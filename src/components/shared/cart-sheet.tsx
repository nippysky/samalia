// src/components/shared/cart-sheet.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import { BrandButton } from "@/src/components/ui/brand-button";

type CartSheetProps = {
  iconClassName?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CartSheet({ iconClassName }: CartSheetProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const [open, setOpen] = React.useState(false);

  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const cartCount: number = 0;
  const subtotal = "₦0.00";

  React.useEffect(() => {
    if (!open) return;

    const restoreFocusTarget = triggerButtonRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
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
      restoreFocusTarget?.focus();
    };
  }, [open]);

  const sheet = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="cart-overlay"
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-80 bg-black/35 backdrop-blur-[2px]"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(false)}
          />

          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-sheet-title"
            aria-describedby="cart-sheet-description"
            className="fixed inset-y-0 right-0 z-90 w-screen border-l border-black/10 bg-white text-black shadow-none sm:w-[min(430px,calc(100vw-24px))]"
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-dvh flex-col">
              <div className="border-b border-black/10 px-5 py-4 sm:px-7">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-10 shrink-0">
                      <Image
                        src="/Samalia_Logo.svg"
                        alt="Sam’Alia"
                        fill
                        priority
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        id="cart-sheet-title"
                        className="text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-black"
                      >
                        Cart
                      </p>

                      <p
                        id="cart-sheet-description"
                        className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-black/45"
                      >
                        {cartCount} selected item
                        {cartCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close cart"
                    onClick={() => setOpen(false)}
                    className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                  >
                    <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-10 sm:px-7">
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.38,
                    delay: reducedMotion ? 0 : 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full max-w-[320px] text-center"
                >
                  <div className="mx-auto flex size-14 items-center justify-center border border-black/10 bg-white mb-5">
                    <HiOutlineShoppingBag className="size-6 text-black" />
                  </div>

                  <p className="mt-6 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-black">
                    Your cart is empty
                  </p>

                  <p className="mt-3 text-sm leading-7 text-black/55">
                    Add pieces to your cart and they will appear here before
                    checkout.
                  </p>

                  <div className="mt-7">
                    <BrandButton
                      href="/ready-to-wear"
                      fullWidth
                      size="md"
                      variant="primary"
                      iconAfter={<FiArrowRight className="size-4" />}
                      onClick={() => setOpen(false)}
                    >
                      Shop ready to wear
                    </BrandButton>
                  </div>
                </motion.div>
              </div>

              <div className="border-t border-black/10 px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-5 text-[10px] uppercase tracking-[0.2em] text-black/50">
                  <span>Subtotal</span>
                  <span className="text-black">{subtotal}</span>
                </div>

                <BrandButton
                  type="button"
                  disabled
                  fullWidth
                  size="md"
                  variant="secondary"
                  className="mt-4"
                >
                  Checkout
                </BrandButton>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        aria-label="Open cart"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="group relative flex size-10 shrink-0 items-center justify-center sm:size-11"
      >
        <HiOutlineShoppingBag
          className={cn(
            iconClassName ?? "size-6 text-black sm:size-6.5",
            "transition-transform duration-300 ease-luxury group-hover:scale-95"
          )}
        />

        {cartCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[9px] font-medium leading-none text-white">
            {cartCount}
          </span>
        ) : null}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(sheet, document.body)
        : null}
    </>
  );
}