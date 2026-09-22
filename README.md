# ScamShield 🛡️
### AI-Powered Fake Offer Letter & Phishing Inspector

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-cyan)](https://ais-dev-gr4tf326wit2ahlpfgn4my-681017137620.asia-east1.run.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%203.8%20Flash-blue)](https://ai.google.dev/)

> **Don't get scammed before you get hired.** ScamShield protects job seekers from advance-fee equipment traps, spoofed lookalike domains, and off-platform migration scams with explainable threat indexing (0–100%).

---

## 📌 The Problem
Job seekers lose over **$365M annually** to recruitment fraud. Attackers issue legitimate-looking appointment letters for high-paying remote roles, then demand a ₹5,000–₹15,000 / $200–$500 "refundable laptop deposit" via UPI, Zelle, or crypto before ghosting victims. Because these emails contain no malware or malicious attachments, **standard spam filters let them directly into the victim's inbox**.

## 🚀 The Solution: Hybrid Threat Intelligence
ScamShield uses a **two-tiered forensic inspection engine**:
1. **Deterministic Security Rules Engine:**
   - Instant regex and heuristic matching for laptop fees, registration deposits, and off-platform redirection (Telegram, WhatsApp).
   - Domain analysis for high-risk TLDs (`.xyz`, `.top`, `.tk`), brand typosquatting, raw IP hosts, and non-HTTPS protocols.
   - Built-in **SSRF Protection** blocking localhost, `127.0.0.1`, and private RFC1918 subnets.
2. **Gemini 3.8 Flash AI Model:**
   - Deep linguistic sentiment and coercion analysis.
   - Evidence-based threat extraction with exact quoted passages.
   - Generates an explainable **0–100% Scam Threat Index** with tailored candidate safety advice.

---

## 🏗️ System Architecture

```text
+-------------------------------------------------------------------------+
|                  CLIENT BROWSER (React 19 + Vite + Tailwind)            |
|                                                                         |
|   User pastes Offer Letter / Enters URL   -->   Dual-Mode Scanner UI    |
|                                                          |              |
|                                                          v              |
|                                                 POST /api/scan/text     |
|                                                 POST /api/scan/url      |
+----------------------------------------------------------|--------------+
                                                           |
                                                           v
+-------------------------------------------------------------------------+
|                  EXPRESS BACKEND SERVER (Node.js runtime)               |
|                                                                         |
|  [Layer 1: Rate Limiter] --> Sliding window prevents bot abuse/DDoS     |
|  [Layer 2: SSRF Guard]   --> Blocks Localhost, 127.0.0.1, & Private IPs |
|  [Layer 3: Heuristic Rules Engine]                                      |
|     * Advance payment keywords ("laptop deposit", "refundable fee")     |
|     * Urgent pressure ("within 24 hours", "forfeit placement")          |
|     * Free webmail / Burner apps (@gmail for corporate, Telegram)       |
|     * Domain TLD Risk (.xyz, raw IP hosts, brand typosquatting)         |
|                                                          |              |
|                                                          v              |
|  [Layer 4: Gemini 3.8 Flash AI Model (@google/genai)]                   |
|     * Server-side only (process.env.GEMINI_API_KEY)                     |
|     * Forensic linguistic reasoning & structured JSON schema            |
|     * Graceful offline fallback to deterministic engine if key is idle  |
+----------------------------------------------------------|--------------+
                                                           |
                                                           v
+-------------------------------------------------------------------------+
|                    EXPLAINABLE RESULTS DASHBOARD                        |
|                                                                         |
|  * 0–100% Dynamic Circular Threat Gauge (Low, Mild, Moderate, High, VH) |
|  * Quoted Red Flag Evidence Cards & Positive Trust Signals              |
|  * Domain & URL Intelligence Card (HTTPS status, TLD risk)              |
|  * Candidate Safety Recommendations & LocalStorage Scan History         |
+-------------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend:** Node.js, Express.js (Single bundled `dist/server.cjs` via esbuild)
- **AI Integration:** `@google/genai` TypeScript SDK (Gemini 3.8 Flash)
- **Security:** In-memory sliding-window rate limiting, SSRF IP-blocklist, client-side input sanitization

---

## 💻 Local Setup (macOS / Linux / Windows)

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm (v9.x+)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/scamshield.git
cd scamshield

# 2. Install dependencies
npm install

# 3. Create .env file with your Gemini API key (optional, fallback engine active)
cp .env.example .env
# Add: GEMINI_API_KEY=your_key_here

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Render (Free Tier)

1. Create a new repository on [GitHub](https://github.com/new) and push this codebase.
2. Sign in to [Render](https://render.com) using your GitHub account.
3. Click **New +** &rarr; **Web Service**.
4. Select your `scamshield` repository.
5. Configure the service settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
6. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `<your_api_key_from_google_ai_studio>`
7. Click **Create Web Service**. Your live production app will deploy in ~2 minutes!

---

## 🏆 Hackathon Quick Pitch (30 Seconds)
> *"Standard spam filters detect malware attachments and generic phishing, but they are completely blind to social engineering in job appointment letters. ScamShield is an intelligent, explainable security inspector that combines instant heuristic rules with Gemini 3.8 Flash to catch equipment deposit traps, spoofed lookalike domains, and burner contacts before job seekers lose their hard-earned money."*
