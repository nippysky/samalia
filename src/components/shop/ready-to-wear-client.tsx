// src/components/shop/ready-to-wear-client.tsx
"use client";

import * as React from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { ProductMasonryGrid } from "@/src/components/shop/product-masonry-grid";
import { ReadyToWearFilterSheet } from "@/src/components/shop/ready-to-wear-filter-sheet";
import { READY_TO_WEAR_ALL_CATEGORY } from "@/src/data/shop-categories";
import type {
  ReadyToWearFilters,
  ShopCategory,
  ShopProduct,
} from "@/src/lib/shop/types";
import { filterReadyToWearProducts } from "@/src/data/filter-products";

type ReadyToWearClientProps = {
  products: ShopProduct[];
  categories: ShopCategory[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useDebouncedValue(value: string, delay = 260) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  const pending = value !== debouncedValue;

  return { debouncedValue, pending };
}

const defaultFilters: ReadyToWearFilters = {
  search: "",
  categorySlug: READY_TO_WEAR_ALL_CATEGORY,
  priceRange: "all",
  tier: "all",
  sort: "featured",
  availableOnly: false,
};

export function ReadyToWearClient({
  products,
  categories,
}: ReadyToWearClientProps) {
  const [rawSearch, setRawSearch] = React.useState("");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filters, setFilters] =
    React.useState<ReadyToWearFilters>(defaultFilters);

  const { debouncedValue, pending } = useDebouncedValue(rawSearch);

  const resolvedFilters = React.useMemo<ReadyToWearFilters>(
    () => ({
      ...filters,
      search: debouncedValue,
    }),
    [debouncedValue, filters]
  );

  const filteredProducts = React.useMemo(
    () => filterReadyToWearProducts(products, resolvedFilters),
    [products, resolvedFilters]
  );

  const queryKey = React.useMemo(
    () =>
      [
        "ready-to-wear",
        resolvedFilters.search,
        resolvedFilters.categorySlug,
        resolvedFilters.priceRange,
        resolvedFilters.tier,
        resolvedFilters.sort,
        resolvedFilters.availableOnly ? "available" : "all",
        filteredProducts.map((product) => product.id).join("-"),
      ].join(":"),
    [filteredProducts, resolvedFilters]
  );

  const hasSearch = rawSearch.trim().length > 0;
  const hasResults = filteredProducts.length > 0;

  function updateFilters(next: ReadyToWearFilters) {
    setFilters(next);
  }

  function setCategory(categorySlug: string) {
    setFilters((current) => ({
      ...current,
      categorySlug,
    }));
  }

  function clearSearch() {
    setRawSearch("");
  }

  return (
    <>
      <section className="bg-white text-black">
        <div className="mx-auto w-full max-w-440 px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 2xl:px-10">
          <div className="mx-auto max-w-220 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-black">
              Ready to wear
            </p>

            <div className="mx-auto mt-8 flex max-w-210 items-center justify-center gap-3">
              <div className="flex h-15 min-w-0 flex-1 items-center border border-black/14 bg-white px-5 transition-colors duration-300 ease-luxury focus-within:border-black">
                <FiSearch className="size-4.5 shrink-0 text-black/45" />

                <input
                  value={rawSearch}
                  onChange={(event) => setRawSearch(event.target.value)}
                  placeholder="Search pieces, materials, categories"
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-center text-sm text-black outline-none placeholder:text-black/35 sm:text-base"
                />

                <div className="flex size-8 shrink-0 items-center justify-center">
                  {pending ? (
                    <span className="relative size-2 bg-black">
                      <span className="absolute inset-0 animate-ping bg-black/30" />
                    </span>
                  ) : hasSearch ? (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={clearSearch}
                      className="flex size-8 items-center justify-center text-black/45 transition-colors duration-300 hover:text-black"
                    >
                      <FiX className="size-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                aria-label="Open filters"
                onClick={() => setFiltersOpen(true)}
                className="flex size-15 shrink-0 items-center justify-center border border-black/14 bg-white text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
              >
                <FiSliders className="size-4" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <CategoryPill
                active={filters.categorySlug === READY_TO_WEAR_ALL_CATEGORY}
                onClick={() => setCategory(READY_TO_WEAR_ALL_CATEGORY)}
              >
                All
              </CategoryPill>

              {categories.map((category) => (
                <CategoryPill
                  key={category.slug}
                  active={filters.categorySlug === category.slug}
                  onClick={() => setCategory(category.slug)}
                >
                  {category.title}
                </CategoryPill>
              ))}
            </div>

            <p className="mt-9 text-[11px] uppercase tracking-[0.18em] text-black/40">
              {pending
                ? "Searching"
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "piece" : "pieces"
                  }`}
            </p>
          </div>
        </div>
      </section>

      {hasResults ? (
        <ProductMasonryGrid
          products={filteredProducts}
          queryKey={queryKey}
          initialPages={2}
          pageSize={18}
          maxPages={14}
        />
      ) : (
        <NoResultsState
          onReset={() => {
            setRawSearch("");
            setFilters(defaultFilters);
          }}
        />
      )}

      <ReadyToWearFilterSheet
        open={filtersOpen}
        categories={categories}
        filters={filters}
        onChange={updateFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </>
  );
}

function CategoryPill({
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
        "inline-flex h-10 items-center border px-4 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ease-luxury",
        active
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black/55 hover:border-black hover:text-black"
      )}
    >
      {children}
    </button>
  );
}

function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <section className="flex min-h-[42svh] items-center justify-center bg-white px-4 py-24 text-center text-black">
      <div className="max-w-120">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em]">
          No pieces found
        </p>

        <p className="mt-5 text-sm leading-7 text-black/55">
          Try a different category, material, price range, or search term.
        </p>

        <div className="mt-8 flex justify-center">
          <BrandButton type="button" variant="outline" onClick={onReset}>
            Reset search
          </BrandButton>
        </div>
      </div>
    </section>
  );
}