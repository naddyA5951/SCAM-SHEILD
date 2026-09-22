import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Safe resolution of directory path for both ESM development and bundled CJS production
const serverDir = typeof __dirname !== "undefined" 
  ? __dirname 
  : (typeof import.meta !== "undefined" && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));

// -------------------------------------------------------------
// Rate Limiter: In-memory sliding counter (Hackathon-ready)
// Prevents API abuse and bot spamming
// -------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRateLimit = new Map<string, RateLimitRecord>();

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 40; // max 40 requests per minute

  const record = ipRateLimit.get(ip);
  if (!record || now > record.resetTime) {
    ipRateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      error: "Too many scan requests. Please wait a minute before running another scan.",
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  record.count++;
  next();
}

// -------------------------------------------------------------
// Safe SSRF & URL Heuristic Analysis Engine
// Protects server from internal SSRF, probes domain structure
// -------------------------------------------------------------
interface DomainAnalysis {
  url: string;
  domain: string;
  isHttps: boolean;
  protocol: string;
  tld: string;
  isSuspiciousTld: boolean;
  isIpHost: boolean;
  subdomainCount: number;
  brandMismatch: boolean;
  targetedBrand?: string;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  heuristicNotes: string[];
}

const SUSPICIOUS_TLDS = new Set([
  "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "club",
  "work", "click", "rest", "icu", "loan", "fit", "surf", "monster",
  "shop", "site", "online", "live", "vip", "support", "cc"
]);

const FAMOUS_BRANDS = [
  { name: "Google", domains: ["google.com", "google.co.in", "google.co.uk", "google.org", "careers.google.com"] },
  { name: "Microsoft", domains: ["microsoft.com", "careers.microsoft.com", "linkedin.com"] },
  { name: "Amazon", domains: ["amazon.com", "amazon.jobs", "amazon.in"] },
  { name: "Apple", domains: ["apple.com", "jobs.apple.com"] },
  { name: "Netflix", domains: ["netflix.com", "jobs.netflix.com"] },
  { name: "Meta", domains: ["meta.com", "metacareers.com", "facebook.com"] },
  { name: "TCS", domains: ["tcs.com", "ibegin.tcs.com"] },
  { name: "Infosys", domains: ["infosys.com", "career.infosys.com"] },
  { name: "Wipro", domains: ["wipro.com", "careers.wipro.com"] },
  { name: "PayPal", domains: ["paypal.com", "paypalcorp.com"] },
  { name: "Deloitte", domains: ["deloitte.com", "jobs2.deloitte.com"] }
];

function isPrivateOrLocalIp(hostname: string): boolean {
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan")
  ) {
    return true;
  }

  // IPv4 regex check
  const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const p1 = parseInt(ipMatch[1], 10);
    const p2 = parseInt(ipMatch[2], 10);
    if (p1 === 10) return true;
    if (p1 === 172 && p2 >= 16 && p2 <= 31) return true;
    if (p1 === 192 && p2 === 168) return true;
    if (p1 === 169 && p2 === 254) return true;
    if (p1 === 127) return true;
    if (p1 === 0) return true;
  }

  return false;
}

