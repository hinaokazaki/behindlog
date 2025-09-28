// 中間ページ
// GET /api/friends/invite?token=xxxx ユーザー_招待お知らせ情報取得から情報取得
// ボタンはalreadyRegisteredの有無によってlabelを新規登録かログインに変更
// リンク先にはtokenを付ける

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../_components/Button";

const searchParams = useSearchParams();
const token = searchParams.get("token");

export default function invite() {
  const [invite, setInvite] = useState();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`/api/friends/invite?token=${token}`);
        const date = await res.json();
        setInvite(date);
      } catch (error) {
        console.error("Failed to fetch invite:", error);
      }
    })();
  }, [token]);

  return (
    <div>
      <div>
        <h1>友達からの招待</h1>
        <p>あなたに00から招待が届いています</p>
        <p></p>
      </div>
      <Button color="red" label="label" variant="outlined" />
    </div>
  );
}
