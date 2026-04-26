// src/components/shop/product-linear-grid.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ShopProduct } from "@/src/lib/shop/types";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ProductLinearGridProps = {
  products: ShopProduct[];
  getHref?: (product: ShopProduct) => string;
};

export function ProductLinearGrid({
  products,
  getHref = (product) => `/shop/${encodeURIComponent(product.slug)}`,
}: ProductLinearGridProps) {
  return (
    <section className="bg-white text-black">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 2xl:grid-cols-5">
        {products.map((product, index) => (
          <ProductLinearCard
            key={product.id}
            product={product}
            href={getHref(product)}
            priority={index < 8}
          />
        ))}
      </div>
    </section>
  );
}

function ProductLinearCard({
  product,
  href,
  priority,
}: {
  product: ShopProduct;
  href: string;
  priority: boolean;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const image = product.images[0];

  if (!image) return null;

  return (
    <Link
      href={href}
      aria-label={product.name}
      prefetch
      className="group block overflow-hidden bg-black/[0.035]"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-black/[0.035]">
        {!loaded ? (
          <div className="absolute inset-0 z-0 animate-pulse bg-linear-to-r from-black/[0.035] via-black/[0.07] to-black/[0.035]" />
        ) : null}

        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
          className={cn(
            "object-cover transition-[opacity,transform,filter] duration-700 ease-luxury group-hover:scale-[1.045] group-hover:brightness-[0.86]",
            loaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            objectPosition:
              image.imagePosition ?? ("center" as CSSProperties["objectPosition"]),
          }}
          onLoad={() => setLoaded(true)}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-luxury group-hover:bg-black/24" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 opacity-0 transition-[opacity,transform] duration-500 ease-luxury group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
            {product.name}
          </p>
        </div>
      </div>
    </Link>
  );
}