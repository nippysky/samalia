// src/components/shared/cookie-preferences-modal.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";

export const COOKIE_CONSENT_KEY = "samalia_cookie_consent";
export const COOKIE_CONSENT_EVENT = "samalia-cookie-consent-change";

type CookieChoice = "accepted" | "rejected" | "custom";

type CookieSettings = {
  performance: boolean;
  functional: boolean;
  marketing: boolean;
};

type CookiePreferencesModalProps = {
  open: boolean;
  onClose: () => void;
};

const cookieTabs = [
  {
    id: "privacy",
    label: "Your privacy",
    title: "Your privacy",
    description:
      "When you visit Sam’Alia, we may store or retrieve information on your browser, mostly in the form of cookies. These help the site work properly, improve the experience, and understand how visitors use the website.",
  },
  {
    id: "necessary",
    label: "Strictly necessary",
    title: "Strictly necessary cookies",
    description:
      "These cookies are required for the website to function and cannot be switched off in our systems.",
  },
  {
    id: "performance",
    label: "Performance cookies",
    title: "Performance cookies",
    description:
      "These cookies help us understand visits and traffic sources so we can improve the performance of the site.",
  },
  {
    id: "functional",
    label: "Functional cookies",
    title: "Functional cookies",
    description:
      "These cookies allow enhanced functionality and personalisation, such as remembering preferences.",
  },
  {
    id: "marketing",
    label: "Marketing cookies",
    title: "Marketing cookies",
    description:
      "These cookies may be used to deliver more relevant brand communications and measure campaign effectiveness.",
  },
] as const;

type CookieTabId = (typeof cookieTabs)[number]["id"];

const defaultSettings: CookieSettings = {
  performance: false,
  functional: false,
  marketing: false,
};

export function writeCookieConsent(
  choice: CookieChoice,
  settings: CookieSettings = defaultSettings
) {
  if (typeof window === "undefined") return;

  const payload = {
    choice,
    settings,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));

  document.cookie = `${COOKIE_CONSENT_KEY}=${choice}; Max-Age=31536000; Path=/; SameSite=Lax`;

  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function readCookieConsentState(): "set" | "unset" {
  if (typeof window === "undefined") return "set";

  return window.localStorage.getItem(COOKIE_CONSENT_KEY) ? "set" : "unset";
}

export function subscribeCookieConsent(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function CookiePreferencesModal({
  open,
  onClose,
}: CookiePreferencesModalProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const [activeTab, setActiveTab] = React.useState<CookieTabId>("privacy");
  const [settings, setSettings] =
    React.useState<CookieSettings>(defaultSettings);

  React.useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const activeContent =
    cookieTabs.find((tab) => tab.id === activeTab) ?? cookieTabs[0];

  const allowAll = () => {
    writeCookieConsent("accepted", {
      performance: true,
      functional: true,
      marketing: true,
    });
    onClose();
  };

  const rejectAll = () => {
    writeCookieConsent("rejected", defaultSettings);
    onClose();
  };

  const saveChoices = () => {
    writeCookieConsent("custom", settings);
    onClose();
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
          <motion.button
            type="button"
            aria-label="Close cookie preferences"
            className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            className="relative z-10 flex max-h-[88svh] w-full max-w-[920px] flex-col border border-black/10 bg-white text-black"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-8">
              <p
                id="cookie-modal-title"
                className="text-[11px] font-medium uppercase tracking-[0.26em] text-black"
              >
                Cookie settings
              </p>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close cookie preferences"
                onClick={onClose}
                className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
              >
                <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
              </button>
            </div>

            <div className="grid flex-1 overflow-y-auto lg:grid-cols-[280px_1fr]">
              <div className="border-b border-black/10 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <nav aria-label="Cookie categories" className="space-y-2">
                  {cookieTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`block w-full border-b py-3 text-left text-sm transition-colors duration-300 ease-luxury ${
                        activeTab === tab.id
                          ? "border-black text-black"
                          : "border-transparent text-black/58 hover:text-black"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-5 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black">
                  {activeContent.title}
                </p>

                <p className="mt-6 max-w-[560px] text-sm leading-7 text-black/65">
                  {activeContent.description}
                </p>

                <div className="mt-8 space-y-4">
                  {(["performance", "functional", "marketing"] as const).map(
                    (key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-5 border-t border-black/10 pt-4"
                      >
                        <div>
                          <p className="text-sm font-medium capitalize text-black">
                            {key} cookies
                          </p>
                          <p className="mt-1 text-xs leading-5 text-black/50">
                            {key === "performance"
                              ? "Help us understand site performance."
                              : key === "functional"
                                ? "Remember preferences and enhance usability."
                                : "Support relevant brand communication."}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-pressed={settings[key]}
                          onClick={() => toggleSetting(key)}
                          className={`relative h-7 w-12 border transition-colors duration-300 ease-luxury ${
                            settings[key]
                              ? "border-black bg-black"
                              : "border-black/20 bg-white"
                          }`}
                        >
                          <span
                            className={`absolute top-1 size-5 bg-current transition-transform duration-300 ease-luxury ${
                              settings[key]
                                ? "left-1 translate-x-5 text-white"
                                : "left-1 translate-x-0 text-black"
                            }`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/10 p-5 sm:flex-row sm:justify-end sm:p-8">
              <button
                type="button"
                onClick={saveChoices}
                className="h-12 border border-black bg-black px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 ease-luxury hover:bg-white hover:text-black"
              >
                Confirm choices
              </button>

              <button
                type="button"
                onClick={rejectAll}
                className="h-12 border border-black/20 px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-black transition-colors duration-300 ease-luxury hover:border-black"
              >
                Reject all
              </button>

              <button
                type="button"
                onClick={allowAll}
                className="h-12 border border-black/20 px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-black transition-colors duration-300 ease-luxury hover:border-black"
              >
                Allow all
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}