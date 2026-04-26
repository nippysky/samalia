// src/components/journal/journal-article-page.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import {
  formatJournalDate,
  type JournalArticle,
  type JournalContentBlock,
} from "@/src/data/journal-content";
import { BrandButton } from "@/src/components/ui/brand-button";
import { JournalHeroMedia } from "@/src/components/journal/journal-hero-media";

type JournalArticlePageProps = {
  article: JournalArticle;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function JournalArticlePage({ article }: JournalArticlePageProps) {
  return (
    <main className="lux-page bg-white text-black">
      <JournalHeroMedia article={article} />

      <article>
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
            <div className="mx-auto max-w-190 text-center">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
              >
                <FiArrowLeft className="size-3.5" />
                Journal
              </Link>

              <p className="mt-9 text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
                {article.category} / {formatJournalDate(article.publishedAt)} /{" "}
                {article.readTime}
              </p>

              <h1 className="mx-auto mt-5 max-w-170 font-display text-[clamp(2.65rem,7vw,7.6rem)] font-medium leading-[0.9] tracking-[-0.055em] text-black">
                {article.title}
              </h1>

              <p className="mx-auto mt-7 max-w-145 text-sm leading-8 text-black/58 sm:text-base">
                {article.subtitle}
              </p>
            </div>
          </div>
        </header>

        <section className="bg-white text-black">
          <div className="mx-auto grid w-full max-w-440 gap-12 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.72fr_minmax(0,1fr)_0.28fr] lg:px-8 lg:py-24 2xl:px-10">
            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--nav-h)+32px)]">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
                  Written by
                </p>
                <p className="mt-3 text-sm leading-7 text-black">
                  {article.author}
                </p>
              </div>
            </aside>

            <div className="mx-auto w-full max-w-185">
              <div className="space-y-10">
                {article.blocks.map((block) => (
                  <JournalBlockRenderer key={block.id} block={block} />
                ))}
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>
        </section>

        {article.gallery.length > 0 ? (
          <section className="bg-white text-black">
            <div className="grid grid-cols-1 gap-px bg-white md:grid-cols-2">
              {article.gallery.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative min-h-[62svh] overflow-hidden bg-black/4.5",
                    index === 0 && article.gallery.length > 1 && "md:min-h-[78svh]"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    style={{
                      objectPosition: image.objectPosition ?? "center",
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="border-t border-black/10 bg-white">
          <div className="mx-auto flex w-full max-w-440 flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-18 2xl:px-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
                Continue reading
              </p>

              <h2 className="mt-4 max-w-145 font-display text-[clamp(2rem,4vw,4.4rem)] font-medium leading-none tracking-[-0.04em] text-black">
                Return to the journal archive.
              </h2>
            </div>

            <BrandButton
              href="/journal"
              variant="primary"
              iconAfter={<FiArrowRight className="size-4" />}
            >
              All journal
            </BrandButton>
          </div>
        </footer>
      </article>
    </main>
  );
}

function JournalBlockRenderer({ block }: { block: JournalContentBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-base leading-9 text-black/62 sm:text-[1.05rem]">
        {block.text}
      </p>
    );
  }

  if (block.type === "heading") {
    return (
      <h2 className="pt-4 font-display text-[clamp(2rem,4vw,4.4rem)] font-medium leading-none tracking-[-0.04em] text-black">
        {block.text}
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-y border-black/10 py-10">
        <p className="font-display text-[clamp(2rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.04em] text-black">
          “{block.text}”
        </p>

        {block.credit ? (
          <cite className="mt-6 block text-[10px] not-italic uppercase tracking-[0.24em] text-black/42">
            {block.credit}
          </cite>
        ) : null}
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <figure>
        <div className="relative min-h-[62svh] overflow-hidden bg-black/4.5">
          <Image
            src={block.image.src}
            alt={block.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
            style={{
              objectPosition: block.image.objectPosition ?? "center",
            }}
          />
        </div>

        {block.caption ? (
          <figcaption className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/38">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "split") {
    return (
      <section className="grid gap-8 border-y border-black/10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
            Studio note
          </p>

          <h2 className="mt-4 text-[1.35rem] font-medium leading-tight tracking-[-0.035em] text-black">
            {block.title}
          </h2>

          <p className="mt-5 text-sm leading-8 text-black/58">{block.text}</p>
        </div>

        <div className="relative min-h-[54svh] overflow-hidden bg-black/4.5">
          <Image
            src={block.image.src}
            alt={block.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            style={{
              objectPosition: block.image.objectPosition ?? "center",
            }}
          />
        </div>
      </section>
    );
  }

  return null;
}