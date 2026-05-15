import Nav from "@/components/nav";
import HeroSection from "@/components/hero-section";
import ReelSection from "@/components/reel-section";
import WorkSection from "@/components/work-section";
import AboutSection from "@/components/about-section";
import FilmSection from "@/components/film-section";
import GallerySection from "@/components/gallery-section";
import PressSection from "@/components/press-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-white selection:text-black">
      <Nav />
      <main className="w-full">
        <HeroSection />
        <ReelSection />
        <WorkSection />
        <AboutSection />
        <FilmSection />
        <GallerySection />
        <PressSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
