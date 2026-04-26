// src/components/lookbook/lookbook-visual-gallery.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiX,
} from "react-icons/fi";

import type {
  LookbookEntry,
  LookbookMedia,
} from "@/src/data/lookbook-content";

type LookbookVisualGalleryProps = {
  entry: LookbookEntry;
};

type LookbookVisual = LookbookMedia & {
  label: string;
  displayNumber: string;
};

type ImageLoadState = {
  src: string;
  loaded: boolean;
};

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_COUNT = 8;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLookbookVisuals(entry: LookbookEntry): LookbookVisual[] {
  const lookVisuals: LookbookVisual[] = entry.looks.map((look, index) => ({
    ...look.image,
    label: look.lookNumber,
    displayNumber: String(index + 1).padStart(2, "0"),
  }));

  const galleryVisuals: LookbookVisual[] = entry.gallery.map((media, index) => {
    const absoluteIndex = entry.looks.length + index;

    return {
      ...media,
      label: `Gallery ${String(index + 1).padStart(2, "0")}`,
      displayNumber: String(absoluteIndex + 1).padStart(2, "0"),
    };
  });

  return [...lookVisuals, ...galleryVisuals];
}

export function LookbookVisualGallery({ entry }: LookbookVisualGalleryProps) {
  const visuals = React.useMemo(() => getLookbookVisuals(entry), [entry]);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT);

  const safeVisibleCount = Math.min(visibleCount, visuals.length);
  const visibleVisuals = visuals.slice(0, safeVisibleCount);
  const hasMore = safeVisibleCount < visuals.length;

  const openLightbox = React.useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showMore = React.useCallback(() => {
    setVisibleCount((current) =>
      Math.min(current + LOAD_MORE_COUNT, visuals.length)
    );
  }, [visuals.length]);

  if (visuals.length === 0) {
    return null;
  }

  return (
    <>
      <section className="border-t border-black/10 bg-white text-black">
        <div className="mx-auto w-full max-w-440 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-black/10 pb-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
                Looks
              </p>

              <h2 className="mt-3 text-[1rem] font-medium uppercase tracking-[0.18em] text-black">
                Collection studies
              </h2>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-12 xl:gap-y-16">
            {visibleVisuals.map((visual, index) => (
              <LookbookVisualCard
                key={visual.id}
                media={visual}
                priority={index < 8}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-16 flex justify-center">
              <button
                type="button"
                onClick={showMore}
                className="group relative inline-flex items-center justify-center text-sm text-black"
              >
                <span className="relative">
                  Discover more
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-black transition-transform duration-300 ease-luxury group-hover:scale-x-0" />
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <LookbookLightbox
              visuals={visuals}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              onClose={closeLightbox}
            />,
            document.body
          )
        : null}
    </>
  );
}

