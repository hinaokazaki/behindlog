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
    <section className="mx-auto max-w-6xl px-8 py-32">
      <SectionTitle title="How to use" isPublic />

      <p className="mb-20 text-center font-bold text-foreground">
        Behindlogの3つの主要機能
      </p>

      <div className="grid grid-cols-3 gap-20">
        {items.map((item) => (
          <div key={item.title}>
            <div className="mb-12 flex justify-center">
              <Image
                src={item.image}
                alt={item.title}
                width={170}
                height={170}
              />
            </div>

            <h3 className="mb-3 font-bold text-foreground">{item.title}</h3>

            <p className="whitespace-pre-line text-body font-bold leading-relaxed text-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowtoUseSection;
