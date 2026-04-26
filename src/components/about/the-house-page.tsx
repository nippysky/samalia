// src/components/about/the-house-page.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import type { HouseContent, HouseImage } from "@/src/data/house-content";

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
      <HouseOrigin content={content} />
      <HouseManifesto content={content} />
      <HousePrinciples content={content} />
      <HouseTimeline content={content} />
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

      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/62 via-black/18 to-transparent" />

      <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h))] items-end">
        <div className="w-full px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16 2xl:px-10">
          <div className="lux-rise-in max-w-185">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/70">
              {hero.eyebrow}
            </p>

            <h1 className="mt-4 max-w-170 font-display text-[clamp(3.4rem,8vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.055em] text-white">
              {hero.title}
            </h1>

            <p className="mt-6 max-w-125 text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HouseOrigin({ content }: TheHousePageProps) {
  const { origin } = content;

  return (
    <section className="bg-white text-black">
      <div className="mx-auto grid w-full max-w-440 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-28 2xl:px-10">
        <div className="order-2 lg:order-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            {origin.eyebrow}
          </p>

          <h2 className="mt-5 max-w-165 font-display text-[clamp(2.15rem,4.6vw,5.1rem)] font-medium leading-[0.98] tracking-[-0.04em] text-black">
            {origin.title}
          </h2>

          <p className="mt-7 max-w-140 text-sm leading-8 text-black/58 sm:text-[0.96rem]">
            {origin.body}
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <EditorialImage
            image={origin.image}
            priority
            className="min-h-[58svh] lg:min-h-[76svh]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

function HouseManifesto({ content }: TheHousePageProps) {
  const { manifesto } = content;

  return (
    <section className="border-y border-black/10 bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-18 sm:px-6 sm:py-24 lg:px-8 lg:py-32 2xl:px-10">
        <div className="mx-auto max-w-245 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            House belief
          </p>

          <h2 className="mx-auto mt-6 max-w-215 font-display text-[clamp(2.25rem,5.2vw,6rem)] font-medium leading-[0.96] tracking-[-0.045em] text-black">
            {manifesto.title}
          </h2>

          <p className="mx-auto mt-8 max-w-150 text-sm leading-8 text-black/58 sm:text-base">
            {manifesto.body}
          </p>
        </div>
      </div>
    </section>
  );
}

function HousePrinciples({ content }: TheHousePageProps) {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 2xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              Principles
            </p>

            <h2 className="mt-5 max-w-120 font-display text-[clamp(2rem,3.8vw,4.2rem)] font-medium leading-none tracking-[-0.035em] text-black">
              The codes of the house.
            </h2>
          </div>

          <div className="grid gap-px bg-black/10">
            {content.principles.map((principle) => (
              <article
                key={principle.id}
                className="grid gap-5 bg-white py-8 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8 sm:py-10"
              >
                <h3 className="text-[0.76rem] font-medium uppercase tracking-[0.26em] text-black">
                  {principle.title}
                </h3>

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

function HouseTimeline({ content }: TheHousePageProps) {
  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 2xl:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              Evolution
            </p>

            <h2 className="mt-5 max-w-150 font-display text-[clamp(2rem,3.8vw,4.2rem)] font-medium leading-none tracking-[-0.035em] text-black">
              A living house, built in chapters.
            </h2>
          </div>

          <p className="max-w-115 text-sm leading-8 text-black/55">
            This structure is ready for production data later — each chapter can
            become a CMS-managed milestone without changing the page layout.
          </p>
        </div>

        <div className="grid gap-px bg-black/10 lg:grid-cols-4">
          {content.timeline.map((item) => (
            <article key={item.id} className="bg-white p-6 sm:p-8 lg:min-h-80">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">
                {item.label}
              </p>

              <h3 className="mt-12 text-[0.86rem] font-medium uppercase tracking-[0.24em] text-black">
                {item.title}
              </h3>

              <p className="mt-5 text-sm leading-8 text-black/56">
                {item.text}
              </p>
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

            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-black">
              {closing.title}
            </h2>

            <p className="mt-7 max-w-130 text-sm leading-8 text-black/58 sm:text-base">
              {closing.body}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:w-fit sm:flex-row">
              <BrandButton
                href="/ready-to-wear"
                variant="primary"
                iconAfter={<FiArrowRight className="size-4" />}
              >
                Ready to wear
              </BrandButton>

              <Link
                href="/craft-legacy"
                className="inline-flex min-h-12 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-colors duration-300 ease-luxury hover:text-black/55"
              >
                Craft & legacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialImage({
  image,
  priority = false,
  className,
  sizes,
}: {
  image: HouseImage;
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-black/4.5", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{
          objectPosition: image.objectPosition ?? "center",
        }}
      />
    </div>
  );
}