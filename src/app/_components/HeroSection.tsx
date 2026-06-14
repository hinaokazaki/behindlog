"use client";
import Link from "next/link";
import { HeroImage } from "./HeroImage";
import Button from "./Button";

type HeroSectionProps = {
  mode?: "lp" | "invite";
  handleGuestLogin?: () => void;
};

export const HeroSection = ({
  mode = "lp",
  handleGuestLogin,
}: HeroSectionProps) => {
  const isInvite = mode === "invite";
  const showButtons = !isInvite;

  return (
    <section
      className={
        isInvite
          ? "flex flex-col-reverse items-center gap-4 text-center"
          : "flex flex-col-reverse items-center justify-center gap-6 px-4 pb-16 pt-28 text-center sm:px-6 lg:my-24 lg:flex-row lg:gap-[150px] lg:pt-[255px] lg:text-left"
      }
    >
      <div>
        <div>
          <p
            className={
              isInvite
                ? "mt-4 text-subtitle-top font-bold text-primary"
                : "mt-4 text-subtitle-top font-bold text-primary sm:text-heading-3 lg:text-heading-1"
            }
          >
            成功の裏側を毎日記録、
          </p>
          <p
            className={
              isInvite
                ? "text-subtitle-top font-bold text-primary"
                : "text-subtitle-top font-bold text-primary sm:text-heading-3 lg:text-heading-1"
            }
          >
            あなたの努力が誰かの支えに
          </p>
        </div>

        <div>
          <p
            className={
              isInvite
                ? "mt-4 text-body font-bold text-foreground"
                : "mt-4 text-body font-bold text-foreground sm:text-subtitle"
            }
          >
            仲間と記録を共有して、続ける力に変えよう。
          </p>
          <p
            className={
              isInvite
                ? "text-body font-bold text-foreground"
                : "text-body font-bold text-foreground sm:text-subtitle"
            }
          >
            目標に向かう大人のための継続支援サービス。
          </p>
        </div>

        {showButtons && (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-10 lg:justify-start lg:gap-20">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-[220px]">無料で始める</Button>
            </Link>

            <Button
              variant="outlined"
              className="w-full sm:w-[220px]"
              onClick={handleGuestLogin}
            >
              ゲストログイン
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <HeroImage mode={isInvite ? "invite" : "lp"} />
      </div>
    </section>
  );
};
