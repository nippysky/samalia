// src/components/shared/main-menu.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

type MenuColor = "white" | "dark";

type MainMenuProps = {
  color?: MenuColor;
};

type NavItem = {
  href: string;
  label: string;
};

const readyToWearCategories: NavItem[] = [
  {
    href: "/ready-to-wear/shirts",
    label: "Shirts",
  },
  {
    href: "/ready-to-wear/trousers",
    label: "Trousers",
  },
  {
    href: "/ready-to-wear/co-ordinates",
    label: "Co-ordinates",
  },
  {
    href: "/ready-to-wear/outerwear",
    label: "Outerwear",
  },
  {
    href: "/ready-to-wear/shorts",
    label: "Shorts",
  },
  {
    href: "/ready-to-wear/accessories",
    label: "Accessories",
  },
];

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/bespoke-services",
    label: "Bespoke",
  },
  {
    href: "/ready-to-wear",
    label: "Ready to Wear",
  },
  {
    href: "/ceremonial-ready-to-wear",
    label: "Ceremonial",
  },
  {
    href: "/lookbook",
    label: "Lookbook",
  },
  {
    href: "/craft-legacy",
    label: "Craft & Legacy",
  },
  {
    href: "/journal",
    label: "Journal",
  },
  {
    href: "/about",
    label: "The House",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isActivePath(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";

  return Boolean(pathname?.startsWith(href));
}

export function MainMenu({ color = "dark" }: MainMenuProps) {
  const pathname = usePathname();
  const reducedMotion = Boolean(useReducedMotion());

  const [open, setOpen] = React.useState(false);
  const [readyToWearOpen, setReadyToWearOpen] = React.useState(false);

  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const year = new Date().getFullYear();
  const iconColor = color === "white" ? "text-white" : "text-black";
  const readyToWearActive = isActivePath(pathname, "/ready-to-wear");

  function handleOpenMenu() {
    setReadyToWearOpen(readyToWearActive);
    setOpen(true);
  }

  React.useEffect(() => {
    if (!open) return;

    const restoreFocusTarget = triggerButtonRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      restoreFocusTarget?.focus();
    };
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="menu-overlay"
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-80 bg-black/35 backdrop-blur-[2px]"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(false)}
          />

          <motion.aside
            key="menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="main-menu-title"
            aria-describedby="main-menu-description"
            className="fixed inset-y-0 left-0 z-90 w-screen border-r border-black/10 bg-white text-black shadow-none sm:w-[min(440px,calc(100vw-24px))]"
            initial={reducedMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-dvh flex-col">
              <div className="px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-10 shrink-0">
                      <Image
                        src="/Samalia_Logo.svg"
                        alt="Sam’Alia"
                        fill
                        priority
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase leading-none tracking-[0.24em] text-black/42">
                        Menu
                      </p>
                    </div>
                  </div>

                  <div id="main-menu-title" className="sr-only">
                    Main navigation
                  </div>

                  <div id="main-menu-description" className="sr-only">
                    Primary site navigation links for Sam’Alia.
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="group flex size-10 shrink-0 items-center justify-center text-black/55 transition-colors duration-300 ease-luxury hover:text-black"
                  >
                    <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-12 sm:px-7 sm:pt-14">
                <ul className="space-y-7">
                  {navItems.map((item, index) => {
                    const active = isActivePath(pathname, item.href);
                    const isReadyToWear = item.href === "/ready-to-wear";

                    if (isReadyToWear) {
                      return (
                        <ReadyToWearMenuItem
                          key={item.href}
                          item={item}
                          active={active}
                          index={index}
                          open={readyToWearOpen}
                          reducedMotion={reducedMotion}
                          onToggle={() =>
                            setReadyToWearOpen((current) => !current)
                          }
                          onNavigate={() => setOpen(false)}
                        />
                      );
                    }

                    return (
                      <MenuLink
                        key={item.href}
                        item={item}
                        active={active}
                        index={index}
                        reducedMotion={reducedMotion}
                        onNavigate={() => setOpen(false)}
                      />
                    );
                  })}
                </ul>
              </nav>

              <div className="px-5 py-6 sm:px-7">
                <p className="max-w-72 text-[10px] font-medium uppercase leading-5 tracking-[0.22em] text-black/34">
                  © {year} Sam&apos;Alia. All rights reserved.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleOpenMenu}
        className={cn(
          "group flex size-10 shrink-0 items-center justify-center transition-colors duration-300 ease-luxury sm:size-11",
          iconColor
        )}
      >
        <HiOutlineMenuAlt2 className="size-6.25 transition-transform duration-300 ease-luxury group-hover:scale-95 sm:size-6.75" />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(drawer, document.body)
        : null}
    </>
  );
}

function MenuLink({
  item,
  active,
  index,
  reducedMotion,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  index: number;
  reducedMotion: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{
          duration: 0.38,
          delay: reducedMotion ? 0 : index * 0.028,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "block w-fit text-[0.86rem] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ease-luxury hover:text-black",
            active ? "text-black" : "text-black/62"
          )}
        >
          {item.label}
        </Link>
      </motion.div>
    </li>
  );
}

function ReadyToWearMenuItem({
  item,
  active,
  index,
  open,
  reducedMotion,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  index: number;
  open: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const contentId = React.useId();
  const pathname = usePathname();

  return (
    <li>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{
          duration: 0.38,
          delay: reducedMotion ? 0 : index * 0.028,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="flex w-full items-baseline justify-between gap-5">
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "block w-fit text-[0.86rem] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ease-luxury hover:text-black",
              active ? "text-black" : "text-black/62"
            )}
          >
            {item.label}
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={contentId}
            onClick={onToggle}
            className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-black/35 transition-colors duration-300 ease-luxury hover:text-black"
          >
            {open ? "Close" : "Categories"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={contentId}
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.34,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden"
            >
              <ul className="space-y-3.5 pt-5">
                {readyToWearCategories.map((category) => {
                  const categoryActive = isActivePath(pathname, category.href);

                  return (
                    <li key={category.href}>
                      <Link
                        href={category.href}
                        onClick={onNavigate}
                        aria-current={categoryActive ? "page" : undefined}
                        className={cn(
                          "block w-fit text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-luxury hover:text-black",
                          categoryActive ? "text-black" : "text-black/40"
                        )}
                      >
                        {category.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </li>
  );
}