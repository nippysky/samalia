// src/lib/validations.ts
// Zod schemas for all form validation

import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ── Hero Slides ───────────────────────────────────────────────────

export const heroSlideSchema = z.object({
  imageSrc: z.string().min(1, "Image is required"),
  imagePublicId: z.string().default(""),
  imageAlt: z.string().default(""),
  imagePosition: z.string().default("center"),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  ctaLabel: z.string().default(""),
  ctaHref: z.string().default("/ready-to-wear"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

// ── Products ──────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  categorySlug: z.string().min(1, "Category is required"),
  tier: z.enum(["READY_TO_WEAR", "BESPOKE", "MADE_TO_ORDER"]).default("READY_TO_WEAR"),
  description: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  priceKobo: z.coerce.number().int().min(0, "Price must be positive"),
  comparePriceKobo: z.coerce.number().int().min(0).optional().nullable(),
  tags: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});
export type ProductInput = z.infer<typeof productSchema>;

export const productVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional(),
  isAvailable: z.boolean().default(true),
});
export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// ── Lookbooks ─────────────────────────────────────────────────────

export const lookbookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  subtitle: z.string().optional(),
  season: z.string().optional(),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  coverImagePublicId: z.string().default(""),
  coverImageSrc: z.string().default(""),
  coverImageAlt: z.string().default(""),
  heroImagePublicId: z.string().default(""),
  heroImageSrc: z.string().default(""),
  heroImageAlt: z.string().default(""),
});
export type LookbookInput = z.infer<typeof lookbookSchema>;

export const lookbookLookSchema = z.object({
  lookNumber: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  imageSrc: z.string().min(1, "Look image is required"),
  imagePublicId: z.string().default(""),
  imageAlt: z.string().default(""),
  imagePosition: z.string().default("center"),
  order: z.coerce.number().int().default(0),
});
export type LookbookLookInput = z.infer<typeof lookbookLookSchema>;

// ── Journal ───────────────────────────────────────────────────────

export const journalArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  coverImagePublicId: z.string().default(""),
  coverImageSrc: z.string().default(""),
  coverImageAlt: z.string().default(""),
});
export type JournalArticleInput = z.infer<typeof journalArticleSchema>;

// ── Orders ────────────────────────────────────────────────────────

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// ── Appointments ──────────────────────────────────────────────────

export const appointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  adminNotes: z.string().optional(),
});
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
