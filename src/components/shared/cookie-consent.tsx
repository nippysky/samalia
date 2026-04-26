// src/components/shared/cookie-consent.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiSettings } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import {
  CookiePreferencesModal,
  readCookieConsentState,
  subscribeCookieConsent,
  writeCookieConsent,
} from "@/src/components/shared/cookie-preferences-modal";

export function CookieConsent() {
  const reduceMotion = Boolean(useReducedMotion());
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const consentState = React.useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsentState,
    () => "set" as const
  );

  return (
    <>
      <AnimatePresence>
        {consentState === "unset" && (
          <motion.div
            role="region"
            aria-label="Cookie consent"
            aria-live="polite"
            className="fixed inset-x-0 bottom-0 z-90 border-t border-black/10 bg-white px-4 py-3 text-black shadow-[0_-6px_32px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8 2xl:px-10"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <div className="mx-auto flex max-w-440 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {/* Message */}
              <p className="min-w-0 shrink text-[10px] leading-relaxed text-black/45 sm:max-w-150 lg:max-w-180">
                Sam&apos;Alia uses cookies to support site functionality,
                understand performance, and refine your experience.
              </p>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">

                {/* Settings — gear icon, spring rotation on hover */}
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Cookie settings"
                  title="Cookie settings"
                  className="group flex items-center justify-center p-2 text-black/30 transition-colors duration-300 ease-luxury hover:text-black"
                >
                  <FiSettings className="size-3 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90" />
                </button>

                <span aria-hidden="true" className="h-3.5 w-px bg-black/12" />

                {/* Reject all — ghost variant, intentionally borderless */}
                <BrandButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => writeCookieConsent("rejected")}
                  className="min-h-8! px-3! text-[9px]!"
                >
                  Reject all
                </BrandButton>

                {/*
                  Allow all — primary.

                  Inline `background` + `border` shorthand are required because
                  globals.css has TWO unlayered rules that beat Tailwind:

                    1. The previous `button { background: transparent }` (now
                       removed but the * reset can still defeat utilities).
                    2. `button { border: 0 }` — this is the one that's been
                       eating the border. The `border: 0` shorthand resets
                       border-width to 0 AND border-style to none, so even
                       setting borderColor inline doesn't render a border —
                       there's no width and no style for the colour to paint.

                  Using `border: '1px solid var(--black)'` shorthand sets all
                  three properties at once, inline, so the cascade can't touch
                  any of them. Now the sharp black edge is visible during the
                  white-overlay hover state.
                */}
                <BrandButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    writeCookieConsent("accepted", {
                      performance: true,
                      functional: true,
                      marketing: true,
                    })
                  }
                  className="min-h-8! px-3! text-[9px]!"
                  style={{
                    backgroundColor: "var(--black)",
                    border: "1px solid var(--black)",
                  }}
                >
                  Allow all
                </BrandButton>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookiePreferencesModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}