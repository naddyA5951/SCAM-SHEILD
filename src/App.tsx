import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ScannerForm, SAMPLE_CASES } from "./components/ScannerForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { ScanHistoryDrawer } from "./components/ScanHistoryDrawer";
import { MentorGuideModal } from "./components/MentorGuideModal";
import { EducationalBanner } from "./components/EducationalBanner";
import { ScanResult } from "./types";
import { ShieldCheck, ShieldAlert, Sparkles, Terminal, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "scamshield_scan_history_v1";

export default function App() {
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgressText, setScanProgressText] = useState("");
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to read scan history from localStorage", err);
    }
  }, []);

  const saveToHistory = (newResult: ScanResult) => {
    setHistory((prev) => {
      const updated = [newResult, ...prev.filter((item) => item.id !== newResult.id)].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to cache to localStorage", err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear localStorage", err);
    }
  };

  const handleScanText = async (text: string) => {
    setIsScanning(true);
    setApiError(null);
    setScanProgressText("Analyzing linguistic red flags...");

    try {
      const timer = setTimeout(() => {
        setScanProgressText("Querying Gemini 3.8 Flash forensic model...");
      }, 700);

      const response = await fetch("/api/scan/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Scan failed with status ${response.status}`);
      }

      const data: ScanResult = await response.json();
      setActiveResult(data);
      saveToHistory(data);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: any) {
      console.error("Text scan request error:", err);
      setApiError(err.message || "Unable to complete security scan. Please try again.");
    } finally {
      setIsScanning(false);
      setScanProgressText("");
    }
  };

  const handleScanUrl = async (url: string) => {
    setIsScanning(true);
    setApiError(null);
    setScanProgressText("Running SSRF & Domain Security Sandbox...");

    try {
      const timer = setTimeout(() => {
        setScanProgressText("Inspecting TLD, Brand Spoofing & Phishing markers...");
      }, 700);

      const response = await fetch("/api/scan/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `URL scan failed with status ${response.status}`);
      }

      const data: ScanResult = await response.json();
      setActiveResult(data);
      saveToHistory(data);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: any) {
      console.error("URL scan request error:", err);
      setApiError(err.message || "Unable to complete URL security scan. Please try again.");
    } finally {
      setIsScanning(false);
      setScanProgressText("");
    }
  };

  const handleLoadPreset = (sampleIndex: number) => {
    const sample = SAMPLE_CASES[sampleIndex];
    if (sample.type === "text") {
      handleScanText(sample.content);
    } else {
      handleScanUrl(sample.content);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onSelectDemo={() => {
          // Scroll smoothly to scanner form
          const elem = document.getElementById("scanner-section");
          elem?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Fake Offer Letter & Phishing Inspector</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 font-mono">
            Don&apos;t Get Scammed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">
              Before You Get Hired.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Job seekers lose millions to fake appointment letters, laptop equipment fee traps, and lookalike phishing portals. Paste an offer or enter a link to calculate a dynamic <strong>Scam Threat Index (0–100%)</strong>.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              Deterministic Rules Engine
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              Gemini 3.8 Flash Hybrid AI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              SSRF & Domain Sandbox
            </span>
          </div>
        </section>

        {/* Global Error Banner */}
        {apiError && (
          <div className="max-w-2xl mx-auto flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-xs font-mono font-bold text-rose-400 hover:text-rose-200 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Interactive Scanner or Results View */}
        <section id="scanner-section" className="max-w-4xl mx-auto">
          {activeResult ? (
            <ResultsDashboard
              result={activeResult}
              onReset={() => setActiveResult(null)}
            />
          ) : (
            <ScannerForm
              onScanText={handleScanText}
              onScanUrl={handleScanUrl}
              isScanning={isScanning}
              scanProgressText={scanProgressText}
            />
          )}
        </section>

        {/* Educational Briefing Banner */}
        <section className="max-w-5xl mx-auto pt-4">
          <EducationalBanner />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ScamShield &bull; AI Fake Offer Letter & Phishing Inspector</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Mac Terminal & Architecture Guide
            </button>
            <span className="text-slate-700">|</span>
            <span>Hackathon Demonstration Edition</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={(scan) => setActiveResult(scan)}
        onClearHistory={handleClearHistory}
      />

      <MentorGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