function LookbookVisualCard({
  media,
  priority,
  onClick,
}: {
  media: LookbookVisual;
  priority: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Open ${media.alt}`}
      onClick={onClick}
      className="group block w-full text-left"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-black/5">
        {media.kind === "video" ? (
          <video
            src={media.src}
            poster={media.posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.035] group-hover:brightness-[0.9]"
            style={{
              objectPosition: media.objectPosition ?? "center",
            }}
          />
        ) : (
          <ThumbnailImage
            src={media.src}
            alt={media.alt}
            priority={priority}
            objectPosition={media.objectPosition ?? "center"}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/14" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 opacity-0 transition-[opacity,transform] duration-500 ease-luxury group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white">
            View
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-none text-black/70">
        {media.displayNumber}
      </p>
    </button>
  );
}

function ThumbnailImage({
  src,
  alt,
  priority,
  objectPosition,
}: {
  src: string;
  alt: string;
  priority: boolean;
  objectPosition: React.CSSProperties["objectPosition"];
}) {
  const [loadState, setLoadState] = React.useState<ImageLoadState>({
    src,
    loaded: false,
  });

  const loaded = loadState.src === src && loadState.loaded;

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-black/5 transition-opacity duration-500 ease-luxury",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="absolute inset-y-0 left-0 w-1/3 animate-pulse bg-black/5" />
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.035] group-hover:brightness-[0.9]"
        style={{
          objectPosition,
        }}
        onLoad={() => setLoadState({ src, loaded: true })}
      />
    </>
  );
}

function LookbookLightbox({
  visuals,
  activeIndex,
  onChange,
  onClose,
}: {
  visuals: LookbookVisual[];
  activeIndex: number | null;
  onChange: (index: number | null) => void;
  onClose: () => void;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const touchStartXRef = React.useRef<number | null>(null);

  const active = activeIndex !== null ? visuals[activeIndex] : null;
  const hasMultiple = visuals.length > 1;

  const goPrevious = React.useCallback(() => {
    if (activeIndex === null || visuals.length === 0) return;

    onChange((activeIndex - 1 + visuals.length) % visuals.length);
  }, [activeIndex, onChange, visuals.length]);

  const goNext = React.useCallback(() => {
    if (activeIndex === null || visuals.length === 0) return;

    onChange((activeIndex + 1) % visuals.length);
  }, [activeIndex, onChange, visuals.length]);

  React.useEffect(() => {
    if (activeIndex === null) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, goNext, goPrevious, onClose]);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;

    touchStartXRef.current = null;

    if (startX === null || endX === null) return;

    const diff = endX - startX;

    if (Math.abs(diff) < 46) return;

    if (diff < 0) {
      goNext();
    } else {
      goPrevious();
    }
  }

  return (
    <AnimatePresence>
      {active && activeIndex !== null ? (
        <motion.div
          key="lookbook-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Lookbook media viewer"
          className="fixed inset-0 bg-white text-black"
          style={{ zIndex: 9999 }}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <button
            type="button"
            aria-label="Close viewer"
            onClick={onClose}
            className="absolute right-4 top-4 z-30 flex size-10 items-center justify-center text-black transition-opacity duration-300 ease-luxury hover:opacity-55 sm:right-7 sm:top-7 sm:size-11"
          >
            <FiX className="size-5" />
          </button>

          <div
            className="flex h-dvh w-full items-center justify-center px-14 py-20 sm:px-20 lg:px-28"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="flex h-full w-full items-center justify-center"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.26,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {active.kind === "video" ? (
                  <CenteredVideo media={active} />
                ) : (
                  <CenteredImage media={active} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-sm text-black/70">
            {active.displayNumber}
          </div>

          {hasMultiple ? (
            <>
              <ViewerArrow
                label="Previous image"
                direction="left"
                onClick={goPrevious}
              />

              <ViewerArrow
                label="Next image"
                direction="right"
                onClick={goNext}
              />
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ViewerArrow({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center text-black transition-opacity duration-300 ease-luxury hover:opacity-55 sm:size-11",
        direction === "left" ? "left-4 sm:left-7" : "right-4 sm:right-7"
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

function CenteredImage({ media }: { media: LookbookVisual }) {
  const [loadState, setLoadState] = React.useState<ImageLoadState>({
    src: media.src,
    loaded: false,
  });

  const loaded = loadState.src === media.src && loadState.loaded;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1/2 h-px w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/10 transition-opacity duration-300 ease-luxury",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="h-full w-1/2 animate-pulse bg-black/40" />
      </div>

      <img
        src={media.src}
        alt={media.alt}
        className={cn(
          "block max-h-full max-w-full object-contain transition-opacity duration-300 ease-luxury",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoadState({ src: media.src, loaded: true })}
      />
    </div>
  );
}

function CenteredVideo({ media }: { media: LookbookVisual }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = React.useState(true);

  React.useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    if (playing) {
      void node.play().catch(() => undefined);
    } else {
      node.pause();
    }
  }, [playing]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <video
        ref={videoRef}
        src={media.src}
        poster={media.posterSrc}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="block max-h-full max-w-full object-contain"
      />

      <button
        type="button"
        aria-label={playing ? "Pause video" : "Play video"}
        onClick={() => setPlaying((current) => !current)}
        className="absolute bottom-10 left-1/2 z-20 flex size-10 -translate-x-1/2 items-center justify-center border border-black/15 bg-white text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
      >
        {playing ? <FiPause className="size-4" /> : <FiPlay className="size-4" />}
      </button>
    </div>
  );
}