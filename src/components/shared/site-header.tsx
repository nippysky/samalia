// src/components/shared/site-header.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { CartSheet } from "./cart-sheet";
import { MainMenu } from "./main-menu";

type HeaderVariant = "solid" | "transparent";

type SiteHeaderProps = {
  variant?: HeaderVariant;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const isTransparent = variant === "transparent";
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isTransparent) return;

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparent]);

  const isSolid = !isTransparent || hasScrolled;

  const tone = useMemo<"dark" | "white">(
    () => (isSolid ? "dark" : "white"),
    [isSolid]
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-70 w-full transition-[background-color,border-color] duration-300 ease-luxury",
        isSolid
          ? "border-b border-black/10 bg-white/95 text-black backdrop-blur-xl"
          : "border-b border-white/15 bg-transparent text-white"
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex h-17 min-w-0 items-center justify-between gap-4 sm:h-18">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <MainMenu color={tone} />

  <Link
  href="/"
  aria-label="Sam’Alia home"
  className="group relative flex min-w-0 items-center"
>
  <span className="relative block h-8 w-42.5 shrink-0 sm:h-9 sm:w-40 lg:h-10 lg:w-45">
    <Image
      src="/Samalia_Wordmark.svg"
      alt="Sam’Alia"
      fill
      priority
      sizes="(max-width: 640px) 170px, (max-width: 1024px) 190px, 215px"
      className={cn(
        "object-contain object-left transition-[filter,opacity] duration-300 ease-luxury group-hover:opacity-75",
        !isSolid && "invert"
      )}
    />
  </span>
</Link>
          </div>

          <div className="flex shrink-0 items-center justify-end">
            <CartSheet
              iconClassName={cn(
                "size-[24px] transition-colors duration-300 ease-luxury sm:size-[26px]",
                isSolid ? "text-black" : "text-white"
              )}
            />
          </div>
        </div>
      </div>
    </header>
  );
}