"use client";
import { useSearchParams } from "next/navigation";
import { FriendInviteResponse } from "@/schemas/friend";
import useFetch from "../admin/_hooks/useFetch";
import Loading from "../_components/Loading";
import Link from "next/link";
import { HeroSection } from "../_components/HeroSection";
import { User, Mail } from "lucide-react";

// 中間ページ
// GET /api/friends/invite?inviteToken=xxxx ユーザー_招待お知らせ情報取得から情報取得

export default function InvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("inviteToken");

  if (!token) {
    return <p>無効なリンクです。</p>;
  }
  const { data, error, isLoading } = useFetch<FriendInviteResponse>(
    `/api/friends/invite?inviteToken=${token}`,
  );

  if (isLoading) return <Loading />;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  console.log("data:", data);
  if (!data?.friendInvite) {
    return <p>招待データが見つかりませんでした。</p>;
  }
  const invitation = data.friendInvite;

  return (
    <div className="my-[84px] flex flex-row items-center justify-center gap-[80px]">
      <HeroSection mode="invite" />
      <div className="my-[84px] flex w-[550px] flex-col items-center gap-10 rounded-xl border-[2.5px] border-foreground px-8 py-6">
        <div>
          <h1 className="mb-6 text-subtitle-top font-bold text-foreground">
            友達からの招待
          </h1>
          <p className="mb-2 flex items-center text-body text-foreground">
            あなたに
            <User className="mx-2 h-5 w-5 text-buttonMain" />
            <span className="mr-2 font-bold text-foreground">
              {invitation.inviterName}
            </span>
            から招待が届いています!
          </p>
          <p className="flex items-center text-body text-foreground">
            <Mail className="mx-2 h-5 w-5 text-buttonMain" />
            <span className="mr-2 font-bold text-foreground">
              {invitation.message}
            </span>
          </p>
        </div>
        <div className="mb-3">
          {invitation.alreadyRegistered ? (
            <Link
              href="/login"
              className="rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:text-form-text"
            >
              ログインして参加
            </Link>
          ) : (
            <Link
              href={`/signup?inviteToken=${token}`}
              className="rounded-xl border-[2px] border-secondary bg-secondary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-secondary-hover md:text-form-text"
            >
              新規登録して参加
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
