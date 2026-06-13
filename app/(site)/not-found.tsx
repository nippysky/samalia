// app/not-found.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowLeft, FiArrowRight, FiMail } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for has moved or is no longer available.",
  // 404s shouldn't be indexed
  robots: { index: false, follow: false },
};

const NAVIGATION_TILES = [
  {
    eyebrow: "01",
    title: "Ready to wear",
    description: "Signature pieces from the current collection.",
    href: "/ready-to-wear",
  },
  {
    eyebrow: "02",
    title: "Bespoke Services",
    description: "Refined essentials made for daily ritual.",
    href: "/bespoke-services",
  },
  {
    eyebrow: "03",
    title: "Craft & legacy",
    description: "Heritage, technique, and the artisans behind the house.",
    href: "/craft-legacy",
  },
] as const;

export default function NotFound() {
  return (
    // Wrapped in a <div> rather than <main> because the root layout already
    // provides a <main> element around `children`.
    <div className="lux-page bg-white text-black">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-black/10">
        <div className="lux-container py-24 lg:py-32 xl:py-36">
          {/* Eyebrow */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/45">
            Error · 404
          </p>

          {/*
            Asymmetric editorial grid:
              - left: large decorative 404 numerals (aria-hidden — purely visual)
              - right: real <h1>, paragraph, CTAs
            `lux-stagger` cascades each child in with rise-in animation.
          */}
          <div className="mt-12 grid gap-12 lux-stagger lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-16 xl:gap-24">
            {/* Decorative numerals */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div
                aria-hidden="true"
                className="lux-display select-none"
                style={{ lineHeight: 0.82 }}
              >
                <span>4</span>
                <span className="text-black/10">0</span>
                <span>4</span>
              </div>
              {/* Brand signature mark */}
              <div className="mt-10 h-px w-20 bg-black" />
            </div>

            {/* Message + CTAs */}
            <div className="lg:col-span-6 xl:col-span-6 xl:col-start-7">
              <h1 className="lux-heading">
                This page is
                <br />
                no longer in season.
              </h1>

              <p className="mt-8 max-w-md text-[15px] leading-[1.8] text-black/55">
                The page you&apos;re looking for has moved, retired, or was
                never part of the archive. Allow us to guide you somewhere
                worth discovering.
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
                <BrandButton
                  href="/"
                  variant="primary"
                  size="md"
                  iconBefore={<FiArrowLeft className="size-3.5" />}
                  className="w-full sm:w-auto sm:min-w-44"
                >
                  Return home
                </BrandButton>

                <BrandButton
                  href="/contact"
                  variant="text"
                  size="md"
                  iconAfter={<FiArrowRight className="size-3.5" />}
                >
                  Contact concierge
                </BrandButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Where to next — navigation tiles ─────────────────────────── */}
      <section>
        <div className="lux-container py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black">
              Where to next
            </p>
            <h2 className="mt-4 lux-heading">Browse the house</h2>
          </div>

          {/*
            `gap-px` + `bg-black/10` is the luxury-editorial trick for hairline
            dividers between cards: the gap reveals the parent's background as
            a 1-pixel rule. Each tile inverts on hover (white → black) for a
            decisive, confident feel that matches BrandButton's overlay logic.
          */}
          <div className="mt-14 grid gap-px bg-black/10 lux-stagger md:grid-cols-3">
            {NAVIGATION_TILES.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group relative block bg-white p-8 transition-colors duration-500 ease-luxury hover:bg-black lg:p-10"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 transition-colors duration-500 ease-luxury group-hover:text-white/45">
                  {tile.eyebrow}
                </p>

                <div className="mt-6 flex items-start justify-between gap-4">
                  <h3 className="text-[15px] font-medium uppercase tracking-[0.18em] text-black transition-colors duration-500 ease-luxury group-hover:text-white">
                    {tile.title}
                  </h3>
                  <FiArrowRight className="mt-1 size-3.5 -translate-x-2 text-black opacity-0 transition-[opacity,transform,color] duration-500 ease-luxury group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white" />
                </div>

                <p className="mt-5 text-[13px] leading-[1.75] text-black/55 transition-colors duration-500 ease-luxury group-hover:text-white/65">
                  {tile.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Concierge line ────────────────────────────────────────── */}
      <section className="border-t border-black/10">
        <div className="lux-container py-10 lg:py-14">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-relaxed text-black/55">
              Believe this is a mistake? Our concierge is happy to help.
            </p>

            <a
              href="mailto:concierge@samalia.com"
              className="group inline-flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-black transition-colors duration-300 ease-luxury hover:text-black/55"
            >
              <FiMail className="size-3 transition-transform duration-300 ease-luxury group-hover:-translate-x-0.5" />
              <span className="font-sans normal-case tracking-normal">
                concierge@samalia.com
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}