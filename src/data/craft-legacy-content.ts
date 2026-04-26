// src/data/craft-legacy-content.ts
import type { CSSProperties } from "react";

export type CraftLegacyMediaKind = "image" | "video";

export type CraftLegacyHeroMedia = {
  videoSrc: string;
  posterSrc: string;
  title: string;
  eyebrow: string;
  description: string;
};

export type CraftLegacyEditorialMedia = {
  id: string;
  kind: CraftLegacyMediaKind;
  src: string;
  posterSrc?: string;
  alt: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type CraftLegacyPrinciple = {
  id: string;
  title: string;
  text: string;
};

export type CraftLegacyContent = {
  hero: CraftLegacyHeroMedia;
  statement: {
    eyebrow: string;
    title: string;
    body: string;
  };
  editorialMedia: CraftLegacyEditorialMedia[];
  principles: CraftLegacyPrinciple[];
};

export const craftLegacyContent: CraftLegacyContent = {
  hero: {
    videoSrc: "/dummy/craftlegacy-video.mp4",
    posterSrc: "/images/home-hero.jpeg",
    eyebrow: "Sam’Alia",
    title: "Craft & Legacy",
    description:
      "A house language shaped by Northern memory, precise hands, and modern restraint.",
  },

  statement: {
    eyebrow: "Craft is continuity",
    title: "The hand remembers what the future must refine.",
    body:
      "Sam’Alia treats craft as a living discipline. Every line, stitch, surface, and proportion carries a conversation between heritage and modern form. The result is not costume, not nostalgia, but a quiet architecture of identity.",
  },

  editorialMedia: [
    {
      id: "craft-detail-01",
      kind: "image",
      src: "/dummy/craft1.jpeg",
      alt: "Sam’Alia atelier craft detail",
      objectPosition: "center",
    },
    {
      id: "craft-detail-02",
      kind: "image",
      src: "/dummy/craft2.jpeg",
      alt: "Sam’Alia garment construction detail",
      objectPosition: "center",
    },
    {
      id: "craft-detail-03",
      kind: "image",
      src: "/dummy/craft3.jpeg",
      alt: "Sam’Alia heritage textile detail",
      objectPosition: "center",
    },
  ],

  principles: [
    {
      id: "restraint",
      title: "Restraint",
      text:
        "Decoration is never used as noise. Every mark must earn its place on the garment.",
    },
    {
      id: "memory",
      title: "Memory",
      text:
        "Northern forms, cultural references, and inherited techniques are treated as source material for modern design.",
    },
    {
      id: "construction",
      title: "Construction",
      text:
        "Fit, finishing, and proportion carry the authority of the piece before any branding does.",
    },
  ],
};

export async function getCraftLegacyContent(): Promise<CraftLegacyContent> {
  return craftLegacyContent;
}