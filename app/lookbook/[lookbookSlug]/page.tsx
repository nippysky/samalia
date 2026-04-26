// app/lookbook/[lookbookSlug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LookbookDetailPage } from "@/src/components/lookbook/lookbook-detail-page";
import {
  getLookbookEntryBySlug,
  getLookbookSlugs,
} from "@/src/data/lookbook-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

type LookbookRouteProps = {
  params: Promise<{
    lookbookSlug: string;
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
  return getLookbookSlugs();
}

export async function generateMetadata({
  params,
}: LookbookRouteProps): Promise<Metadata> {
  const { lookbookSlug } = await params;
  const entry = await getLookbookEntryBySlug(lookbookSlug);

  if (!entry) {
    return {
      title: "Lookbook not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: `/lookbook/${entry.slug}`,
    },
    openGraph: {
      title: `${entry.title} | Sam’Alia`,
      description: entry.description,
      url: `/lookbook/${entry.slug}`,
      siteName: "Sam’Alia",
      type: "website",
      images: [
        {
          url: entry.coverImage.src,
          width: 1600,
          height: 1000,
          alt: entry.coverImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | Sam’Alia`,
      description: entry.description,
      images: [entry.coverImage.src],
    },
  };
}

export default async function LookbookRoutePage({
  params,
}: LookbookRouteProps) {
  const { lookbookSlug } = await params;
  const entry = await getLookbookEntryBySlug(lookbookSlug);

  if (!entry) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.title,
    description: entry.description,
    url: `${siteUrl}/lookbook/${entry.slug}`,
    image: getAbsoluteUrl(entry.coverImage.src),
    creator: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
    },
    about: [entry.category, entry.season, "African luxury fashion", "Lookbook"],
    hasPart: entry.looks.map((look) => ({
      "@type": "CreativeWork",
      name: look.title,
      description: look.description,
      image: getAbsoluteUrl(look.image.src),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(jsonLd),
        }}
      />

      <LookbookDetailPage entry={entry} />
    </>
  );
}