"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/components/AuthProvider";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <AuthProvider>
      {isAuthPage ? (
        <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
          {children}
        </main>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>
          </div>
        </>
      )}
    </AuthProvider>
  );
}
