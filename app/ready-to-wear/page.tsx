// app/ready-to-wear/page.tsx
import type { Metadata } from "next";

import { ReadyToWearClient } from "@/src/components/shop/ready-to-wear-client";
import { getReadyToWearCategories } from "@/src/data/shop-categories";
import { getReadyToWearProducts } from "@/src/data/ready-to-wear-products";

export const metadata: Metadata = {
  title: "Ready to Wear",
  description:
    "Explore Sam’Alia ready-to-wear pieces through garment type, material, and construction.",
  alternates: {
    canonical: "/ready-to-wear",
  },
  openGraph: {
    title: "Ready to Wear | Sam’Alia",
    description:
      "Explore Sam’Alia ready-to-wear pieces through garment type, material, and construction.",
    url: "/ready-to-wear",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia Ready to Wear",
      },
    ],
  },
};

export default async function ReadyToWearPage() {
  const [products, categories] = await Promise.all([
    getReadyToWearProducts(),
    getReadyToWearCategories(),
  ]);

  return (
    <main className="lux-page bg-white text-black">
      <ReadyToWearClient products={products} categories={categories} />
    </main>
  );
}