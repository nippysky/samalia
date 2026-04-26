// src/data/journal-content.ts
import type { CSSProperties } from "react";

export type JournalMediaKind = "image" | "video";

export type JournalMedia = {
  id: string;
  kind: JournalMediaKind;
  src: string;
  alt: string;
  posterSrc?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type JournalContentBlock =
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "heading";
      text: string;
    }
  | {
      id: string;
      type: "quote";
      text: string;
      credit?: string;
    }
  | {
      id: string;
      type: "image";
      image: JournalMedia;
      caption?: string;
    }
  | {
      id: string;
      type: "split";
      title: string;
      text: string;
      image: JournalMedia;
    };

export type JournalArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  heroImage: JournalMedia;
  heroVideo?: JournalMedia;
  excerpt: string;
  author: string;
  blocks: JournalContentBlock[];
  gallery: JournalMedia[];
};

const pexels = (id: string, width = 2200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const journalArticles: JournalArticle[] = [
  {
    id: "journal-001",
    slug: "north-from-here",
    title: "North from here",
    subtitle:
      "On the quiet discipline behind a house language shaped by memory, fabric, and restraint.",
    category: "House Notes",
    publishedAt: "2026-04-16",
    readTime: "4 min read",
    featured: true,
    author: "Sam’Alia Studio",
    heroImage: {
      id: "north-from-here-hero",
      kind: "image",
      src: pexels("9849297"),
      alt: "Fashion designer working late in a sewing workspace",
      objectPosition: "center",
    },
    heroVideo: {
      id: "north-from-here-video",
      kind: "video",
      src: "/dummy/craftlegacy-video.mp4",
      posterSrc: pexels("9849297"),
      alt: "Sam’Alia journal video editorial",
      objectPosition: "center",
    },
    excerpt:
      "A reflection on Sam’Alia’s visual discipline: not costume, not nostalgia, but a living design house shaped from the North outward.",
    blocks: [
      {
        id: "north-p1",
        type: "paragraph",
        text:
          "Sam’Alia begins with the belief that heritage does not need to be loud to be present. The house language is built from quiet codes: proportion, fabric weight, tonal restraint, and the discipline of finishing.",
      },
      {
        id: "north-quote",
        type: "quote",
        text:
          "The North is not used as decoration. It is treated as memory, method, and direction.",
        credit: "Sam’Alia Studio",
      },
      {
        id: "north-heading-1",
        type: "heading",
        text: "A design house before a fashion label",
      },
      {
        id: "north-p2",
        type: "paragraph",
        text:
          "For Sam’Alia, clothing is only one visible expression of a larger cultural system. Each collection must carry a point of view: cultural intelligence, modern restraint, and a sense of permanence.",
      },
      {
        id: "north-split",
        type: "split",
        title: "The atelier as archive",
        text:
          "Sketches, measurements, fabric trials, and unfinished samples become a living archive. These details inform what the house repeats, refuses, and refines.",
        image: {
          id: "north-split-image",
          kind: "image",
          src: pexels("9849642"),
          alt: "Fashion designer holding fabrics in an atelier",
          objectPosition: "center",
        },
      },
      {
        id: "north-p3",
        type: "paragraph",
        text:
          "The work is not to reproduce the past. The work is to understand what the past has already solved, then carry it forward with clarity.",
      },
    ],
    gallery: [
      {
        id: "north-gallery-01",
        kind: "image",
        src: pexels("9849642"),
        alt: "Fashion designer holding fabrics",
        objectPosition: "center",
      },
      {
        id: "north-gallery-02",
        kind: "image",
        src: pexels("4620619"),
        alt: "Two designers working in a fashion atelier",
        objectPosition: "center",
      },
    ],
  },
  {
    id: "journal-002",
    slug: "the-language-of-fabric",
    title: "The language of fabric",
    subtitle:
      "Why textile choice is not only material selection, but cultural positioning.",
    category: "Material Study",
    publishedAt: "2026-04-08",
    readTime: "5 min read",
    author: "Sam’Alia Studio",
    heroImage: {
      id: "fabric-hero",
      kind: "image",
      src: pexels("9849642"),
      alt: "Fashion designer holding fabrics",
      objectPosition: "center",
    },
    excerpt:
      "Fabric is the first architecture of a piece. It decides how the garment stands, falls, breathes, and remembers.",
    blocks: [
      {
        id: "fabric-p1",
        type: "paragraph",
        text:
          "Every fabric carries a behavior. Some fabrics ask for volume, some ask for structure, and some demand silence. The role of the house is to listen before cutting.",
      },
      {
        id: "fabric-heading",
        type: "heading",
        text: "Texture before ornament",
      },
      {
        id: "fabric-p2",
        type: "paragraph",
        text:
          "Sam’Alia treats texture as a primary design decision. Surface, hand-feel, weight, and light absorption define the emotional tone of a piece before any decorative intervention.",
      },
      {
        id: "fabric-image",
        type: "image",
        image: {
          id: "fabric-body-image",
          kind: "image",
          src: pexels("9849307"),
          alt: "Fashion designer working in dimly lit room",
          objectPosition: "center",
        },
        caption: "Material testing as part of the house archive.",
      },
    ],
    gallery: [
      {
        id: "fabric-gallery-01",
        kind: "image",
        src: pexels("9849307"),
        alt: "Fashion designer working with sketches",
        objectPosition: "center",
      },
      {
        id: "fabric-gallery-02",
        kind: "image",
        src: pexels("4620612"),
        alt: "Fashion designer working with a model",
        objectPosition: "center",
      },
    ],
  },
  {
    id: "journal-003",
    slug: "the-private-appointment",
    title: "The private appointment",
    subtitle:
      "A slower client experience for fittings, measurements, and personal design direction.",
    category: "Service",
    publishedAt: "2026-03-28",
    readTime: "3 min read",
    author: "Sam’Alia Studio",
    heroImage: {
      id: "appointment-hero",
      kind: "image",
      src: pexels("4620612"),
      alt: "Fashion designer working with a model during a fitting",
      objectPosition: "center",
    },
    excerpt:
      "Private appointments are designed around attention: measurements, intent, fabric, and the client’s presence.",
    blocks: [
      {
        id: "appointment-p1",
        type: "paragraph",
        text:
          "A private appointment is not simply a shopping session. It is a space for understanding proportion, purpose, and how a client wants to be seen.",
      },
      {
        id: "appointment-heading",
        type: "heading",
        text: "Measured, not rushed",
      },
      {
        id: "appointment-p2",
        type: "paragraph",
        text:
          "The appointment format allows the house to slow the process down. Fit, sleeve length, fabric behavior, and finishing preferences can all be reviewed with intention.",
      },
      {
        id: "appointment-quote",
        type: "quote",
        text:
          "Luxury is not always excess. Sometimes it is simply being properly attended to.",
      },
    ],
    gallery: [
      {
        id: "appointment-gallery-01",
        kind: "image",
        src: pexels("4620612"),
        alt: "Designer fitting a garment",
        objectPosition: "center",
      },
      {
        id: "appointment-gallery-02",
        kind: "image",
        src: pexels("9849642"),
        alt: "Fashion designer with fabrics",
        objectPosition: "center",
      },
    ],
  },
  {
    id: "journal-004",
    slug: "restraint-as-luxury",
    title: "Restraint as luxury",
    subtitle:
      "A note on why quiet design can carry more authority than visual noise.",
    category: "Perspective",
    publishedAt: "2026-03-18",
    readTime: "4 min read",
    author: "Sam’Alia Studio",
    heroImage: {
      id: "restraint-hero",
      kind: "image",
      src: pexels("9849307"),
      alt: "Fashion designer working in a dimly lit room",
      objectPosition: "center",
    },
    excerpt:
      "When a garment is stripped of noise, construction becomes visible. That is where authority begins.",
    blocks: [
      {
        id: "restraint-p1",
        type: "paragraph",
        text:
          "Restraint is not emptiness. It is editing. It is knowing what to remove so the essential parts can become stronger.",
      },
      {
        id: "restraint-heading",
        type: "heading",
        text: "Silence as a design tool",
      },
      {
        id: "restraint-p2",
        type: "paragraph",
        text:
          "A quiet garment must rely on proportion, fabric, and finishing. Without ornament to distract the eye, every decision becomes more important.",
      },
    ],
    gallery: [
      {
        id: "restraint-gallery-01",
        kind: "image",
        src: pexels("9849307"),
        alt: "Designer working in a studio",
        objectPosition: "center",
      },
      {
        id: "restraint-gallery-02",
        kind: "image",
        src: pexels("4620619"),
        alt: "Designers collaborating in a studio",
        objectPosition: "center",
      },
    ],
  },
];

export async function getJournalArticles(): Promise<JournalArticle[]> {
  return journalArticles;
}

export async function getJournalArticleBySlug(
  slug: string
): Promise<JournalArticle | null> {
  return journalArticles.find((article) => article.slug === slug) ?? null;
}

export function getJournalArticleSlugs() {
  return journalArticles.map((article) => ({
    journalSlug: article.slug,
  }));
}

export function formatJournalDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}