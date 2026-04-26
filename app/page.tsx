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

const homeHeroData: HomeHeroData = {
  intervalMs: 14_000,
  slides: [
    {
      id: "samalia-hero-local",
      imageSrc: "/images/home-hero.jpeg",
      imageAlt: "Sam’Alia luxury fashion editorial",
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

const homeFeatureLinks: HomeFeatureLink[] = [
  {
    title: "Ready to wear",
    href: "/ready-to-wear",
    imageSrc: "/images/ready-wear.jpeg",
    imageAlt: "Sam’Alia ready to wear editorial",
    imagePosition: "center",
  },
  {
    title: "Bespoke Services",
    href: "/bespoke-services",
    imageSrc: "/images/elevated-daily.jpeg",
    imageAlt: "Sam’Alia bespoke services editorial",
    imagePosition: "center",
  },
  {
    title: "Craft & legacy",
    href: "/craft-legacy",
    imageSrc: "/images/craft-legacy.jpeg",
    imageAlt: "Sam’Alia craft and legacy textile detail",
    imagePosition: "center",
  },
];

const homeHouseFeature: HomeHouseFeatureData = {
  eyebrow: "From the house",
  title: "A language of restraint, craft, and northern memory.",
  description:
    "Sam’Alia moves between culture, construction, and modern presence through pieces shaped with quiet authority.",
  href: "/journal",
  ctaLabel: "Read the journal",
  mediaType: "image",
  mediaSrc:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=90",
  mediaAlt: "Editorial fashion image representing Sam’Alia house language",
  imagePosition: "center",
};

export default function Home() {
  return (
    <main className="lux-page bg-white text-black">
      <HomeHero hero={homeHeroData} />
      <HomeFeatureLinks items={homeFeatureLinks} />
      <HomeHouseFeature feature={homeHouseFeature} />
    </main>
  );
}