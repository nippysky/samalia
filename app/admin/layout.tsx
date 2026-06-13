// app/admin/layout.tsx
// Admin layout — completely isolated from the frontend (site) layout.
// No SiteHeader, no SiteFooter, no QueryProvider — just the admin shell.
"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/src/components/admin/admin-sidebar";
import { AdminShellContext } from "@/src/components/admin/admin-topbar";

type AdminLayoutProps = { children: React.ReactNode };

function AdminShell({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <AdminShellContext.Provider value={{ onMenuClick: () => setSidebarOpen(true) }}>
      {/* Full-viewport admin shell — sidebar + scrollable content area */}
      <div className="flex h-svh bg-white overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
