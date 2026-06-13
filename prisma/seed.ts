// prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Creates (or updates) the default admin user.
//
// Run:
//   npm run db:seed
//
// The email and password are read from environment variables so you never
// hard-code credentials in the repo. In development, .env.local holds them.
// Before going live, change ADMIN_PASSWORD to something only you know.
//
// Password is hashed with bcrypt cost 12 (deliberate — slow enough to resist
// brute-force even on a GPU cluster; fast enough that seeding takes ~0.5 s).
// ─────────────────────────────────────────────────────────────────────────────

import { config } from "dotenv";
config({ path: ".env.local" }); // load .env.local first (highest priority)
config();                        // fallback to .env
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Standalone seed client — does not use the global singleton from db.ts
// because seed runs as a one-off script, not inside the Next.js server.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  // Accept self-signed / hostname-mismatch certs (Postgres on a droplet uses
  // a cert issued to the server's domain, not its IP).
  ssl: process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
    : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Default credentials (override via env) ────────────────────────────────────
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@samalia.com";
const ADMIN_NAME     = process.env.ADMIN_NAME     ?? "Sam'Aila Admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Samalia@Admin2026!";

// ── Seed ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Seeding database…");

  // bcrypt cost 12: ~0.4 s per hash — far too slow for an attacker to brute-force
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where:  { email: ADMIN_EMAIL },
    update: {
      // Update name + password on re-seed (allows credential rotation)
      name:     ADMIN_NAME,
      password: hashedPassword,
      role:     "ADMIN",
    },
    create: {
      email:    ADMIN_EMAIL,
      name:     ADMIN_NAME,
      password: hashedPassword,
      role:     "ADMIN",
    },
  });

  console.log(`✅  Admin user ready:`);
  console.log(`     Email : ${user.email}`);
  console.log(`     Role  : ${user.role}`);
  console.log(`     ID    : ${user.id}`);
  console.log("");
  console.log("⚠️   Change ADMIN_PASSWORD in .env before going live.");
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
