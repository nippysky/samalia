// src/components/shop/product-details-client.tsx
"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { SizeGuideModal } from "@/src/components/shared/size-guide-modal";
import type { ShopProduct } from "@/src/lib/shop/types";
import { useCartStore } from "@/src/stores/cart-store";
import { useBrandToastStore } from "@/src/stores/brand-toast-store";

type ProductDetailsClientProps = {
  product: ShopProduct;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const pushToast = useBrandToastStore((state) => state.pushToast);

  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const [activeMobileImage, setActiveMobileImage] = React.useState(0);

  const mobileScrollerRef = React.useRef<HTMLDivElement | null>(null);

  const availableSizes = product.availableSizes ?? product.sizes;
  const firstColor = product.colors[0] ?? "Default";

  function handleMobileScroll() {
    const node = mobileScrollerRef.current;
    if (!node) return;

    const nextIndex = Math.round(node.scrollLeft / node.clientWidth);
    setActiveMobileImage(nextIndex);
  }

  function handleAddToCart() {
    if (!product.available) {
      pushToast({
        variant: "error",
        title: "Sold out",
        message: "This piece is currently unavailable.",
      });
      return;
    }

    if (!selectedSize) {
      pushToast({
        variant: "info",
        title: "Select size",
        message: "Choose a size before adding this piece to your cart.",
      });
      return;
    }

    const primaryImage = product.images[0] ?? null;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      categorySlug: product.categorySlug,
      productType: product.productType,
      image: primaryImage
        ? {
            src: primaryImage.src,
            alt: primaryImage.alt,
          }
        : null,
      color: firstColor,
      size: selectedSize,
      price: product.price,
      quantity: 1,
    });

    pushToast({
      variant: "success",
      title: "Added to cart",
      message: `${product.name} / ${selectedSize} has been added.`,
    });
  }

  const canAddToBag = product.available;

  return (
    <>
      <main className="bg-white text-black">
        <div className="lg:hidden">
          <MobileProductGallery
            product={product}
            activeImage={activeMobileImage}
            scrollerRef={mobileScrollerRef}
            onScroll={handleMobileScroll}
          />

          <div className="px-4 pb-14 pt-8 sm:px-6">
            <ProductInfoPanel
              product={product}
              selectedSize={selectedSize}
              selectedColor={firstColor}
              availableSizes={availableSizes}
              canAddToBag={canAddToBag}
              onSelectSize={setSelectedSize}
              onOpenSizeGuide={() => setSizeGuideOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <DesktopProductGallery product={product} />

          <section className="border-t border-black/10 bg-white px-8 py-20 text-black 2xl:px-10 2xl:py-24">
            <div className="mx-auto w-full max-w-170">
              <div className="mb-10 flex justify-center">
                <Link
                  href="/ready-to-wear"
                  className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45 transition-colors duration-300 ease-luxury hover:text-black"
                >
                  <FiArrowLeft className="size-3.5" />
                  Ready to wear
                </Link>
              </div>

              <ProductInfoPanel
                product={product}
                selectedSize={selectedSize}
                selectedColor={firstColor}
                availableSizes={availableSizes}
                canAddToBag={canAddToBag}
                onSelectSize={setSelectedSize}
                onOpenSizeGuide={() => setSizeGuideOpen(true)}
                onAddToCart={handleAddToCart}
              />
            </div>
          </section>
        </div>
      </main>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </>
  );
}

function DesktopProductGallery({ product }: { product: ShopProduct }) {
  return (
    <section className="bg-white">
      <div className="grid w-full grid-cols-2 gap-px bg-white">
        {product.images.map((image, index) => (
          <ProductImageBlock
            key={image.id}
            image={image}
            priority={index < 2}
            className="aspect-4/5 min-h-[calc(100svh-var(--nav-h))]"
          />
        ))}
      </div>
    </section>
  );
}

