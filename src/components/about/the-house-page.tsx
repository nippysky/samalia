// src/components/about/the-house-page.tsx
import Image from "next/image";
import Link from "next/link";

import { BrandButton } from "@/src/components/ui/brand-button";
import type {
  HouseContent,
  HouseTextSection,
} from "@/src/data/house-content";

type TheHousePageProps = {
  content: HouseContent;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TheHousePage({ content }: TheHousePageProps) {
  return (
    <main className="lux-page bg-white text-black">
      <HouseHero content={content} />
      <HouseTextSections sections={content.sections} />
      <HouseClosing content={content} />
    </main>
  );
}

function HouseHero({ content }: TheHousePageProps) {
  const { hero } = content;

  return (
    <section className="relative min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-black text-white">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{
          objectPosition: hero.image.objectPosition ?? "center",
        }}
      />

      <div className="absolute inset-0 bg-black/26" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 via-black/22 to-transparent" />

      <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h))] items-end">
        <div className="w-full px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-18 2xl:px-10">
          <div className="lux-rise-in max-w-185">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/68">
              {hero.eyebrow}
            </p>

            <h1 className="mt-5 max-w-170 font-display text-[clamp(3.4rem,8vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.055em] text-white">
              {hero.title}
            </h1>

            <p className="mt-8 max-w-125 text-sm leading-8 text-white/72 sm:text-base">
              {hero.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HouseTextSections({ sections }: { sections: HouseTextSection[] }) {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-22 lg:px-8 lg:py-28 2xl:px-10">
        <div className="grid gap-px bg-black/10">
          {sections.map((section) => (
            <article
              key={section.id}
              className="grid gap-10 bg-white py-12 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:py-18"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
                  {section.eyebrow}
                </p>
              </div>

              <div className="max-w-190">
                {section.title ? (
                  <h2 className="max-w-165 font-display text-[clamp(2rem,4vw,4.7rem)] font-medium leading-none tracking-[-0.04em] text-black">
                    {section.title}
                  </h2>
                ) : null}

                <div className={cn("space-y-6", section.title && "mt-8")}>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="max-w-150 text-sm leading-8 text-black/60 sm:text-[0.96rem]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HouseClosing({ content }: TheHousePageProps) {
  const { closing } = content;

  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="grid min-h-[calc(92svh-var(--nav-h))] lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[62svh] bg-black/4.5 lg:min-h-[calc(92svh-var(--nav-h))]">
          <Image
            src={closing.image.src}
            alt={closing.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{
              objectPosition: closing.image.objectPosition ?? "center",
            }}
          />
        </div>

        <div className="flex items-end px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-18 2xl:px-12">
          <div className="max-w-150">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              {closing.eyebrow}
            </p>

            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-black">
              {closing.title}
            </h2>

            <p className="mt-8 max-w-130 text-sm leading-8 text-black/58 sm:text-base">
              {closing.body}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:w-fit sm:flex-row sm:items-center">
              <BrandButton href="/ready-to-wear" variant="primary">
                View Pieces
              </BrandButton>

              <Link
                href="/craft-legacy"
                className="inline-flex min-h-12 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-colors duration-300 ease-luxury hover:text-black/55"
              >
                Craft & Legacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}