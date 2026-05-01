// src/components/home/home-feature-links.tsx
import Image from "next/image";
import Link from "next/link";

export type HomeFeatureLink = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
};

type HomeFeatureLinksProps = {
  items: HomeFeatureLink[];
};

export function HomeFeatureLinks({ items }: HomeFeatureLinksProps) {
  return (
    <section className="bg-white text-black">
      <div className="w-full px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 2xl:px-10">
        <div className="mx-auto grid w-full max-w-390 grid-cols-1 gap-16 sm:grid-cols-3 sm:gap-7 lg:gap-10 xl:gap-14">
          {items.map((item, index) => (
            <FeatureLinkCard key={item.href} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureLinkCard({
  item,
  index,
}: {
  item: HomeFeatureLink;
  index: number;
}) {
  return (
    <article
      className="lux-rise-in group min-w-0"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link
        href={item.href}
        aria-label={item.title}
        className="block w-full"
      >
        <div className="relative mx-auto aspect-square w-full max-w-107.5 overflow-hidden bg-black/2.5 p-[clamp(2.25rem,4.6vw,4.25rem)] transition-[background-color,transform] duration-500 ease-luxury group-hover:-translate-y-1 group-hover:bg-black/4.5 sm:max-w-none">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-black/[0.035]">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              loading="eager"
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 29vw, 380px"
              className="object-cover transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.035] group-hover:brightness-[0.92]"
              style={{
                objectPosition: item.imagePosition ?? "center",
              }}
            />

            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/8" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="relative inline-flex pb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-black transition-opacity duration-300 ease-luxury group-hover:opacity-60">
            {item.title}
            <span className="absolute bottom-0 left-1/2 h-px w-6 -translate-x-1/2 bg-black/28 transition-[width,opacity] duration-500 ease-luxury group-hover:w-12 group-hover:opacity-60" />
          </span>
        </div>
      </Link>
    </article>
  );
}