"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created successfully. You can now sign in.");
      // In many cases, if email confirmation is off, this logs them in automatically.
      // The AuthProvider will handle redirecting to '/' if logged in.
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-surface shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-zinc-50 mb-2">Create an account</h1>
      <p className="text-center text-slate-500 dark:text-zinc-400 mb-8 text-sm">Join us to personalize your applications</p>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !!success}
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-zinc-400">
        Already have an account? <Link href="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
