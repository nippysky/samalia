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
    largeStatement: string;
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
      "Process, material, construction, and craft carried through the house.",
  },

  statement: {
    eyebrow: "Craft & Legacy",
    title: "Craft is continuity.",
    largeStatement: "The hand remembers what the future must refine.",
    body:
      "The work is developed through material, construction, and finishing — with a focus on precision, durability, and clarity.\n\nThe house draws from long-standing craft traditions, particularly from northern Nigeria, where techniques are rooted in repetition, skill, and discipline.\n\nThese methods are not referenced — they are practiced, refined, and carried forward.\n\nEach piece reflects a continuous dialogue between what has been made before and what is being shaped now.",
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
      alt: "Sam’Alia textile detail",
      objectPosition: "center",
    },
  ],

  principles: [
    {
      id: "restraint",
      title: "Restraint",
      text:
        "Every element must serve the garment. Nothing is added without purpose.",
    },
    {
      id: "memory",
      title: "Memory",
      text:
        "Cultural knowledge and inherited techniques inform the work — not as reference, but as foundation.",
    },
    {
      id: "construction",
      title: "Construction",
      text:
        "Fit, structure, and finishing define the piece before any visible identity does.",
    },
  ],
};

export async function getCraftLegacyContent(): Promise<CraftLegacyContent> {
  return craftLegacyContent;
}