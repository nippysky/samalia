// src/components/shared/site-footer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import { CookiePreferencesModal } from "@/src/components/shared/cookie-preferences-modal";
import { SizeGuideModal } from "@/src/components/shared/size-guide-modal";

type FooterAction = "size-guide" | "cookie-settings";

type FooterHrefLink = {
  label: string;
  href: string;
  external?: boolean;
  action?: never;
};

type FooterActionLink = {
  label: string;
  action: FooterAction;
  href?: never;
  external?: never;
};

type FooterLink = FooterHrefLink | FooterActionLink;

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Explore",
    links: [
      { label: "Ready to wear", href: "/ready-to-wear" },
      { label: "Elevated everyday", href: "/elevated-everyday" },
      { label: "Craft & legacy", href: "/craft-legacy" },
      { label: "Bespoke service", href: "/bespoke-services" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Book appointment", href: "/bespoke-services" },
      { label: "Size guide", action: "size-guide" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/",
        external: true,
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/",
        external: true,
      },
      {
        label: "Pinterest",
        href: "https://www.pinterest.com/",
        external: true,
      },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Shipping & returns", href: "/shipping-returns" },
  { label: "Cookie settings", action: "cookie-settings" },
];

function isFooterActionLink(link: FooterLink): link is FooterActionLink {
  return "action" in link && typeof link.action === "string";
}

function FooterTextLink({
  link,
  onAction,
}: {
  link: FooterLink;
  onAction: (action: FooterAction) => void;
}) {
  const className =
    "group/link inline-flex w-fit items-center gap-2 whitespace-nowrap text-sm leading-7 text-black/62 transition-colors duration-300 ease-luxury hover:text-black";

  const icon = (
    <FiArrowRight className="size-3 opacity-0 transition-[opacity,transform] duration-300 ease-luxury group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
  );

  if (isFooterActionLink(link)) {
    return (
      <button
        type="button"
        onClick={() => onAction(link.action)}
        className={className}
      >
        <span>{link.label}</span>
        {icon}
      </button>
    );
  }

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span>{link.label}</span>
        {icon}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      <span>{link.label}</span>
      {icon}
    </Link>
  );
}

function FooterSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.38em] text-black">
      {children}
    </h3>
  );
}

function DesktopFooterSection({
  section,
  onAction,
}: {
  section: FooterSection;
  onAction: (action: FooterAction) => void;
}) {
  return (
    <div className="min-w-0">
      <FooterSectionTitle>{section.title}</FooterSectionTitle>

      <div className="pt-5">
        <ul className="space-y-6">
          {section.links.map((link) => (
            <li key={`${section.title}-${link.label}`}>
              <FooterTextLink link={link} onAction={onAction} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileFooterAccordion({
  section,
  onAction,
}: {
  section: FooterSection;
  onAction: (action: FooterAction) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-5 py-6 text-left"
      >
        <FooterSectionTitle>{section.title}</FooterSectionTitle>

        <span className="flex size-8 shrink-0 items-center justify-center text-black">
          {open ? <FiMinus className="size-4" /> : <FiPlus className="size-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-5 pb-9 pt-8">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <FooterTextLink link={link} onAction={onAction} />
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function NewsletterBlock({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="min-w-0">
      <FooterSectionTitle>Private list</FooterSectionTitle>

      <div className={compact ? "pt-10" : "pt-5"}>
        <p
          className={`text-sm leading-8 text-black/58 ${
            compact ? "max-w-none" : "max-w-115"
          }`}
        >
          Receive collection notes, private appointments, and new releases from
          Sam’Alia.
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="border-b border-black/20 transition-colors duration-300 ease-luxury focus-within:border-black">
            <label
              htmlFor={compact ? "footer-email-mobile" : "footer-email"}
              className="sr-only"
            >
              Email address
            </label>

            <input
              id={compact ? "footer-email-mobile" : "footer-email"}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="h-12 w-full bg-transparent text-sm text-black outline-none placeholder:text-black/35"
            />
          </div>

          <div className="mt-8">
            <BrandButton
              type="submit"
              variant="primary"
              size="md"
              iconAfter={<FiArrowRight className="size-3.5" />}
              className="min-w-47.5"
            >
              Join the list
            </BrandButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function FooterBrandNote() {
  return (
    <div className="min-w-0 max-w-107.5">
      <FooterSectionTitle>Sam’Alia</FooterSectionTitle>

      <div className="pt-5">
        <p className="max-w-92.5 text-sm leading-8 text-black/58">
          Luxury fashion and lifestyle shaped by heritage, restraint, and modern
          presence.
        </p>

        <div className="mt-14 h-px w-24 bg-black" />
      </div>
    </div>
  );
}

export function SiteFooter() {
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = React.useState(false);

  const year = new Date().getFullYear();

  function handleAction(action: FooterAction) {
    if (action === "size-guide") {
      setSizeGuideOpen(true);
      return;
    }

    setCookieSettingsOpen(true);
  }

  return (
    <>
      <footer className="border-t border-black/10 bg-white text-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10">
          <div className="mx-auto w-full max-w-440">
            <div className="hidden py-24 lg:grid lg:grid-cols-[minmax(270px,1.15fr)_minmax(170px,0.65fr)_minmax(170px,0.65fr)_minmax(150px,0.55fr)_minmax(380px,1.2fr)] lg:gap-16 xl:gap-24 2xl:gap-28">
              <FooterBrandNote />

              {footerSections.map((section) => (
                <DesktopFooterSection
                  key={section.title}
                  section={section}
                  onAction={handleAction}
                />
              ))}

              <NewsletterBlock />
            </div>

            <div className="py-12 lg:hidden">
              <div className="border-b border-black/10 pb-9">
                <FooterBrandNote />
              </div>

              <div>
                {footerSections.map((section) => (
                  <MobileFooterAccordion
                    key={section.title}
                    section={section}
                    onAction={handleAction}
                  />
                ))}

                <div className="border-b border-black/10 py-9">
                  <NewsletterBlock compact />
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 py-6">
              <div className="flex flex-col gap-5 text-[11px] tracking-[0.12em] text-black/42 sm:flex-row sm:items-center sm:justify-between">
                <p className="uppercase tracking-[0.2em]">
                  © {year} Sam’Alia. All rights reserved.
                </p>

                <nav aria-label="Legal links">
                  <ul className="flex flex-wrap gap-x-7 gap-y-3">
                    {legalLinks.map((link) => (
                      <li key={link.label}>
                        {isFooterActionLink(link) ? (
                          <button
                            type="button"
                            onClick={() => handleAction(link.action)}
                            className="transition-colors duration-300 ease-luxury hover:text-black"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            className="transition-colors duration-300 ease-luxury hover:text-black"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <CookiePreferencesModal
        open={cookieSettingsOpen}
        onClose={() => setCookieSettingsOpen(false)}
      />
    </>
  );
}