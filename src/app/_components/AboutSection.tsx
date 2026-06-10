import Link from "next/link";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { HeroImage } from "./HeroImage";

type Props = {
  handleGuestLogin: () => void;
};

const AboutSection = ({ handleGuestLogin }: Props) => {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-20 px-8 pb-64 pt-32">
      <HeroImage />

      <div>
        <SectionTitle title="About" isPublic />

        <p className="mb-12 text-center font-bold text-foreground">
          Behindlogが選ばれる理由
        </p>

        <div className="space-y-8 text-body font-bold leading-relaxed text-foreground">
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

        <div className="mt-10 flex gap-20">
          <Link href="/signup">
            <Button className="w-[220px]">無料で始める</Button>
          </Link>

          <Button
            variant="outlined"
            className="w-[220px]"
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
