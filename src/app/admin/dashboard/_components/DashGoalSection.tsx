"use client";
import { Goals } from "@/schemas/goal";
import BlockTitle from "../../_components/BlockTitle";
import GoalCardBase from "../../edit/_components/GoalCardBase";

type DashGoalSectionProps = {
  goals: Goals;
};

const DashGoalSection: React.FC<DashGoalSectionProps> = ({ goals }) => {
  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Goal" />
      <div className="space-y-2">
        {goals.length === 0 ? (
          <div className="flex flex-col">
            <p className="text-base text-body font-semibold">
              * Goalが登録されていません
            </p>
            <p className="text-base text-body font-semibold">
              * 編集ページで作成してみましょう!
            </p>
          </div>
        ) : (
          goals.map((g) => (
            <GoalCardBase key={g.id} goal={g.title} deadline={g.deadline} />
          ))
        )}
      </div>
    </section>
  );
};

export default DashGoalSection;
