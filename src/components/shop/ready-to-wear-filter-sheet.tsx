// src/components/shop/ready-to-wear-filter-sheet.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { READY_TO_WEAR_ALL_CATEGORY } from "@/src/data/shop-categories";
import type {
  ProductPriceRange,
  ProductSort,
  ProductTier,
  ReadyToWearFilters,
  ShopCategory,
} from "@/src/lib/shop/types";

type ReadyToWearFilterSheetProps = {
  open: boolean;
  categories: ShopCategory[];
  filters: ReadyToWearFilters;
  onChange: (filters: ReadyToWearFilters) => void;
  onClose: () => void;
};

const priceRanges: Array<{ label: string; value: ProductPriceRange }> = [
  { label: "All prices", value: "all" },
  { label: "Under ₦200k", value: "under-200k" },
  { label: "₦200k – ₦400k", value: "200k-400k" },
  { label: "₦400k – ₦700k", value: "400k-700k" },
  { label: "₦700k+", value: "700k-plus" },
];

const tiers: Array<{ label: string; value: ProductTier | "all" }> = [
  { label: "All tiers", value: "all" },
  { label: "House essential", value: "house-essential" },
  { label: "Design piece", value: "design-piece" },
  { label: "Craft signature", value: "craft-signature" },
];

const sortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ReadyToWearFilterSheet({
  open,
  categories,
  filters,
  onChange,
  onClose,
}: ReadyToWearFilterSheetProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
    };
  }, [open, onClose]);

  function update(next: Partial<ReadyToWearFilters>) {
    onChange({ ...filters, ...next });
  }

  function reset() {
    onChange({
      search: "",
      categorySlug: READY_TO_WEAR_ALL_CATEGORY,
      priceRange: "all",
      tier: "all",
      sort: "featured",
      availableOnly: false,
    });
  }

  const sheet = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="filter-overlay"
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 z-80 bg-black/35 backdrop-blur-[2px]"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          <motion.aside
            key="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ready-filter-title"
            aria-describedby="ready-filter-description"
            className="fixed inset-y-0 right-0 z-90 w-screen border-l border-black/10 bg-white text-black shadow-none sm:w-[min(460px,calc(100vw-24px))]"
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
                        id="ready-filter-title"
                        className="text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-black"
                      >
                        Filter
                      </p>

                      <p
                        id="ready-filter-description"
                        className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-black/45"
                      >
                        Refine ready to wear
                      </p>
                    </div>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close filters"
                    onClick={onClose}
                    className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                  >
                    <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 [-webkit-overflow-scrolling:touch] sm:px-7">
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.38,
                    delay: reducedMotion ? 0 : 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="space-y-8"
                >
                  <FilterSection title="Category">
                    <div className="grid grid-cols-1 gap-2">
                      <FilterButton
                        active={
                          filters.categorySlug === READY_TO_WEAR_ALL_CATEGORY
                        }
                        onClick={() =>
                          update({ categorySlug: READY_TO_WEAR_ALL_CATEGORY })
                        }
                      >
                        All ready to wear
                      </FilterButton>

                      {categories.map((category) => (
                        <FilterButton
                          key={category.slug}
                          active={filters.categorySlug === category.slug}
                          onClick={() =>
                            update({ categorySlug: category.slug })
                          }
                        >
                          {category.title}
                        </FilterButton>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Price">
                    <div className="grid grid-cols-1 gap-2">
                      {priceRanges.map((item) => (
                        <FilterButton
                          key={item.value}
                          active={filters.priceRange === item.value}
                          onClick={() => update({ priceRange: item.value })}
                        >
                          {item.label}
                        </FilterButton>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Tier">
                    <div className="grid grid-cols-1 gap-2">
                      {tiers.map((item) => (
                        <FilterButton
                          key={item.value}
                          active={filters.tier === item.value}
                          onClick={() => update({ tier: item.value })}
                        >
                          {item.label}
                        </FilterButton>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Sort">
                    <div className="grid grid-cols-1 gap-2">
                      {sortOptions.map((item) => (
                        <FilterButton
                          key={item.value}
                          active={filters.sort === item.value}
                          onClick={() => update({ sort: item.value })}
                        >
                          {item.label}
                        </FilterButton>
                      ))}
                    </div>
                  </FilterSection>

                  <section className="border-t border-black/10 pt-7">
                    <button
                      type="button"
                      onClick={() =>
                        update({ availableOnly: !filters.availableOnly })
                      }
                      className="flex w-full items-center justify-between gap-5 py-2 text-left"
                    >
                      <span>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-black">
                          Availability
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-black/55">
                          Show available pieces only
                        </span>
                      </span>

                      <span
                        className={cn(
                          "relative h-7 w-12 shrink-0 border transition-colors duration-300 ease-luxury",
                          filters.availableOnly
                            ? "border-black bg-black"
                            : "border-black/20 bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 size-5 bg-current transition-transform duration-300 ease-luxury",
                            filters.availableOnly
                              ? "left-1 translate-x-5 text-white"
                              : "left-1 translate-x-0 text-black"
                          )}
                        />
                      </span>
                    </button>
                  </section>
                </motion.div>
              </div>

              <div className="shrink-0 border-t border-black/10 px-5 py-5 sm:px-7">
                <div className="grid grid-cols-2 gap-3">
                  <BrandButton
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={reset}
                  >
                    Reset
                  </BrandButton>

                  <BrandButton
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={onClose}
                  >
                    Apply
                  </BrandButton>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );

  return open && typeof document !== "undefined"
    ? createPortal(sheet, document.body)
    : null;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-black/10 pb-8">
      <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.24em] text-black">
        {title}
      </h3>

      {children}
    </section>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center border px-4 text-left text-sm transition-colors duration-300 ease-luxury",
        active
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black/62 hover:border-black hover:text-black"
      )}
    >
      {children}
    </button>
  );
}