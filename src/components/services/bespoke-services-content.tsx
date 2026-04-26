// src/components/services/bespoke-services-content.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiChevronDown,
  FiCreditCard,
  FiGift,
  FiPackage,
  FiPenTool,
  FiScissors,
  FiShield,
} from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

type ServiceItem = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
  cta?: {
    label: string;
    href: string;
  };
};

const serviceItems: ServiceItem[] = [
  {
    id: "personalisation",
    eyebrow: "01",
    title: "Personalisation",
    summary:
      "Initials, private markings, finishing choices, and quiet details made specific to the wearer.",
    body:
      "Sam’Alia personalisation is designed to feel private rather than loud. Depending on the piece, selected details may include initials, tonal embroidery, custom placement, modified finishing, or a discreet inscription within the garment.",
    details: [
      "Available on selected ready-to-wear, craft, and bespoke pieces.",
      "Placement, lettering, and finishing are confirmed before production.",
      "Personalised pieces may require additional atelier time.",
    ],
    icon: FiPenTool,
  },
  {
    id: "book-appointment",
    eyebrow: "02",
    title: "Book appointment",
    summary:
      "A private session for fittings, measurements, collection previews, and bespoke direction.",
    body:
      "Appointments are created for clients who want a closer relationship with the house. A session may include measurements, fit review, fabric discussion, styling direction, or early access to selected pieces.",
    details: [
      "Available first for clients in Nigeria.",
      "Virtual appointment support can be added as the service expands.",
      "Appointment confirmation is subject to atelier availability.",
    ],
    icon: FiScissors,
    cta: {
      label: "Request appointment",
      href: "/book-appointment",
    },
  },
  {
    id: "certificate-of-craft",
    eyebrow: "03",
    title: "Certificate of craft",
    summary:
      "A house record for selected pieces, documenting identity, material language, and provenance.",
    body:
      "The Certificate of Craft is an archive-led record for selected Sam’Alia pieces. It can document the piece identity, material notes, craft category, production context, and house authentication.",
    details: [
      "Available for selected craft-signature and bespoke pieces.",
      "Designed as a long-term ownership and authentication record.",
      "Certificate information can later connect to digital product records.",
    ],
    icon: FiShield,
  },
  {
    id: "gift-option",
    eyebrow: "04",
    title: "Gift option",
    summary:
      "Minimal gift presentation for pieces intended for ceremony, appreciation, or private exchange.",
    body:
      "Gift presentation stays aligned with Sam’Alia’s restraint: clean packaging, optional note inclusion, and careful preparation before dispatch. The intention is premium, quiet, and personal.",
    details: [
      "Available for eligible ready-to-wear and accessory orders.",
      "Gift notes may be included on request.",
      "Packaging may vary by item size, fragility, and order type.",
    ],
    icon: FiGift,
  },
  {
    id: "shipping-option",
    eyebrow: "05",
    title: "Shipping option",
    summary:
      "Nigeria-first delivery support for ready-to-wear, accessories, and selected private orders.",
    body:
      "Sam’Alia begins with a Nigeria-first delivery model. Ready-to-ship pieces can be prepared after order confirmation, while bespoke, personalised, or atelier-finished pieces may require a longer lead time before dispatch.",
    details: [
      "Launch delivery support is focused on Nigeria.",
      "Lagos and major Nigerian city delivery workflows can be prioritized first.",
      "International shipping can be introduced after the local workflow is stable.",
    ],
    icon: FiPackage,
  },
  {
    id: "payment-methods",
    eyebrow: "06",
    title: "Payment methods",
    summary:
      "A Paystack-ready payment direction for secure Nigerian checkout and private order flows.",
    body:
      "For launch, Sam’Alia’s payment experience can be built around Paystack for Nigeria-first commerce. The production flow can support card payments, transfer-based checkout, payment confirmation, and private invoice-style payment links for bespoke orders.",
    details: [
      "Paystack checkout can support the main online purchase flow.",
      "Private appointments and bespoke orders can use invoice/payment-link confirmation.",
      "Backend payment verification should confirm successful payment before order fulfilment.",
    ],
    icon: FiCreditCard,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BespokeServicesContent() {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-28 2xl:px-10">
        <div className="mx-auto max-w-150 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            Sam’Alia services
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.35rem,4.7vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.04em] text-black">
            Bespoke Service
          </h1>

          <p className="mx-auto mt-6 max-w-125 text-sm leading-8 text-black/56 sm:text-[0.96rem]">
            A considered service language for personal pieces, private
            appointments, gifting, craft authentication, Nigerian shipping, and
            Paystack-enabled payments.
          </p>
        </div>

        <div className="mx-auto mt-18 max-w-260 border-t border-black/10 lg:mt-24">
          {serviceItems.map((item) => (
            <ServiceAccordion key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceAccordion({ item }: { item: ServiceItem }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [open, setOpen] = React.useState(false);
  const Icon = item.icon;

  return (
    <section className="border-b border-black/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-8 text-left transition-colors duration-300 ease-luxury sm:gap-6 sm:py-9 lg:grid-cols-[96px_64px_minmax(220px,0.62fr)_minmax(0,1fr)_auto] lg:py-11"
      >
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-black/32 lg:block">
          {item.eyebrow}
        </span>

        <span className="flex size-12 shrink-0 items-center justify-center border border-black/10 text-black transition-colors duration-300 ease-luxury group-hover:border-black group-hover:bg-black group-hover:text-white">
          <Icon className="size-4.5" />
        </span>

        <span className="min-w-0">
          <span className="block text-[0.88rem] font-medium uppercase tracking-[0.24em] text-black">
            {item.title}
          </span>
        </span>

        <span className="hidden max-w-150 text-sm leading-7 text-black/54 lg:block">
          {item.summary}
        </span>

        <FiChevronDown
          className={cn(
            "size-4 shrink-0 text-black/42 transition-transform duration-300 ease-luxury",
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
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 sm:pb-12 lg:grid lg:grid-cols-[96px_64px_minmax(220px,0.62fr)_minmax(0,1fr)_auto] lg:pb-14">
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />

              <div className="max-w-170">
                <p className="text-sm leading-8 text-black/62">{item.body}</p>

                <ul className="mt-7 space-y-4 text-sm leading-7 text-black/56">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex gap-4">
                      <span className="mt-3 h-px w-6 shrink-0 bg-black/32" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {item.cta ? (
                  <div className="mt-9">
                    <BrandButton href={item.cta.href} variant="primary">
                      {item.cta.label}
                    </BrandButton>
                  </div>
                ) : null}
              </div>

              <div className="hidden lg:block" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}