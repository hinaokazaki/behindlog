"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const postedRef = useRef(false);

  useEffect(() => {
    (async () => {
      // リダイレクトURLの ?code=... をセッションに交換
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const token = url.searchParams.get("token");
      const type = url.searchParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } else if (token && type === "signup") {
        const { error } = await supabase.auth.verifyOtp({
          type: "signup",
          token_hash: token,
        });
        if (error) throw error;
      }

      // セッションを取得（exchange 後なら入っている）
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      // 一度だけ /api/me を upsert（timezoneを保存）
      if (!postedRef.current) {
        postedRef.current = true;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const res = await fetch("/api/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ timezone: tz }),
        });

        if (!res.ok) console.error("POST /api/me failed", await res.json());
      }

      router.replace("/test"); // /me
    })();
  }, [router]);
  return null;
}
