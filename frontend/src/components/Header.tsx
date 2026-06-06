"use client";

import React from "react";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-zinc-800 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
      {/* Spacer to push actions to the right */}
      <div className="flex-1"></div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 pl-4">
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 p-0.5 shadow-sm cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 overflow-hidden">
            {/* Placeholder avatar */}
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