function analyzeUrlSecurity(rawUrl: string): { valid: boolean; error?: string; analysis?: DomainAnalysis } {
  let target = rawUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch (err) {
    return { valid: false, error: "The provided URL is malformed or invalid." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: `Disallowed protocol "${parsed.protocol}". Only HTTP/HTTPS allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF Protection: Deny private/loopback addresses
  if (isPrivateOrLocalIp(hostname)) {
    return { valid: false, error: "Access to private, localhost, or internal network IPs is strictly prohibited (SSRF protection)." };
  }

  const isHttps = parsed.protocol === "https:";
  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(":");
  const domainParts = hostname.split(".");
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : "";
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  const subdomainCount = Math.max(0, domainParts.length - 2);

  const notes: string[] = [];
  let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
  let brandMismatch = false;
  let targetedBrand: string | undefined;

  if (!isHttps) {
    notes.push("Insecure HTTP protocol: Legitimate corporate portals and recruitment platforms enforce HTTPS encryption.");
    riskLevel = 'suspicious';
  } else {
    notes.push("Valid HTTPS transport layer present.");
  }

  if (isIpHost) {
    notes.push("Raw IP address used instead of a registered domain name (common phishing indicator).");
    riskLevel = 'dangerous';
  }

  if (isSuspiciousTld) {
    notes.push(`High-risk Top Level Domain (.${tld}): Frequently exploited by automated bulk phishing generators.`);
    if (riskLevel !== 'dangerous') riskLevel = 'suspicious';
  }

  // Check for Brand Spoofing / Lookalikes
  for (const b of FAMOUS_BRANDS) {
    const brandLower = b.name.toLowerCase();
    if (hostname.includes(brandLower)) {
      const isAuthentic = b.domains.some(validDomain => 
        hostname === validDomain || hostname.endsWith("." + validDomain)
      );

      if (!isAuthentic) {
        brandMismatch = true;
        targetedBrand = b.name;
        notes.push(`Brand Impersonation: Domain contains "${b.name}" but does NOT belong to official infrastructure (${b.domains[0]}).`);
        riskLevel = 'dangerous';
        break;
      } else {
        notes.push(`Verified official domain belonging to ${b.name}.`);
      }
    }
  }

  // Phishing keywords in hostname
  const phishingKeywords = ["career-portal", "job-offer", "verify-account", "equipment-desk", "hiring-desk", "appointment-letter", "hr-verify", "joining-form"];
  for (const kw of phishingKeywords) {
    if (hostname.includes(kw)) {
      notes.push(`Hyphenated deceptive keyword "${kw}" detected in domain hostname.`);
      if (riskLevel === 'safe') riskLevel = 'suspicious';
    }
  }

  if (subdomainCount >= 3) {
    notes.push(`Excessive subdomain nesting (${subdomainCount} levels): Technique used to disguise the true root domain.`);
    if (riskLevel === 'safe') riskLevel = 'suspicious';
  }

  return {
    valid: true,
    analysis: {
      url: parsed.href,
      domain: hostname,
      isHttps,
      protocol: parsed.protocol.replace(":", ""),
      tld,
      isSuspiciousTld,
      isIpHost,
      subdomainCount,
      brandMismatch,
      targetedBrand,
      riskLevel,
      heuristicNotes: notes
    }
  };
}

// -------------------------------------------------------------
// Deterministic Security Rules Engine
// -------------------------------------------------------------
interface RuleMatch {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'payment' | 'urgency' | 'identity' | 'communication' | 'compensation';
  evidence: string;
  explanation: string;
  points: number;
}

function runDeterministicRules(text: string): { matches: RuleMatch[]; detectedUrls: string[] } {
  const matches: RuleMatch[] = [];
  const lower = text.toLowerCase();

  // 1. Payment demands before employment (Critical)
  const paymentPhrases = [
    { regex: /(?:pay|transfer|deposit|send)\s+(?:amount|fee|sum|rs\.?|inr|₹|\$)\s*[\d,]+/i, title: "Explicit Payment Demand Detected", desc: "Legitimate employers never demand application, registration, or onboarding payments from candidates." },
    { regex: /(?:equipment|laptop|macbook|hardware|gadget|desktop)\s+(?:fee|charges|deposit|registration|cost|reimbursement)/i, title: "Equipment / Laptop Deposit Trap", desc: "Common scam: Requiring candidates to pay upfront for work equipment with a promise of 'future reimbursement'." },
    { regex: /(?:security\s+deposit|refundable\s+deposit|caution\s+money|onboarding\s+fee|verification\s+fee|processing\s+charge)/i, title: "Refundable Security Deposit Trap", desc: "Fraudsters claim deposits are '100% refundable after joining' to eliminate victim resistance." },
    { regex: /(?:training\s+fee|certification\s+cost|documentation\s+fee|courier\s+charges)/i, title: "Mandatory Training / Documentation Fee", desc: "Demanding payment for mandatory training modules or offer letter couriers is a proven red flag." }
  ];

  paymentPhrases.forEach((item, idx) => {
    const m = text.match(item.regex);
    if (m) {
      matches.push({
        id: `det-payment-${idx}`,
        title: item.title,
        severity: "critical",
        category: "payment",
        evidence: m[0],
        explanation: item.desc,
        points: 35
      });
    }
  });

  // 2. Unorthodox Payment Methods (Critical)
  const altPayments = [
    { regex: /(?:crypto|cryptocurrency|bitcoin|btc|usdt|binance|trust\s*wallet)/i, title: "Cryptocurrency Payment Requested", desc: "Requests for crypto or decentralized wallets allow zero recourse or chargebacks." },
    { regex: /(?:gift\s*card|amazon\s*gift|steam\s*card|apple\s*gift\s*card|google\s*play\s*card)/i, title: "Gift Card Payment Request", desc: "Gift cards are untraceable and immediately laundered by scam rings." },
    { regex: /(?:gpay|phonepe|paytm)\s+(?:to\s+(?:personal\s+number|number)|[0-9]{10})/i, title: "Payment to Personal UPI / Mobile Number", desc: "Recruiting companies never collect corporate fees via personal digital wallet numbers." }
  ];

  altPayments.forEach((item, idx) => {
    const m = text.match(item.regex);
    if (m) {
      matches.push({
        id: `det-altpay-${idx}`,
        title: item.title,
        severity: "critical",
        category: "payment",
        evidence: m[0],
        explanation: item.desc,
        points: 30
      });
    }
  });

  // 3. Urgency & Coercive Pressure (High)
  const urgencyPhrases = [
    { regex: /(?:within\s+(?:24|12|6|2)\s*hours|offer\s+expires\s+today|immediate\s+transfer|strictly\s+confidential)/i, title: "Artificial High-Pressure Deadline", desc: "Creating manufactured panicking deadlines prevents victims from consulting family or fraud databases." },
    { regex: /(?:forfeit|cancel|terminate|seat\s+will\s+be\s+allotted\s+to\s+next)\s+candidate/i, title: "Placement Forfeiture Threat", desc: "Threatening to forfeit the job offer unless funds are transferred swiftly." }
  ];

  urgencyPhrases.forEach((item, idx) => {
    const m = text.match(item.regex);
    if (m) {
      matches.push({
        id: `det-urgency-${idx}`,
        title: item.title,
        severity: "high",
        category: "urgency",
        evidence: m[0],
        explanation: item.desc,
        points: 20
      });
    }
  });

  // 4. Suspicious Communication Channels & Free Emails (Medium / High)
  const commPhrases = [
    { regex: /(?:telegram|contact\s+on\s+telegram|t\.me\/|whatsapp\s+only|message\s+via\s+signal)/i, title: "Unmonitored Chat App Onboarding (Telegram / WhatsApp)", desc: "Using encrypted personal messengers avoids enterprise HR logs and enables anonymous burner profiles." },
    { regex: /[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|yandex|protonmail)\.com/i, title: "Free Consumer Webmail for Corporate Offer", desc: "Legitimate corporate recruiters communicate exclusively through enterprise domain emails, not free consumer addresses." }
  ];

  commPhrases.forEach((item, idx) => {
    const m = text.match(item.regex);
    if (m) {
      matches.push({
        id: `det-comm-${idx}`,
        title: item.title,
        severity: "medium",
        category: "communication",
        evidence: m[0],
        explanation: item.desc,
        points: 18
      });
    }
  });

  // 5. Unrealistic Compensation (Medium)
  if (
    /(?:earn|salary|stipend)\s*(?:of)?\s*(?:\$|₹|rs\.?)\s*(?:[5-9]\d{4}|[1-9]\d{5,})\s*(?:per\s*(?:week|day|part\s*time)|for\s*2\s*hours)/i.test(text) ||
    /no\s+interview\s+required|direct\s+selection\s+without\s+interview/i.test(text)
  ) {
    matches.push({
      id: "det-unrealistic-terms",
      title: "Direct Selection Without Formal Interview Process",
      severity: "high",
      category: "compensation",
      evidence: "Direct selection / abnormal compensation for minimal workload",
      explanation: "Offers made without technical evaluation or face-to-face rounds are almost universally fraudulent lures.",
      points: 22
    });
  }

  // Extract URLs from text
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const rawUrls = text.match(urlRegex) || [];
  const detectedUrls = Array.from(new Set(rawUrls));

  return { matches, detectedUrls };
}

// -------------------------------------------------------------
// AI Engine: Gemini 3.8 Flash Client
// Server-side only, user-agent telemetry included
// -------------------------------------------------------------
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// -------------------------------------------------------------
// POST /api/scan/text
// -------------------------------------------------------------
app.post("/api/scan/text", rateLimiter, async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim().length < 15) {
      return res.status(400).json({
        error: "Please provide a valid offer letter text, email body, or recruitment message (minimum 15 characters)."
      });
    }

    const trimmed = content.trim();
    const { matches: deterministicMatches, detectedUrls } = runDeterministicRules(trimmed);

    // Optional domain analysis if a URL is found in the text
    let domainIntel: DomainAnalysis | undefined;
    if (detectedUrls.length > 0) {
      const urlCheck = analyzeUrlSecurity(detectedUrls[0]);
      if (urlCheck.valid && urlCheck.analysis) {
        domainIntel = urlCheck.analysis;
      }
    }

    const ai = getGenAi();
    let aiResponseJson: any = null;

    if (ai) {
      try {
        const prompt = `You are ScamShield AI, an enterprise cybersecurity and fraud inspection model specialized in fake job offers, recruitment scams, appointment letter fraud, and phishing traps.

Analyze the following submitted job offer / appointment text:
--- BEGIN OFFER TEXT ---
${trimmed.slice(0, 4000)}
--- END OFFER TEXT ---

Deterministic red flags already detected by rule engine:
${JSON.stringify(deterministicMatches.map(m => ({ title: m.title, evidence: m.evidence, severity: m.severity })))}

URL Intelligence (if any):
${domainIntel ? JSON.stringify(domainIntel) : "No URL extracted"}

Your objective:
1. Conduct forensic linguistic analysis.
2. Detect payment traps (equipment deposit, laptop fee, courier fee, registration).
3. Evaluate urgency tactics, fake interview claims, free email domains, and unrealistic salaries.
4. Calculate an explainable "Scam Threat Index" (0 - 100):
   - 0-20: Low Risk (Authentic corporate offer traits, official verification channels)
   - 21-40: Mild Risk (Minor anomalies, free webmail but standard language)
   - 41-60: Moderate Risk (Suspicious urgency or vague compensation, requires direct verification)
   - 61-80: High Risk (Significant indicators such as telegram interview, payment hint, fake portal)
   - 81-100: Very High Risk (Direct payment demands, deposit for laptop, spoofed domain, untraceable wallets)
5. Provide red flags with quotes as evidence.
6. Provide positive legitimate signals (if present).
7. Provide actionable safety recommendations.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: "Scam Threat Index from 0 to 100" },
                riskLevel: { 
                  type: Type.STRING, 
                  description: "One of: Low Risk, Mild Risk, Moderate Risk, High Risk, Very High Risk" 
                },
                summary: { type: Type.STRING, description: "2-3 sentence executive safety summary" },
                redFlags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      severity: { type: Type.STRING, description: "critical, high, medium, or low" },
                      category: { type: Type.STRING, description: "payment, urgency, identity, communication, or compensation" },
                      evidence: { type: Type.STRING, description: "Quoted snippet from the text" },
                      explanation: { type: Type.STRING, description: "Why this is dangerous" }
                    },
                    required: ["title", "severity", "category", "evidence", "explanation"]
                  }
                },
                positiveSignals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["title", "evidence", "explanation"]
                  }
                },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    paymentRisk: { type: Type.INTEGER, description: "0-100" },
                    identitySpoofing: { type: Type.INTEGER, description: "0-100" },
                    pressureUrgency: { type: Type.INTEGER, description: "0-100" },
                    unrealisticTerms: { type: Type.INTEGER, description: "0-100" }
                  },
                  required: ["paymentRisk", "identitySpoofing", "pressureUrgency", "unrealisticTerms"]
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["score", "riskLevel", "summary", "redFlags", "positiveSignals", "breakdown", "recommendations"]
            }
          }
        });

        if (response.text) {
          aiResponseJson = JSON.parse(response.text.trim());
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed or timed out, falling back to deterministic engine:", geminiError);
      }
    }

    // Combine or Fallback Calculation
    let finalScore = 10;
    let finalRiskLevel: any = "Low Risk";
    let finalSummary = "";
    let finalRedFlags: any[] = [];
    let finalPositiveSignals: any[] = [];
    let finalBreakdown = {
      paymentRisk: 5,
      identitySpoofing: 5,
      pressureUrgency: 5,
      unrealisticTerms: 5
    };
    let finalRecs: string[] = [];

    if (aiResponseJson) {
      finalScore = Math.min(100, Math.max(0, aiResponseJson.score));
      finalRiskLevel = aiResponseJson.riskLevel || getRiskLevelFromScore(finalScore);
      finalSummary = aiResponseJson.summary;
      finalRedFlags = aiResponseJson.redFlags || [];
      finalPositiveSignals = aiResponseJson.positiveSignals || [];
      finalBreakdown = aiResponseJson.breakdown;
      finalRecs = aiResponseJson.recommendations || [];
    } else {
      // Deterministic Fallback Engine
      let accumulatedScore = 5;
      deterministicMatches.forEach(m => {
        accumulatedScore += m.points;
      });

      if (domainIntel && domainIntel.riskLevel === 'dangerous') accumulatedScore += 30;
      else if (domainIntel && domainIntel.riskLevel === 'suspicious') accumulatedScore += 15;

      finalScore = Math.min(100, Math.max(5, accumulatedScore));
      finalRiskLevel = getRiskLevelFromScore(finalScore);

      finalRedFlags = deterministicMatches.map(m => ({
        id: m.id,
        title: m.title,
        severity: m.severity,
        category: m.category,
        evidence: m.evidence,
        explanation: m.explanation
      }));

      if (finalRedFlags.length === 0) {
        finalPositiveSignals.push({
          id: "pos-1",
          title: "No Upfront Payment Demand",
          evidence: "Clean financial verification",
          explanation: "The message does not solicit fees for training, equipment, or application processing."
        });
        finalSummary = "Automated inspection completed. No overt advance-fee payment traps or coercive urgency patterns were detected in the provided offer text.";
      } else {
        finalSummary = `Automated threat engine detected ${finalRedFlags.length} significant red flags, prominently featuring ${finalRedFlags[0].title}. High risk of financial loss or data harvesting.`;
      }

      finalBreakdown = {
        paymentRisk: deterministicMatches.some(m => m.category === 'payment') ? 90 : 10,
        identitySpoofing: domainIntel?.brandMismatch ? 95 : 20,
        pressureUrgency: deterministicMatches.some(m => m.category === 'urgency') ? 85 : 15,
        unrealisticTerms: deterministicMatches.some(m => m.category === 'compensation') ? 75 : 10
      };

      finalRecs = [
        "Never transfer money for laptops, security deposits, or background checks prior to official joining.",
        "Verify recruiter identities via the official corporate website or verified LinkedIn company directory.",
        "Report suspicious recruitment demands to your national cyber fraud portal."
      ];
    }

    return res.json({
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      scanType: "text",
      inputSnippet: trimmed.slice(0, 180) + (trimmed.length > 180 ? "..." : ""),
      score: finalScore,
      riskLevel: finalRiskLevel,
      summary: finalSummary,
      redFlags: finalRedFlags,
      positiveSignals: finalPositiveSignals,
      domainIntelligence: domainIntel,
      breakdown: finalBreakdown,
      recommendations: finalRecs,
      engine: aiResponseJson ? "Hybrid AI (Gemini 3.8 Flash + Threat Rules)" : "Deterministic Security Rule Engine (Offline Safeguard)"
    });
  } catch (error: any) {
    console.error("Text scan error:", error);
    return res.status(500).json({
      error: "An error occurred while inspecting the offer text. Please try again."
    });
  }
});

