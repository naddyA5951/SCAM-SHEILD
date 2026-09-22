import React, { useState } from "react";
import { Shield, Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types";

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
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (isSignUp && !name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: isSignUp ? name.trim() : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        email: email.trim().toLowerCase(),
        provider: "email",
        joinedAt: Date.now(),
      };
      setLoading(false);
      onLoginSuccess(userProfile);
    }, 600);
  };

  return (
    <div id="login-page-container" className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 p-6 border-b border-slate-800/80 relative">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Security Scanner</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/25">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isSignUp ? "Create ScamShield Account" : "Sign In to ScamShield"}
              </h2>
              <p className="text-xs text-slate-400">
                Unlock document upload & unlimited threat scans
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            id="google-signin-btn"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-100 bg-slate-800/90 hover:bg-slate-700 hover:border-slate-600 border border-slate-700 shadow-md transition-all active:scale-98"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Naveed Ali"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-lg shadow-cyan-500/20 active:scale-98"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? "Create Free Account" : "Sign In to Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            {isSignUp ? (
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(null); }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                New candidate?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(null); }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
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