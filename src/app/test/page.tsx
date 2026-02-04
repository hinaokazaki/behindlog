// app/test/page.tsx

"use client";

import Input from "../_components/Input";
import Label from "../_components/Label";
import Button from "../_components/Button";
import Textarea from "../_components/Textarea";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-brand text-center font-en text-2xl font-bold">
          Login
        </h1>
        <div className="bg-accent mx-auto mb-2 h-[2px] w-12" />

        {/* メールアドレス */}
        <div>
          <Label name="email" title="メールアドレス" />
          <Input
            id="email"
            type="email"
            placeholder="メールアドレス"
            autoComplete="email"
          />
        </div>

        {/* パスワード */}
        <div>
          <Label name="password" title="パスワード" />
          <Input
            id="password"
            type="password"
            placeholder="パスワード"
            autoComplete="current-password"
          />
        </div>
        {/* コメント */}
        <div>
          <Label name="message" title="コメント" />
          <Textarea id="message" placeholder="コメント" />
        </div>

        {/* ログインボタン（仮） */}
        <Button
          color="red"
          variant="filled"
          className="w-full"
          label="ログイン"
        />

        <p className="cursor-pointer text-center text-base text-form-text underline">
          アカウントをお持ちでない方はこちら
        </p>
      </div>
    </main>
  );
}
