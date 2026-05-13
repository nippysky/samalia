"use client";

import * as React from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { ProductMasonryGrid } from "@/src/components/shop/product-masonry-grid";
import { ReadyToWearFilterSheet } from "@/src/components/shop/ready-to-wear-filter-sheet";
import { READY_TO_WEAR_ALL_CATEGORY } from "@/src/data/shop-categories";
import { filterReadyToWearProducts } from "@/src/data/filter-products";
import type {
  ReadyToWearFilters,
  ShopCategory,
  ShopProduct,
} from "@/src/lib/shop/types";

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

  const categoryCounts = React.useMemo(() => {
    return products.reduce<Record<string, number>>((counts, product) => {
      counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1;
      return counts;
    }, {});
  }, [products]);

  const selectedCategoryTitle = React.useMemo(() => {
    if (filters.categorySlug === READY_TO_WEAR_ALL_CATEGORY) {
      return "All categories";
    }

    return (
      categories.find((category) => category.slug === filters.categorySlug)
        ?.title ?? "Selected category"
    );
  }, [categories, filters.categorySlug]);

  const queryKey = React.useMemo(
    () =>
      [
        "ready-to-wear",
        resolvedFilters.search,
        resolvedFilters.categorySlug,
        resolvedFilters.tier,
        resolvedFilters.sort,
        resolvedFilters.availableOnly ? "available" : "all",
        filteredProducts.map((product) => product.id).join("-"),
      ].join(":"),
    [filteredProducts, resolvedFilters]
  );

  const hasSearch = rawSearch.trim().length > 0;
  const hasResults = filteredProducts.length > 0;

  const activeFilterCount = React.useMemo(() => {
    let count = 0;

    if (filters.categorySlug !== READY_TO_WEAR_ALL_CATEGORY) count += 1;
    if (filters.tier !== "all") count += 1;
    if (filters.availableOnly) count += 1;

    return count;
  }, [filters]);

  const hasActiveState = hasSearch || activeFilterCount > 0;

  const closeFilters = React.useCallback(() => {
    setFiltersOpen(false);
  }, []);

  const resetAll = React.useCallback(() => {
    setRawSearch("");
    setFilters(defaultFilters);
  }, []);

  function updateFilters(next: ReadyToWearFilters) {
    setFilters(next);
  }

  function clearSearch() {
    setRawSearch("");
  }

  return (
    <>
      <section
        className="sticky z-30 border-b border-black/10 bg-white text-black"
        style={{
          top: "calc(var(--nav-h, 72px) - 2px)",
          boxShadow: "0 -12px 0 0 #fff",
        }}
      >
        <div className="mx-auto w-full max-w-440 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 2xl:px-10">
          <div className="mx-auto max-w-220 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-black">
              Ready to wear
            </p>

            <div className="mx-auto mt-7 flex max-w-210 items-center justify-center gap-3">
              <div className="flex h-14 min-w-0 flex-1 items-center border border-black/14 bg-white px-5 transition-colors duration-300 ease-luxury focus-within:border-black sm:h-15">
                <FiSearch className="size-4.5 shrink-0 text-black/45" />

                <input
                  value={rawSearch}
                  onChange={(event) => setRawSearch(event.target.value)}
                  placeholder="search pieces"
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
                className={cn(
                  "relative flex size-14 shrink-0 items-center justify-center border bg-white text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white sm:size-15",
                  activeFilterCount > 0 ? "border-black" : "border-black/14"
                )}
              >
                <FiSliders className="size-4" />

                {activeFilterCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center bg-black text-[10px] font-medium text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>

            <div className="mx-auto mt-4 flex max-w-210 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black/42">
              <span>
                {pending
                  ? "Searching"
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "piece" : "pieces"
                    }`}
              </span>

              <span className="hidden h-px w-8 bg-black/14 sm:block" />

              <span>{selectedCategoryTitle}</span>

              {hasActiveState ? (
                <>
                  <span className="hidden h-px w-8 bg-black/14 sm:block" />

                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-black transition-opacity duration-300 ease-luxury hover:opacity-55"
                  >
                    Reset
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {hasResults ? (
        <ProductMasonryGrid
          products={filteredProducts}
          queryKey={queryKey}
          initialPages={1}
          pageSize={10}
          maxPages={3}
          loadMode="manual"
        />
      ) : (
        <NoResultsState onReset={resetAll} />
      )}

      <ReadyToWearFilterSheet
        open={filtersOpen}
        categories={categories}
        categoryCounts={categoryCounts}
        totalCount={products.length}
        filters={filters}
        onChange={updateFilters}
        onReset={resetAll}
        onClose={closeFilters}
      />
    </>
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
          Try a different category, tier, availability, or search term.
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