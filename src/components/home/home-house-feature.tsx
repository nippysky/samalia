// src/components/home/home-house-feature.tsx
import type { CSSProperties } from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

export type HomeHouseFeatureMediaType = "image" | "video";

export type HomeHouseFeatureData = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  mediaType?: HomeHouseFeatureMediaType;
  mediaSrc: string;
  mediaAlt?: string;
  posterSrc?: string;
  imagePosition?: CSSProperties["objectPosition"];
};

type HomeHouseFeatureProps = {
  feature: HomeHouseFeatureData;
};

export function HomeHouseFeature({ feature }: HomeHouseFeatureProps) {
  const mediaType = feature.mediaType ?? "image";

  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="grid min-h-[calc(92svh-var(--nav-h))] lg:grid-cols-2">
        <div className="relative min-h-[58svh] overflow-hidden bg-black/5 lg:min-h-[calc(92svh-var(--nav-h))]">
          {mediaType === "video" ? (
            <video
              src={feature.mediaSrc}
              poster={feature.posterSrc}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              className="h-full w-full object-cover"
              style={{
                objectPosition: feature.imagePosition ?? "center",
              }}
            />
          ) : (
            <Image
              src={feature.mediaSrc}
              alt={feature.mediaAlt ?? feature.title}
              fill
              quality={94}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{
                objectPosition: feature.imagePosition ?? "center",
              }}
            />
          )}

          <div className="absolute inset-0 bg-black/4" />
        </div>

        <div className="flex items-center border-t border-black/10 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:border-l lg:border-t-0 lg:px-8 lg:py-24 2xl:px-10">
          <div className="mx-auto w-full max-w-150 lg:mx-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              {feature.eyebrow}
            </p>

            <h2 className="mt-6 max-w-135 font-display text-[clamp(2.45rem,5.5vw,6rem)] font-medium leading-[0.94] tracking-tight text-black">
              {feature.title}
            </h2>

            <p className="mt-7 max-w-120 text-sm leading-8 text-black/58 sm:text-base">
              {feature.description}
            </p>

            <div className="mt-9">
              <BrandButton
                href={feature.href}
                variant="text"
                size="md"
                iconAfter={<FiArrowRight className="size-4" />}
              >
                {feature.ctaLabel}
              </BrandButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}