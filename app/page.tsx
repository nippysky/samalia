// app/page.tsx
import {
  HomeFeatureLinks,
  type HomeFeatureLink,
} from "@/src/components/home/home-feature-links";
import { HomeHero, type HomeHeroData } from "@/src/components/home/home-hero";

const homeHeroData: HomeHeroData = {
  imageSrc: "/images/home-hero.jpeg",
  imageAlt: "Sam’Alia luxury fashion editorial",
  imagePosition: "center",
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
    title: "Elevated everyday",
    href: "/bespoke-services",
    imageSrc: "/images/elevated-daily.jpeg",
    imageAlt: "Sam’Alia elevated everyday editorial",
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

export default function Home() {
  return (
    <main className="lux-page bg-white text-black">
      <HomeHero hero={homeHeroData} />
      <HomeFeatureLinks items={homeFeatureLinks} />
    </main>
  );
}