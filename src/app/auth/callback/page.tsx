"use client";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { useApi } from "@/app/_hooks/useApi";
import { FriendLinkResponse } from "@/schemas/friend";
import { ProfileResponse } from "@/schemas/me";
import Loading from "@/app/_components/Loading";

function AuthCallbackContent() {
  const router = useRouter();
  const postedRef = useRef(false);
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const { callApi, token: useApiToken } = useApi();

  useEffect(() => {
    if (!useApiToken || postedRef.current) return;
    postedRef.current = true;

    (async () => {
      try {
        // リダイレクトURLの ?code=... をセッションに交換
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
        await callApi<ProfileResponse>("/api/me", "POST", {
          timezone: tz,
        });

        if (inviteToken) {
          await callApi<FriendLinkResponse>("/api/friends/link", "PATCH", {
            inviteToken,
          });
        }

        router.replace("/admin/me");
      } catch (error) {
        console.error("Auth callback error:", error);
      }
    })();
  }, [router, inviteToken, callApi, useApiToken]);
  return null;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
