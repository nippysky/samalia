// src/components/shared/site-footer.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";
import { LuRuler } from "react-icons/lu";

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
      { label: "Lookbook", href: "/lookbook" },
      { label: "Journal", href: "/journal" },
      { label: "The House", href: "/about" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Book appointment", href: "/book-appointment" },
      { label: "FAQs", href: "/faq" },
      { label: "Bespoke service", href: "/bespoke-services" },
      { label: "Craft & legacy", href: "/craft-legacy" },
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
    "group/link inline-flex w-fit appearance-none items-center gap-1.5 whitespace-nowrap p-0 font-sans text-[13px] font-normal leading-6 text-black/55 transition-colors duration-300 ease-luxury hover:text-black";

  const icon = (
    <FiArrowRight className="size-2.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 ease-luxury group-hover/link:translate-x-0 group-hover/link:opacity-100" />
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
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black">
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

      <div className="pt-6">
        <ul className="space-y-3.5">
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
          {open ? (
            <FiMinus className="size-3.5" />
          ) : (
            <FiPlus className="size-3.5" />
          )}
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
            <ul className="space-y-3.5 pb-8 pt-6">
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

      <div className={compact ? "pt-8" : "pt-6"}>
        <p
          className={`text-[13px] leading-[1.75] text-black/55 ${
            compact ? "max-w-none" : "max-w-full"
          }`}
        >
          Receive collection notes, private appointments, and new releases from
          Sam&apos;Alia.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
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
              className="h-11 w-full bg-transparent text-[13px] text-black outline-none placeholder:text-black/35"
            />
          </div>

          <div className="mt-7">
            <BrandButton
              type="submit"
              variant="primary"
              size="md"
              iconAfter={<FiArrowRight className="size-3.5" />}
              className="w-full lg:w-auto lg:min-w-44"
              style={{
                backgroundColor: "var(--black)",
                border: "1px solid var(--black)",
              }}
            >
              Join the list
            </BrandButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function FooterBrandNote({
  onAction,
}: {
  onAction: (action: FooterAction) => void;
}) {
  return (
    <div className="min-w-0">
      <FooterSectionTitle>Sam&apos;Alia</FooterSectionTitle>

      <div className="pt-6">
        <p className="text-[13px] leading-[1.75] text-black/55">
          Luxury fashion and lifestyle shaped by heritage, restraint, and modern
          presence.
        </p>

        <div className="mt-6">
          <BrandButton
            variant="text"
            size="sm"
            iconBefore={<LuRuler className="size-3.5" />}
            onClick={() => onAction("size-guide")}
          >
            Size guide
          </BrandButton>
        </div>

        <div className="mt-10 h-px w-20 bg-black" />
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
            <div className="hidden py-20 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.65fr)_minmax(0,0.65fr)_minmax(0,0.55fr)_minmax(0,1.2fr)] lg:gap-10 xl:gap-16 2xl:gap-24">
              <FooterBrandNote onAction={handleAction} />

              {footerSections.map((section) => (
                <DesktopFooterSection
                  key={section.title}
                  section={section}
                  onAction={handleAction}
                />
              ))}

              <NewsletterBlock />
            </div>

            <div className="py-10 lg:hidden">
              <div className="border-b border-black/10 pb-8">
                <FooterBrandNote onAction={handleAction} />
              </div>

              <div>
                {footerSections.map((section) => (
                  <MobileFooterAccordion
                    key={section.title}
                    section={section}
                    onAction={handleAction}
                  />
                ))}

                <div className="border-b border-black/10 py-8">
                  <NewsletterBlock compact />
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 py-5">
              <div className="flex flex-col gap-4 text-[10px] tracking-[0.12em] text-black/40 sm:flex-row sm:items-center sm:justify-between">
                <p className="uppercase tracking-[0.2em]">
                  © {year} Sam&apos;Alia. All rights reserved.
                </p>

                <nav aria-label="Legal links">
                  <ul className="flex flex-wrap gap-x-6 gap-y-2.5 uppercase tracking-[0.18em]">
                    {legalLinks.map((link) => (
                      <li key={link.label}>
                        {isFooterActionLink(link) ? (
                          <button
                            type="button"
                            onClick={() => handleAction(link.action)}
                            className="appearance-none p-0 font-sans font-normal transition-colors duration-300 ease-luxury hover:text-black"
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