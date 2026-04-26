// src/lib/shop/types.ts
import type { CSSProperties } from "react";

export type ProductTier = "house-essential" | "design-piece" | "craft-signature";

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

export type ProductPriceRange =
  | "all"
  | "under-200k"
  | "200k-400k"
  | "400k-700k"
  | "700k-plus";

export type ShopCategory = {
  slug: string;
  title: string;
  description: string;
  productionCategories: string[];
  seoTitle: string;
  seoDescription: string;
};

export type ShopProductImage = {
  id: string;
  src: string;
  alt: string;
  imagePosition?: CSSProperties["objectPosition"];
};

export type ShopProductPrice = {
  amount: number;
  currency: "NGN";
  display: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  productionCategory: string;
  productType: string;
  tier: ProductTier;

  description: string;
  detailBullets: string[];
  fitNote: string;
  careInstructions: string[];
  madeIn: string;
  sku: string;
  deliveryNote: string;

  price: ShopProductPrice;
  images: ShopProductImage[];

  colors: string[];
  sizes: string[];
  availableSizes?: string[];

  materials: string[];
  tags: string[];

  available: boolean;
  featured?: boolean;
  createdAt: string;
};

export type ReadyToWearFilters = {
  search: string;
  categorySlug: string;
  priceRange: ProductPriceRange;
  tier: ProductTier | "all";
  sort: ProductSort;
  availableOnly: boolean;
};