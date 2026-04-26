// src/components/shared/main-menu.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronDown,
  FiFeather,
  FiHome,
  FiInfo,
  FiScissors,
  FiStar,
  FiX,
} from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { LuNotebookText } from "react-icons/lu";

import { readyToWearCategories } from "@/src/data/shop-categories";

type MenuColor = "white" | "dark";

type MainMenuProps = {
  color?: MenuColor;
};

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Enter the house",
    icon: FiHome,
  },
  {
    href: "/bespoke-services",
    label: "Bespoke",
    description: "Tailored for presence",
    icon: FiScissors,
  },
  {
    href: "/ready-to-wear",
    label: "Ready to wear",
    description: "Modern refined pieces",
    icon: FiStar,
  },
  {
    href: "/lookbook",
    label: "Lookbook",
    description: "Visual stories",
    icon: FiBookOpen,
  },
  {
    href: "/craft-legacy",
    label: "Craft & Legacy",
    description: "Heritage in motion",
    icon: FiFeather,
  },
  {
    href: "/journal",
    label: "Journal",
    description: "Culture and notes",
    icon: LuNotebookText,
  },
  {
    href: "/about",
    label: "About",
    description: "The Sam’Alia house",
    icon: FiInfo,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MainMenu({ color = "dark" }: MainMenuProps) {
  const pathname = usePathname();
  const reducedMotion = Boolean(useReducedMotion());

  const [open, setOpen] = React.useState(false);

  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);

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

  const iconColor = color === "white" ? "text-white" : "text-black";

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
            className="fixed inset-y-0 left-0 z-90 w-screen border-r border-black/10 bg-white text-black shadow-none sm:w-[min(460px,calc(100vw-24px))]"
            initial={reducedMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-dvh flex-col">
              <div className="border-b border-black/10 px-5 py-4 sm:px-7">
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
                      <p className="text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-black">
                        Menu
                      </p>
                      <p className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-black/45">
                        Discover Sam’Alia
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
                    className="group flex size-10 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                  >
                    <FiX className="size-5 transition-transform duration-300 ease-luxury group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
                <ul className="space-y-2.5">
                  {navItems.map((item, index) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : Boolean(pathname?.startsWith(item.href));

                    if (item.href === "/ready-to-wear") {
                      return (
                        <ReadyToWearMenuGroup
                          key={item.href}
                          item={item}
                          active={active}
                          index={index}
                          pathname={pathname}
                          reducedMotion={reducedMotion}
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

              <div className="border-t border-black/10 px-5 py-4 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="shrink-0 text-[9px] uppercase tracking-[0.22em] text-black/45">
                    Heritage / Modernity / Presence
                  </p>
                  <span className="h-px flex-1 bg-black/10" />
                </div>
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
        onClick={() => setOpen(true)}
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

function ReadyToWearMenuGroup({
  item,
  active,
  index,
  pathname,
  reducedMotion,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  index: number;
  pathname: string | null;
  reducedMotion: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const [expanded, setExpanded] = React.useState(() =>
    Boolean(pathname?.startsWith("/ready-to-wear"))
  );

  return (
    <li>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{
          duration: 0.38,
          delay: reducedMotion ? 0 : index * 0.028,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className={cn(
            "group/link relative flex w-full items-center justify-between gap-4 overflow-hidden border px-4 py-4 text-left transition-colors duration-300 ease-luxury",
            active
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-px transition-transform duration-500 ease-luxury",
              active
                ? "scale-y-100 bg-white"
                : "scale-y-0 bg-black group-hover/link:scale-y-100 group-hover/link:bg-white"
            )}
          />

          <span className="flex min-w-0 items-center gap-3.5">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center border transition-colors duration-300 ease-luxury",
                active
                  ? "border-white/20 bg-white text-black"
                  : "border-black/10 bg-black/5 text-black group-hover/link:border-white/20 group-hover/link:bg-white group-hover/link:text-black"
              )}
            >
              <Icon className="size-4.25" />
            </span>

            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-[0.78rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                  active
                    ? "text-white"
                    : "text-black group-hover/link:text-white"
                )}
              >
                {item.label}
              </span>

              <span
                className={cn(
                  "mt-1 block truncate text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                  active
                    ? "text-white/60"
                    : "text-black/45 group-hover/link:text-white/65"
                )}
              >
                {item.description}
              </span>
            </span>
          </span>

          <FiChevronDown
            className={cn(
              "size-4.25 shrink-0 transition-[color,transform] duration-300 ease-luxury",
              expanded && "rotate-180",
              active
                ? "text-white"
                : "text-black/35 group-hover/link:text-white"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-x border-b border-black/10 px-4 py-4">
                <div className="grid gap-2">
                  <Link
                    href="/ready-to-wear"
                    onClick={onNavigate}
                    className="flex min-h-10 items-center justify-between border border-black/10 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/65 transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                  >
                    View all ready to wear
                    <FiArrowRight className="size-3.5" />
                  </Link>

                  {readyToWearCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/ready-to-wear/${category.slug}`}
                      onClick={onNavigate}
                      className="flex min-h-10 items-center justify-between border border-black/10 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/65 transition-colors duration-300 ease-luxury hover:border-black hover:bg-black hover:text-white"
                    >
                      {category.title}
                      <FiArrowRight className="size-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </li>
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
  const Icon = item.icon;

  return (
    <li>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
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
            "group/link relative flex items-center justify-between gap-4 overflow-hidden border px-4 py-4 transition-colors duration-300 ease-luxury",
            active
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-px transition-transform duration-500 ease-luxury",
              active
                ? "scale-y-100 bg-white"
                : "scale-y-0 bg-black group-hover/link:scale-y-100 group-hover/link:bg-white"
            )}
          />

          <span className="flex min-w-0 items-center gap-3.5">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center border transition-colors duration-300 ease-luxury",
                active
                  ? "border-white/20 bg-white text-black"
                  : "border-black/10 bg-black/5 text-black group-hover/link:border-white/20 group-hover/link:bg-white group-hover/link:text-black"
              )}
            >
              <Icon className="size-4.25" />
            </span>

            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-[0.78rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                  active
                    ? "text-white"
                    : "text-black group-hover/link:text-white"
                )}
              >
                {item.label}
              </span>

              <span
                className={cn(
                  "mt-1 block truncate text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                  active
                    ? "text-white/60"
                    : "text-black/45 group-hover/link:text-white/65"
                )}
              >
                {item.description}
              </span>
            </span>
          </span>

          <FiArrowRight
            className={cn(
              "size-4.25 shrink-0 transition-[color,transform] duration-300 ease-luxury",
              active
                ? "text-white"
                : "text-black/35 group-hover/link:translate-x-1 group-hover/link:text-white"
            )}
          />
        </Link>
      </motion.div>
    </li>
  );
}