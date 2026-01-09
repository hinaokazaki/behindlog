"use Client";
import Link from "next/link";
import { HeroImage } from "./HeroImage";

type HeroSectionProps = {
  mode?: "lp" | "invite" | "mobile";
};

export const HeroSection = ({ mode = "lp" }: HeroSectionProps) => {
  const isvertical = mode !== "lp";
  const showButtons = mode !== "invite";
  const text = {
    lp: {
      fontSizeH1: "text-heading-1",
      fontSizep: "text-subtitle",
      fontCenter: "md:text-left",
    },
    invite: {
      fontSizeH1: "text-subtitle-top",
      fontSizep: "text-body",
      fontCenter: "md:text-center",
    },
    mobile: {
      fontSizeH1: "text-subtitle-top",
      fontSizep: "text-body",
      fontCenter: "md:text-center",
    },
  }[mode];

  return (
    <section
      className={`flex ${
        isvertical
          ? "flex-col-reverse items-center text-center"
          : "flex-row items-center justify-center gap-[150px]"
      } gap-4`}
    >
      <div className={`text-center md:text-left ${text.fontCenter}`}>
        <div>
          <p
            className={`mt-4 text-body font-bold text-primary ${text.fontSizeH1}`}
          >
            成功の裏側を毎日記録、
          </p>
          <p className={`text-body font-bold text-primary ${text.fontSizeH1}`}>
            あなたの努力が誰かの支えに
          </p>
        </div>
        <div>
          <p
            className={`mt-4 text-body font-bold text-foreground ${text.fontSizep}`}
          >
            仲間と記録を共有して、続ける力に変えよう。
          </p>
          <p
            className={`text-body font-bold text-foreground ${text.fontSizep}`}
          >
            目標に向かう大人のための継続支援サービス。
          </p>
        </div>
        {showButtons && (
          <div className="mt-6 flex justify-center gap-4 md:justify-start">
            <Link
              href="/signup"
              className="rounded-xl border-[2px] border-primary bg-primary px-4 py-2 text-body font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:text-form-text"
            >
              無料で始める
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border-[2px] border-primary bg-background px-4 py-2 text-body font-semibold text-primary transition-colors duration-200 hover:border-primary-hover hover:text-primary-hover md:text-form-text"
            >
              ゲストログイン
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <HeroImage mode={mode} />
      </div>
    </section>
  );
};
