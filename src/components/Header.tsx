import React from "react";
import { ShieldCheck, History, BookOpen, Terminal, Sparkles } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onSelectDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenGuide,
  onSelectDemo,
}) => {
  return (
    <header id="main-header" className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-slate-100 font-mono">
                SCAM<span className="text-cyan-400">SHIELD</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                v1.0 Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI Fake Offer Letter & Phishing Inspector
            </p>
          </div>
        </div>

        {/* Right Navigation & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Button */}
          <button
            id="header-demo-btn"
            onClick={onSelectDemo}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Cases</span>
          </button>

          {/* Mentorship & Stage 0 Guide Modal Button */}
          <button
            id="header-guide-btn"
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-colors"
            title="Stage 0: Architecture, Mac Terminal Commands & Setup Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Mentor Guide</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            id="header-history-btn"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
