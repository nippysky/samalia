// src/components/shared/cookie-preferences-modal.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

// ─── Storage contract ────────────────────────────────────────────────────────

export const COOKIE_CONSENT_KEY = "samalia_cookie_consent";
export const COOKIE_CONSENT_EVENT = "samalia-cookie-consent-change";

export type CookieChoice = "accepted" | "rejected" | "custom";

export type CookieSettings = {
  performance: boolean;
  functional: boolean;
  marketing: boolean;
};

export type CookieConsentPayload = {
  choice: CookieChoice;
  settings: CookieSettings;
  updatedAt: string; // ISO-8601
};

const DEFAULT_SETTINGS: CookieSettings = {
  performance: false,
  functional: false,
  marketing: false,
};

// ─── Persistence helpers ─────────────────────────────────────────────────────

/**
 * Writes consent to both localStorage (JS reads) and a first-party HTTP cookie
 * (Next.js middleware / server components). Dispatches a custom event so any
 * mounted `useSyncExternalStore` subscriber re-renders immediately.
 */
export function writeCookieConsent(
  choice: CookieChoice,
  settings: CookieSettings = DEFAULT_SETTINGS
): void {
  if (typeof window === "undefined") return;

  const payload: CookieConsentPayload = {
    choice,
    settings,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));

  // HTTP cookie — readable server-side without JS
  document.cookie = [
    `${COOKIE_CONSENT_KEY}=${choice}`,
    "Max-Age=31536000", // 1 year
    "Path=/",
    "SameSite=Lax",
    // Add Secure=true in production via middleware or a Set-Cookie header
  ].join("; ");

  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

/**
 * Synchronously reads whether the user has made any consent choice.
 * Returns "set" if a choice exists, "unset" otherwise.
 * The server snapshot always returns "set" to avoid SSR hydration mismatches.
 */
export function readCookieConsentState(): "set" | "unset" {
  if (typeof window === "undefined") return "set";
  return window.localStorage.getItem(COOKIE_CONSENT_KEY) ? "set" : "unset";
}

/**
 * Reads the full saved payload (choice + per-category settings).
 * Returns null if no consent has been recorded yet.
 */
export function readCookieConsentPayload(): CookieConsentPayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CookieConsentPayload;
  } catch {
    return null;
  }
}

/**
 * Subscribe to consent changes. Compatible with React's `useSyncExternalStore`.
 * Listens for both same-tab dispatches and cross-tab `storage` events.
 */
export function subscribeCookieConsent(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive the correct toggle state from whatever is saved in localStorage. */
function deriveSettingsFromStorage(): CookieSettings {
  const saved = readCookieConsentPayload();
  if (saved?.choice === "custom") return saved.settings;
  if (saved?.choice === "accepted") {
    return { performance: true, functional: true, marketing: true };
  }
  return DEFAULT_SETTINGS;
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

const COOKIE_TABS = [
  {
    id: "privacy" as const,
    label: "Your privacy",
    title: "Your privacy",
    description:
      "When you visit Sam'Alia, we may store or retrieve information on your browser, mostly in the form of cookies. These help the site work as expected, measure how visitors interact with it, and occasionally support personalised content.",
    toggleKey: null,
    alwaysOn: false,
  },
  {
    id: "necessary" as const,
    label: "Strictly necessary",
    title: "Strictly necessary",
    description:
      "Required for core site functions such as navigation, checkout, and security. These cannot be disabled and do not collect personal information for advertising purposes.",
    toggleKey: null,
    alwaysOn: true,
  },
  {
    id: "performance" as const,
    label: "Performance",
    title: "Performance cookies",
    description:
      "Help us understand how visitors interact with the site by collecting anonymous metrics — pages visited, time on page, error rates. This information is used to improve the experience over time.",
    toggleKey: "performance" as keyof CookieSettings,
    alwaysOn: false,
  },
  {
    id: "functional" as const,
    label: "Functional",
    title: "Functional cookies",
    description:
      "Remember your preferences — language, region, wishlist items — so you don't have to re-enter them on each visit. Disabling these may reduce site personalisation.",
    toggleKey: "functional" as keyof CookieSettings,
    alwaysOn: false,
  },
  {
    id: "marketing" as const,
    label: "Marketing",
    title: "Marketing cookies",
    description:
      "Used to deliver brand communications relevant to your interests and to measure the effectiveness of campaigns. If disabled, you may still see ads but they will be less tailored.",
    toggleKey: "marketing" as keyof CookieSettings,
    alwaysOn: false,
  },
] as const;

type CookieTabId = (typeof COOKIE_TABS)[number]["id"];

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onChange}
      className={[
        "relative h-6 w-11 shrink-0 border transition-colors duration-300 ease-luxury",
        disabled
          ? "cursor-not-allowed border-black/15 bg-black/8"
          : checked
            ? "cursor-pointer border-black bg-black"
            : "cursor-pointer border-black/20 bg-white",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute top-0.5 flex h-5 w-5 items-center justify-center transition-transform duration-300 ease-luxury",
          checked ? "translate-x-5 bg-white" : "translate-x-0 bg-black/20",
          disabled && "opacity-40",
        ].join(" ")}
      >
        {checked && !disabled && (
          <FiCheck className="size-2.5 text-black" strokeWidth={3} />
        )}
      </span>
    </button>
  );
}

// ─── Inner modal content ──────────────────────────────────────────────────────
/**
 * Extracted into its own component so that AnimatePresence unmounts and
 * remounts it on every open/close cycle. This means `useState` initializers
 * run fresh on each open — no need for a `useEffect` that calls `setState`
 * (which would trigger the react-hooks/set-state-in-effect lint error).
 */
