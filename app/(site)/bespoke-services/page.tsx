// app/bespoke-services/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

import { BespokeServicesContent } from "@/src/components/services/bespoke-services-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "Bespoke Services";

const pageDescription =
  "Explore Sam’Alia bespoke service: private fittings, measurements, material selection, personalisation, and final construction.";

const bespokeHeroImage =
  "https://images.pexels.com/photos/6764997/pexels-photo-6764997.jpeg?auto=compress&cs=tinysrgb&w=2400";

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
        url: bespokeHeroImage,
        width: 1600,
        height: 900,
        alt: "Sam’Alia bespoke tailoring and appointment service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    images: [bespokeHeroImage],
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
      "Bespoke process",
    ],
    url: `${siteUrl}/bespoke-services`,
    image: bespokeHeroImage,
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
        <section className="relative min-h-[calc(82svh-var(--nav-h))] overflow-hidden bg-black sm:min-h-[calc(88svh-var(--nav-h))]">
          <Image
            src={bespokeHeroImage}
            alt="Sam’Alia bespoke tailoring and appointment service"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 38%",
            }}
          />
        </section>

        <div id="services">
          <BespokeServicesContent />
        </div>
      </main>
    </>
  );
}