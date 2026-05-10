import { READY_TO_WEAR_ALL_CATEGORY } from "@/src/data/shop-categories";
import type { ProductPriceRange, ReadyToWearFilters, ShopProduct } from "@/src/lib/shop/types";

function matchesPriceRange(amount: number, range: ProductPriceRange) {
  switch (range) {
    case "under-200k":
      return amount < 200000;
    case "200k-400k":
      return amount >= 200000 && amount < 400000;
    case "400k-700k":
      return amount >= 400000 && amount < 700000;
    case "700k-plus":
      return amount >= 700000;
    case "all":
    default:
      return true;
  }
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function searchableText(product: ShopProduct) {
  return [
    product.name,
    product.slug,
    product.categorySlug,
    product.productionCategory,
    product.productType,
    product.tier,
    product.description,
    product.sku,
    product.madeIn,
    ...product.detailBullets,
    ...product.careInstructions,
    ...product.colors,
    ...product.sizes,
    ...(product.availableSizes ?? []),
    ...product.materials,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterReadyToWearProducts(
  products: ShopProduct[],
  filters: ReadyToWearFilters
) {
  const search = normalize(filters.search);

  const filtered = products.filter((product) => {
    const categoryMatches =
      filters.categorySlug === READY_TO_WEAR_ALL_CATEGORY ||
      product.categorySlug === filters.categorySlug;

    if (!categoryMatches) return false;

    if (filters.availableOnly && !product.available) return false;

    if (filters.tier !== "all" && product.tier !== filters.tier) return false;

    if (!matchesPriceRange(product.price.amount, filters.priceRange)) {
      return false;
    }

    if (search.length > 0 && !searchableText(product).includes(search)) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "price-asc":
        return a.price.amount - b.price.amount;

      case "price-desc":
        return b.price.amount - a.price.amount;

      case "featured":
      default: {
        const featuredScore =
          Number(Boolean(b.featured)) - Number(Boolean(a.featured));

        if (featuredScore !== 0) return featuredScore;

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  });
}