// src/lib/utils.ts
// Shared utility functions

/** Format price from kobo (NGN subunit) to display string */
export function formatPrice(kobo: number): string {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString("en-NG")}`;
}

/** Convert price in Naira to kobo */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** Convert kobo to Naira */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/** Generate a URL-safe slug from a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a random SKU */
export function generateSKU(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SAM-${prefix.toUpperCase()}-${rand}`;
}

/** Format a date for display */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/** Format a datetime for display */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Truncate text to a given length */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/** Class name merger (no dependencies) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Order status to display label */
export function orderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    IN_PRODUCTION: "In Production",
    READY: "Ready",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };
  return map[status] ?? status;
}

/** Appointment status to display label */
export function appointmentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
  };
  return map[status] ?? status;
}
