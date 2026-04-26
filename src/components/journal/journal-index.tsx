// src/components/journal/journal-index.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import {
  formatJournalDate,
  type JournalArticle,
} from "@/src/data/journal-content";

type JournalIndexProps = {
  articles: JournalArticle[];
};

export function JournalIndex({ articles }: JournalIndexProps) {
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const rest = articles.filter((article) => article.id !== featured?.id);

  return (
    <main className="lux-page bg-white text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mx-auto max-w-230 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              Sam’Alia journal
            </p>

            <h1 className="mx-auto mt-5 max-w-210 font-display text-[clamp(2.55rem,5.4vw,6.35rem)] font-medium leading-[0.94] tracking-tight text-black">
              Notes on form, craft, and culture.
            </h1>

            <p className="mx-auto mt-7 max-w-140 text-sm leading-8 text-black/56 sm:text-base">
              Editorial stories from the house: process notes, cultural memory,
              material studies, private services, and the ideas shaping
              Sam’Alia.
            </p>
          </div>
        </div>
      </section>

      {featured ? <FeaturedJournalCard article={featured} /> : null}

      <section className="bg-white text-black">
        <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-black/10 pb-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
                Latest
              </p>

              <h2 className="mt-3 text-[1rem] font-medium uppercase tracking-[0.18em] text-black">
                Journal entries
              </h2>
            </div>
          </div>

          <div className="grid items-start gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, index) => (
              <JournalCard
                key={article.id}
                article={article}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeaturedJournalCard({ article }: { article: JournalArticle }) {
  return (
    <section className="bg-white text-black">
      <Link
        href={`/journal/${article.slug}`}
        className="group grid min-h-[calc(92svh-var(--nav-h))] border-b border-black/10 lg:grid-cols-[minmax(0,1.18fr)_minmax(420px,0.82fr)]"
      >
        <div className="relative min-h-[62svh] overflow-hidden bg-black/5 lg:min-h-[calc(92svh-var(--nav-h))]">
          <Image
            src={article.heroImage.src}
            alt={article.heroImage.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.025]"
            style={{
              objectPosition: article.heroImage.objectPosition ?? "center",
            }}
          />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/12" />
        </div>

        <div className="flex items-end bg-white p-5 sm:p-8 lg:p-10 2xl:p-12">
          <div className="max-w-135">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
              {article.category} / {formatJournalDate(article.publishedAt)}
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,5.7rem)] font-medium leading-[0.95] tracking-tight text-black">
              {article.title}
            </h2>

            <p className="mt-6 text-sm leading-8 text-black/58">
              {article.excerpt}
            </p>

            <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black">
              Read journal
              <FiArrowRight className="size-4 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function JournalCard({
  article,
  priority,
}: {
  article: JournalArticle;
  priority: boolean;
}) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group block h-full"
      aria-label={article.title}
    >
      <div className="relative aspect-5/4 w-full overflow-hidden bg-black/5">
        <Image
          src={article.heroImage.src}
          alt={article.heroImage.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.04] group-hover:brightness-[0.88]"
          style={{
            objectPosition: article.heroImage.objectPosition ?? "center",
          }}
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/18" />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/40">
          {article.category} / {formatJournalDate(article.publishedAt)}
        </p>

        <h3 className="mt-3 max-w-120 text-[1.15rem] font-medium leading-snug tracking-tight text-black">
          {article.title}
        </h3>

        <p className="mt-3 max-w-120 text-sm leading-7 text-black/55">
          {article.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black">
          Read
          <FiArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}