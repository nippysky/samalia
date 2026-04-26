// src/components/lookbook/lookbook-detail-page.tsx
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import type { LookbookEntry } from "@/src/data/lookbook-content";
import { LookbookHeroMedia } from "@/src/components/lookbook/lookbook-hero-media";
import { LookbookVisualGallery } from "@/src/components/lookbook/lookbook-visual-gallery";

type LookbookDetailPageProps = {
  entry: LookbookEntry;
};

export function LookbookDetailPage({ entry }: LookbookDetailPageProps) {
  return (
    <main className="lux-page bg-white text-black">
      <LookbookHeroMedia entry={entry} />

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mx-auto max-w-190 text-center">
            <Link
              href="/lookbook"
              className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
            >
              <FiArrowLeft className="size-3.5" />
              Lookbook
            </Link>

            <p className="mt-9 text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
              {entry.category} / {entry.season} / {entry.year}
            </p>

            <h1 className="mx-auto mt-5 max-w-170 font-display text-[clamp(2.65rem,7vw,7.4rem)] font-medium leading-[0.9] tracking-tighter text-black">
              {entry.title}
            </h1>

            <p className="mx-auto mt-7 max-w-145 text-sm leading-8 text-black/58 sm:text-base">
              {entry.description}
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white text-black">
        <div className="mx-auto grid w-full max-w-440 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-24 2xl:px-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              {entry.statement.eyebrow}
            </p>
          </div>

          <div className="max-w-170">
            <h2 className="font-display text-[clamp(2rem,4vw,4.7rem)] font-medium leading-none tracking-tight text-black">
              {entry.statement.title}
            </h2>

            <p className="mt-7 max-w-145 text-sm leading-8 text-black/58 sm:text-[0.96rem]">
              {entry.statement.body}
            </p>
          </div>
        </div>
      </section>

      <LookbookVisualGallery entry={entry} />

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-440 flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-18 2xl:px-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
              Continue
            </p>

            <h2 className="mt-4 max-w-145 font-display text-[clamp(2rem,4vw,4.4rem)] font-medium leading-none tracking-tight text-black">
              Return to the lookbook directory.
            </h2>
          </div>

          <BrandButton
            href="/lookbook"
            variant="primary"
            iconAfter={<FiArrowRight className="size-4" />}
          >
            All lookbooks
          </BrandButton>
        </div>
      </footer>
    </main>
  );
}