import React, { useState, useRef } from "react";
import { Shield, Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Sparkles, KeyRound, Cpu, ShieldCheck } from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "email";
  joinedAt: number;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 3D Card Tilt state (Hand-Coded CSS Perspective)
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 7 degrees tilt
    const rx = ((centerY - y) / centerY) * 7;
    const ry = ((x - centerX) / centerX) * 7;

    setTilt({
      rx,
      ry,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: `g_${Date.now()}`,
        name: "Naveed Ali",
        email: "naveedalicodes1@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        provider: "google",
        joinedAt: Date.now(),
      };
      setLoading(false);
      onLoginSuccess(googleUser);
    }, 550);
  };

  const handleQuickDemoSignIn = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const demoUser: UserProfile = {
        id: `demo_${Date.now()}`,
        name: "Verified Security Candidate",
        email: "candidate.demo@scamshield.internal",
        provider: "email",
        joinedAt: Date.now(),
      };
      setLoading(false);
      onLoginSuccess(demoUser);
    }, 450);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: isSignUp
          ? name.trim()
          : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.trim().toLowerCase(),
        provider: "email",
        joinedAt: Date.now(),
      };
      setLoading(false);
      onLoginSuccess(userProfile);
    }, 600);
  };

  return (
    <div
      id="login-page-container"
      className="relative z-10 min-h-[82vh] flex items-center justify-center px-4 py-10"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Perspective Tilt Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
        }}
        className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Dynamic hand-coded glare reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4), transparent 80%)`,
          }}
        />

        {/* Top glowing cyber accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500" />

        {/* Header section */}
        <div className="p-6 sm:p-7 bg-slate-850/90 border-b border-slate-800/90 relative">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-900/60"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Scanner</span>
            </button>

            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              NODE // AUTH_V2.4
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                {isSignUp ? "Create Security Profile" : "Access ScamShield"}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Inspect contracts, unlock PDF upload, & track threat history
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Form */}
        <div className="p-6 sm:p-8 space-y-5 bg-slate-900/90">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Direct Google Sign In Button */}
          <button
            id="google-signin-btn"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-100 bg-slate-800 hover:bg-slate-750 hover:border-cyan-500/50 border border-slate-700 shadow-md transition-all active:scale-98 group"
          >
            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick One-Click Candidate Test Sign-In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleQuickDemoSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 hover:border-cyan-600 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚡ Instant One-Click Candidate Test Login</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">or email sign-in</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Naveed Ali"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <button
              id="submit-auth-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg shadow-cyan-500/25 active:scale-98"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Initialize Candidate Profile" : "Sign In to ScamShield"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Features Checklist */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Document Upload Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gemini 3.8 AI Scanner</span>
            </div>
          </div>

          <div className="text-center pt-2">
            {isSignUp ? (
              <p className="text-xs text-slate-300">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 ml-1"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-300">
                First time scanning?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 ml-1"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};