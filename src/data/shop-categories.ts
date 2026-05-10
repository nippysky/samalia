import type { ShopCategory } from "@/src/lib/shop/types";

export const READY_TO_WEAR_ALL_CATEGORY = "all";

export const readyToWearCategories: ShopCategory[] = [
  {
    slug: "shirts",
    title: "Shirts",
    description:
      "Shirts developed through form, material, and construction. Includes refined everyday shirts, dinner shirts, polos, tees, and linen shapes.",
    productionCategories: [
      "T-Shirts",
      "Polo Shirts",
      "Day Structured Shirts",
      "Dinner Shirts",
      "Linens",
    ],
    seoTitle: "Shirts",
    seoDescription:
      "Explore Sam’Alia shirts developed through form, material, and construction.",
  },
  {
    slug: "trousers",
    title: "Trousers",
    description:
      "Tailored trousers developed through structure, proportion, and fit. Includes denim, dinner pants, linen trousers, and clean daily silhouettes.",
    productionCategories: ["Dinner Pants", "Denims", "Linens"],
    seoTitle: "Trousers",
    seoDescription:
      "Explore Sam’Alia trousers developed through structure, proportion, and fit.",
  },
  {
    slug: "co-ordinates",
    title: "Co-ordinates",
    description:
      "Coordinated garments designed to be worn together. Developed through shared structure, material, and proportion.",
    productionCategories: ["Travel Sets & Track Sets", "Linens"],
    seoTitle: "Co-ordinates",
    seoDescription:
      "Explore Sam’Alia coordinated garments developed through shared structure, material, and proportion.",
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    description:
      "Outerwear developed through structure, weight, and proportion. Includes layered pieces, leather clothing, and private loungewear.",
    productionCategories: ["Outerwear", "Leather Clothing", "Loungewear"],
    seoTitle: "Outerwear",
    seoDescription:
      "Explore Sam’Alia outerwear developed through structure, weight, and proportion.",
  },
  {
    slug: "shorts",
    title: "Shorts",
    description:
      "Shorts developed through proportion, ease, and construction. Built for movement without losing structure.",
    productionCategories: ["Shorts"],
    seoTitle: "Shorts",
    seoDescription:
      "Explore Sam’Alia shorts developed through proportion, ease, and construction.",
  },
  {
    slug: "accessories",
    title: "Accessories",
    description:
      "Accessories developed as finishing pieces — functional, measured, and specific to the house.",
    productionCategories: [
      "Belts",
      "Caps",
      "Bags",
      "Brooches / Metal Accessories",
    ],
    seoTitle: "Accessories",
    seoDescription:
      "Explore Sam’Alia accessories developed as functional finishing pieces.",
  },
  {
    slug: "ceremonial",
    title: "Ceremonial",
    description:
      "Ceremonial ready-to-wear pieces shaped for elevated occasions, cultural form, and precise house construction.",
    productionCategories: ["Ceremonial RTW", "Jalabia", "Heritage Forms"],
    seoTitle: "Ceremonial Ready to Wear",
    seoDescription:
      "Explore Sam’Alia ceremonial ready-to-wear pieces shaped for elevated occasions and cultural form.",
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