// src/components/shared/size-guide-modal.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";

type SizeGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

const sizeRows = [
  { size: "XS", chest: "32–34", waist: "26–28", hip: "34–36" },
  { size: "S", chest: "35–37", waist: "29–31", hip: "37–39" },
  { size: "M", chest: "38–40", waist: "32–34", hip: "40–42" },
  { size: "L", chest: "41–43", waist: "35–37", hip: "43–45" },
  { size: "XL", chest: "44–46", waist: "38–40", hip: "46–48" },
];

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);

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

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6">
          <motion.button
            type="button"
            aria-label="Close size guide"
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
            aria-labelledby="size-guide-title"
            className="relative z-10 w-full max-w-[780px] border border-black/10 bg-white text-black"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between gap-5 border-b border-black/10 px-5 py-5 sm:px-8">
              <div>
                <p
                  id="size-guide-title"
                  className="text-[11px] font-medium uppercase tracking-[0.26em] text-black"
                >
                  Size Guide
                </p>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Measurements are shown in inches. For bespoke pieces, final
                  sizing is confirmed during consultation.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close size guide"
                onClick={onClose}
                className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
              >
                <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="py-4 pr-5 text-[10px] font-medium uppercase tracking-[0.22em]">
                        Size
                      </th>
                      <th className="py-4 pr-5 text-[10px] font-medium uppercase tracking-[0.22em]">
                        Chest
                      </th>
                      <th className="py-4 pr-5 text-[10px] font-medium uppercase tracking-[0.22em]">
                        Waist
                      </th>
                      <th className="py-4 text-[10px] font-medium uppercase tracking-[0.22em]">
                        Hip
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizeRows.map((row) => (
                      <tr key={row.size} className="border-b border-black/10">
                        <td className="py-4 pr-5 text-sm font-medium">
                          {row.size}
                        </td>
                        <td className="py-4 pr-5 text-sm text-black/60">
                          {row.chest}
                        </td>
                        <td className="py-4 pr-5 text-sm text-black/60">
                          {row.waist}
                        </td>
                        <td className="py-4 text-sm text-black/60">
                          {row.hip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 max-w-[620px] text-sm leading-7 text-black/55">
                This guide is a reference only. Sam’Alia bespoke appointments
                include measurement confirmation for a more precise fit.
              </p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}