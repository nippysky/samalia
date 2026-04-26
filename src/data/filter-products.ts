// src/lib/shop/filter-products.ts
import type {
  ProductPriceRange,
  ReadyToWearFilters,
  ShopProduct,
} from "@/src/lib/shop/types";
import { READY_TO_WEAR_ALL_CATEGORY } from "@/src/data/shop-categories";

function matchesPriceRange(amount: number, range: ProductPriceRange) {
  if (range === "all") return true;
  if (range === "under-200k") return amount < 200000;
  if (range === "200k-400k") return amount >= 200000 && amount <= 400000;
  if (range === "400k-700k") return amount > 400000 && amount <= 700000;
  if (range === "700k-plus") return amount > 700000;

  return true;
}

function getSearchIndex(product: ShopProduct) {
  return [
    product.name,
    product.categorySlug,
    product.productionCategory,
    product.productType,
    product.tier,
    product.colors.join(" "),
    product.sizes.join(" "),
    product.materials.join(" "),
    product.tags.join(" "),
    product.price.display,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterReadyToWearProducts(
  products: ShopProduct[],
  filters: ReadyToWearFilters
) {
  const query = filters.search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatches =
      filters.categorySlug === READY_TO_WEAR_ALL_CATEGORY ||
      product.categorySlug === filters.categorySlug;

    const searchMatches = query.length === 0 || getSearchIndex(product).includes(query);

    const tierMatches = filters.tier === "all" || product.tier === filters.tier;

    const priceMatches = matchesPriceRange(
      product.price.amount,
      filters.priceRange
    );

    const availabilityMatches = !filters.availableOnly || product.available;

    return (
      categoryMatches &&
      searchMatches &&
      tierMatches &&
      priceMatches &&
      availabilityMatches
    );
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "price-asc") return a.price.amount - b.price.amount;
    if (filters.sort === "price-desc") return b.price.amount - a.price.amount;

    if (filters.sort === "newest") {
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    }

    return Number(b.featured ?? false) - Number(a.featured ?? false);
  });
}

export function getCategoryProductCount(
  products: ShopProduct[],
  categorySlug: string
) {
  if (categorySlug === READY_TO_WEAR_ALL_CATEGORY) return products.length;

  return products.filter((product) => product.categorySlug === categorySlug)
    .length;
}