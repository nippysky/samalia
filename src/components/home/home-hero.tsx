// src/components/home/home-hero.tsx
import type { CSSProperties } from "react";
import Image from "next/image";

import { BrandButton } from "@/src/components/ui/brand-button";
import { FiArrowRight } from "react-icons/fi";

export const HERO_IMAGE_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "center top",
  "center bottom",
  "center 35%",
  "65% center",
] as const;

export type HeroImagePosition =
  | (typeof HERO_IMAGE_POSITIONS)[number]
  | (string & {});

export type HomeHeroData = {
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: HeroImagePosition;
};

type HomeHeroProps = {
  hero?: HomeHeroData;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: HeroImagePosition;
  ctaLabel?: string;
  ctaHref?: string;
};

export function HomeHero({
  hero,
  imageSrc,
  imageAlt,
  imagePosition,
  ctaLabel = "Bespoke service",
  ctaHref = "/bespoke-services",
}: HomeHeroProps) {
  const resolvedImageSrc = hero?.imageSrc ?? imageSrc ?? "/images/home-hero.jpeg";

  const resolvedImageAlt =
    hero?.imageAlt ?? imageAlt ?? "Sam’Alia luxury fashion editorial hero image";

  const resolvedImagePosition =
    hero?.imagePosition ?? imagePosition ?? "center";

  const imageStyle: CSSProperties = {
    objectPosition: resolvedImagePosition,
  };

  return (
    <section className="relative min-h-[calc(100svh-var(--nav-h))] w-full overflow-hidden bg-black text-white">
      <Image
        src={resolvedImageSrc}
        alt={resolvedImageAlt}
        fill
        priority
        quality={95}
        sizes="100vw"
        className="object-cover"
        style={imageStyle}
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-t from-black/55 via-black/18 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 2xl:px-10">
        <div className="lux-rise-in">
      <BrandButton
  href={ctaHref}
  variant="text-inverse"
  size="md"
  iconAfter={<FiArrowRight className="size-4" />}
  className="drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]"
>
  {ctaLabel}
</BrandButton>
        </div>
      </div>
    </section>
  );
}