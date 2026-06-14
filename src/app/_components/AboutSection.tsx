"use client";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { HeroImage } from "./HeroImage";

type Props = {
  handleGuestLogin: () => void;
};

const AboutSection = ({ handleGuestLogin }: Props) => {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-20 pt-20 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-20 lg:px-8 lg:pb-64 lg:pt-32">
      <HeroImage />

      <div className="w-full">
        <SectionTitle title="About" isPublic />
        <p className="mb-8 text-center font-bold text-foreground lg:mb-12">
          Behindlogが選ばれる理由
        </p>
        <div className="space-y-6 text-sm font-bold leading-relaxed text-foreground sm:text-body lg:space-y-8">
          <p>
            ✅ 努力の“見える化”でモチベーションアップ
            <br />
            努力の過程や毎日の記録を振り返ることで、自分の成長を実感できます。
          </p>
          <p>
            ✅ 仲間の頑張りを見て、自分も続けられる
            <br />
            目標に向かって努力する仲間の記録が、あなたの励みになります。
          </p>
          <p>
            ✅ 続ける仕組みで、挫折知らずのサポート
            <br />
            簡単な記録機能とコミュニティで、継続の壁を乗り越えられます。
          </p>
        </div>

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
      </div>
    </section>
  );
};

export default AboutSection;
