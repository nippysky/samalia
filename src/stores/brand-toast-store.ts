// src/stores/brand-toast-store.ts
import { create } from "zustand";

export type BrandToastVariant = "success" | "error" | "info";

export type BrandToast = {
  id: string;
  title: string;
  message?: string;
  variant: BrandToastVariant;
};

type BrandToastInput = {
  title: string;
  message?: string;
  variant?: BrandToastVariant;
};

type BrandToastStore = {
  toasts: BrandToast[];
  pushToast: (toast: BrandToastInput) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useBrandToastStore = create<BrandToastStore>((set) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = createToastId();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          title: toast.title,
          message: toast.message,
          variant: toast.variant ?? "info",
        },
      ].slice(-4),
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));