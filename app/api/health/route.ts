// app/api/health/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Liveness + readiness probe for Digital Ocean App Platform / load balancers.
//
// GET /api/health
//   → 200  { status: "ok",   db: { ok: true,  latencyMs: 4,  poolStats: {...} } }
//   → 503  { status: "down", db: { ok: false, latencyMs: 12, poolStats: {...} } }
//
// Configure DO health check:
//   Path:              /api/health
//   Success threshold: 1
//   Failure threshold: 3
//   Interval:          10 s
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { dbHealthCheck } from "@/src/lib/db";

export const dynamic = "force-dynamic"; // never cache — always live check

export async function GET() {
  const db = await dbHealthCheck();

  const body = {
    status: db.ok ? "ok" : "down",
    version: process.env.npm_package_version ?? "unknown",
    env: process.env.NODE_ENV,
    db,
    ts: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status: db.ok ? 200 : 503,
    headers: {
      // Don't cache health checks anywhere
      "Cache-Control": "no-store",
    },
  });
}
