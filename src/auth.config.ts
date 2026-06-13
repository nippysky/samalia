// src/auth.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Edge-compatible Auth.js v5 base config.
// NO Prisma, NO pg, NO Node.js-only imports — safe to run in Edge Runtime.
//
// This is imported by proxy.ts (Edge) and spread into the full auth.ts (Node.js).
// The two NextAuth instances share AUTH_SECRET so their JWTs are interoperable.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  // JWT strategy — sessions live in a signed cookie, no DB lookup in middleware.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookie config must match between the Edge (proxy) and Node.js (auth) instances
  // so they read/write the same cookie.
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Providers are added in auth.ts — the proxy only validates existing tokens.
  providers: [],
};
