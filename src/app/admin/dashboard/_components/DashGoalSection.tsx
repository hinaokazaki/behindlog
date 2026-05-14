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
        {goals.map((g) => (
          <GoalCardBase key={g.id} goal={g.title} deadline={g.deadline} />
        ))}
      </div>
    </section>
  );
};

export default DashGoalSection;
