import React from "react";
import { RiskLevel } from "../types";
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskLevel }) => {
  // SVG circular gauge math
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorTheme = () => {
    if (score <= 20) {
      return {
        stroke: "#10b981", // emerald-500
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
        icon: ShieldCheck,
      };
    }
    if (score <= 40) {
      return {
        stroke: "#84cc16", // lime-500
        text: "text-lime-400",
        bg: "bg-lime-500/10",
        border: "border-lime-500/30",
        glow: "shadow-[0_0_25px_rgba(132,204,22,0.25)]",
        icon: ShieldCheck,
      };
    }
    if (score <= 60) {
      return {
        stroke: "#f59e0b", // amber-500
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]",
        icon: AlertTriangle,
      };
    }
    if (score <= 80) {
      return {
        stroke: "#f97316", // orange-500
        text: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
        icon: ShieldAlert,
      };
    }
    return {
      stroke: "#f43f5e", // rose-500
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/40",
      glow: "shadow-[0_0_35px_rgba(244,63,94,0.35)]",
      icon: Flame,
    };
  };

  const theme = getColorTheme();
  const IconComponent = theme.icon;

  return (
    <div id="score-gauge-container" className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="14"
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
            THREAT INDEX
          </span>
          <div className="flex items-baseline">
            <span className={`text-5xl font-extrabold tracking-tight font-mono ${theme.text}`}>
              {score}
            </span>
            <span className="text-xl font-bold text-slate-500 ml-0.5">%</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
            Score: {score}/100
          </span>
        </div>
      </div>

      {/* Risk level badge */}
      <div
        id="risk-level-badge"
        className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide ${theme.bg} ${theme.border} ${theme.text} ${theme.glow}`}
      >
        <IconComponent className="w-4 h-4" />
        <span>{riskLevel}</span>
      </div>

      <p className="mt-3 text-xs text-slate-400 text-center max-w-xs">
        Automated cyber threat heuristic index. Does not constitute legal advice.
      </p>
    </div>
  );
};
