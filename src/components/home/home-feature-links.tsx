// src/components/home/home-feature-links.tsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

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
        <div className="mx-auto grid w-full max-w-390 grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-6 lg:gap-10 xl:gap-14">
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
      className="lux-rise-in group flex min-w-0 flex-col items-center"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link href={item.href} aria-label={item.title} className="block w-full">
        <div className="relative mx-auto flex aspect-square w-full max-w-107.5 items-center justify-center border border-black/10 bg-white p-[clamp(2.25rem,4.6vw,4.25rem)] transition-[border-color,transform] duration-500 ease-luxury group-hover:border-black sm:max-w-none">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-black/3">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              loading="eager"
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 29vw, 380px"
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.035]"
              style={{
                objectPosition: item.imagePosition ?? "center",
              }}
            />
          </div>
        </div>
      </Link>

      <div className="mt-7 flex justify-center">
        <BrandButton
          href={item.href}
          variant="text"
          size="sm"
          iconAfter={<FiArrowRight className="size-3.5" />}
        >
          {item.title}
        </BrandButton>
      </div>
    </article>
  );
}