import { AboutSection } from "@/features/home/components/AboutSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { FeaturedArtworks } from "@/features/home/components/FeaturedArtworks";
import { HeroSection } from "@/features/home/components/HeroSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedArtworks />
      <AboutSection />
      <CtaSection />
    </>
  );
}
