// app/page.tsx
import {
  HomeFeatureLinks,
  type HomeFeatureLink,
} from "@/src/components/home/home-feature-links";
import {
  HomeHero,
  type HomeHeroData,
} from "@/src/components/home/home-hero";
import {
  HomeHouseFeature,
  type HomeHouseFeatureData,
} from "@/src/components/home/home-house-feature";
import { prisma } from "@/src/lib/prisma";

// ── Static fallback data ──────────────────────────────────────────

const staticHeroData: HomeHeroData = {
  intervalMs: 14_000,
  slides: [
    {
      id: "samalia-hero-local",
      imageSrc: "/images/home-hero.jpeg",
      imageAlt: "Sam'Alia luxury fashion editorial",
      imagePosition: "center",
      ctaLabel: "Lookbook",
      ctaHref: "/lookbook",
    },
    {
      id: "samalia-hero-editorial-01",
      imageSrc:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2200&q=92",
      imageAlt: "Minimal fashion editorial portrait",
      imagePosition: "center",
      ctaLabel: "Ready to wear",
      ctaHref: "/ready-to-wear",
    },
    {
      id: "samalia-hero-editorial-02",
      imageSrc:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=92",
      imageAlt: "Luxury fashion editorial model in refined styling",
      imagePosition: "center 35%",
      ctaLabel: "Craft & legacy",
      ctaHref: "/craft-legacy",
    },
    {
      id: "samalia-hero-editorial-03",
      imageSrc:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=2200&q=92",
      imageAlt: "Editorial fashion image with quiet luxury styling",
      imagePosition: "center",
      ctaLabel: "Bespoke services",
      ctaHref: "/bespoke-services",
    },
  ],
};

const staticFeatureLinks: HomeFeatureLink[] = [
  {
    title: "Ready to wear",
    href: "/ready-to-wear",
    imageSrc: "/images/ready-wear.jpeg",
    imageAlt: "Sam'Alia ready to wear editorial",
    imagePosition: "center",
  },
  {
    title: "Bespoke Services",
    href: "/bespoke-services",
    imageSrc: "/images/elevated-daily.jpeg",
    imageAlt: "Sam'Alia bespoke services editorial",
    imagePosition: "center",
  },
  {
    title: "Craft & legacy",
    href: "/craft-legacy",
    imageSrc: "/images/craft-legacy.jpeg",
    imageAlt: "Sam'Alia craft and legacy textile detail",
    imagePosition: "center",
  },
];

const staticHouseFeature: HomeHouseFeatureData = {
  eyebrow: "From the house",
  title: "A language of restraint, craft, and northern memory.",
  description:
    "Sam'Alia moves between culture, construction, and modern presence through pieces shaped with quiet authority.",
  href: "/journal",
  ctaLabel: "Read the journal",
  mediaType: "image",
  mediaSrc:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90",
  mediaAlt: "Editorial fashion image representing Sam'Alia house language",
  imagePosition: "center",
};

// ── Data fetchers ─────────────────────────────────────────────────

async function getHeroData(): Promise<HomeHeroData> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (slides.length === 0) return staticHeroData;
    return {
      intervalMs: 14_000,
      slides: (slides as Array<{ id: string; imageSrc: string; imageAlt: string; imagePosition: string | null; headline: string | null; subheadline: string | null; ctaLabel: string; ctaHref: string }>).map((s) => ({
        id: s.id,
        imageSrc: s.imageSrc,
        imageAlt: s.imageAlt,
        imagePosition: s.imagePosition ?? undefined,
        headline: s.headline ?? undefined,
        subheadline: s.subheadline ?? undefined,
        ctaLabel: s.ctaLabel,
        ctaHref: s.ctaHref,
      })),
    };
  } catch {
    return staticHeroData;
  }
}

async function getFeatureLinks(): Promise<HomeFeatureLink[]> {
  try {
    const links = await prisma.homeFeatureLink.findMany({
      orderBy: { order: "asc" },
    });
    if (links.length === 0) return staticFeatureLinks;
    return (links as Array<{ title: string; href: string; imageSrc: string; imageAlt: string; imagePosition: string | null }>).map((l) => ({
      title: l.title,
      href: l.href,
      imageSrc: l.imageSrc,
      imageAlt: l.imageAlt,
      imagePosition: l.imagePosition ?? undefined,
    }));
  } catch {
    return staticFeatureLinks;
  }
}

// ── Page ──────────────────────────────────────────────────────────

export default async function Home() {
  const [heroData, featureLinks] = await Promise.all([
    getHeroData(),
    getFeatureLinks(),
  ]);

  return (
    <main className="lux-page bg-white text-black">
      <HomeHero hero={heroData} />
      <HomeFeatureLinks items={featureLinks} />
      <HomeHouseFeature feature={staticHouseFeature} />
    </main>
  );
}
