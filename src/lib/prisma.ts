// src/lib/prisma.ts
// ─────────────────────────────────────────────────────────────────────────────
// Backward-compat re-export.
// All existing code imports { prisma } from "@/src/lib/prisma" — this keeps
// working without touching those files.
//
// For NEW code, prefer the canonical import:
//   import { db } from "@/src/lib/db"
// ─────────────────────────────────────────────────────────────────────────────

export { db as prisma } from "@/src/lib/db";
