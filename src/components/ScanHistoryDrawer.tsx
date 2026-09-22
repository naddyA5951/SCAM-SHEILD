import React from "react";
import { ScanResult } from "../types";
import { X, Trash2, ExternalLink, ShieldCheck, ShieldAlert, Clock, ArrowRight } from "lucide-react";

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory: () => void;
}

export const ScanHistoryDrawer: React.FC<ScanHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score <= 20) return "text-emerald-400 bg-emerald-950/60 border-emerald-800/80";
    if (score <= 40) return "text-lime-400 bg-lime-950/60 border-lime-800/80";
    if (score <= 60) return "text-amber-400 bg-amber-950/60 border-amber-800/80";
    if (score <= 80) return "text-orange-400 bg-orange-950/60 border-orange-800/80";
    return "text-rose-400 bg-rose-950/60 border-rose-800/80";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="scan-history-drawer"
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-mono uppercase tracking-wider font-bold text-slate-100">
              Scan Audit History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cached locally in browser localStorage ({history.length} scans)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-500">
              <Clock className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
              <p className="text-sm font-medium text-slate-400">No previous scan history yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Run an offer letter or URL scan to populate your security inspection timeline.
              </p>
            </div>
          ) : (
            history.map((scan) => (
              <div
                key={scan.id}
                onClick={() => {
                  onSelectScan(scan);
                  onClose();
                }}
                className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all hover:translate-x-1 group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    {scan.scanType.toUpperCase()} SCAN
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(
                      scan.score
                    )}`}
                  >
                    {scan.score}% &bull; {scan.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 font-mono group-hover:text-cyan-300 transition-colors">
                  {scan.inputSnippet}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  <span>{new Date(scan.timestamp).toLocaleString()}</span>
                  <span className="text-cyan-400 flex items-center gap-0.5 group-hover:underline">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClearHistory}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Scan History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
