// app/privacy/page.tsx
import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Sam’Alia privacy policy, including how personal information is handled across our website and services.",
};

const sections = [
  {
    title: "Information we collect",
    body: [
      "We may collect information you provide directly, including your name, email address, appointment details, order details, and messages sent through our website.",
      "We may also collect limited technical information such as device type, browser type, pages visited, and cookie preferences to improve the website experience.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use information to respond to enquiries, manage appointments, process requests, improve our services, and communicate collection updates where you have opted in.",
      "We do not sell personal information. Any third-party service providers are expected to handle information only for the purpose of supporting Sam’Alia operations.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may request access, correction, or deletion of personal information by contacting Sam’Alia.",
      "You may also manage cookie preferences through the cookie settings available in the footer.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy policy"
      activeHref="/privacy"
      sections={sections}
    />
  );
}