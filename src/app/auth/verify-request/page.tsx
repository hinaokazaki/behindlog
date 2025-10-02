"use client";

export default function VerifyRequestPage() {
  return (
    <div className="m-auto my-[84px] w-[550px] rounded-xl border-[2.5px] border-foreground px-8 py-6">
      <h1 className="mb-6 text-subtitle-top text-foreground">
        メールを確認してください
      </h1>
      <p className="text-body text-foreground">
        入力したメールアドレス宛に確認リンクを送信しました。
      </p>
      <p className="text-body text-foreground">
        リンクをクリックするとログインが完了します。
      </p>
      <p className="mt-6 text-body text-foreground">
        見当たらない場合は迷惑メールフォルダもご確認ください。
      </p>
    </div>
  );
}