function MobileProductGallery({
  product,
  activeImage,
  scrollerRef,
  onScroll,
}: {
  product: ShopProduct;
  activeImage: number;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}) {
  return (
    <section className="relative border-b border-black/10 bg-white">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {product.images.map((image, index) => (
          <div key={image.id} className="relative min-w-full snap-start">
            <ProductImageBlock
              image={image}
              priority={index === 0}
              className="aspect-4/5 min-h-[62svh]"
            />
          </div>
        ))}
      </div>

      {product.images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {product.images.map((image, index) => (
            <span
              key={image.id}
              className={cn(
                "h-1.5 transition-all duration-300 ease-luxury",
                activeImage === index ? "w-6 bg-white" : "w-1.5 bg-white/45"
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ProductImageBlock({
  image,
  priority,
  className,
}: {
  image: ShopProduct["images"][number];
  priority: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-black/4.5", className)}>
      {!loaded ? (
        <div className="absolute inset-0 z-0 animate-pulse bg-linear-to-r from-black/[0.035] via-black/[0.07] to-black/[0.035]" />
      ) : null}

      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={cn(
          "object-cover transition-[opacity,transform] duration-700 ease-luxury",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          objectPosition:
            image.imagePosition ?? ("center" as CSSProperties["objectPosition"]),
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function ProductInfoPanel({
  product,
  selectedSize,
  selectedColor,
  availableSizes,
  canAddToBag,
  onSelectSize,
  onOpenSizeGuide,
  onAddToCart,
}: {
  product: ShopProduct;
  selectedSize: string | null;
  selectedColor: string;
  availableSizes: string[];
  canAddToBag: boolean;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div>
      <div className="border-b border-black/10 pb-8 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/45">
          {product.productionCategory}
        </p>

        <h1 className="mx-auto mt-4 max-w-130 text-[1.65rem] font-medium leading-tight tracking-[-0.035em] text-black">
          {product.name}
        </h1>

        <p className="mx-auto mt-4 max-w-130 text-sm leading-7 text-black/58">
          {product.description}
        </p>

        <p className="mt-7 text-sm text-black">{product.price.display}</p>
      </div>

      <div className="border-b border-black/10 py-7">
        <div className="flex items-center justify-between gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black">
            Color
          </p>
          <p className="text-sm text-black/58">{selectedColor}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <span
              key={color}
              className="inline-flex h-10 items-center border border-black/10 px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-black"
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      <div className="border-b border-black/10 py-7">
        <div className="flex items-center justify-between gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black">
            Size
          </p>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/55 underline underline-offset-4 transition-colors duration-300 ease-luxury hover:text-black"
          >
            Size guide
          </button>
        </div>

        <p className="mt-3 text-sm text-black/50">
          {selectedSize ? `Selected: ${selectedSize}` : "Please select a size"}
        </p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {product.sizes.map((size) => {
            const available = availableSizes.includes(size);
            const active = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                disabled={!available}
                onClick={() => onSelectSize(size)}
                className={cn(
                  "flex h-11 items-center justify-center border text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ease-luxury",
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black hover:border-black",
                  !available &&
                    "cursor-not-allowed text-black/25 line-through hover:border-black/10"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="py-7">
        <BrandButton
          type="button"
          fullWidth
          size="lg"
          variant={canAddToBag ? "primary" : "secondary"}
          disabled={!canAddToBag}
          onClick={onAddToCart}
        >
          {product.available
            ? selectedSize
              ? "Add to cart"
              : "Select size"
            : "Sold out"}
        </BrandButton>

        <p className="mx-auto mt-4 max-w-130 text-center text-[11px] uppercase tracking-[0.16em] text-black/40">
          {product.deliveryNote}
        </p>
      </div>

      <div className="border-t border-black/10">
        <ProductAccordion title="Product details" defaultOpen>
          <p className="text-sm leading-7 text-black/62">
            {product.description}
          </p>

          <ul className="mt-5 space-y-2 text-sm leading-7 text-black/62">
            {product.detailBullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <p className="mt-5 text-sm leading-7 text-black/62">
            • Color: {product.colors.join(", ")}
          </p>

          <p className="text-sm leading-7 text-black/62">
            • Made in: {product.madeIn}
          </p>

          <p className="text-sm leading-7 text-black/62">
            • Product code: {product.sku}
          </p>
        </ProductAccordion>

        <ProductAccordion title="Material">
          <p className="text-sm leading-7 text-black/62">
            • Material: {product.materials.join(", ")}
          </p>
        </ProductAccordion>

        <ProductAccordion title="Size & fit">
          <p className="text-sm leading-7 text-black/62">{product.fitNote}</p>
        </ProductAccordion>

        <ProductAccordion title="Product care">
          <ul className="space-y-2 text-sm leading-7 text-black/62">
            {product.careInstructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </ProductAccordion>

        <ProductAccordion title="Delivery & returns">
          <p className="text-sm leading-7 text-black/62">
            {product.deliveryNote}
          </p>
        </ProductAccordion>
      </div>
    </div>
  );
}

function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section className="border-b border-black/10">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 py-5 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-black">
          {title}
        </span>

        <FiChevronDown
          className={cn(
            "size-4 shrink-0 text-black/45 transition-transform duration-300 ease-luxury",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}