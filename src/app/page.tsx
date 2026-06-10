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

    await fetch("/api/me", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Guest",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    router.replace("/admin/dashboard");
  };

  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        <HeroSection mode="lp" handleGuestLogin={handleGuestLogin} />
        <HowtoUseSection />
        <AboutSection handleGuestLogin={handleGuestLogin} />
      </main>
      <Footer />
    </div>
  );
}
