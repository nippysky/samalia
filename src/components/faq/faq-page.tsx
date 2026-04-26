// src/components/faq/faq-page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";

import { BrandButton } from "@/src/components/ui/brand-button";
import type { FAQItem, FAQSection } from "@/src/data/faq-content";

type FAQPageProps = {
  sections: FAQSection[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FAQPage({ sections }: FAQPageProps) {
  const firstItemId = sections[0]?.items[0]?.id;
  const [openItemId, setOpenItemId] = React.useState<string | null>(
    firstItemId ?? null
  );

  return (
    <main className="lux-page bg-white text-black">
      <FAQHero />

      <section className="bg-white text-black">
        <div className="mx-auto grid w-full max-w-440 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-18 2xl:px-10">
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
            <FAQNavigation sections={sections} />
          </aside>

          <div className="min-w-0">
            <div className="space-y-14 lg:space-y-18">
              {sections.map((section) => (
                <FAQSectionBlock
                  key={section.id}
                  section={section}
                  openItemId={openItemId}
                  onToggle={(itemId) =>
                    setOpenItemId((current) =>
                      current === itemId ? null : itemId
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQContactBlock />
    </main>
  );
}

function FAQHero() {
  return (
    <section className="border-b border-black/10 bg-white text-black">
      <div className="mx-auto w-full max-w-440 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/42">
              Customer care
            </p>
          </div>

          <div className="max-w-190">
            <h1 className="font-display text-[clamp(2.75rem,6.4vw,7rem)] font-medium leading-[0.92] tracking-tight text-black">
              Frequently asked questions.
            </h1>

            <p className="mt-7 max-w-145 text-sm leading-8 text-black/58 sm:text-base">
              Answers about orders, payments, delivery, returns, sizing,
              appointments, gifting, and care for Sam’Alia pieces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQNavigation({ sections }: { sections: FAQSection[] }) {
  return (
    <nav aria-label="FAQ sections">
      <div className="border border-black/10 bg-white">
        <div className="border-b border-black/10 p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/42">
            Topics
          </p>
        </div>

        <ul className="hidden divide-y divide-black/10 lg:block">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="group flex items-center justify-between gap-4 p-5 text-[11px] font-medium uppercase tracking-[0.18em] text-black/58 transition-colors duration-300 ease-luxury hover:text-black"
              >
                <span>{section.title}</span>
                <FiArrowRight className="size-3.5 opacity-0 transition-[opacity,transform] duration-300 ease-luxury group-hover:translate-x-1 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 overflow-x-auto p-4 lg:hidden">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 border border-black/10 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/58 transition-colors duration-300 ease-luxury hover:border-black hover:text-black"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function FAQSectionBlock({
  section,
  openItemId,
  onToggle,
}: {
  section: FAQSection;
  openItemId: string | null;
  onToggle: (itemId: string) => void;
}) {
  return (
    <section id={section.id} className="scroll-mt-[calc(var(--nav-h)+40px)]">
      <div className="mb-8 grid gap-5 border-b border-black/10 pb-6 lg:grid-cols-[0.28fr_0.72fr]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/38">
            {section.eyebrow}
          </p>
        </div>

        <div>
          <h2 className="text-[1rem] font-medium uppercase tracking-[0.18em] text-black">
            {section.title}
          </h2>

          <p className="mt-3 max-w-150 text-sm leading-7 text-black/55">
            {section.description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-black/10 border-b border-black/10">
        {section.items.map((item) => (
          <FAQAccordionItem
            key={item.id}
            item={item}
            open={openItemId === item.id}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function FAQAccordionItem({
  item,
  open,
  onToggle,
}: {
  item: FAQItem;
  open: boolean;
  onToggle: () => void;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const contentId = React.useId();

  return (
    <article>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
      >
        <span className="max-w-180 text-[0.96rem] font-medium leading-7 tracking-tight text-black sm:text-[1.03rem]">
          {item.question}
        </span>

        <span
          className={cn(
            "mt-1 flex size-8 shrink-0 items-center justify-center border transition-colors duration-300 ease-luxury",
            open
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black group-hover:border-black"
          )}
        >
          {open ? <FiMinus className="size-4" /> : <FiPlus className="size-4" />}
        </span>
      </button>

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
            <div className="max-w-170 pb-7 pr-12 sm:pb-8">
              <div className="space-y-4 text-sm leading-8 text-black/58 sm:text-[0.95rem]">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {item.bullets && item.bullets.length > 0 ? (
                <ul className="mt-5 space-y-3 text-sm leading-7 text-black/58">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-3 h-px w-4 shrink-0 bg-black/35" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function FAQContactBlock() {
  return (
    <section className="border-t border-black/10 bg-white text-black">
      <div className="mx-auto flex w-full max-w-440 flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-18 2xl:px-10">
        <div className="max-w-150">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/42">
            Need more help?
          </p>

          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,4.4rem)] font-medium leading-none tracking-tight text-black">
            Speak with the house.
          </h2>

          <p className="mt-5 max-w-115 text-sm leading-8 text-black/55">
            For order questions, appointments, bespoke enquiries, delivery
            support, or fit guidance, contact Sam’Alia directly.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:w-fit sm:flex-row">
          <BrandButton
            href="/contact"
            variant="primary"
            iconAfter={<FiArrowRight className="size-4" />}
          >
            Contact
          </BrandButton>

          <Link
            href="/book-appointment"
            className="inline-flex min-h-12 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-colors duration-300 ease-luxury hover:text-black/55"
          >
            Book appointment
          </Link>
        </div>
      </div>
    </section>
  );
}