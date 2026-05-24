import type { Metadata } from "next";
import { Noto_Sans_JP, Poppins } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import Header from "./_components/Header";
import ThemeProvider from "./_providers/ThemeProvider";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-jp",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Behindlog",
  description: "学習記録型の継続支援アプリ",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${poppins.variable}`}>
      <body id="body" className="m-0 p-0">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
