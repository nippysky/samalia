// src/data/shop-categories.ts
import type { ShopCategory } from "@/src/lib/shop/types";

export const READY_TO_WEAR_ALL_CATEGORY = "all";

export const readyToWearCategories: ShopCategory[] = [
  {
    slug: "tops-and-tees",
    title: "Tops & Tees",
    description: "Elevated foundation layers, polos, and refined house tees.",
    productionCategories: ["T-Shirts", "Polo Shirts"],
    seoTitle: "Tops & Tees",
    seoDescription:
      "Explore Sam’Alia luxury tops, tees, and polos shaped by modern African refinement.",
  },
  {
    slug: "shirts",
    title: "Shirts",
    description: "Structured day shirts, dinner shirts, and refined linen forms.",
    productionCategories: ["Day Structured Shirts", "Dinner Shirts", "Linens"],
    seoTitle: "Shirts",
    seoDescription:
      "Explore Sam’Alia day shirts, dinner shirts, and linen shirt forms.",
  },
  {
    slug: "trousers-and-denim",
    title: "Trousers & Denim",
    description: "Tailored trousers, dinner pants, linen trousers, and denim.",
    productionCategories: ["Dinner Pants", "Denims", "Linens"],
    seoTitle: "Trousers & Denim",
    seoDescription:
      "Explore Sam’Alia trousers, denim, and tailored lower-body pieces.",
  },
  {
    slug: "sets",
    title: "Sets",
    description: "Travel sets, track sets, linen sets, and refined pairings.",
    productionCategories: ["Travel Sets & Track Sets", "Linens"],
    seoTitle: "Sets",
    seoDescription:
      "Explore Sam’Alia ready-to-wear sets, travel sets, and coordinated pieces.",
  },
  {
    slug: "shorts",
    title: "Shorts",
    description: "Tailored shorts, linen shorts, and embroidered resort forms.",
    productionCategories: ["Shorts"],
    seoTitle: "Shorts",
    seoDescription:
      "Explore Sam’Alia tailored shorts and resort casual luxury pieces.",
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    description: "Architectural coats, jackets, trenches, and overshirts.",
    productionCategories: ["Outerwear"],
    seoTitle: "Outerwear",
    seoDescription:
      "Explore Sam’Alia outerwear, coats, jackets, and structured overshirts.",
  },
  {
    slug: "loungewear",
    title: "Loungewear",
    description: "Private luxury wardrobe pieces, robes, and lounge sets.",
    productionCategories: ["Loungewear"],
    seoTitle: "Loungewear",
    seoDescription:
      "Explore Sam’Alia loungewear, robes, and private luxury wardrobe pieces.",
  },
  {
    slug: "leather",
    title: "Leather",
    description: "Leather shirts, overshirts, pants, vests, and statement layers.",
    productionCategories: ["Leather Clothing"],
    seoTitle: "Leather",
    seoDescription:
      "Explore Sam’Alia leather clothing and prestige craftsmanship pieces.",
  },
  {
    slug: "heritage-forms",
    title: "Heritage Forms",
    description: "Ceremonial RTW, jalabia, kaftans, tunics, and cultural forms.",
    productionCategories: ["Ceremonial RTW", "Jalabia"],
    seoTitle: "Heritage Forms",
    seoDescription:
      "Explore Sam’Alia ceremonial ready-to-wear, jalabia, kaftans, and heritage forms.",
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Belts, caps, bags, brooches, and house finishing details.",
    productionCategories: [
      "Belts",
      "Caps",
      "Bags",
      "Brooches / Metal Accessories",
    ],
    seoTitle: "Accessories",
    seoDescription:
      "Explore Sam’Alia accessories, leather goods, caps, belts, bags, and finishing details.",
  },
];

export async function getReadyToWearCategories(): Promise<ShopCategory[]> {
  return readyToWearCategories;
}

export async function getReadyToWearCategoryBySlug(
  slug: string
): Promise<ShopCategory | null> {
  return readyToWearCategories.find((category) => category.slug === slug) ?? null;
}