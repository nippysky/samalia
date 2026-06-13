// src/components/admin/admin-sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Images,
  Package,
  ClipboardList,
  BookOpen,
  Newspaper,
  Home,
  Hammer,
  Calendar,
  Settings,
  LogOut,
  BarChart3,
  Layers,
  X,
  Menu,
  ExternalLink,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Website",
    items: [
      { label: "Hero Slides", href: "/admin/hero", icon: Images },
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "The House", href: "/admin/house", icon: Layers },
      { label: "Craft & Legacy", href: "/admin/craft", icon: Hammer },
    ],
  },
  {
    group: "Shop",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
      { label: "Orders", href: "/admin/orders", icon: ClipboardList },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Lookbooks", href: "/admin/lookbooks", icon: BookOpen },
      { label: "Journal", href: "/admin/journal", icon: Newspaper },
    ],
  },
  {
    group: "Service",
    items: [
      { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 shrink-0">
          <Link href="/admin" className="flex flex-col gap-0.5 group" onClick={onClose}>
            <Image
              src="/Samalia_Wordmark.svg"
              alt="Sam'Aila"
              width={110}
              height={37}
              priority
              className="block"
            />
            <span className="text-[9px] tracking-[0.28em] uppercase text-gray-300 font-medium pl-0.5">
              Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-300 hover:text-gray-700 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5">
          {navGroups.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="px-2.5 mb-1.5 text-[9.5px] tracking-[0.28em] uppercase text-gray-300 font-medium">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] transition-colors group relative",
                          active
                            ? "text-gray-900 bg-gray-50 font-medium"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-gray-900" />
                        )}
                        <Icon
                          size={14}
                          className={cn(
                            "shrink-0 transition-colors",
                            active ? "text-gray-900" : "text-gray-300 group-hover:text-gray-600"
                          )}
                        />
                        <span>{item.label}</span>
                        {item.badge != null && item.badge > 0 && (
                          <span className="ml-auto bg-gray-900 text-white text-[9px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-2.5 py-3 shrink-0 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} className="shrink-0" />
            View website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} className="shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Mobile trigger button ─────────────────────────────────────────

export function AdminMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-gray-900 transition-colors"
      aria-label="Open menu"
    >
      <Menu size={19} />
    </button>
  );
}
