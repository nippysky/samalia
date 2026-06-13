// app/admin/login/page.tsx
// Server Component — reads dev credentials from SERVER-ONLY env vars.
// These are never in the client bundle; they render into the initial HTML
// only in development (empty strings in production).

import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/src/components/admin/login-form";

export const metadata = {
  title: "Admin · Sam'Aila",
  robots: "noindex, nofollow", // never index the login page
};

export default function AdminLoginPage() {
  // Server-only env vars (no NEXT_PUBLIC_ prefix = never in the JS bundle).
  // In production, leave ADMIN_EMAIL and ADMIN_PASSWORD unset (or empty) so
  // the form renders blank. In development, set them in .env.local.
  const isDev = process.env.NODE_ENV === "development";
  const defaultEmail    = isDev ? (process.env.ADMIN_EMAIL    ?? "") : "";
  const defaultPassword = isDev ? (process.env.ADMIN_PASSWORD ?? "") : "";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/Samalia_Logo.svg"
            alt="Sam'Aila"
            width={72}
            height={68}
            priority
            className="mb-5"
          />
          <p className="text-gray-400 text-[10px] tracking-[0.28em] uppercase">
            Admin Console
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-100 shadow-sm p-8 w-full">
          <Suspense fallback={null}>
            <LoginForm
              defaultEmail={defaultEmail}
              defaultPassword={defaultPassword}
            />
          </Suspense>
        </div>

        {/* Dev mode indicator — never shows in production */}
        {isDev && (
          <p className="text-center text-gray-400 text-[9px] tracking-[0.12em] uppercase mt-3">
            Dev mode — credentials pre-filled from .env.local
          </p>
        )}

        <p className="text-center text-gray-300 text-[10px] tracking-[0.12em] mt-6">
          Sam&apos;Aila Studio · Admin Access
        </p>
      </div>
    </div>
  );
}
