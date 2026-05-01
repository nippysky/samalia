// src/components/craft/craft-legacy-page.tsx
import Image from "next/image";
import Link from "next/link";

import type {
  CraftLegacyContent,
  CraftLegacyEditorialMedia,
} from "@/src/data/craft-legacy-content";
import { BrandButton } from "@/src/components/ui/brand-button";

type CraftLegacyPageProps = {
  content: CraftLegacyContent;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CraftLegacyPage({ content }: CraftLegacyPageProps) {
  return (
    <main className="lux-page bg-white text-black">
      <CraftLegacyHero content={content} />

      <CraftLegacyStatement content={content} />

      <CraftLegacyEditorialGrid media={content.editorialMedia} />

      <CraftLegacyPrinciples content={content} />

      <CraftLegacyClosing />
    </main>
  );
}

function CraftLegacyHero({ content }: CraftLegacyPageProps) {
  const { hero } = content;

  return (
    <section className="relative min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={hero.videoSrc}
        poster={hero.posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={hero.title}
      />
    </section>
  );
}

function CraftLegacyStatement({ content }: CraftLegacyPageProps) {
  const { statement } = content;
  const paragraphs = statement.body.split("\n\n");

  return (
    <section className="bg-white text-black">
      <div className="mx-auto grid w-full max-w-440 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-24 2xl:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            {statement.eyebrow}
          </p>
        </div>

        <div className="max-w-175">
          <h1 className="font-display text-[clamp(2.45rem,4.8vw,5.6rem)] font-medium leading-[0.96] tracking-[-0.045em] text-black">
            {statement.title}
          </h1>

          <p className="mt-8 max-w-145 font-display text-[clamp(1.65rem,2.8vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.035em] text-black">
            {statement.largeStatement}
          </p>

          <div className="mt-10 space-y-6">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-145 text-sm leading-8 text-black/58 sm:text-[0.96rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CraftLegacyEditorialGrid({
  media,
}: {
  media: CraftLegacyEditorialMedia[];
}) {
  if (media.length === 0) return null;

  return (
    <section className="bg-white text-black">
      <div className="grid w-full grid-cols-1 gap-px bg-white md:grid-cols-2">
        {media.map((item, index) => {
          const isFullWidth = index === 0;

          return (
            <CraftLegacyMediaBlock
              key={item.id}
              media={item}
              priority={index === 0}
              fullWidth={isFullWidth}
              className={cn(
                "min-h-[58svh]",
                isFullWidth && "md:col-span-2 md:min-h-[88svh]",
                !isFullWidth && "md:min-h-[74svh]"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}

function CraftLegacyMediaBlock({
  media,
  priority,
  fullWidth,
  className,
}: {
  media: CraftLegacyEditorialMedia;
  priority: boolean;
  fullWidth: boolean;
  className?: string;
}) {
  const imageSizes = fullWidth
    ? "100vw"
    : "(max-width: 767px) 100vw, 50vw";

  return (
    <div className={cn("relative overflow-hidden bg-black/4.5", className)}>
      {media.kind === "video" ? (
        <video
          src={media.src}
          poster={media.posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
          className="h-full w-full object-cover"
          style={{
            objectPosition: media.objectPosition ?? "center",
          }}
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={imageSizes}
          className="object-cover"
          style={{
            objectPosition: media.objectPosition ?? "center",
          }}
        />
      )}
    </div>
  );
}

function CraftLegacyPrinciples({ content }: CraftLegacyPageProps) {
  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              House Approach
            </p>
          </div>

          <div className="grid gap-px bg-black/10">
            {content.principles.map((principle) => (
              <article
                key={principle.id}
                className="grid gap-6 bg-white py-9 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-10 sm:py-11"
              >
                <h2 className="text-[0.76rem] font-medium uppercase tracking-[0.26em] text-black">
                  {principle.title}
                </h2>

                <p className="max-w-145 text-sm leading-8 text-black/58">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CraftLegacyClosing() {
  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto grid w-full max-w-440 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16 2xl:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            Continue
          </p>
        </div>

        <div className="max-w-180">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,4rem)] font-medium leading-none tracking-[-0.035em] text-black">
            Explore garments developed through craft.
          </h2>

          <div className="mt-10 flex flex-col gap-4 sm:w-fit sm:flex-row sm:items-center">
            <BrandButton href="/ready-to-wear" variant="primary">
              Ready to Wear
            </BrandButton>

            <Link
              href="/ceremonial-ready-to-wear"
              className="inline-flex min-h-12 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-colors duration-300 ease-luxury hover:text-black/55"
            >
              Ceremonial Ready to Wear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}