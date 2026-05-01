// src/components/journal/journal-index.tsx
import Image from "next/image";
import Link from "next/link";

import {
  formatJournalDate,
  type JournalArticle,
} from "@/src/data/journal-content";

type JournalIndexProps = {
  articles: JournalArticle[];
};

function getArticleTime(article: JournalArticle) {
  const time = new Date(article.publishedAt).getTime();

  return Number.isNaN(time) ? 0 : time;
}

export function JournalIndex({ articles }: JournalIndexProps) {
  const sortedArticles = [...articles].sort(
    (a, b) => getArticleTime(b) - getArticleTime(a)
  );

  const featured = sortedArticles[0];
  const rest = sortedArticles.slice(1);

  return (
    <main className="lux-page bg-white text-black">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mx-auto max-w-230 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              From the House
            </p>

            <h1 className="mx-auto mt-5 max-w-190 font-display text-[clamp(2.55rem,5.4vw,6.35rem)] font-medium leading-[0.94] tracking-tight text-black">
              Notes from the House.
            </h1>

            <p className="mx-auto mt-8 max-w-132 text-sm leading-8 text-black/56 sm:text-base">
              A closer look at the house — pieces, process, and the decisions
              behind them.
            </p>
          </div>
        </div>
      </section>

      {featured ? <FeaturedJournalCard article={featured} /> : null}

      {rest.length > 0 ? (
        <section className="bg-white text-black">
          <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
            <div className="mb-12 border-b border-black/10 pb-6">
              <h2 className="text-[1rem] font-medium tracking-[0.18em] text-black">
                From the House
              </h2>
            </div>

            <div className="grid items-start gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
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
      ) : null}
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
          <div className="max-w-138">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
              {article.category} / {formatJournalDate(article.publishedAt)}
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,5.7rem)] font-medium leading-[0.95] tracking-tight text-black">
              {article.title}
            </h2>

            <p className="mt-8 text-sm leading-8 text-black/58">
              {article.excerpt}
            </p>

            <span className="mt-10 inline-flex text-[12px] font-medium tracking-[0.08em] text-black transition-opacity duration-300 ease-luxury group-hover:opacity-55">
              Read More →
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

      <div className="pt-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/40">
          {article.category} / {formatJournalDate(article.publishedAt)}
        </p>

        <h3 className="mt-4 max-w-120 text-[1.15rem] font-medium leading-snug tracking-tight text-black">
          {article.title}
        </h3>

        <p className="mt-5 max-w-120 text-sm leading-7 text-black/55">
          {article.excerpt}
        </p>

        <span className="mt-7 inline-flex text-[11px] font-medium tracking-[0.08em] text-black transition-opacity duration-300 ease-luxury group-hover:opacity-55">
          Read More →
        </span>
      </div>
    </Link>
  );
}