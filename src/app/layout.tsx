import type { Metadata } from "next";
import { Noto_Sans_JP, Poppins } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import Header from "./_components/Header";

// google font を有効化
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-jp" });
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bihindlog",
  description: " 学習記録型の継続支援アプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${poppins.variable}`}>
      <body id="body" className="m-0 p-0">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
