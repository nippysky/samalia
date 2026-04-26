// src/components/journal/journal-hero-media.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  FiPause,
  FiPlay,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

import type { JournalArticle } from "@/src/data/journal-content";

type JournalHeroMediaProps = {
  article: JournalArticle;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function JournalHeroMedia({ article }: JournalHeroMediaProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [isMuted, setIsMuted] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(Boolean(article.heroVideo));

  const video = article.heroVideo;

  React.useEffect(() => {
    const node = videoRef.current;
    if (!node || !video) return;

    node.muted = isMuted;

    if (isPlaying) {
      node.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      node.pause();
    }
  }, [isMuted, isPlaying, video]);

  if (!video) {
    return (
      <section className="relative min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-black">
        <Image
          src={article.heroImage.src}
          alt={article.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: article.heroImage.objectPosition ?? "center",
          }}
        />
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={video.src}
        poster={video.posterSrc ?? article.heroImage.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.alt}
        style={{
          objectPosition: video.objectPosition ?? "center",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 lg:p-8 2xl:p-10">
        <div className="flex items-center gap-2">
          <MediaButton
            label={isPlaying ? "Pause video" : "Play video"}
            onClick={() => setIsPlaying((current) => !current)}
          >
            {isPlaying ? <FiPause className="size-4" /> : <FiPlay className="size-4" />}
          </MediaButton>

          <MediaButton
            label={isMuted ? "Unmute video" : "Mute video"}
            onClick={() => setIsMuted((current) => !current)}
          >
            {isMuted ? (
              <FiVolumeX className="size-4" />
            ) : (
              <FiVolume2 className="size-4" />
            )}
          </MediaButton>
        </div>

        <p className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-white/70 sm:block">
          {isPlaying ? "Playing" : "Paused"} / {isMuted ? "Muted" : "Sound on"}
        </p>
      </div>
    </section>
  );
}

function MediaButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center border border-white/20 bg-black/25 text-white backdrop-blur-md",
        "transition-colors duration-300 ease-luxury hover:border-white hover:bg-white hover:text-black"
      )}
    >
      {children}
    </button>
  );
}