// prisma.config.ts
// Prisma v7 — centralised CLI configuration.
//
// Next.js loads .env.local automatically, but the Prisma CLI does not use
// Next.js — it runs standalone. We manually load both files here so that
// `prisma migrate`, `prisma studio`, and `prisma db push` all see the same
// DATABASE_URL that Next.js sees at runtime.
//
// Priority (highest → lowest):  process env  →  .env.local  →  .env

import { config } from "dotenv";

// Load .env.local first — its values take priority (won't override shell env)
config({ path: ".env.local" });
// Load .env as fallback for any vars not in .env.local
config();

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Only provide datasource when the var is present so `prisma generate`
  // still works in CI without a live database.
  ...(process.env.DATABASE_URL
    ? { datasource: { url: process.env.DATABASE_URL } }
    : {}),
});