// -------------------------------------------------------------
// POST /api/scan/url
// -------------------------------------------------------------
app.post("/api/scan/url", rateLimiter, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string" || url.trim().length < 4) {
      return res.status(400).json({
        error: "Please provide a valid recruitment portal, application link, or company URL."
      });
    }

    const { valid, error, analysis } = analyzeUrlSecurity(url);
    if (!valid || !analysis) {
      return res.status(400).json({ error: error || "Invalid URL submitted." });
    }

    const ai = getGenAi();
    let aiResponseJson: any = null;

    if (ai) {
      try {
        const prompt = `You are ScamShield AI, inspecting a recruitment website URL / hiring link:
URL: ${analysis.url}
Domain: ${analysis.domain}
Protocol: ${analysis.protocol}
TLD: ${analysis.tld} (Suspicious TLD: ${analysis.isSuspiciousTld})
Raw IP Host: ${analysis.isIpHost}
Brand Mismatch: ${analysis.brandMismatch ? `Impersonating ${analysis.targetedBrand}` : "None"}
Heuristic Notes: ${analysis.heuristicNotes.join("; ")}

Analyze this URL from a cyber-fraud and recruitment phishing standpoint.
Determine:
1. Scam Threat Index (0-100)
2. Risk Level (Low Risk, Mild Risk, Moderate Risk, High Risk, Very High Risk)
3. Red flags found in URL structure / impersonation
4. Positive safety signals (e.g. valid official domain, HTTPS)
5. Actionable recommendations`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                riskLevel: { type: Type.STRING },
                summary: { type: Type.STRING },
                redFlags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      category: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["title", "severity", "category", "evidence", "explanation"]
                  }
                },
                positiveSignals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["title", "evidence", "explanation"]
                  }
                },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    paymentRisk: { type: Type.INTEGER },
                    identitySpoofing: { type: Type.INTEGER },
                    pressureUrgency: { type: Type.INTEGER },
                    unrealisticTerms: { type: Type.INTEGER }
                  },
                  required: ["paymentRisk", "identitySpoofing", "pressureUrgency", "unrealisticTerms"]
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["score", "riskLevel", "summary", "redFlags", "positiveSignals", "breakdown", "recommendations"]
            }
          }
        });

        if (response.text) {
          aiResponseJson = JSON.parse(response.text.trim());
        }
      } catch (geminiError) {
        console.warn("Gemini URL scan failed, using deterministic heuristics:", geminiError);
      }
    }

    let score = 10;
    let riskLevel: any = "Low Risk";
    let summary = "";
    let redFlags: any[] = [];
    let positiveSignals: any[] = [];
    let breakdown = {
      paymentRisk: 10,
      identitySpoofing: 10,
      pressureUrgency: 10,
      unrealisticTerms: 10
    };
    let recs: string[] = [];

    if (aiResponseJson) {
      score = Math.min(100, Math.max(0, aiResponseJson.score));
      riskLevel = aiResponseJson.riskLevel || getRiskLevelFromScore(score);
      summary = aiResponseJson.summary;
      redFlags = aiResponseJson.redFlags || [];
      positiveSignals = aiResponseJson.positiveSignals || [];
      breakdown = aiResponseJson.breakdown;
      recs = aiResponseJson.recommendations || [];
    } else {
      if (analysis.riskLevel === 'dangerous') {
        score = 88;
        riskLevel = "Very High Risk";
        summary = `High-probability phishing portal detected. Hostname ${analysis.domain} exhibits deceptive brand impersonation or malicious hosting indicators.`;
      } else if (analysis.riskLevel === 'suspicious') {
        score = 55;
        riskLevel = "Moderate Risk";
        summary = `Suspicious domain characteristics detected on ${analysis.domain}. Exercise extreme caution and do not enter credentials or banking details.`;
      } else {
        score = 12;
        riskLevel = "Low Risk";
        summary = `Domain ${analysis.domain} aligns with legitimate structural standards over secure HTTPS protocol.`;
      }

      analysis.heuristicNotes.forEach((note, idx) => {
        if (note.includes("Brand Impersonation") || note.includes("Raw IP") || note.includes("High-risk Top Level Domain") || note.includes("Insecure HTTP")) {
          redFlags.push({
            id: `url-flag-${idx}`,
            title: note.split(":")[0],
            severity: analysis.riskLevel === 'dangerous' ? "critical" : "high",
            category: "identity",
            evidence: analysis.domain,
            explanation: note
          });
        } else {
          positiveSignals.push({
            id: `url-pos-${idx}`,
            title: "Security Attribute",
            evidence: analysis.protocol.toUpperCase(),
            explanation: note
          });
        }
      });

      breakdown = {
        paymentRisk: 15,
        identitySpoofing: analysis.brandMismatch ? 95 : (analysis.isSuspiciousTld ? 60 : 15),
        pressureUrgency: 20,
        unrealisticTerms: 10
      };

      recs = [
        "Do not enter passwords, identity proof, or credit card details on this domain.",
        "Cross-verify the career openings on the company's verified primary domain.",
        "Check WHOIS registration age; newly registered domains (under 30 days) are high risk."
      ];
    }

    return res.json({
      id: `scan-url-${Date.now()}`,
      timestamp: Date.now(),
      scanType: "url",
      inputSnippet: analysis.url,
      score,
      riskLevel,
      summary,
      redFlags,
      positiveSignals,
      domainIntelligence: analysis,
      breakdown,
      recommendations: recs,
      engine: aiResponseJson ? "Hybrid AI (Gemini 3.8 Flash + Domain Heuristics)" : "Domain Forensics Rule Engine"
    });
  } catch (error: any) {
    console.error("URL scan error:", error);
    return res.status(500).json({ error: "Failed to analyze URL. Please check formatting and try again." });
  }
});

function getRiskLevelFromScore(score: number): string {
  if (score <= 20) return "Low Risk";
  if (score <= 40) return "Mild Risk";
  if (score <= 60) return "Moderate Risk";
  if (score <= 80) return "High Risk";
  return "Very High Risk";
}

// -------------------------------------------------------------
// Vite Middleware / Static Asset Serving Setup
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ScamShield] Security scanner server active on http://0.0.0.0:${PORT}`);
  });
}

start();