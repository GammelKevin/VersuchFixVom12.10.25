import { VideoHero } from "@/components/ui/video-hero";
import { Navigation } from "@/components/ui/navigation";
import { AboutSection } from "@/components/ui/about-section";
import { AwardsSection } from "@/components/ui/awards-section";
import { OpeningHours } from "@/components/ui/opening-hours";
import { ContactSection } from "@/components/ui/contact-section";
import { Footer } from "@/components/ui/footer";
import { StructuredData } from "@/components/structured-data";
import { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: SEO_PAGES.home.title,
  description: SEO_PAGES.home.description,
  keywords: SEO_PAGES.home.keywords,
  openGraph: {
    title: SEO_PAGES.home.title,
    description: SEO_PAGES.home.description,
    type: 'website',
  },
};

async function getOpeningHours() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/opening-hours`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const openingHours = await getOpeningHours();

  return (
    <>
      <StructuredData openingHours={openingHours} />
      <Navigation variant="transparent" />
      <main>
        <div id="home">
          <VideoHero />
        </div>
        <AboutSection />
        <AwardsSection />
        <OpeningHours />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
