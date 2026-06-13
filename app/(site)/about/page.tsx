// app/about/page.tsx
import type { Metadata } from "next";

import { TheHousePage } from "@/src/components/about/the-house-page";
import { getHouseContent } from "@/src/data/house-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "The House";
const pageDescription =
  "Discover Sam’Alia, a design house built on structure, discipline, craft, and cultural clarity.";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/about",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia — The House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    images: ["/og-samalia.jpg"],
  },
};

export default async function AboutPage() {
  const content = await getHouseContent();

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "The House | Sam’Alia",
    description: pageDescription,
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "Sam’Alia",
      alternateName: ["Sam Alia", "Sam'Alia"],
      url: siteUrl,
      foundingLocation: {
        "@type": "Place",
        name: "Northern Nigeria",
      },
      description: pageDescription,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(aboutJsonLd),
        }}
      />

      <TheHousePage content={content} />
    </>
  );
}