// app/shipping-returns/page.tsx
import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Shipping and Returns",
  description:
    "Read the Sam’Alia shipping and returns policy for ready-to-wear and bespoke pieces.",
};

const sections = [
  {
    title: "Shipping",
    body: [
      "Shipping timelines vary depending on product availability, destination, and whether the piece is ready-to-wear or bespoke.",
      "Once an order is dispatched, tracking information will be provided where available.",
    ],
  },
  {
    title: "Returns",
    body: [
      "Eligible ready-to-wear items may be returned within the stated return window if unused, unworn, and in original condition.",
      "Bespoke, altered, personalised, or made-to-measure pieces may not be eligible for return unless required by applicable law.",
    ],
  },
  {
    title: "Exchanges",
    body: [
      "Exchange eligibility depends on stock availability and the condition of the returned item.",
      "For fit-related concerns, contact Sam’Alia as early as possible so the team can review available options.",
    ],
  },
];

export default function ShippingReturnsPage() {
  return (
    <LegalPageShell
      title="Shipping and returns"
      activeHref="/shipping-returns"
      sections={sections}
    />
  );
}