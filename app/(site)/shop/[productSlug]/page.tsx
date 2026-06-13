// app/shop/[productSlug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailsClient } from "@/src/components/shop/product-details-client";
import {
  getReadyToWearProductBySlug,
  getReadyToWearProductSlugs,
} from "@/src/data/ready-to-wear-products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

type ProductPageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

function getAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateStaticParams() {
  return getReadyToWearProductSlugs();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getReadyToWearProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Product not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const primaryImage = product.images[0]?.src ?? "/og-samalia.jpg";
  const description = product.description;
  const canonicalPath = `/shop/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${product.name} | Sam’Alia`,
      description,
      url: canonicalPath,
      type: "website",
      siteName: "Sam’Alia",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 1600,
          alt: product.images[0]?.alt ?? product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Sam’Alia`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getReadyToWearProductBySlug(productSlug);

  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    url: getAbsoluteUrl(`/shop/${product.slug}`),
    image: product.images.map((image) => getAbsoluteUrl(image.src)),
    brand: {
      "@type": "Brand",
      name: "Sam’Alia",
    },
    category: product.productionCategory,
    material: product.materials.join(", "),
    color: product.colors.join(", "),
    offers: {
      "@type": "Offer",
      url: getAbsoluteUrl(`/shop/${product.slug}`),
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(productJsonLd),
        }}
      />

      <ProductDetailsClient product={product} />
    </>
  );
}