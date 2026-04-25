// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cinzel, Poppins } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { CookieConsent } from "@/src/components/shared/cookie-consent";
import { SiteFooter } from "@/src/components/shared/site-footer";
import { SiteHeader } from "@/src/components/shared/site-header";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";

const siteName = "Sam’Alia";

const siteDescription =
  "Sam’Alia is a luxury fashion and lifestyle house from Northern Nigeria, where heritage, culture, and modern design meet in timeless black-and-white elegance.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Sam’Alia — Luxury Fashion & Lifestyle",
    template: "%s | Sam’Alia",
  },

  description: siteDescription,

  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "fashion",

  keywords: [
    "Sam'Alia",
    "Sam Alia",
    "Sam’Alia",
    "luxury fashion brand",
    "African luxury fashion",
    "Northern Nigeria fashion",
    "Nigerian luxury fashion",
    "African lifestyle brand",
    "heritage fashion",
    "modern African fashion",
    "minimalist fashion brand",
    "black and white fashion brand",
    "luxury lifestyle brand",
    "contemporary African design",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Sam’Alia — Luxury Fashion & Lifestyle",
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-samalia.jpg",
        width: 1200,
        height: 630,
        alt: "Sam’Alia — Luxury Fashion and Lifestyle",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sam’Alia — Luxury Fashion & Lifestyle",
    description: siteDescription,
    images: ["/og-samalia.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sam'Alia",
  alternateName: ["Sam Alia", "Sam’Alia"],
  url: siteUrl,
  logo: `${siteUrl}/og-samalia.jpg`,
  description: siteDescription,
  foundingLocation: {
    "@type": "Place",
    name: "Northern Nigeria",
  },
  brand: {
    "@type": "Brand",
    name: siteName,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  publisher: {
    "@type": "Organization",
    name: siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-svh w-full overflow-x-hidden bg-background text-foreground font-sans">
        <Script
          id="samalia-organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <Script
          id="samalia-website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>

        <CookieConsent />
      </body>
    </html>
  );
}