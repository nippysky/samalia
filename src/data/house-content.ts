// src/data/house-content.ts
import type { CSSProperties } from "react";

export type HouseImage = {
  id: string;
  src: string;
  alt: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type HouseTextSection = {
  id: string;
  eyebrow: string;
  title?: string;
  paragraphs: string[];
};

export type HouseContent = {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    image: HouseImage;
  };
  sections: HouseTextSection[];
  closing: {
    eyebrow: string;
    title: string;
    body: string;
    image: HouseImage;
  };
};

const pexels = (id: string, width = 2200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const houseContent: HouseContent = {
  hero: {
    eyebrow: "Sam’Alia",
    title: "The House",
    body:
      "Sam’Aila is a design house built on structure, discipline, and cultural clarity.",
    image: {
      id: "house-hero",
      src: pexels("9849297", 2600),
      alt: "Fashion designer working late inside an atelier",
      objectPosition: "center",
    },
  },

  sections: [
    {
      id: "approach",
      eyebrow: "House approach",
      title: "Structure, discipline, and cultural clarity.",
      paragraphs: [
        "The work is developed through a consistent approach — focused on form, material, and construction. Each piece is considered, not assembled.",
        "At its core, the house is a study of craft.",
      ],
    },
    {
      id: "memory",
      eyebrow: "Cultural memory",
      title: "Foundation, not reference.",
      paragraphs: [
        "The work draws from cultural memory — particularly northern Nigerian craftsmanship — not as reference, but as foundation. Techniques, materials, and ways of making are preserved, refined, and translated into a contemporary language.",
        "This is not replication.",
        "It is continuation.",
      ],
    },
    {
      id: "architecture",
      eyebrow: "Architecture",
      title: "Line, proportion, repetition, and balance.",
      paragraphs: [
        "Architecture informs the house at every level. Line, proportion, repetition, and balance shape garments that feel measured and intentional.",
        "Craft sits at the centre of the work. Embroidery, construction, and finishing are treated as structural elements, not decoration.",
      ],
    },
    {
      id: "standard",
      eyebrow: "House standard",
      title: "Nothing is left unresolved.",
      paragraphs: [
        "There is a constant standard applied across everything — detail, fit, weight, and balance. Nothing is left unresolved.",
        "The house does not follow trend cycles or respond to noise. It moves with clarity, guided by an internal standard.",
      ],
    },
    {
      id: "presence",
      eyebrow: "Presence",
      title: "Precision before visibility.",
      paragraphs: [
        "The objective is not excess, but precision.",
        "Not visibility, but presence.",
        "This is a house built with control.",
        "And maintained through consistency.",
      ],
    },
  ],

  closing: {
    eyebrow: "House direction",
    title: "What is built with care will endure.",
    body:
      "Sam’Alia continues through structure, craft, and a consistent internal standard.",
    image: {
      id: "house-closing",
      src: pexels("4620612", 2200),
      alt: "Designer fitting a garment on a model",
      objectPosition: "center",
    },
  },
};

export async function getHouseContent(): Promise<HouseContent> {
  return houseContent;
}