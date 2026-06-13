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
      "A reflection on the house’s visual discipline — not costume, not nostalgia, but a system built through structure, craft, and control.",
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
      "Fabric determines how a garment stands, moves, and holds its shape. It is the starting point for every piece.",
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
      "Private appointments are built around precision — measurements, material selection, and a clear understanding of the client.",
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
      "When excess is removed, construction becomes visible. That is where clarity and authority begin.",
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

// ── DB helpers ────────────────────────────────────────────────────

import { prisma } from "@/src/lib/prisma";
import type {
  JournalArticle as DbArticle,
  JournalBlock,
  JournalGalleryImage,
} from "@/src/generated/prisma/client";

type ArticleFull = DbArticle & {
  blocks: JournalBlock[];
  gallery: JournalGalleryImage[];
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=80";

function mapDbBlock(block: JournalBlock): JournalContentBlock {
  switch (block.type) {
    case "HEADING":
      return { id: block.id, type: "heading", text: block.content ?? "" };
    case "QUOTE":
      return { id: block.id, type: "quote", text: block.content ?? "" };
    case "IMAGE":
      return {
        id: block.id,
        type: "image",
        image: {
          id: block.id,
          kind: "image",
          src: block.imageSrc ?? PLACEHOLDER_IMG,
          alt: block.imageAlt ?? "",
          objectPosition: "center",
        },
      };
    default:
      return { id: block.id, type: "paragraph", text: block.content ?? "" };
  }
}

function mapDbArticle(a: ArticleFull): JournalArticle {
  const heroSrc = a.coverImageSrc ?? PLACEHOLDER_IMG;
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle ?? "",
    category: a.category ?? "House Notes",
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString().split("T")[0],
    readTime: "4 min read",
    featured: false,
    heroImage: {
      id: `${a.id}-hero`,
      kind: "image",
      src: heroSrc,
      alt: a.coverImageAlt || a.title,
      objectPosition: "center",
    },
    excerpt: a.excerpt ?? "",
    author: a.author ?? "Sam'Aila Studio",
    blocks: a.blocks.map(mapDbBlock),
    gallery: (a.gallery as Array<{ id: string; imageSrc: string; imageAlt: string | null }>).map((g) => ({
      id: g.id,
      kind: "image" as JournalMediaKind,
      src: g.imageSrc,
      alt: g.imageAlt || "",
      objectPosition: "center",
    })),
  };
}

async function getDbArticles(): Promise<JournalArticle[] | null> {
  try {
    const articles = await prisma.journalArticle.findMany({
      where: { published: true },
      include: {
        blocks: { orderBy: { order: "asc" } },
        gallery: { orderBy: { order: "asc" } },
      },
      orderBy: { publishedAt: "desc" },
    });
    if (articles.length === 0) return null;
    return articles.map(mapDbArticle);
  } catch {
    return null;
  }
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  const dbArticles = await getDbArticles();
  return dbArticles ?? journalArticles;
}

export async function getJournalArticleBySlug(
  slug: string
): Promise<JournalArticle | null> {
  try {
    const a = await prisma.journalArticle.findUnique({
      where: { slug },
      include: {
        blocks: { orderBy: { order: "asc" } },
        gallery: { orderBy: { order: "asc" } },
      },
    });
    if (a) return mapDbArticle(a);
  } catch {}
  return journalArticles.find((a) => a.slug === slug) ?? null;
}

export async function getJournalArticleSlugs() {
  try {
    const slugs = await prisma.journalArticle.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (slugs.length > 0) return (slugs as Array<{ slug: string }>).map((a) => ({ journalSlug: a.slug }));
  } catch {}
  return journalArticles.map((a) => ({ journalSlug: a.slug }));
}

export function formatJournalDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}