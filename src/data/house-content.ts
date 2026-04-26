// src/data/house-content.ts
import type { CSSProperties } from "react";

export type HouseImage = {
  id: string;
  src: string;
  alt: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type HousePrinciple = {
  id: string;
  title: string;
  text: string;
};

export type HouseTimelineItem = {
  id: string;
  label: string;
  title: string;
  text: string;
};

export type HouseContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: HouseImage;
  };
  origin: {
    eyebrow: string;
    title: string;
    body: string;
    image: HouseImage;
  };
  manifesto: {
    title: string;
    body: string;
  };
  principles: HousePrinciple[];
  timeline: HouseTimelineItem[];
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
    subtitle:
      "A luxury fashion and lifestyle house from Northern Nigeria, shaped by heritage, restraint, and modern presence.",
    image: {
      id: "house-hero",
      src: pexels("9849297", 2600),
      alt: "Fashion designer working late inside an atelier",
      objectPosition: "center",
    },
  },

  origin: {
    eyebrow: "North from here",
    title: "A house built from memory, discipline, and modern form.",
    body:
      "Sam’Alia begins in Northern Nigeria as a study of culture, proportion, and presence. The house is not interested in costume or nostalgia. It is interested in what heritage can become when it is handled with restraint, technical clarity, and a contemporary eye.",
    image: {
      id: "house-origin",
      src: pexels("9849642", 2200),
      alt: "Designer holding fabric inside a fashion studio",
      objectPosition: "center",
    },
  },

  manifesto: {
    title: "Heritage is not a reference. It is a responsibility.",
    body:
      "Every garment, object, service, and visual expression must carry the same discipline: fewer gestures, stronger meaning. Sam’Alia treats clothing as architecture for identity — quiet, precise, and deeply rooted.",
  },

  principles: [
    {
      id: "heritage",
      title: "Heritage",
      text:
        "Northern memory is treated as source material, not decoration. Forms, gestures, and cultural codes are studied before they are transformed.",
    },
    {
      id: "restraint",
      title: "Restraint",
      text:
        "The house removes excess so construction can speak. Luxury is expressed through proportion, fabric, fit, and finish.",
    },
    {
      id: "craft",
      title: "Craft",
      text:
        "Craft is the evidence of attention. Every detail must feel considered, from the visible silhouette to the hidden seam.",
    },
    {
      id: "presence",
      title: "Presence",
      text:
        "Sam’Alia designs for people who enter quietly but are remembered. The pieces are built for elegance without performance.",
    },
  ],

  timeline: [
    {
      id: "origin",
      label: "01",
      title: "Origin",
      text:
        "The house begins with a Northern Nigerian point of view: culture, restraint, elegance, and the desire to create modern African luxury with permanence.",
    },
    {
      id: "atelier",
      label: "02",
      title: "Atelier language",
      text:
        "The visual language develops through fabric testing, proportion studies, embroidery direction, and garment construction.",
    },
    {
      id: "ready-to-wear",
      label: "03",
      title: "Ready to wear",
      text:
        "The first public expression of the house: clean pieces, modern silhouettes, and a foundation for daily luxury.",
    },
    {
      id: "future",
      label: "04",
      title: "The future",
      text:
        "Sam’Alia expands across fashion, craft, private services, journal storytelling, and cultural objects with the same house discipline.",
    },
  ],

  closing: {
    eyebrow: "House direction",
    title: "North from here. Modern everywhere.",
    body:
      "Sam’Alia is building a design language that can travel without losing its origin. The work is quiet, exacting, and made to last beyond the season.",
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