// app/ready-to-wear/[categorySlug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductLinearGrid } from "@/src/components/shop/product-linear-grid";
import {
  getReadyToWearCategories,
  getReadyToWearCategoryBySlug,
} from "@/src/data/shop-categories";
import { getReadyToWearProductsByCategory } from "@/src/data/ready-to-wear-products";

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function generateStaticParams() {
  const categories = await getReadyToWearCategories();

  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getReadyToWearCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Ready to Wear",
    };
  }

  return {
    title: `${category.seoTitle} — Ready to Wear`,
    description: category.seoDescription,
    alternates: {
      canonical: `/ready-to-wear/${category.slug}`,
    },
    openGraph: {
      title: `${category.seoTitle} | Sam’Alia`,
      description: category.seoDescription,
      url: `/ready-to-wear/${category.slug}`,
      images: [
        {
          url: "/og-samalia.jpg",
          width: 1200,
          height: 630,
          alt: `${category.title} — Sam’Alia`,
        },
      ],
    },
  };
}

export default async function ReadyToWearCategoryPage({
  params,
}: CategoryPageProps) {
  const { categorySlug } = await params;

  const [category, products] = await Promise.all([
    getReadyToWearCategoryBySlug(categorySlug),
    getReadyToWearProductsByCategory(categorySlug),
  ]);

  if (!category) notFound();

  return (
    <main className="lux-page bg-white text-black">
      <section className="bg-white px-4 py-16 text-black sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
        <div className="mx-auto max-w-440">
          <div className="max-w-160">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-black/45">
              Ready to wear
            </p>

            <h1 className="mt-5 text-[clamp(2.4rem,5vw,5.8rem)] font-display font-medium leading-[0.95] tracking-[-0.045em]">
              {category.title}
            </h1>

            <p className="mt-6 max-w-130 text-sm leading-8 text-black/58">
              {category.description}
            </p>
          </div>

          <div className="mt-14">
            <ProductLinearGrid products={products} />
          </div>
        </div>
      </section>
    </main>
  );
}