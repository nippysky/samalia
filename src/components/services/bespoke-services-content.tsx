// src/components/services/bespoke-services-content.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";

type ServiceItem = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  body: string;
  details: string[];
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
      "Initials, private markings, finishing options, and details specific to the wearer.",
    body:
      "Personalisation is handled through controlled details specific to the piece and the wearer.",
    details: [
      "Initials and private markings.",
      "Finishing options confirmed before production.",
      "Placement and treatment reviewed with the client.",
    ],
  },
  {
    id: "book-appointment",
    eyebrow: "02",
    title: "Book appointment",
    summary:
      "Private sessions for fittings, measurements, collection previews, and bespoke direction.",
    body:
      "Appointments are structured around fit, proportion, fabric, and intended use.",
    details: [
      "Fittings and measurements.",
      "Material review and selection.",
      "Collection preview and bespoke direction.",
    ],
    cta: {
      label: "Request a Fitting",
      href: "/book-appointment",
    },
  },
  {
    id: "certificate-of-craft",
    eyebrow: "03",
    title: "Certificate of craft",
    summary:
      "A house record for selected pieces — documenting construction, material, and identity.",
    body:
      "Selected pieces may carry a house record documenting how the piece was developed.",
    details: [
      "Construction notes.",
      "Material record.",
      "Piece identity and house authentication.",
    ],
  },
  {
    id: "process",
    eyebrow: "04",
    title: "Process",
    summary:
      "Consultation, development, fittings, and final delivery handled through a private service flow.",
    body:
      "Each commission follows a structured process — consultation, development, fittings, and final delivery.",
    details: [
      "Details, including timelines and cost, are discussed and confirmed during the appointment.",
      "Payment is introduced only after the service has been confirmed.",
      "The process remains private, considered, and service-led.",
    ],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BespokeServicesContent() {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-28 2xl:px-10">
        <div className="mx-auto max-w-165 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
            Bespoke Service
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.35rem,4.7vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.04em] text-black">
            Private service, developed with care.
          </h1>

          <div className="mx-auto mt-9 max-w-132 space-y-5 text-sm leading-8 text-black/58 sm:text-[0.96rem]">
            <p>
              A considered service built around the individual — measurements,
              material selection, fittings, and final construction.
            </p>
            <p>
              Each piece is developed with precision, clarity, and attention to
              detail.
            </p>
          </div>
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

  return (
    <section className="border-b border-black/10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 py-9 text-left transition-colors duration-300 ease-luxury sm:gap-6 sm:py-10 lg:grid-cols-[96px_minmax(220px,0.62fr)_minmax(0,1fr)_auto] lg:py-12"
      >
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-black/32 lg:block">
          {item.eyebrow}
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
            "size-4 shrink-0 text-black/38 transition-transform duration-300 ease-luxury",
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
            <div className="pb-10 sm:pb-12 lg:grid lg:grid-cols-[96px_minmax(220px,0.62fr)_minmax(0,1fr)_auto] lg:pb-14">
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />

              <div className="max-w-170">
                <p className="text-sm leading-8 text-black/62">{item.body}</p>

                <ul className="mt-8 space-y-4 text-sm leading-7 text-black/56">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex gap-4">
                      <span className="mt-3 h-px w-6 shrink-0 bg-black/32" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {item.cta ? (
                  <div className="mt-10">
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