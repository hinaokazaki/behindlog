"use client";
import { useSearchParams } from "next/navigation";
import { FriendInviteResponse } from "@/schemas/friend";
import Loading from "../_components/Loading";
import Link from "next/link";
import { HeroSection } from "../_components/HeroSection";
import { User, Mail } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

function InvitePageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("inviteToken");

  const [data, setData] = useState<FriendInviteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchInvite = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/friends/invite?inviteToken=${token}`);

        if (!res.ok) {
          throw new Error("招待情報の取得に失敗しました");
        }

        const result: FriendInviteResponse = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-center font-semibold text-foreground">
          無効なリンクです。
        </p>
      </div>
    );
  }

  if (isLoading) return <Loading />;
  if (error) {
    return <p className="px-4 text-center">エラーが発生しました: {error}</p>;
  }

  if (!data?.friendInvite) {
    return (
      <p className="px-4 text-center">招待データが見つかりませんでした。</p>
    );
  }

  const invitation = data.friendInvite;

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:my-[84px] lg:flex-row lg:gap-[80px] lg:px-8">
      <HeroSection mode="invite" />

      <div className="flex w-full max-w-[550px] flex-col items-center gap-8 rounded-2xl border-[2.5px] border-foreground px-5 py-6 sm:px-8">
        <div className="w-full">
          <h1 className="mb-6 text-center text-subtitle-top font-bold text-foreground lg:text-left">
            友達からの招待
          </h1>

          <p className="mb-4 flex flex-wrap items-center justify-center text-center text-foreground sm:text-body lg:justify-start lg:text-left">
            あなたに
            <User className="mx-2 h-5 w-5 shrink-0 text-buttonMain" />
            <span className="mr-2 font-bold text-foreground">
              {invitation.inviterName}
            </span>
            から招待が届いています!
          </p>

          <p className="flex flex-wrap items-center justify-center text-center text-foreground sm:text-body lg:justify-start lg:text-left">
            <Mail className="mx-2 h-5 w-5 shrink-0 text-buttonMain" />
            <span className="font-bold text-foreground">
              {invitation.message}
            </span>
          </p>
        </div>

        <div className="w-full sm:w-auto">
          {invitation.alreadyRegistered ? (
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover sm:text-form-text"
            >
              ログインして参加
            </Link>
          ) : (
            <Link
              href={`/signup?inviteToken=${token}`}
              className="flex w-full items-center justify-center rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover sm:text-form-text"
            >
              新規登録して参加
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<Loading />}>
      <InvitePageContent />
    </Suspense>
  );
}
