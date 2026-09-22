import React, { useState } from "react";
import { FileText, Globe, Search, ArrowRight, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

interface ScannerFormProps {
  onScanText: (text: string) => Promise<void>;
  onScanUrl: (url: string) => Promise<void>;
  isScanning: boolean;
  scanProgressText: string;
}

export const SAMPLE_CASES = [
  {
    id: "fake-laptop-deposit",
    title: "Fake Remote Job (₹8,999 Laptop Deposit Trap)",
    type: "text" as const,
    label: "High Threat",
    badgeColor: "text-rose-400 bg-rose-950/60 border-rose-800",
    content: `Dear Candidate,
Congratulations! We are thrilled to inform you that you have been selected for the position of Senior Remote Operations Associate at Global Tech Logistics Inc. Your monthly salary will be ₹95,000 + incentives.

Because this is a 100% remote job, our company provides a pre-configured Apple MacBook Pro M3 and home-office equipment. 

As per our corporate security protocol, you are required to deposit a refundable equipment insurance fee of ₹8,999 via Google Pay to our logistics vendor account at 9876543210 before 6:00 PM today. 

Once the transaction is confirmed, your appointment letter dispatch tracking number will be issued. If the deposit is not received within 4 hours, your offer will be immediately cancelled and transferred to the next candidate on the waitlist. Do not reply to this email, contact HR Director via Telegram: @globaltech_hr_desk`
  },
  {
    id: "phishing-url",
    title: "Spoofed Phishing Portal (`.xyz` brand lookalike)",
    type: "url" as const,
    label: "URL Phishing",
    badgeColor: "text-amber-400 bg-amber-950/60 border-amber-800",
    content: "https://careers-google-verify.xyz/portal/login?auth_token=93284"
  },
  {
    id: "legitimate-offer",
    title: "Authentic Software Engineer Offer Letter",
    type: "text" as const,
    label: "Legitimate",
    badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
    content: `Dear Alex Morgan,

On behalf of Acme Cloud Systems Inc., I am pleased to offer you the full-time position of Full Stack Software Engineer starting on November 1st.

Your starting base compensation will be $115,000 USD per annum, paid bi-weekly, along with standard health benefits, 401(k) matching, and 20 days paid vacation.

The company will provide all required workstation equipment, which will be shipped directly to your residential address prior to your start date at zero expense to you. Acme Cloud Systems will never request any payment, security deposits, or fee transfers during the hiring or onboarding process.

Please review the attached formal employment agreement and return a signed copy through our secure DocuSign enterprise portal by next Friday. If you have any questions, please contact our Talent Acquisition partner at recruitment@acmecloud.com or via your hiring manager directly.`
  }
];

export const ScannerForm: React.FC<ScannerFormProps> = ({
  onScanText,
  onScanUrl,
  isScanning,
  scanProgressText,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (activeTab === "text") {
      if (!textContent.trim() || textContent.trim().length < 15) {
        setLocalError("Please enter or paste at least 15 characters of offer text, email, or message.");
        return;
      }
      await onScanText(textContent.trim());
    } else {
      if (!urlContent.trim()) {
        setLocalError("Please enter a valid website or portal URL.");
        return;
      }
      await onScanUrl(urlContent.trim());
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_CASES[0]) => {
    setLocalError(null);
    if (sample.type === "text") {
      setActiveTab("text");
      setTextContent(sample.content);
    } else {
      setActiveTab("url");
      setUrlContent(sample.content);
    }
  };

  return (
    <div id="scanner-form-container" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
        <button
          type="button"
          id="tab-text-scan"
          onClick={() => {
            setActiveTab("text");
            setLocalError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "text"
              ? "bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Inspect Offer Text / Letter</span>
        </button>

        <button
          type="button"
          id="tab-url-scan"
          onClick={() => {
            setActiveTab("url");
            setLocalError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "url"
              ? "bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Inspect Recruitment URL / Link</span>
        </button>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="p-6">
        {activeTab === "text" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="offer-text-input" className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Paste Appointment Letter, Email Body, or WhatsApp / Telegram Offer:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {textContent.length} characters
                </span>
                {textContent.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTextContent("")}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              id="offer-text-input"
              rows={7}
              disabled={isScanning}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="e.g. 'Congratulations! You are selected for remote operations. To dispatch your MacBook Pro, please transfer ₹8,999 refundable equipment registration fee via GPay...'"
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 font-sans focus:outline-none transition-colors resize-y leading-relaxed"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="url-input" className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Enter Hiring Portal, Recruitment Form, or Company Domain:
              </label>
              {urlContent.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUrlContent("")}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="url-input"
                type="text"
                disabled={isScanning}
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                placeholder="https://company-careers.com/apply or careers-google-verify.xyz"
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none transition-colors"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Protected by Server-Side SSRF Guard (Localhost, private subnets, and loopbacks blocked).
            </p>
          </div>
        )}

        {/* Local validation error banner */}
        {localError && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{localError}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Gemini 3.8 Flash Hybrid Forensic Engine</span>
          </div>

          <button
            type="submit"
            id="scan-submit-btn"
            disabled={isScanning}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 transition-all ${
              isScanning
                ? "bg-slate-700 cursor-not-allowed text-slate-400"
                : "bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-[0.98]"
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                <span>{scanProgressText || "Scanning Security Vectors..."}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>RUN SCAM INSPECTION</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Demo Cases */}
      <div className="p-4 bg-slate-950/70 border-t border-slate-800">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Quick Hackathon Demo Test Presets:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="flex flex-col text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${sample.badgeColor}`}>
                  {sample.label}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">
                  Load &rarr;
                </span>
              </div>
              <span className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                {sample.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
