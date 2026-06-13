// src/lib/db.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central database connection — single source of truth for the entire app.
//
// Architecture:
//   pg.Pool  →  @prisma/adapter-pg  →  PrismaClient (v7, Rust-free)
//
// Deployment targets:
//   • Development  — Mac → DO droplet (remote SSL, self-signed cert OK)
//   • Production   — Vercel (serverless) → DO droplet (remote SSL)
//
// Vercel vs. persistent server pool strategy:
//   Vercel serverless functions are short-lived — each warm instance reuses
//   the pool within that process, but many concurrent instances each hold
//   their own pool. We cap max:3 on Vercel so 30 warm instances = 90 conns,
//   well within Postgres 18's default max_connections=100.
//   On a persistent server (local dev, custom Node.js server) we keep a
//   larger pool with warm connections for low first-byte latency.
//
// Usage (anywhere in the app):
//   import { db } from "@/src/lib/db"
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ── Environment detection ─────────────────────────────────────────────────────

const isVercel     = !!process.env.VERCEL;           // set automatically by Vercel
const isProd       = process.env.NODE_ENV === "production";
const useSSL       = process.env.DATABASE_SSL === "true";
const trustSelfSigned = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";

// ── 1. Connection pool ────────────────────────────────────────────────────────

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,

  // Vercel: keep pool tiny — many parallel function instances share Postgres.
  // Persistent server (dev / custom Node): keep warm connections for speed.
  max: isVercel
    ? parseInt(process.env.DB_POOL_MAX ?? "3", 10)
    : parseInt(process.env.DB_POOL_MAX ?? "10", 10),

  min: isVercel
    ? 0   // serverless processes die — no point warming connections
    : parseInt(process.env.DB_POOL_MIN ?? "2", 10),

  // Fail fast under load rather than queuing forever
  connectionTimeoutMillis: 5_000,

  // Release idle connections sooner on Vercel (process will be killed anyway)
  idleTimeoutMillis: isVercel ? 10_000 : 30_000,

  // Vercel functions exit on their own; persistent servers should stay alive
  allowExitOnIdle: isVercel,

  // SSL config:
  // - DATABASE_SSL=true     → encrypt the connection (required over internet)
  // - DATABASE_SSL_REJECT_UNAUTHORIZED=false → accept self-signed certs
  //   (Postgres 18 on Ubuntu ships with a self-signed cert by default)
  ...(useSSL
    ? { ssl: { rejectUnauthorized: !trustSelfSigned } }
    : {}),
});

// Surface pool errors without crashing (network blip, Postgres restart, etc.)
pool.on("error", (err) => {
  console.error("[db:pool] idle client error —", err.message);
});

// ── 2. Prisma v7 client ───────────────────────────────────────────────────────
//
// globalThis singleton prevents duplicate clients during Next.js HMR in dev.
// On Vercel each warm function instance has exactly one client per process.

const globalForDb = globalThis as unknown as { db: PrismaClient | undefined };

function createClient(): PrismaClient {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    errorFormat: "minimal",
    log: isProd ? ["error"] : ["query", "error", "warn"],
  });
}

export const db: PrismaClient = globalForDb.db ?? createClient();

if (!isProd) {
  globalForDb.db = db;
}

// ── 3. Graceful shutdown ──────────────────────────────────────────────────────
//
// On Vercel, functions are killed — no SIGTERM. On a persistent server
// (PM2, Docker, DO App Platform) SIGTERM is sent before kill: we drain cleanly.

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`[db] ${signal} — draining connections…`);
  try {
    await db.$disconnect();
    await pool.end();
    console.log("[db] All connections closed.");
  } catch (err) {
    console.error("[db] Shutdown error:", err);
  } finally {
    process.exit(0);
  }
}

if (isProd && !isVercel) {
  // Only register on persistent servers — not on Vercel
  process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.once("SIGINT",  () => gracefulShutdown("SIGINT"));
}

// ── 4. Health check helper ────────────────────────────────────────────────────

export interface DbHealthResult {
  ok: boolean;
  latencyMs: number;
  poolStats: { total: number; idle: number; waiting: number };
}

export async function dbHealthCheck(): Promise<DbHealthResult> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return {
      ok: true,
      latencyMs: Date.now() - start,
      poolStats: {
        total:   pool.totalCount,
        idle:    pool.idleCount,
        waiting: pool.waitingCount,
      },
    };
  } catch {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      poolStats: {
        total:   pool.totalCount,
        idle:    pool.idleCount,
        waiting: pool.waitingCount,
      },
    };
  }
}
