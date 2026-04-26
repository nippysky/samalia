// src/components/legal/legal-page-shell.tsx
import Link from "next/link";

type LegalNavItem = {
  label: string;
  href: string;
};

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageShellProps = {
  title: string;
  activeHref: string;
  sections: LegalSection[];
};

const legalNavItems: LegalNavItem[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "Shipping and returns", href: "/shipping-returns" },
];

export function LegalPageShell({
  title,
  activeHref,
  sections,
}: LegalPageShellProps) {
  return (
    <main className="bg-white text-black">
      <section className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10">
        <div className="mx-auto grid w-full max-w-440 gap-12 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr]">
          <aside className="lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:h-fit">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black">
              Legal pages
            </p>

            <nav className="mt-8 flex gap-6 overflow-x-auto border-b border-black/10 pb-5 lg:block lg:space-y-5 lg:overflow-visible lg:border-b-0 lg:pb-0">
              {legalNavItems.map((item) => {
                const active = item.href === activeHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block whitespace-nowrap text-sm tracking-[0.01em] transition-colors duration-300 ease-luxury ${
                      active
                        ? "text-black underline underline-offset-8"
                        : "text-black/55 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <article className="max-w-215">
            <h1 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black">
              {title}
            </h1>

            <div className="mt-16 space-y-14">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black">
                    {section.title}
                  </h2>

                  <div className="mt-8 space-y-6">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-8 text-black/70"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}