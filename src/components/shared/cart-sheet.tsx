// src/components/shared/cart-sheet.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import { BrandButton } from "@/src/components/ui/brand-button";
import {
  formatCartAmount,
  getCartItemCount,
  getCartSubtotal,
  type CartItem,
  useCartStore,
} from "@/src/stores/cart-store";
import { useBrandToastStore } from "@/src/stores/brand-toast-store";

type CartSheetProps = {
  iconClassName?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CartSheet({ iconClassName }: CartSheetProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const pushToast = useBrandToastStore((state) => state.pushToast);

  const [open, setOpen] = React.useState(false);

  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const cartCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);
  const hasItems = items.length > 0;

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

  function handleClearCart() {
    clearCart();

    pushToast({
      variant: "success",
      title: "Selection cleared",
      message: "All selected pieces have been removed.",
    });
  }

  const sheet = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="cart-overlay"
            type="button"
            aria-label="Close selected pieces"
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
            <div className="flex h-dvh min-h-0 flex-col">
              <div className="shrink-0 border-b border-black/10 px-5 py-4 sm:px-7">
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
                        Selected Pieces
                      </p>

                      <p
                        id="cart-sheet-description"
                        className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-black/45"
                      >
                        {cartCount} selected piece
                        {cartCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close selected pieces"
                    onClick={() => setOpen(false)}
                    className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                  >
                    <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              {hasItems ? (
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [-webkit-overflow-scrolling:touch] sm:px-7">
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.38,
                      delay: reducedMotion ? 0 : 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="space-y-4"
                  >
                    {items.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="mt-2 inline-flex text-[10px] font-medium uppercase tracking-[0.2em] text-black/42 transition-colors duration-300 ease-luxury hover:text-black"
                    >
                      Clear selection
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 py-10 sm:px-7">
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.38,
                      delay: reducedMotion ? 0 : 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full max-w-80 text-center"
                  >
                    <p className="text-[0.78rem] font-medium uppercase tracking-[0.22em] text-black">
                      No pieces selected.
                    </p>

                    <p className="mt-4 text-sm leading-7 text-black/55">
                      Selected pieces will appear here before checkout.
                    </p>

                    <div className="mt-8">
                      <BrandButton
                        href="/ready-to-wear"
                        fullWidth
                        size="md"
                        variant="primary"
                        onClick={() => setOpen(false)}
                      >
                        View Pieces
                      </BrandButton>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="shrink-0 border-t border-black/10 px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-5 text-[10px] uppercase tracking-[0.2em] text-black/50">
                  <span>Subtotal</span>
                  <span className="text-black">{formatCartAmount(subtotal)}</span>
                </div>

                <BrandButton
                  href={hasItems ? "/checkout" : undefined}
                  type={!hasItems ? "button" : undefined}
                  disabled={!hasItems}
                  fullWidth
                  size="md"
                  variant={hasItems ? "primary" : "secondary"}
                  className="mt-4"
                  onClick={() => {
                    if (hasItems) {
                      setOpen(false);
                    }
                  }}
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
        aria-label="Open selected pieces"
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

function CartLineItem({
  item,
  onNavigate,
}: {
  item: CartItem;
  onNavigate: () => void;
}) {
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const pushToast = useBrandToastStore((state) => state.pushToast);

  function handleRemove() {
    removeItem(item.id);

    pushToast({
      variant: "success",
      title: "Removed from selection",
      message: `${item.productName} was removed.`,
    });
  }

  return (
    <article className="border border-black/10 bg-white">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-3">
        <Link
          href={`/shop/${item.productSlug}`}
          onClick={onNavigate}
          className="relative block aspect-3/4 overflow-hidden bg-black/4.5"
        >
          {item.image ? (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              loading="eager"
              fill
              sizes="88px"
              className="object-cover transition-transform duration-700 ease-luxury hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HiOutlineShoppingBag className="size-5 text-black/30" />
            </div>
          )}
        </Link>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/shop/${item.productSlug}`}
                onClick={onNavigate}
                className="block truncate text-[11px] font-medium uppercase tracking-[0.18em] text-black transition-colors duration-300 ease-luxury hover:text-black/55"
              >
                {item.productName}
              </Link>

              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-black/42">
                {item.color} / {item.size}
              </p>
            </div>

            <button
              type="button"
              aria-label={`Remove ${item.productName}`}
              onClick={handleRemove}
              className="shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-black/38 transition-colors duration-300 ease-luxury hover:text-black"
            >
              Remove
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex h-9 items-center border border-black/10">
              <button
                type="button"
                aria-label={`Decrease ${item.productName} quantity`}
                onClick={() => decrementItem(item.id)}
                className="flex size-9 items-center justify-center text-sm text-black/55 transition-colors duration-300 hover:text-black"
              >
                −
              </button>

              <span className="flex h-9 min-w-8 items-center justify-center text-[11px] font-medium text-black">
                {item.quantity}
              </span>

              <button
                type="button"
                aria-label={`Increase ${item.productName} quantity`}
                onClick={() => incrementItem(item.id)}
                className="flex size-9 items-center justify-center text-sm text-black/55 transition-colors duration-300 hover:text-black"
              >
                +
              </button>
            </div>

            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-black">
              {formatCartAmount(item.price.amount * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}