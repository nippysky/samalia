// app/faq/page.tsx
import type { Metadata } from "next";

import { FAQPage } from "@/src/components/faq/faq-page";
import { faqFlatItems, faqSections } from "@/src/data/faq-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "Frequently Asked Questions";

const pageDescription =
  "Find answers about Sam’Alia orders, Paystack payments, Nigeria delivery, Shipbubble-ready shipping, returns, sizing, appointments, gifting, and care.";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/faq",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia FAQ",
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

export default function FAQRoutePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: `${siteUrl}/faq`,
    mainEntity: faqFlatItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [...item.answer, ...(item.bullets ?? [])].join(" "),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(faqJsonLd),
        }}
      />

      <FAQPage sections={faqSections} />
    </>
  );
}