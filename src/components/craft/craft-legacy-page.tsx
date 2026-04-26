// src/components/craft/craft-legacy-page.tsx
import Image from "next/image";

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

  return (
    <section className="bg-white text-black">
      <div className="mx-auto grid w-full max-w-440 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-24 2xl:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            {statement.eyebrow}
          </p>
        </div>

        <div className="max-w-170">
          <h1 className="font-display text-[clamp(2rem,4vw,4.7rem)] font-medium leading-none tracking-[-0.035em] text-black">
            {statement.title}
          </h1>

          <p className="mt-7 max-w-145 text-sm leading-8 text-black/58 sm:text-[0.96rem]">
            {statement.body}
          </p>
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
              Principles
            </p>
          </div>

          <div className="grid gap-px bg-black/10">
            {content.principles.map((principle) => (
              <article
                key={principle.id}
                className="grid gap-5 bg-white py-8 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8 sm:py-10"
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
      <div className="mx-auto flex w-full max-w-440 flex-col items-start justify-between gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-16 2xl:px-10">
        <div className="max-w-160">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            Continue
          </p>

          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,4rem)] font-medium leading-none tracking-[-0.035em] text-black">
            Discover the pieces shaped by the hand.
          </h2>
        </div>

        <BrandButton href="/ready-to-wear" variant="primary">
          Ready to wear
        </BrandButton>
      </div>
    </section>
  );
}