function ModalInner({ onClose }: { onClose: () => void }) {
  const reduceMotion = Boolean(useReducedMotion());
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Initialised fresh on every mount (i.e. every time the modal opens)
  const [activeTab, setActiveTab] = React.useState<CookieTabId>("privacy");
  const [settings, setSettings] = React.useState<CookieSettings>(
    deriveSettingsFromStorage
  );

  // Scroll lock + keyboard trap — runs once on mount, cleans up on unmount
  React.useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    const t = setTimeout(() => closeButtonRef.current?.focus(), 40);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("keydown", handleKey);
      clearTimeout(t);
    };
  }, [onClose]);

  const activeTabData =
    COOKIE_TABS.find((t) => t.id === activeTab) ?? COOKIE_TABS[0];

  const handleAllowAll = () => {
    writeCookieConsent("accepted", {
      performance: true,
      functional: true,
      marketing: true,
    });
    onClose();
  };

  const handleRejectAll = () => {
    writeCookieConsent("rejected", DEFAULT_SETTINGS);
    onClose();
  };

  const handleSaveChoices = () => {
    writeCookieConsent("custom", settings);
    onClose();
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="relative z-10 flex max-h-[88svh] w-full max-w-225 flex-col border border-black/10 bg-white text-black shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.982 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.982 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 sm:px-8 sm:py-5">
        <p
          id="cookie-modal-title"
          className="text-[11px] font-medium uppercase tracking-[0.3em] text-black"
        >
          Cookie preferences
        </p>

        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="group flex size-9 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
        >
          <FiX className="size-4 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
        </button>
      </div>

      {/* Body: sidebar + content */}
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[240px_1fr]">
        {/* Sidebar nav */}
        <nav
          aria-label="Cookie categories"
          className="overflow-y-auto border-b border-black/10 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:py-7"
        >
          <ul className="space-y-0.5">
            {COOKIE_TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative w-full border-b py-3 text-left text-xs transition-colors duration-300 ease-luxury",
                    activeTab === tab.id
                      ? "border-black font-medium text-black"
                      : "border-black/8 text-black/50 hover:text-black",
                  ].join(" ")}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {tab.label}
                    {tab.alwaysOn && (
                      <span className="text-[9px] uppercase tracking-[0.18em] text-black/35">
                        Always on
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab content */}
        <div className="overflow-y-auto p-6 sm:p-8 lg:py-8">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.26em] text-black">
            {activeTabData.title}
          </h3>

          <p className="mt-5 text-sm leading-7 text-black/60">
            {activeTabData.description}
          </p>

          {/* Individual toggle row */}
          {activeTabData.toggleKey && (
            <div className="mt-8 flex items-center justify-between gap-6 border-t border-black/10 pt-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-black">
                  {activeTabData.label}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-black/45">
                  {settings[activeTabData.toggleKey]
                    ? "Currently enabled"
                    : "Currently disabled"}
                </p>
              </div>
              <Toggle
                checked={settings[activeTabData.toggleKey]}
                onChange={() => toggleSetting(activeTabData.toggleKey!)}
              />
            </div>
          )}

          {/* Always-on indicator */}
          {activeTabData.alwaysOn && (
            <div className="mt-8 flex items-center justify-between gap-6 border-t border-black/10 pt-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-black">
                  Strictly necessary
                </p>
                <p className="mt-1.5 text-xs leading-5 text-black/45">
                  Always active — cannot be disabled
                </p>
              </div>
              <Toggle checked disabled onChange={() => {}} />
            </div>
          )}

          {/* Privacy tab: overview of all toggles at once */}
          {activeTabData.id === "privacy" && (
            <div className="mt-8 border-t border-black/10">
              {COOKIE_TABS.filter((t) => t.toggleKey).map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center justify-between gap-6 border-b border-black/8 py-5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-black">
                      {tab.label}
                    </p>
                    <p className="mt-1 truncate text-xs text-black/45">
                      {tab.description.slice(0, 72).trimEnd()}…
                    </p>
                  </div>
                  <Toggle
                    checked={settings[tab.toggleKey!]}
                    onChange={() => toggleSetting(tab.toggleKey!)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col gap-2.5 border-t border-black/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-5">
        {/* Save — primary CTA (black bg) */}
        <button
          type="button"
          onClick={handleSaveChoices}
          className="h-10 border border-black bg-black px-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 ease-luxury hover:bg-transparent hover:text-black sm:order-3"
        >
          Save preferences
        </button>

        {/* Reject all */}
        <button
          type="button"
          onClick={handleRejectAll}
          className="h-10 border border-black/15 px-5 text-[10px] font-medium uppercase tracking-[0.2em] text-black/65 transition-colors duration-300 ease-luxury hover:border-black hover:text-black sm:order-1"
        >
          Reject all
        </button>

        {/* Allow all */}
        <button
          type="button"
          onClick={handleAllowAll}
          className="h-10 border border-black/15 px-5 text-[10px] font-medium uppercase tracking-[0.2em] text-black/65 transition-colors duration-300 ease-luxury hover:border-black hover:text-black sm:order-2"
        >
          Allow all
        </button>
      </div>
    </motion.div>
  );
}

// ─── Public modal wrapper ─────────────────────────────────────────────────────

type CookiePreferencesModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CookiePreferencesModal({
  open,
  onClose,
}: CookiePreferencesModalProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-8">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close cookie preferences"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          {/*
           * ModalInner is mounted fresh on every open because it lives
           * inside the AnimatePresence conditional. Its useState initializers
           * re-run on each mount, reading the latest localStorage values —
           * no useEffect → setState needed, and no lint error.
           */}
          <ModalInner onClose={onClose} />
        </div>
      )}
    </AnimatePresence>
  );
}