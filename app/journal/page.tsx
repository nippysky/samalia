// app/journal/page.tsx
import type { Metadata } from "next";

import { JournalIndex } from "@/src/components/journal/journal-index";
import { getJournalArticles } from "@/src/data/journal-content";

const pageTitle = "Journal";
const pageDescription =
  "Read Sam’Alia journal entries on craft, culture, material studies, private appointments, and the house language behind modern African luxury.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/journal",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia Journal",
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

export default async function JournalPage() {
  const articles = await getJournalArticles();

  return <JournalIndex articles={articles} />;
}