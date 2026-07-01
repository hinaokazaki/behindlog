"use client";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Loading from "@/app/_components/Loading";

function AuthCallbackContent() {
  const router = useRouter();
  const postedRef = useRef(false);
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  useEffect(() => {
    if (postedRef.current) return;
    postedRef.current = true;

    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const optToken = url.searchParams.get("token");
        const type = url.searchParams.get("type");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (optToken && type === "signup") {
          const { error } = await supabase.auth.verifyOtp({
            type: "signup",
            token_hash: optToken,
          });
          if (error) throw error;
        }

        // セッションを取得（exchange 後なら入っている）
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (!session) {
          router.replace("/login");
          return;
        }

        // /api/me を upsert（timezoneを保存）
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await fetch("/api/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ timezone: tz }),
        });

        if (inviteToken) {
          await fetch("/api/friends/link", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ inviteToken }),
          });
        }

        router.replace("/admin/me");
      } catch (error) {
        router.replace("/login");
      }
    })();
  }, [router, inviteToken]);
  return <Loading />;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
