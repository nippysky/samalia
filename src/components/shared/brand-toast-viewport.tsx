// src/components/shared/brand-toast-viewport.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiInfo, FiX } from "react-icons/fi";

import {
  BrandToast,
  useBrandToastStore,
} from "@/src/stores/brand-toast-store";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BrandToastViewport() {
  const toasts = useBrandToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-100 flex flex-col items-center gap-3 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end sm:px-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <BrandToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function BrandToastItem({ toast }: { toast: BrandToast }) {
  const reducedMotion = Boolean(useReducedMotion());
  const removeToast = useBrandToastStore((state) => state.removeToast);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      removeToast(toast.id);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [removeToast, toast.id]);

  const Icon = toast.variant === "success" ? FiCheck : FiInfo;

  return (
    <motion.div
      role="status"
      initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto w-full max-w-100 border border-black/10 bg-white text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:w-100"
    >
      <div className="flex items-start gap-4 p-4">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center border",
            toast.variant === "success"
              ? "border-black bg-black text-white"
              : toast.variant === "error"
                ? "border-black bg-white text-black"
                : "border-black/10 bg-white text-black"
          )}
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase leading-5 tracking-[0.22em] text-black">
            {toast.title}
          </p>

          {toast.message ? (
            <p className="mt-1 text-sm leading-6 text-black/58">
              {toast.message}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => removeToast(toast.id)}
          className="flex size-8 shrink-0 items-center justify-center text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
        >
          <FiX className="size-4" />
        </button>
      </div>

      <div className="h-px w-full bg-black/10" />
    </motion.div>
  );
}