"use client";
import { Goals } from "@/schemas/goal";
import BlockTitle from "../../_components/BlockTitle";
import GoalCardBase from "../../edit/_components/GoalCardBase";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

type DashGoalSectionProps = {
  goals: Goals;
};

const DashGoalSection: React.FC<DashGoalSectionProps> = ({ goals }) => {
  const router = useRouter();

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Goal" />
      <div className="space-y-2">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col">
              <p className="text-base text-subtitle font-semibold">
                Goalが登録されていません
              </p>
              <p className="text-base text-subtitle font-semibold">
                編集ページで作成してみましょう!
              </p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => router.push("/admin/edit")}
                type="button"
                color="red"
                children="編集ページでGoalを作成する"
              />
            </div>
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
