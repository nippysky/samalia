// app/terms/page.tsx
import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Sam’Alia terms and conditions for website use, services, appointments, and purchases.",
};

const sections = [
  {
    title: "Use of the website",
    body: [
      "By using this website, you agree to access Sam’Alia content and services only for lawful personal or business purposes.",
      "All imagery, text, marks, and design material remain the property of Sam’Alia or its licensors unless otherwise stated.",
    ],
  },
  {
    title: "Products and services",
    body: [
      "Product availability, pricing, appointment slots, and bespoke service timelines may change without prior notice.",
      "Bespoke pieces may require consultations, measurements, deposits, and agreed production timelines before confirmation.",
    ],
  },
  {
    title: "Limitation",
    body: [
      "Sam’Alia aims to keep information accurate and current, but the website may occasionally contain typographical, visual, or availability errors.",
      "Nothing on this website should be interpreted as a guarantee of availability until an order or appointment is formally confirmed.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms and conditions"
      activeHref="/terms"
      sections={sections}
    />
  );
}