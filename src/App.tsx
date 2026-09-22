import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ScannerForm, SAMPLE_CASES } from "./components/ScannerForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { ScanHistoryDrawer } from "./components/ScanHistoryDrawer";
import { MentorGuideModal } from "./components/MentorGuideModal";
import { EducationalBanner } from "./components/EducationalBanner";
import { AuthModal } from "./components/AuthModal";
import { ScanResult } from "./types";
import { ShieldCheck, ShieldAlert, Sparkles, Terminal, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "scamshield_scan_history_v1";
const USER_KEY = "scamshield_user_session_v1";

export default function App() {
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgressText, setScanProgressText] = useState("");
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // UserProfile is not exported by ./types; keep the session value compatible
  // with the auth component until a shared profile type is introduced.
  const [user, setUser] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }

      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.warn("Failed to read cached data from localStorage", err);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    } catch (err) {
      console.warn("Failed to cache user session", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.warn("Failed to clear user session", err);
    }
  };

  const saveToHistory = (newResult: ScanResult) => {
    setHistory((prev) => {
      const updated = [newResult, ...prev.filter((item) => item.id !== newResult.id)].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist history", e);
      }
      return updated;
    });
  };

  const handleScanText = async (text: string) => {
    setIsScanning(true);
    setApiError(null);
    setScanProgressText("Extracting red flags & payment phrases...");

    try {
      const response = await fetch("/api/scan/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with HTTP ${response.status}`);
      }

      const data: ScanResult = await response.json();
      setActiveResult(data);
      saveToHistory(data);

      setTimeout(() => {
        const resultsElem = document.getElementById("results-dashboard-section");
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: any) {
      console.error("Text scan error:", err);
      setApiError(err.message || "Failed to analyze offer text. Please check your connection or retry.");
    } finally {
      setIsScanning(false);
      setScanProgressText("");
    }
  };

  const handleScanUrl = async (url: string) => {
    setIsScanning(true);
    setApiError(null);
    setScanProgressText("Probing domain infrastructure & phishing markers...");

    try {
      const response = await fetch("/api/scan/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with HTTP ${response.status}`);
      }

      const data: ScanResult = await response.json();
      setActiveResult(data);
      saveToHistory(data);

      setTimeout(() => {
        const resultsElem = document.getElementById("results-dashboard-section");
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: any) {
      console.error("URL scan error:", err);
      setApiError(err.message || "Failed to analyze domain link. Please verify URL formatting and retry.");
    } finally {
      setIsScanning(false);
      setScanProgressText("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        historyCount={history.length}
        user={user}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSelectDemo={() => {
          const elem = document.getElementById("scanner-section");
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <EducationalBanner />

        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Forensic Verification + Deterministic Rule Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Verify Job Offers Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Pay A Single Rupee</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Detect laptop deposit traps, spoofed corporate domains, advance fee fraud, and suspicious Telegram recruiters using dual-engine cybersecurity intelligence.
          </p>
        </div>

        {apiError && (
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-semibold text-rose-300">Scan Warning</p>
              <p className="mt-0.5 text-rose-300/90">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 font-mono underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <ScannerForm
            onScanText={handleScanText}
            onScanUrl={handleScanUrl}
            isScanning={isScanning}
            progressText={scanProgressText}
          />
        </div>

        {activeResult && (
          <div id="results-dashboard-section" className="pt-4 scroll-mt-20">
            <ResultsDashboard result={activeResult} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-400 font-mono">
        <p>ScamShield Cyber Defense Engine • Built for Candidate Safety & Anti-Fraud Security</p>
      </footer>

      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelectResult={(item) => {
          setActiveResult(item);
          setIsHistoryOpen(false);
          const el = document.getElementById("results-dashboard-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem(STORAGE_KEY);
        }}
      />

      <MentorGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}