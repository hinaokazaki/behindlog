"use client";
import { supabase } from "@/utils/supabase";
import AboutSection from "./_components/AboutSection";
import Footer from "./_components/Footer";
import { HeroSection } from "./_components/HeroSection";
import HowtoUseSection from "./_components/HowtoUseSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGuestLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_GUEST_EMAIL!,
      password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
    });

    if (error || !data.session) {
      alert("Guest login failed");
      return;
    }

    router.replace("/admin/dashboard");
  };

  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        <HeroSection mode="lp" handleGuestLogin={handleGuestLogin} />
        <section id="how-to-use">
          <HowtoUseSection />
        </section>
        <section id="about">
          <AboutSection handleGuestLogin={handleGuestLogin} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
