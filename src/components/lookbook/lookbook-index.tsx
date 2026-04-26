// src/components/lookbook/lookbook-index.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import type { LookbookEntry } from "@/src/data/lookbook-content";

type LookbookIndexProps = {
  entries: LookbookEntry[];
};

export function LookbookIndex({ entries }: LookbookIndexProps) {
  const featured = entries.find((entry) => entry.featured) ?? entries[0];
  const rest = entries.filter((entry) => entry.id !== featured?.id);

  return (
    <main className="lux-page bg-white text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mx-auto max-w-210 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              Sam’Alia lookbook
            </p>

            <h1 className="mx-auto mt-5 max-w-190 font-display text-[clamp(2.7rem,6.2vw,7rem)] font-medium leading-[0.92] tracking-tighter text-black">
              Visual studies from the house.
            </h1>

            <p className="mx-auto mt-7 max-w-135 text-sm leading-8 text-black/56 sm:text-base">
              A directory of collections, campaigns, atelier studies, and
              seasonal expressions from Sam’Alia.
            </p>
          </div>
        </div>
      </section>

      {featured ? <FeaturedLookbook entry={featured} /> : null}

      <section className="bg-white text-black">
        <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-black/10 pb-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
                Directory
              </p>

              <h2 className="mt-3 text-[1rem] font-medium uppercase tracking-[0.18em] text-black">
                Collections & campaigns
              </h2>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((entry, index) => (
              <LookbookCard
                key={entry.id}
                entry={entry}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeaturedLookbook({ entry }: { entry: LookbookEntry }) {
  return (
    <section className="bg-white text-black">
      <Link
        href={`/lookbook/${entry.slug}`}
        className="group grid min-h-[calc(92svh-var(--nav-h))] border-b border-black/10 lg:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)]"
      >
        <div className="relative min-h-[64svh] overflow-hidden bg-black/5 lg:min-h-[calc(92svh-var(--nav-h))]">
          <Image
            src={entry.coverImage.src}
            alt={entry.coverImage.alt}
            fill
            priority
            quality={92}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.025]"
            style={{
              objectPosition: entry.coverImage.objectPosition ?? "center",
            }}
          />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/12" />
        </div>

        <div className="flex items-end bg-white p-5 sm:p-8 lg:p-10 2xl:p-12">
          <div className="max-w-135">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
              {entry.category} / {entry.season} / {entry.year}
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,5.7rem)] font-medium leading-[0.95] tracking-tight text-black">
              {entry.title}
            </h2>

            <p className="mt-6 text-sm leading-8 text-black/58">
              {entry.description}
            </p>

            <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black">
              Discover lookbook
              <FiArrowRight className="size-4 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function LookbookCard({
  entry,
  priority,
}: {
  entry: LookbookEntry;
  priority: boolean;
}) {
  return (
    <Link
      href={`/lookbook/${entry.slug}`}
      className="group block"
      aria-label={entry.title}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-black/5">
        <Image
          src={entry.coverImage.src}
          alt={entry.coverImage.alt}
          fill
          priority={priority}
          quality={90}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.04] group-hover:brightness-[0.88]"
          style={{
            objectPosition: entry.coverImage.objectPosition ?? "center",
          }}
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/18" />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/40">
          {entry.category} / {entry.year}
        </p>

        <h3 className="mt-3 max-w-120 text-[1.15rem] font-medium leading-snug tracking-tight text-black">
          {entry.title}
        </h3>

        <p className="mt-3 max-w-120 text-sm leading-7 text-black/55">
          {entry.subtitle}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black">
          View
          <FiArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}