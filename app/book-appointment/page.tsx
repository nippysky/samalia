// app/book-appointment/page.tsx
import type { Metadata } from "next";

import { MakeAppointmentClient } from "@/src/components/appointments/make-appointment-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const pageTitle = "Book Appointment";
const pageDescription =
  "Book a private Sam’Alia appointment in Lagos, Nigeria for bespoke consultations, fittings, collection previews, and personalisation enquiries.";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/book-appointment",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/book-appointment",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Book a Sam’Alia appointment",
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

export default function BookAppointmentPage() {
  const appointmentJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Sam’Alia Private Appointment",
    description: pageDescription,
    provider: {
      "@type": "Organization",
      name: "Sam’Alia",
      url: siteUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Lagos",
      containedInPlace: {
        "@type": "Country",
        name: "Nigeria",
      },
    },
    serviceType: [
      "Bespoke consultation",
      "Private fitting",
      "Collection preview",
      "Personalisation enquiry",
    ],
    url: `${siteUrl}/book-appointment`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(appointmentJsonLd),
        }}
      />

      <MakeAppointmentClient />
    </>
  );
}