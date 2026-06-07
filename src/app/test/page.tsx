// app/test/page.tsx

"use client";

import Input from "../_components/Input";
import Label from "../_components/Label";
import Button from "../_components/Button";
import Textarea from "../_components/Textarea";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Footer from "../_components/Footer";
import AboutSection from "../_components/AboutSection";
import HowtoUseSection from "../_components/HowtoUseSection";
import { HeroSection } from "../_components/HeroSection";

export default function InputTestPage() {
  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Access Token:", data.session?.access_token);
    };
    getToken();
  }, []);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
        <HeroSection mode="lp" />
        <HowtoUseSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
