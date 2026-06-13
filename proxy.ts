// proxy.ts — Next.js 16 route proxy (Edge Runtime)
// ─────────────────────────────────────────────────────────────────────────────
// Responsibilities:
//   1. Protect all /admin/* routes — redirect unauthenticated visitors to login
//   2. Rate-limit POST /admin/login — slow brute-force attacks
//   3. Add security response headers to all admin pages
//
// IMPORTANT: This file runs in Edge Runtime — no Prisma, no pg, no Node.js APIs.
// Auth validation uses only JWT (cookie-based, no DB round-trip).
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from "next-auth";
import { authConfig } from "@/src/auth.config";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "next-auth";

// Edge-compatible auth — validates JWT cookie without touching the database.
// Shares AUTH_SECRET with the full auth.ts instance so tokens are interoperable.
const { auth } = NextAuth(authConfig);

// Auth.js v5 augments NextRequest with the decoded session
type NextAuthRequest = NextRequest & { auth: Session | null };

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Per-IP sliding window: 10 login attempts per 15 minutes.
// For multi-replica deployments swap for @upstash/ratelimit (Redis-backed).

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

type RateEntry = { count: number; resetAt: number };
const ipMap = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;

  ipMap.set(ip, entry);
  return false;
}

// ── Proxy handler ─────────────────────────────────────────────────────────────

export const proxy = auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const reqMethod = req.method ?? "GET";

  // Rate-limit login attempts
  if (pathname === "/admin/login" && reqMethod === "POST") {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return new NextResponse("Too many login attempts. Try again later.", {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // Login page — always allow through
  if (pathname === "/admin/login") return NextResponse.next();

  // All other /admin/* require a valid session
  if (!req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add security headers to all authenticated admin responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
});

export const config = {
  matcher: ["/admin/:path*"],
};
