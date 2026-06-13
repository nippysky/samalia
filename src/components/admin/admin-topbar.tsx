// src/components/admin/admin-topbar.tsx
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { AdminMenuButton } from "./admin-sidebar";

type AdminShellContextType = { onMenuClick: () => void };
type AdminTopbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
};

export function AdminTopbar({ title, subtitle, onMenuClick, actions }: AdminTopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center gap-4 px-4 sm:px-6 py-3.5 shrink-0">
      <AdminMenuButton onClick={onMenuClick} />

      <div className="flex-1 min-w-0">
        <h1
          className="text-gray-900 font-light leading-none truncate"
          style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(0.95rem, 2vw, 1.15rem)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-[11px] tracking-[0.08em] mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}

        {/* Admin avatar */}
        {session?.user && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
            <div className="w-7 h-7 bg-gray-900 flex items-center justify-center text-white text-[11px] font-medium shrink-0">
              {(session.user.name ?? session.user.email ?? "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <span className="hidden sm:block text-gray-400 text-[12px] max-w-[120px] truncate">
              {session.user.name ?? session.user.email}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

// ── Page shell helper ─────────────────────────────────────────────

const AdminShellContext = React.createContext<AdminShellContextType>({ onMenuClick: () => {} });
export { AdminShellContext };

export function AdminPageShell({
  title,
  subtitle,
  actions,
  children,
  onMenuClick: onMenuClickProp,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  onMenuClick?: () => void;
}) {
  const ctx = React.useContext(AdminShellContext);
  const onMenuClick = onMenuClickProp ?? ctx.onMenuClick;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <AdminTopbar
        title={title}
        subtitle={subtitle}
        actions={actions}
        onMenuClick={onMenuClick}
      />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
