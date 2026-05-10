"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { ShopProduct, ShopProductImage } from "@/src/lib/shop/types";

type ProductMasonryAspect =
  | "portrait"
  | "tall"
  | "editorial"
  | "slender"
  | "softPortrait";

export type ProductMasonryTile = ShopProductImage & {
  tileId: string;
  productId: string;
  productSlug: string;
  productName: string;
  categorySlug: string;
  aspect: ProductMasonryAspect;
};

type ProductMasonryPage = {
  tiles: ProductMasonryTile[];
  nextPage: number | null;
};

type ProductMasonryGridProps = {
  products: ShopProduct[];
  queryKey: string;
  initialPages?: number;
  pageSize?: number;
  maxPages?: number;
  loadMode?: "manual" | "infinite";
  getHref?: (tile: ProductMasonryTile) => string;
};

const aspectClasses: Record<ProductMasonryAspect, string> = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  editorial: "aspect-[4/5]",
  slender: "aspect-[5/7]",
  softPortrait: "aspect-[5/6]",
};

const aspectCycle: ProductMasonryAspect[] = [
  "portrait",
  "tall",
  "editorial",
  "softPortrait",
  "slender",
  "portrait",
  "editorial",
  "tall",
  "softPortrait",
  "slender",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function flattenProductImages(products: ShopProduct[]) {
  return products.flatMap((product) =>
    product.images.map((image) => ({
      ...image,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      categorySlug: product.categorySlug,
    }))
  );
}

function createMasonryPage({
  products,
  page,
  pageSize,
  maxPages,
}: {
  products: ShopProduct[];
  page: number;
  pageSize: number;
  maxPages: number;
}): ProductMasonryPage {
  const images = flattenProductImages(products);
  const maxItems = Math.min(images.length, pageSize * maxPages);

  if (images.length === 0 || maxItems === 0) {
    return {
      tiles: [],
      nextPage: null,
    };
  }

  const start = page * pageSize;
  const end = Math.min(start + pageSize, maxItems);
  const pageImages = images.slice(start, end);

  const tiles = pageImages.map((image, index) => {
    const absoluteIndex = start + index;

    return {
      ...image,
      tileId: `${image.productId}-${image.id}-tile-${absoluteIndex}`,
      aspect: aspectCycle[absoluteIndex % aspectCycle.length],
    };
  });

  return {
    tiles,
    nextPage: end < maxItems ? page + 1 : null,
  };
}

function useInfiniteSentinel({
  enabled,
  onIntersect,
}: {
  enabled: boolean;
  onIntersect: () => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onIntersect();
      },
      {
        root: null,
        rootMargin: "700px 0px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return ref;
}

function MasonryLoadingIndicator() {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-black/20" />
        <span className="relative size-2 bg-black">
          <span className="absolute inset-0 animate-ping bg-black/30" />
        </span>
        <span className="h-px w-12 bg-black/20" />
      </div>
    </div>
  );
}

function MasonrySkeleton() {
  return (
    <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 lg:gap-4 2xl:columns-5">
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className={cn(
            "mb-2 break-inside-avoid bg-black/4.5 sm:mb-3 lg:mb-4",
            index % 3 === 0
              ? "aspect-2/3"
              : index % 3 === 1
                ? "aspect-4/5"
                : "aspect-3/4"
          )}
        >
          <div className="h-full w-full animate-pulse bg-linear-to-r from-black/[0.035] via-black/[0.07] to-black/[0.035]" />
        </div>
      ))}
    </div>
  );
}

export function ProductMasonryGrid({
  products,
  queryKey,
  initialPages = 1,
  pageSize = 10,
  maxPages = 3,
  loadMode = "manual",
  getHref = (tile) => `/shop/${encodeURIComponent(tile.productSlug)}`,
}: ProductMasonryGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "product-masonry",
        queryKey,
        pageSize,
        maxPages,
        products.map((product) => product.id).join(","),
      ],
      initialPageParam: 0,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      queryFn: async ({ pageParam }) => {
        const page = typeof pageParam === "number" ? pageParam : 0;

        return createMasonryPage({
          products,
          page,
          pageSize,
          maxPages,
        });
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  React.useEffect(() => {
    if (!data) return;
    if (!hasNextPage) return;
    if (data.pages.length >= initialPages) return;
    if (isFetchingNextPage) return;

    fetchNextPage();
  }, [data, fetchNextPage, hasNextPage, initialPages, isFetchingNextPage]);

  const handleIntersect = React.useCallback(() => {
    if (loadMode !== "infinite") return;
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, loadMode]);

  const sentinelRef = useInfiniteSentinel({
    enabled: loadMode === "infinite" && Boolean(hasNextPage),
    onIntersect: handleIntersect,
  });

  const tiles = data?.pages.flatMap((page) => page.tiles) ?? [];

  return (
    <section className="bg-white text-black">
      <div className="w-full px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 2xl:px-5">
        {isLoading && tiles.length === 0 ? (
          <MasonrySkeleton />
        ) : (
          <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 lg:gap-4 2xl:columns-5">
            {tiles.map((tile, index) => (
              <ProductMasonryCard
                key={tile.tileId}
                tile={tile}
                href={getHref(tile)}
                priority={index < 8}
              />
            ))}
          </div>
        )}

        {isFetchingNextPage ? <MasonryLoadingIndicator /> : null}

        {loadMode === "manual" && hasNextPage ? (
          <div className="flex justify-center px-4 py-12">
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className="inline-flex h-12 items-center justify-center border border-black bg-white px-7 text-[11px] font-medium uppercase tracking-[0.22em] text-black transition-colors duration-300 ease-luxury hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-45"
            >
              {isFetchingNextPage ? "Loading" : "Load more"}
            </button>
          </div>
        ) : null}

        {loadMode === "infinite" ? (
          <div ref={sentinelRef} className="h-1 w-full" />
        ) : null}
      </div>
    </section>
  );
}

function ProductMasonryCard({
  tile,
  href,
  priority,
}: {
  tile: ProductMasonryTile;
  href: string;
  priority: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={tile.productName}
      prefetch
      className="group mb-2 block break-inside-avoid overflow-hidden bg-black/[0.035] sm:mb-3 lg:mb-4"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black/[0.035]",
          aspectClasses[tile.aspect]
        )}
      >
        <ProductMasonryImage
          key={`${tile.tileId}-${tile.src}`}
          tile={tile}
          priority={priority}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/24" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 opacity-0 transition-[opacity,transform] duration-500 ease-luxury group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
            {tile.productName}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ProductMasonryImage({
  tile,
  priority,
}: {
  tile: ProductMasonryTile;
  priority: boolean;
}) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      {!loaded ? (
        <div className="absolute inset-0 z-0 animate-pulse bg-linear-to-r from-black/[0.035] via-black/[0.07] to-black/[0.035]" />
      ) : null}

      <Image
        src={tile.src}
        alt={tile.alt}
        loading={priority ? "eager" : "lazy"}
        fill
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
        className={cn(
          "object-cover transition-[opacity,transform,filter] duration-700 ease-luxury group-hover:scale-[1.045] group-hover:brightness-[0.86]",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          objectPosition:
            tile.imagePosition ?? ("center" as CSSProperties["objectPosition"]),
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}