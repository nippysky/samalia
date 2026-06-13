// app/(site)/layout.tsx
// Frontend layout — wraps all public-facing pages with SiteHeader, SiteFooter,
// QueryProvider, CookieConsent, and JSON-LD scripts.
// Admin routes at app/admin/ do NOT inherit this layout.

import Script from "next/script";
import { BrandToastViewport } from "@/src/components/shared/brand-toast-viewport";
import { CookieConsent } from "@/src/components/shared/cookie-consent";
import { SiteFooter } from "@/src/components/shared/site-footer";
import { SiteHeader } from "@/src/components/shared/site-header";
import { QueryProvider } from "@/src/providers/query-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samalia.com";
const siteName = "Sam'Alia";
const siteDescription =
  "Sam'Alia is a luxury fashion and lifestyle house from Northern Nigeria, where heritage, culture, and modern design meet in timeless black-and-white elegance.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  alternateName: ["Sam Alia", "Sam'Alia"],
  url: siteUrl,
  logo: `${siteUrl}/og-samalia.jpg`,
  description: siteDescription,
  foundingLocation: { "@type": "Place", name: "Northern Nigeria" },
  brand: { "@type": "Brand", name: siteName },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  publisher: { "@type": "Organization", name: siteName },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="samalia-organization-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="samalia-website-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <QueryProvider>
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <CookieConsent />
        <BrandToastViewport />
      </QueryProvider>
    </>
  );
}
