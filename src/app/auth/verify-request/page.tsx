"use client";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="w-full max-w-[550px] rounded-xl border-[2.5px] border-foreground px-5 py-6 sm:px-8">
        <h1 className="mb-6 text-center text-subtitle-top text-foreground lg:text-left">
          メールを確認してください
        </h1>

        <div className="space-y-2">
          <p className="text-center text-body text-foreground lg:text-left">
            入力したメールアドレス宛に確認リンクを送信しました。
          </p>

          <p className="text-center text-body text-foreground lg:text-left">
            リンクをクリックするとログインが完了します。
          </p>

          <p className="mt-6 text-center text-body text-foreground lg:text-left">
            見当たらない場合は迷惑メールフォルダもご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
