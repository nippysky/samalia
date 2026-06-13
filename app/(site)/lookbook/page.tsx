// app/lookbook/page.tsx
import type { Metadata } from "next";

import { LookbookIndex } from "@/src/components/lookbook/lookbook-index";
import { getLookbookEntries } from "@/src/data/lookbook-content";

const pageTitle = "Lookbook";

const pageDescription =
  "Explore Sam’Alia lookbooks, campaigns, atelier studies, and seasonal visual stories from the house.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/lookbook",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/lookbook",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia Lookbook",
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

export default async function LookbookPage() {
  const entries = await getLookbookEntries();

  return <LookbookIndex entries={entries} />;
}