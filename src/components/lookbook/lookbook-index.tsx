// src/components/lookbook/lookbook-index.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import type { LookbookEntry } from "@/src/data/lookbook-content";

type LookbookIndexProps = {
  entries: LookbookEntry[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LookbookIndex({ entries }: LookbookIndexProps) {
  const primary = entries.find((entry) => entry.featured) ?? entries[0];
  const secondary = entries.find((entry) => entry.id !== primary?.id);

  const heroEntries = [primary, secondary].filter(Boolean) as LookbookEntry[];

  const directoryEntries = entries.filter(
    (entry) => !heroEntries.some((hero) => hero.id === entry.id)
  );

  return (
    <main className="lux-page bg-white text-black">
      {heroEntries.length > 0 ? (
        <LookbookHeroGrid entries={heroEntries} />
      ) : null}

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
            {directoryEntries.map((entry, index) => (
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

function LookbookHeroGrid({ entries }: { entries: LookbookEntry[] }) {
  return (
    <section className="bg-white text-black">
      <div
        className={cn(
          "grid border-b border-black/10",
          entries.length === 1
            ? "min-h-[calc(100svh-var(--nav-h))]"
            : "lg:grid-cols-2 lg:min-h-[calc(100svh-var(--nav-h))]"
        )}
      >
        {entries.map((entry, index) => (
          <HeroLookbookCard
            key={entry.id}
            entry={entry}
            priority={index < 2}
            isPrimary={index === 0}
            single={entries.length === 1}
          />
        ))}
      </div>
    </section>
  );
}

function HeroLookbookCard({
  entry,
  priority,
  isPrimary,
  single,
}: {
  entry: LookbookEntry;
  priority: boolean;
  isPrimary: boolean;
  single: boolean;
}) {
  return (
    <Link
      href={`/lookbook/${entry.slug}`}
      aria-label={entry.title}
      className={cn(
        "group relative block min-h-[68svh] overflow-hidden bg-black text-white lg:min-h-[calc(100svh-var(--nav-h))]",
        !single && "border-b border-white/20 lg:border-b-0 lg:border-r",
        !single && !isPrimary && "lg:border-r-0"
      )}
    >
      <Image
        src={entry.coverImage.src}
        alt={entry.coverImage.alt}
        fill
        priority={priority}
        quality={94}
        sizes={single ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
        className="object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.025] group-hover:brightness-[0.88]"
        style={{
          objectPosition: entry.coverImage.objectPosition ?? "center",
        }}
      />

      <div className="absolute inset-0 bg-black/12 transition-colors duration-500 ease-luxury group-hover:bg-black/24" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-black/76 via-black/28 to-transparent" />

      {isPrimary ? (
        <div className="absolute left-4 top-5 z-10 sm:left-6 lg:left-8 2xl:left-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/72">
            Sam’Alia lookbook
          </p>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-[68svh] items-end lg:min-h-[calc(100svh-var(--nav-h))]">
        <div className="w-full p-4 pb-8 sm:p-6 sm:pb-10 lg:p-8 lg:pb-12 2xl:p-10 2xl:pb-14">
          <div className="max-w-120">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/62">
              {entry.category} / {entry.season} / {entry.year}
            </p>

            {isPrimary ? (
              <h1 className="mt-5 font-display text-[clamp(2rem,4.2vw,4.75rem)] font-medium leading-[0.96] tracking-tight text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {entry.title}
              </h1>
            ) : (
              <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,4.75rem)] font-medium leading-[0.96] tracking-tight text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {entry.title}
              </h2>
            )}

            <p className="mt-5 max-w-105 text-sm leading-7 text-white/72 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden sm:text-[0.95rem] sm:leading-8">
              {entry.description}
            </p>

            <span className="mt-7 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
              Discover lookbook
              <FiArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
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

        <h3 className="mt-3 max-w-120 text-[1.15rem] font-medium leading-snug tracking-tight text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {entry.title}
        </h3>

        <p className="mt-3 max-w-120 text-sm leading-7 text-black/55 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
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