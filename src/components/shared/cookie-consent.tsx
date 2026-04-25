// src/components/shared/cookie-consent.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
    () => "set"
  );

  const showBanner = consentState === "unset";

  return (
    <>
      <AnimatePresence>
        {showBanner ? (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-90 border-t border-black/10 bg-white px-4 py-4 text-black shadow-[0_-20px_80px_rgba(0,0,0,0.08)] sm:px-6 lg:px-8 2xl:px-10"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto flex max-w-[1760px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-[760px] text-sm leading-7 text-black/62">
                Sam’Alia uses cookies to support site functionality, understand
                performance, and refine your experience.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <BrandButton
                  type="button"
                  variant="text"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  Cookie settings
                </BrandButton>

                <BrandButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => writeCookieConsent("rejected")}
                >
                  Reject all
                </BrandButton>

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
                >
                  Allow all
                </BrandButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CookiePreferencesModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}