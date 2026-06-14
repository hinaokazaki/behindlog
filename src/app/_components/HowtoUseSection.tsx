"use client";
import Image from "next/image";
import SectionTitle from "./SectionTitle";

const items = [
  {
    image: "/dashboard.png",
    title: "📊 ダッシュボード",
    text: "目標や進捗を一目で確認。\n自分の頑張りがすぐに見える化されます。",
  },
  {
    image: "/record.png",
    title: "📝 毎日の記録",
    text: "日々のToDoや実績、気づきを手軽に入力。\n続ける習慣づくりに最適です。",
  },
  {
    image: "/community.png",
    title: "🤝 コミュニティ",
    text: "仲間の記録をチェックして励まし合い、\nモチベーションを高めます。",
  },
];

const HowtoUseSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <SectionTitle title="How to use" isPublic />

      <p className="mb-12 text-center font-bold text-foreground lg:mb-20">
        Behindlogの3つの主要機能
      </p>

      <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 flex justify-center lg:mb-12">
              <Image
                src={item.image}
                alt={item.title}
                width={170}
                height={170}
                className="h-[120px] w-[120px] object-contain sm:h-[140px] sm:w-[140px] lg:h-[170px] lg:w-[170px]"
              />
            </div>

            <h3 className="mb-3 text-base font-bold text-foreground sm:text-lg">
              {item.title}
            </h3>

            <p className="whitespace-pre-line text-sm font-bold leading-relaxed text-foreground sm:text-body">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowtoUseSection;
