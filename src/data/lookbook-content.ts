// src/data/lookbook-content.ts
import type { CSSProperties } from "react";

export type LookbookMediaKind = "image" | "video";

export type LookbookMedia = {
  id: string;
  kind: LookbookMediaKind;
  src: string;
  alt: string;
  posterSrc?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export type LookbookLook = {
  id: string;
  title: string;
  lookNumber: string;
  description: string;
  category: string;
  image: LookbookMedia;
};

export type LookbookEntry = {
  id: string;
  slug: string;
  title: string;
  season: string;
  category: string;
  year: string;
  subtitle: string;
  description: string;
  featured?: boolean;
  heroImage: LookbookMedia;
  heroVideo?: LookbookMedia;
  coverImage: LookbookMedia;
  statement: {
    eyebrow: string;
    title: string;
    body: string;
  };
  looks: LookbookLook[];
  gallery: LookbookMedia[];
};

const pexels = (id: string, width = 2400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const lookbookEntries: LookbookEntry[] = [
  {
    id: "lookbook-001",
    slug: "north-from-here-2026",
    title: "North From Here",
    season: "First Study",
    category: "Collection",
    year: "2026",
    featured: true,
    subtitle:
      "A first visual study of restraint, heat, memory, and modern Northern presence.",
    description:
      "North From Here introduces Sam’Alia’s house language through clean silhouettes, sun-washed surfaces, quiet tailoring, and cultural memory translated into modern form.",
    coverImage: {
      id: "north-cover",
      kind: "image",
      src: pexels("35670151", 2200),
      alt: "Elegant portrait of a Black model in Lagos",
      objectPosition: "center",
    },
    heroImage: {
      id: "north-hero",
      kind: "image",
      src: pexels("35670151", 2600),
      alt: "Minimal portrait of a Black model in Lagos",
      objectPosition: "center",
    },
    heroVideo: {
      id: "north-video",
      kind: "video",
      src: "/dummy/craftlegacy-video.mp4",
      posterSrc: pexels("35670151", 2400),
      alt: "Sam’Alia lookbook moving portrait",
      objectPosition: "center",
    },
    statement: {
      eyebrow: "Lookbook 01",
      title: "A quiet beginning from the North.",
      body:
        "The collection studies what happens when Northern references are not copied, but refined. The silhouettes are still, the surfaces are restrained, and the mood is deliberate.",
    },
    looks: [
      {
        id: "north-look-01",
        lookNumber: "Look 01",
        title: "Ivory stillness",
        category: "Shirting",
        description:
          "A softened ivory silhouette with clean construction and quiet surface authority.",
        image: {
          id: "north-look-01-image",
          kind: "image",
          src: pexels("35670151", 1600),
          alt: "Look 01 portrait",
          objectPosition: "center",
        },
      },
      {
        id: "north-look-02",
        lookNumber: "Look 02",
        title: "Field restraint",
        category: "Daily form",
        description:
          "An easy form designed for movement, heat, and modern city presence.",
        image: {
          id: "north-look-02-image",
          kind: "image",
          src: pexels("32703279", 1600),
          alt: "Young Black man with tropical background",
          objectPosition: "center",
        },
      },
      {
        id: "north-look-03",
        lookNumber: "Look 03",
        title: "Atelier line",
        category: "Tailoring",
        description:
          "A measured tailoring gesture, built around the private appointment language.",
        image: {
          id: "north-look-03-image",
          kind: "image",
          src: pexels("6764997", 1600),
          alt: "Tailor measuring a client",
          objectPosition: "center",
        },
      },
      {
        id: "north-look-04",
        lookNumber: "Look 04",
        title: "Ceremonial ease",
        category: "Ceremonial",
        description:
          "A clean ceremonial direction with restrained richness and modern posture.",
        image: {
          id: "north-look-04-image",
          kind: "image",
          src: pexels("29479572", 1600),
          alt: "Fashion portrait of a model in Nigeria",
          objectPosition: "center",
        },
      },
    ],
    gallery: [
      {
        id: "north-gallery-01",
        kind: "image",
        src: pexels("35670150", 2200),
        alt: "Elegant portrait of a Black model in Lagos",
        objectPosition: "center",
      },
      {
        id: "north-gallery-02",
        kind: "image",
        src: pexels("6766234", 2200),
        alt: "Tailor measuring a client's chest",
        objectPosition: "center",
      },
      {
        id: "north-gallery-03",
        kind: "image",
        src: pexels("32703279", 2200),
        alt: "Portrait of a young Black man in Nigeria",
        objectPosition: "center",
      },
    ],
  },
  {
    id: "lookbook-002",
    slug: "atelier-memory",
    title: "Atelier Memory",
    season: "Craft Study",
    category: "Craft",
    year: "2026",
    subtitle:
      "A craft-led study of measurement, fabric, construction, and the private hand.",
    description:
      "Atelier Memory is built around process: measurements, fabric behavior, studio silence, and the intimate discipline behind the final garment.",
    coverImage: {
      id: "atelier-cover",
      kind: "image",
      src: pexels("6766234", 2200),
      alt: "Tailor measuring a client's chest",
      objectPosition: "center",
    },
    heroImage: {
      id: "atelier-hero",
      kind: "image",
      src: pexels("6766234", 2600),
      alt: "Bespoke tailoring measurement",
      objectPosition: "center",
    },
    statement: {
      eyebrow: "Lookbook 02",
      title: "Craft begins before the garment is visible.",
      body:
        "The hand records the body, the cloth responds, and the piece begins to take shape. This lookbook treats the atelier as a living archive of restraint.",
    },
    looks: [
      {
        id: "atelier-look-01",
        lookNumber: "Look 01",
        title: "Measured line",
        category: "Bespoke",
        description:
          "A clean study of fitting and construction before the final garment emerges.",
        image: {
          id: "atelier-look-01-image",
          kind: "image",
          src: pexels("6766234", 1600),
          alt: "Tailor measuring a client",
          objectPosition: "center",
        },
      },
      {
        id: "atelier-look-02",
        lookNumber: "Look 02",
        title: "Private fitting",
        category: "Service",
        description:
          "The appointment ritual translated into a visual language of precision.",
        image: {
          id: "atelier-look-02-image",
          kind: "image",
          src: pexels("6764997", 1600),
          alt: "Tailor fitting a client",
          objectPosition: "center",
        },
      },
      {
        id: "atelier-look-03",
        lookNumber: "Look 03",
        title: "Studio form",
        category: "Construction",
        description:
          "A quiet view of the making process, from proportion to final presence.",
        image: {
          id: "atelier-look-03-image",
          kind: "image",
          src: pexels("9849297", 1600),
          alt: "Fashion designer working late in a studio",
          objectPosition: "center",
        },
      },
    ],
    gallery: [
      {
        id: "atelier-gallery-01",
        kind: "image",
        src: pexels("9849297", 2200),
        alt: "Fashion designer working in atelier",
        objectPosition: "center",
      },
      {
        id: "atelier-gallery-02",
        kind: "image",
        src: pexels("9849642", 2200),
        alt: "Fashion designer holding fabric",
        objectPosition: "center",
      },
    ],
  },
  {
    id: "lookbook-003",
    slug: "ceremonial-heat",
    title: "Ceremonial Heat",
    season: "Campaign",
    category: "Campaign",
    year: "2026",
    subtitle:
      "A campaign study of ceremony, warmth, surface, and modern African elegance.",
    description:
      "Ceremonial Heat brings stronger color, portraiture, and occasion dressing into Sam’Alia’s restrained black-and-white system.",
    coverImage: {
      id: "ceremonial-cover",
      kind: "image",
      src: pexels("29479572", 2200),
      alt: "Vibrant fashion portrait of a model in Nigeria",
      objectPosition: "center",
    },
    heroImage: {
      id: "ceremonial-hero",
      kind: "image",
      src: pexels("29479572", 2600),
      alt: "Fashion portrait of a model in Nigeria",
      objectPosition: "center",
    },
    heroVideo: {
      id: "ceremonial-video",
      kind: "video",
      src: "/dummy/craftlegacy-video.mp4",
      posterSrc: pexels("29479572", 2400),
      alt: "Sam’Alia ceremonial campaign video",
      objectPosition: "center",
    },
    statement: {
      eyebrow: "Lookbook 03",
      title: "Occasion dressing, without noise.",
      body:
        "Ceremony does not have to be heavy. The work is to carry presence with clarity: refined fabric, exact proportion, and a silhouette that understands the room.",
    },
    looks: [
      {
        id: "ceremonial-look-01",
        lookNumber: "Look 01",
        title: "Floral ceremony",
        category: "Occasion",
        description:
          "A vivid ceremonial direction held together by clean composition.",
        image: {
          id: "ceremonial-look-01-image",
          kind: "image",
          src: pexels("29479572", 1600),
          alt: "Vibrant fashion portrait",
          objectPosition: "center",
        },
      },
      {
        id: "ceremonial-look-02",
        lookNumber: "Look 02",
        title: "Red study",
        category: "Editorial",
        description:
          "A stronger editorial mood for the house’s visual archive.",
        image: {
          id: "ceremonial-look-02-image",
          kind: "image",
          src: pexels("22690354", 1600),
          alt: "Editorial fashion portrait of a Black woman",
          objectPosition: "center",
        },
      },
      {
        id: "ceremonial-look-03",
        lookNumber: "Look 03",
        title: "Lagos portrait",
        category: "Portrait",
        description:
          "A portrait language built from stillness, focus, and urban elegance.",
        image: {
          id: "ceremonial-look-03-image",
          kind: "image",
          src: pexels("35670150", 1600),
          alt: "Elegant portrait of a Black model in Lagos",
          objectPosition: "center",
        },
      },
    ],
    gallery: [
      {
        id: "ceremonial-gallery-01",
        kind: "image",
        src: pexels("22690354", 2200),
        alt: "Editorial fashion portrait",
        objectPosition: "center",
      },
      {
        id: "ceremonial-gallery-02",
        kind: "image",
        src: pexels("35670150", 2200),
        alt: "Lagos fashion portrait",
        objectPosition: "center",
      },
    ],
  },
];

export async function getLookbookEntries(): Promise<LookbookEntry[]> {
  return lookbookEntries;
}

export async function getLookbookEntryBySlug(
  slug: string
): Promise<LookbookEntry | null> {
  return lookbookEntries.find((entry) => entry.slug === slug) ?? null;
}

export function getLookbookSlugs() {
  return lookbookEntries.map((entry) => ({
    lookbookSlug: entry.slug,
  }));
}