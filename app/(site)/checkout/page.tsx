// app/checkout/page.tsx
import type { Metadata } from "next";

import { CheckoutContent } from "@/src/components/checkout/checkout-content";

const pageTitle = "Checkout";

const pageDescription =
  "Complete your Sam’Alia order with delivery details, order summary, and Paystack-ready payment flow.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    url: "/checkout",
    siteName: "Sam’Alia",
    type: "website",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia checkout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Sam’Alia`,
    description: pageDescription,
    images: ["/og-samalia.jpg"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}