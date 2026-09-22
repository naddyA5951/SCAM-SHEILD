import React from "react";
import { AlertTriangle, ShieldCheck, DollarSign, Send, Award } from "lucide-react";

export const EducationalBanner: React.FC = () => {
  return (
    <div id="educational-intel-banner" className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Threat Intelligence Briefing
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 font-mono mt-1">
            Why Standard Spam Filters Miss Fake Offer Letters
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>$365M+ Lost Annually to Employment Scams</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
            1. Equipment Deposit Trap
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scammers offer high-paying remote roles, then demand a &ldquo;refundable deposit&rdquo; for MacBook or home-office dispatch.
          </p>
        </div>

        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Send className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
            2. Off-Platform Redirection
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Redirecting victims from LinkedIn/Indeed to unmonitored Telegram or WhatsApp channels to avoid corporate audit trails.
          </p>
        </div>

        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
            3. Spoofed Domains (.xyz)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Registering lookalike domains (e.g. <code>google-careers-portal.xyz</code>) to harvest credentials and personal identity documents.
          </p>
        </div>

        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
            4. The No-Interview Lure
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct job offers without any technical evaluation or live video interview, targeting vulnerable eager job seekers.
          </p>
        </div>
      </div>
    </div>
  );
};
