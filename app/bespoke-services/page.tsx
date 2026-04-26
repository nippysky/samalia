// app/bespoke-services/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

import { BespokeServicesContent } from "@/src/components/services/bespoke-services-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "Bespoke Services";
const pageDescription =
  "Explore Sam’Alia bespoke services including personalisation, private appointments, certificate of craft, gifting, Nigeria-first shipping, and Paystack-enabled payment support.";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/bespoke-services",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/bespoke-services",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/images/BespokeHero.svg",
        width: 1600,
        height: 900,
        alt: "Sam’Alia bespoke services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    images: ["/images/BespokeHero.svg"],
  },
};

export default function BespokeServicesPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Sam’Alia Bespoke Services",
    description: pageDescription,
    provider: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    serviceType: [
      "Personalisation",
      "Private appointments",
      "Certificate of craft",
      "Gift option",
      "Nigeria-first shipping",
      "Paystack-enabled payment methods",
    ],
    url: `${siteUrl}/bespoke-services`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(serviceJsonLd),
        }}
      />

      <main className="lux-page bg-white text-black">
        <section className="relative min-h-[calc(82svh-var(--nav-h))] overflow-hidden bg-white sm:min-h-[calc(88svh-var(--nav-h))]">
          <Image
            src="/images/BespokeHero.svg"
            alt="Sam’Alia bespoke services hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </section>

        <div id="services">
          <BespokeServicesContent />
        </div>
      </main>
    </>
  );
}