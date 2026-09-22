import React, { useState } from "react";
import { X, Terminal, CheckCircle2, Code2, Shield, Layers, HelpCircle, Laptop } from "lucide-react";

interface MentorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentorGuideModal: React.FC<MentorGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "mac" | "architecture" | "github" | "render" | "status">("github");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="mentor-guide-modal"
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                Senior Mentor & Stage 0 Guide
              </h2>
              <p className="text-xs text-slate-400">
                Beginner walkthrough &bull; macOS Terminal Guide &bull; System Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("github")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "github"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Stage 7: Git & GitHub Setup
          </button>
          <button
            onClick={() => setActiveTab("render")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "render"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Stage 8: Render Cloud Deployment
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "overview"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            1. Plain English Overview
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "architecture"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            2. System Architecture
          </button>
          <button
            onClick={() => setActiveTab("mac")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "mac"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            3. macOS Terminal Commands
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold transition-colors shrink-0 ${
              activeTab === "status"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            4. Project Status
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
          {activeTab === "github" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span>Stage 7: Git & GitHub Setup Guide</span>
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Beginner Friendly
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Follow these 4 simple steps to save your code to Git and push it to your GitHub profile.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    Step 1: Create a New Repository on GitHub
                  </span>
                  <p className="text-xs text-slate-300">
                    Open your web browser and go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/new</a>.
                  </p>
                  <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                    <li>Repository name: <strong className="text-slate-200">scamshield</strong></li>
                    <li>Description: <span className="text-slate-200">AI-Powered Fake Offer Letter & Phishing Inspector</span></li>
                    <li>Visibility: <strong className="text-slate-200">Public</strong> (recommended for hackathon judges)</li>
                    <li>Do <strong>NOT</strong> check &ldquo;Add a README&rdquo; or &ldquo;Add .gitignore&rdquo; (our project already has them!)</li>
                    <li>Click <strong>Create repository</strong>.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    Step 2: Initialize Git in your Local Project Folder
                  </span>
                  <p className="text-xs text-slate-300">
                    In your Mac Terminal (inside your ScamShield folder), run:
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400 space-y-1 border border-slate-800">
                    <div>git init</div>
                    <div>git add .</div>
                    <div>git commit -m &quot;feat: initial ScamShield hackathon release&quot;</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    Step 3: Link and Push to your GitHub
                  </span>
                  <p className="text-xs text-slate-300">
                    Replace <code className="text-amber-300">YOUR_USERNAME</code> with your actual GitHub username:
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-400 space-y-1 border border-slate-800">
                    <div>git branch -M main</div>
                    <div>git remote add origin https://github.com/<span className="text-amber-300 font-bold">YOUR_USERNAME</span>/scamshield.git</div>
                    <div>git push -u origin main</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    Step 4: Verify on GitHub
                  </span>
                  <p className="text-xs text-slate-400">
                    Refresh your GitHub page in your browser. You will see all your files, README, and clean commit history ready to share with judges!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "render" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>Stage 8: Free Cloud Deployment on Render</span>
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Zero Cost Free Tier
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Render is a modern cloud hosting platform with a 100% free tier. Here is how to host your live ScamShield URL:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    1. Connect your GitHub Account to Render
                  </span>
                  <p className="text-xs text-slate-300">
                    Visit <a href="https://render.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">render.com</a> and click <strong>Get Started</strong> or <strong>Log In with GitHub</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    2. Create a &ldquo;Web Service&rdquo;
                  </span>
                  <p className="text-xs text-slate-300">
                    In your Render Dashboard, click <strong>New +</strong> &rarr; <strong>Web Service</strong>.
                  </p>
                  <p className="text-xs text-slate-400">
                    Select your <strong className="text-slate-200">scamshield</strong> repository from your connected GitHub list.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    3. Configure Exact Build & Start Commands
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">BUILD COMMAND:</span>
                      <span className="text-emerald-400">npm install && npm run build</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">START COMMAND:</span>
                      <span className="text-emerald-400">npm start</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Environment: Node &bull; Plan: Free
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    4. Add Environment Variable
                  </span>
                  <p className="text-xs text-slate-300">
                    Under the <strong>Environment Variables</strong> tab on Render, add:
                  </p>
                  <div className="p-2 bg-slate-900 rounded font-mono text-xs text-amber-300 border border-slate-800">
                    GEMINI_API_KEY = your_gemini_api_key_here
                  </div>
                  <p className="text-[11px] text-slate-400">
                    (Get a free key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google AI Studio</a>).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                    5. Deploy!
                  </span>
                  <p className="text-xs text-slate-300">
                    Click <strong>Create Web Service</strong>. In about 2 minutes, Render will provide a public HTTPS URL (e.g. <code className="text-cyan-300">https://scamshield.onrender.com</code>) to submit to your hackathon judges!
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-mono">
                What are we building in very simple words?
              </h3>
              <p>
                Imagine a job seeker receives an email saying: <em>&ldquo;Congratulations! You are hired remotely. Please transfer ₹8,999 to register your company laptop.&rdquo;</em> Standard email spam filters let this through because it doesn&apos;t contain malware attachments or typical spam keywords.
              </p>
              <p>
                <strong>ScamShield</strong> is a specialized cyber-inspection web application. The user pastes that offer letter or enters the company&apos;s recruitment link. ScamShield immediately evaluates it through a two-tiered system:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">Layer 1: Deterministic Security Rules</span>
                  <p className="text-xs text-slate-400">
                    Instant pattern-matching for advance fees, equipment deposits, Telegram burners, high-pressure deadlines, and spoofed TLDs (.xyz, raw IP hosts).
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">Layer 2: Gemini 3.8 Flash AI Model</span>
                  <p className="text-xs text-slate-400">
                    Deep linguistic analysis that extracts nuanced evidence quotes, checks for interview skipping, and calculates an explainable 0-100% Scam Threat Index.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-100 font-mono">
                End-to-End System Flow Architecture
              </h3>
              <div className="p-4 bg-slate-950 font-mono text-[11px] text-cyan-300 rounded-xl border border-slate-800 overflow-x-auto leading-tight">
                <pre>{`+-------------------------------------------------------------------+
|               CLIENT BROWSER (React + Vite + Tailwind)             |
|                                                                   |
|   [Paste Offer Text / URL]   --->   [Dual Mode Scanner Form]      |
|                                                |                  |
|                                                v                  |
|                                        POST /api/scan/text        |
|                                        POST /api/scan/url         |
+------------------------------------------------|------------------+
                                                 |
                                                 v
+-------------------------------------------------------------------+
|               EXPRESS BACKEND SERVER (Node.js runtime)            |
|                                                                   |
|  1. Sliding Window Rate Limiter (Anti-DDoS / Anti-Spam)           |
|  2. SSRF Protection (Blocks Localhost, 127.0.0.1, Private RFC1918)|
|  3. Deterministic Security Rules Engine                           |
|     * Advance payment detection (Laptop fees, ₹/$, Crypto, UPI)   |
|     * Urgency heuristics ("within 24 hours", "forfeit placement") |
|     * Communication channels (Telegram, WhatsApp, free webmail)   |
|     * Domain TLD & Brand Typo-squatting (.xyz, lookalikes)        |
|                                |                                  |
|                                v                                  |
|  4. Secure Gemini 3.8 Flash AI Analysis (Google GenAI SDK)        |
|     * Kept 100% server-side via process.env.GEMINI_API_KEY        |
|     * Structured JSON Response Schema (Score, Flags, Recs)        |
|     * Offline Fallback Safeguard (Works even if API Key is idle)  |
+------------------------------------------------|------------------+
                                                 |
                                                 v
+-------------------------------------------------------------------+
|               EXPLAINABLE THREAT REPORT DASHBOARD                 |
|                                                                   |
|  * 0-100% Dynamic Scam Threat Gauge                               |
|  * Categorized Red Flags with Quoted Forensic Evidence            |
|  * Positive Trust Signals & URL Network Intelligence              |
|  * Actionable Candidate Safety Guidance & Local History Cache     |
+-------------------------------------------------------------------+`}</pre>
              </div>
            </div>
          )}

          {activeTab === "mac" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>macOS Terminal Verification Guide</span>
              </h3>
              <p className="text-xs text-slate-400">
                To open your Mac terminal: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-slate-200">Cmd + Space</kbd>, type <strong>Terminal</strong>, and hit <strong>Enter</strong>.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">1. Verify Node.js (JavaScript Runtime):</span>
                  </div>
                  <code className="block p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 mb-1">
                    node -v
                  </code>
                  <span className="text-[11px] text-slate-400">Expected: <span className="font-mono text-slate-300">v18.x</span> or <span className="font-mono text-slate-300">v20.x</span> or higher. (If missing, download from nodejs.org).</span>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">2. Verify Git (Version Control):</span>
                  </div>
                  <code className="block p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 mb-1">
                    git --version
                  </code>
                  <span className="text-[11px] text-slate-400">Expected: <span className="font-mono text-slate-300">git version 2.x.x</span>. Mac will prompt to install Xcode Command Line Tools if missing.</span>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">3. Verify VS Code CLI:</span>
                  </div>
                  <code className="block p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 mb-1">
                    code -v
                  </code>
                  <span className="text-[11px] text-slate-400">Expected: Prints the VS Code version. (You can enable this inside VS Code via Cmd+Shift+P &rarr; &ldquo;Shell Command: Install &apos;code&apos; command in PATH&rdquo;).</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-mono">
                Project Milestone Tracking Checklist
              </h3>
              <div className="space-y-2">
                {[
                  { title: "Stage 0: Conceptual Architecture & Mentorship Guide", done: true },
                  { title: "Stage 1: Project Setup & Package Dependencies", done: true },
                  { title: "Stage 2: Deterministic Threat Rule Engine & SSRF Protection", done: true },
                  { title: "Stage 3: Gemini 3.8 Flash Hybrid AI Integration", done: true },
                  { title: "Stage 4: Explainable Threat Dashboard & Circular Gauge", done: true },
                  { title: "Stage 5: Demo Test Presets (Laptop Trap, Phishing URL, Clean Offer)", done: true },
                  { title: "Stage 6: LocalStorage Scan Audit History", done: true },
                  { title: "Stage 7: Git & GitHub Setup Documentation", done: true },
                  { title: "Stage 8: Cloud Deployment on Render Guide", done: true },
                  { title: "Stage 9: Hackathon Pitch Deck & Judge Defense", done: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono ${
                      item.done
                        ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                        : "bg-slate-950/40 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${item.done ? "text-emerald-400" : "text-slate-600"}`} />
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold">
                      {item.done ? "COMPLETED" : "NEXT STAGE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            ScamShield Hackathon Edition &bull; Mentor Assistant Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
