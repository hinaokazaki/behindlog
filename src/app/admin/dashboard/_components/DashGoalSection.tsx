"use client";
import Loading from "@/app/_components/Loading";
import { useGoalQuery } from "../../_hooks/useGoalQuery";
import { Goals } from "@/schemas/goal";
import BlockTitle from "../../_components/BlockTitle";
import GoalCardBase from "../../edit/_components/GoalCardBase";

const DashGoalSection: React.FC = () => {
  const goalsData = useGoalQuery();

  if (goalsData.isLoading) return <Loading />;
  if (goalsData.error)
    return <p>目標の取得でエラーが発生しました: {goalsData.error.message}</p>;

  const goals: Goals = goalsData.data?.goals ?? [];

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
