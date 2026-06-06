"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, History, Settings, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-surface h-screen sticky top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xl tracking-tight">
          <Sparkles className="w-6 h-6" />
          <span>ADPD</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                  : "text-slate-600 hover:bg-surface-muted hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-zinc-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
              : "text-slate-600 hover:bg-surface-muted hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
          )}
        >
          <Settings className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
