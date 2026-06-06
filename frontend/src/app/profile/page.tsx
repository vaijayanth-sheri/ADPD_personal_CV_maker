"use client";

import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { User, Sparkles, FolderOpen, Briefcase, Plus } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-brand-500" />
          Your Profile
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your personal details and content libraries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* User Information Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 ring-4 ring-white dark:ring-zinc-950 shadow-sm">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                {user?.email?.split('@')[0] || "User"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                {user?.email}
              </p>
              
              <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl font-medium text-sm transition-colors">
                Edit Profile
              </button>
            </div>
            
            <hr className="my-6 border-slate-200 dark:border-zinc-800" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-zinc-400">Account Type</span>
                <span className="font-medium text-slate-900 dark:text-zinc-100">Standard</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-zinc-400">Joined</span>
                <span className="font-medium text-slate-900 dark:text-zinc-100">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Libraries */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Experience Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-500" />
                Experience Library
              </h3>
              <button className="p-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-zinc-100">Senior Frontend Engineer</h4>
                  <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md">2021 - Present</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">Tech Corp Inc.</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">React</span>
                  <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">Next.js</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-300 dark:hover:border-brand-700 transition-colors border-dashed text-center flex flex-col items-center justify-center py-8">
                <p className="text-sm text-slate-500 dark:text-zinc-400">You haven't added other experiences yet.</p>
              </div>
            </div>
          </div>

          {/* Project Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-brand-500" />
                Project Library
              </h3>
              <button className="p-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h4 className="font-semibold text-slate-900 dark:text-zinc-100 mb-1">E-Commerce Redesign</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 line-clamp-2">Led the complete overhaul of the main shopping cart flow resulting in 15% conversion increase.</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded">UX</span>
                  <span className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded">Frontend</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 bg-surface hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">Create new project</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
