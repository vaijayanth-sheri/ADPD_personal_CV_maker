"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { FileText, Briefcase, FilePlus, ChevronRight, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cvs: 0, coverLetters: 0, total: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    const { data: apps, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && apps) {
      const cvs = apps.filter(a => a.doc_type === "cv").length;
      const coverLetters = apps.filter(a => a.doc_type === "cover_letter").length;
      setStats({ cvs, coverLetters, total: apps.length });
      setRecentApps(apps.slice(0, 5)); // show latest 5
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Welcome back, {user?.email?.split('@')[0] || "User"}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Here is an overview of your recent job application personalization activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="CVs Generated"
          value={stats.cvs.toString()}
          trend="Total in system"
          icon={Briefcase}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Cover Letters"
          value={stats.coverLetters.toString()}
          trend="Total in system"
          icon={FilePlus}
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Applications"
          value={stats.total.toString()}
          trend="Total generated"
          icon={CheckCircle2}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Quick Actions / Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-500/10 dark:to-brand-500/5 border border-brand-200 dark:border-brand-500/20">
            <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-4">
              How it works
            </h2>
            <div className="space-y-4 text-sm text-brand-800 dark:text-brand-200">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-500/30 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 shrink-0">1</div>
                <p><strong>Upload your Templates:</strong> Head to the Templates page to upload your base .docx templates for your CV and Cover Letter.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-500/30 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 shrink-0">2</div>
                <p><strong>Create a Document:</strong> Choose to Create CV or Create Cover Letter from the sidebar.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-500/30 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 shrink-0">3</div>
                <p><strong>Upload Content:</strong> Enter job details and drop a markdown (.md) file to merge into the template.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <Link href="/cv" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Generate CV
              </Link>
              <Link href="/cover-letter" className="px-5 py-2.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 rounded-xl font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Cover Letter
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Application History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent History
            </h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 flex justify-center text-brand-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : recentApps.length === 0 ? (
              <div className="p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface text-center text-slate-500 dark:text-zinc-400 text-sm">
                No history yet. Start generating!
              </div>
            ) : (
              recentApps.map((app) => (
                <div 
                  key={app.id} 
                  className="group p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      app.doc_type === 'cv' 
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {app.doc_type === 'cv' ? <Briefcase className="w-5 h-5" /> : <FilePlus className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate max-w-[140px]">
                        {app.job_title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {app.company} • {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper component for stats
function StatCard({ title, value, trend, icon: Icon, color, loading }: any) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 ring-blue-100 dark:ring-blue-500/20",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-500/20",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 ring-purple-100 dark:ring-purple-500/20",
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:shadow-lg transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ring-1 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-16 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-md"></div>
        ) : (
          <span className="text-3xl font-bold text-slate-900 dark:text-zinc-50">
            {value}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
        {trend}
      </p>
    </div>
  );
}
