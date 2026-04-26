// src/components/home/home-hero.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

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

export type HomeHeroSlide = {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: HeroImagePosition;
  ctaLabel: string;
  ctaHref: string;
};

export type HomeHeroData = {
  slides: HomeHeroSlide[];
  intervalMs?: number;
};

type HomeHeroProps = {
  hero: HomeHeroData;
};

const DEFAULT_INTERVAL_MS = 14_000;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HomeHero({ hero }: HomeHeroProps) {
  const reducedMotion = Boolean(useReducedMotion());

  const slides = hero.slides.length > 0 ? hero.slides : fallbackSlides;
  const intervalMs = hero.intervalMs ?? DEFAULT_INTERVAL_MS;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const activeSlide = slides[activeIndex] ?? slides[0];
  const hasMultipleSlides = slides.length > 1;

  const goToSlide = React.useCallback(
    (index: number) => {
      setActiveIndex(index % slides.length);
    },
    [slides.length]
  );

  React.useEffect(() => {
    if (!hasMultipleSlides) return;
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, intervalMs, paused, slides.length]);

  return (
    <section
      className="relative min-h-[calc(100svh-var(--nav-h))] w-full overflow-hidden bg-black text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide.id}
          className="absolute inset-0"
          initial={reducedMotion ? false : { opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
          transition={{
            duration: reducedMotion ? 0.18 : 1.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src={activeSlide.imageSrc}
            alt={
              activeSlide.imageAlt ??
              "Sam’Alia luxury fashion editorial hero image"
            }
            fill
            priority={activeIndex === 0}
            quality={95}
            sizes="100vw"
            className="object-cover"
            style={
              {
                objectPosition: activeSlide.imagePosition ?? "center",
              } satisfies CSSProperties
            }
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-t from-black/55 via-black/18 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 2xl:px-10">
        <div className="flex items-end justify-between gap-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeSlide.id}-cta`}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{
                duration: 0.46,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-0"
            >
              <BrandButton
                href={activeSlide.ctaHref}
                variant="text-inverse"
                size="md"
                iconAfter={<FiArrowRight className="size-4" />}
                className="drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]"
              >
                {activeSlide.ctaLabel}
              </BrandButton>
            </motion.div>
          </AnimatePresence>

          {hasMultipleSlides ? (
            <div
              className="flex max-w-[42vw] shrink-0 items-center justify-end gap-2 overflow-hidden sm:max-w-none"
              aria-label="Hero slides"
            >
              {slides.map((slide, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Show hero slide ${index + 1}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => goToSlide(index)}
                    className="group flex size-4 shrink-0 items-center justify-center sm:size-5"
                  >
                    <span
                      className={cn(
                        "relative block rounded-full transition-[width,height,background-color,opacity,transform] duration-300 ease-luxury",
                        active
                          ? "size-2.5 bg-white opacity-100"
                          : "size-1.5 bg-white/55 opacity-75 group-hover:bg-white group-hover:opacity-100"
                      )}
                    >
                      {active ? (
                        <motion.span
                          key={`${slide.id}-${activeIndex}`}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-white/80"
                          initial={
                            reducedMotion
                              ? false
                              : { scale: 1, opacity: 0.9 }
                          }
                          animate={
                            paused || reducedMotion
                              ? { scale: 1, opacity: 0.9 }
                              : { scale: 2.1, opacity: 0 }
                          }
                          transition={{
                            duration: paused || reducedMotion ? 0 : 1.25,
                            repeat: paused || reducedMotion ? 0 : Infinity,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const fallbackSlides: HomeHeroSlide[] = [
  {
    id: "fallback-home",
    imageSrc: "/images/home-hero.jpeg",
    imageAlt: "Sam’Alia luxury fashion editorial",
    imagePosition: "center",
    ctaLabel: "Lookbook",
    ctaHref: "/lookbook",
  },
];