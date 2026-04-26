// app/craft-legacy/page.tsx
import type { Metadata } from "next";

import { CraftLegacyPage } from "@/src/components/craft/craft-legacy-page";
import { getCraftLegacyContent } from "@/src/data/craft-legacy-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "Craft & Legacy";
const pageDescription =
  "Explore Sam’Alia Craft & Legacy, a media-led expression of Northern memory, atelier discipline, construction, and modern African luxury.";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/craft-legacy",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/craft-legacy",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/images/home-hero.jpeg",
        width: 1600,
        height: 900,
        alt: "Sam’Alia Craft & Legacy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    images: ["/images/home-hero.jpeg"],
  },
};

export default async function CraftLegacyRoutePage() {
  const content = await getCraftLegacyContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Sam’Alia Craft & Legacy",
    description: pageDescription,
    url: `${siteUrl}/craft-legacy`,
    publisher: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
    },
    about: [
      "African luxury fashion",
      "Northern Nigerian craft",
      "Atelier construction",
      "Heritage design",
    ],
    image: `${siteUrl}${content.hero.posterSrc}`,
    video: {
      "@type": "VideoObject",
      name: content.hero.title,
      description: content.hero.description,
      thumbnailUrl: `${siteUrl}${content.hero.posterSrc}`,
      contentUrl: `${siteUrl}${content.hero.videoSrc}`,
      uploadDate: "2026-01-01",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(jsonLd),
        }}
      />

      <CraftLegacyPage content={content} />
    </>
  );
}