// app/test/page.tsx
"use client";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase";

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8"></main>
    </>
  );
}
