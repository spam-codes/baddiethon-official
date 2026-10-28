import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { TimelineSection } from "@/components/timeline/TimelineSection";
import { TracksSection } from "@/components/tracks/TracksSection";
import { RewardsSection } from "@/components/rewards/RewardsSection";
import { PartnersSection } from "@/components/partners/PartnersSection";
import { SponsorsSection } from "@/components/sponsors/SponsorsSection";
import { FAQSection } from "@/components/faqs/FAQSection";

export default function Home() {
  return (
    <>
      <CinematicIntro />
      <Navbar />

      <main id="main" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <TimelineSection />
        <TracksSection />
        <RewardsSection />
        <PartnersSection />
        <SponsorsSection />
        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
