import AboutSection from "./_components/AboutSection";
import Footer from "./_components/Footer";
import { HeroSection } from "./_components/HeroSection";
import HowtoUseSection from "./_components/HowtoUseSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        <HeroSection mode="lp" />
        <HowtoUseSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
