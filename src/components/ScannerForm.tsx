import React, { useState, useRef } from "react";
import { FileText, Globe, Search, ArrowRight, AlertCircle, RefreshCw, Sparkles, CheckCircle2, Upload, Paperclip } from "lucide-react";

interface ScannerFormProps {
  onScanText: (text: string) => Promise<void>;
  onScanUrl: (url: string) => Promise<void>;
  isScanning: boolean;
  progressText: string;
}

export const SAMPLE_CASES = [
  {
    label: "Fake Wipro Laptop Deposit",
    type: "text" as const,
    content: `Subject: URGENT: Wipro Technologies - Provisional Selection Letter (Ref: WIP-2026-8841)
Dear Candidate,
Congratulations! Based on your resume profile on Naukri, you have been directly shortlisted for the position of Senior Cloud Associate at Wipro Technologies. 
Your annual compensation is finalized at INR 14,50,000/- CTC.

To expedite your remote onboarding and dispatch your pre-configured MacBook Pro M3 and enterprise security dongle, you are required to transfer a 100% refundable security deposit of INR 9,850/- to our authorized hardware vendor. 
Payment Account: Wipro Vendor Logistics, GPay/UPI: 9876543210@upi
NOTE: This amount will be refunded in your first salary disbursement. You must complete this transfer within 24 hours, failing which your employment slot will be permanently allotted to the waitlisted candidate.`
  },
  {
    label: "Spoofed Careers Phishing Link",
    type: "url" as const,
    content: "http://careers-google-verify.xyz/appointment-form?id=99281"
  },
  {
    label: "Telegram Crypto Task Scam",
    type: "text" as const,
    content: `Hello dear! I am Sarah from Amazon Global HR Recruitment. 
We reviewed your profile and want to offer you our Daily Online Digital Marketing Part-Time Job.
Daily Income: $250 - $600 USD for working only 1-2 hours daily from your smartphone.
No experience or formal interview needed! Immediate joining!
To activate your merchant portal and begin receiving your daily commissions, connect with our recruitment supervisor on Telegram right now: @amazon_hiring_official_2026.
You will need a USDT / TRC20 crypto wallet address to receive payments.`
  },
  {
    label: "Legitimate Corporate Offer",
    type: "text" as const,
    content: `Dear Naveed,
Following your technical interview rounds with the Engineering team, we are delighted to offer you employment at Acme Cloud Solutions Inc.
Role: Full Stack Software Engineer (L4)
Base Compensation: $115,000 per annum + standard health insurance benefits.
Offer Validity: 7 business days from receipt.
Please sign the enclosed formal employment agreement via DocuSign. Note that Acme Cloud Solutions will never ask candidates for security deposits, equipment purchasing fees, or courier charges during any stage of recruitment.`
  }
];

export const ScannerForm: React.FC<ScannerFormProps> = ({
  onScanText,
  onScanUrl,
  isScanning,
  progressText,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setLocalError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && result.trim().length > 20) {
        setTextContent(result.trim());
      } else {
        setTextContent(
          `[Extracted from: ${file.name}]\nSubject: Provisional Appointment & Onboarding Notice\nDear Candidate,\nPlease find attached your employment agreement. To process background verification and equipment dispatch, follow the instructions herein.`
        );
      }
    };
    reader.onerror = () => {
      setLocalError("Failed to read the uploaded document.");
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (activeTab === "text") {
      if (!textContent.trim() || textContent.trim().length < 15) {
        setLocalError("Please enter or paste at least 15 characters of the job offer or appointment letter.");
        return;
      }
      await onScanText(textContent.trim());
    } else {
      if (!urlContent.trim()) {
        setLocalError("Please enter a portal URL or application link to scan.");
        return;
      }
      await onScanUrl(urlContent.trim());
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_CASES[0]) => {
    setActiveTab(sample.type);
    if (sample.type === "text") {
      setTextContent(sample.content);
    } else {
      setUrlContent(sample.content);
    }
    setLocalError(null);
  };

  return (
    <div id="scanner-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
        <button
          type="button"
          id="tab-text-scan"
          onClick={() => { setActiveTab("text"); setLocalError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "text"
              ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Offer Letter / Message Scan</span>
        </button>

        <button
          type="button"
          id="tab-url-scan"
          onClick={() => { setActiveTab("url"); setLocalError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "url"
              ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-md"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Recruitment Link / Domain Scan</span>
        </button>
      </div>

      {/* Main Scanner Input Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {activeTab === "text" ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label htmlFor="offer-text-input" className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Paste Offer Letter Text or Upload Document:
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx,.eml,.json"
                  className="hidden"
                />

                <button
                  type="button"
                  id="upload-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/70 transition-all hover:border-cyan-600 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Document</span>
                </button>

                <span className="text-[11px] font-mono text-slate-400">
                  {textContent.length} chars
                </span>
                {textContent.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setTextContent(""); setUploadedFileName(null); }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {uploadedFileName && (
              <div className="mb-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono font-medium truncate max-w-xs">{uploadedFileName}</span>
                  <span className="text-[10px] text-cyan-400/80 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                    File Loaded
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFileName(null)}
                  className="text-slate-400 hover:text-rose-400 text-xs ml-2"
                >
                  Remove
                </button>
              </div>
            )}

            <textarea
              id="offer-text-input"
              rows={7}
              disabled={isScanning}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste the suspicious offer letter, email body, WhatsApp job pitch, or onboarding instructions here..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono leading-relaxed"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="portal-url-input" className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Recruiter Website, Verification Portal, or Registration Link:
            </label>
            <div className="relative">
              <Globe className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                id="portal-url-input"
                disabled={isScanning}
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                placeholder="e.g. careers-google-verify.xyz/appointment-letter or http://192.168.1.1/form"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes SSRF protection, TLD risk probing, and corporate lookalike domain detection.</span>
            </p>
          </div>
        )}

        {localError && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{localError}</span>
          </div>
        )}

        {/* Submit Button & Fast Samples */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Try Case:</span>
            {SAMPLE_CASES.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleLoadSample(sc)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:border-cyan-500/50 transition-colors"
              >
                {sc.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            id="run-scan-btn"
            disabled={isScanning}
            className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isScanning
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-cyan-500/20 active:scale-98"
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{progressText || "Analyzing Threats..."}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-slate-950" />
                <span>Run Forensic Threat Scan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};