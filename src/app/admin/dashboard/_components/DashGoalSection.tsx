"use client";
import { Goals } from "@/schemas/goal";
import BlockTitle from "../../_components/BlockTitle";
import GoalCardBase from "../../edit/_components/GoalCardBase";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

type DashGoalSectionProps = {
  goals: Goals;
  isOwnPage?: boolean;
};

const DashGoalSection: React.FC<DashGoalSectionProps> = ({
  goals,
  isOwnPage = true,
}) => {
  const router = useRouter();

  return (
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <BlockTitle title="Goal" />

      <div className="space-y-2">
        {goals.length === 0 ? (
          isOwnPage ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-col">
                <p className="text-subtitle font-semibold sm:text-base">
                  Goalが登録されていません
                </p>
                <p className="text-subtitle font-semibold sm:text-base">
                  編集ページで作成してみましょう!
                </p>
              </div>

              <div className="mt-4 w-full sm:w-auto">
                <Button
                  onClick={() => router.push("/admin/edit")}
                  type="button"
                  color="red"
                >
                  編集ページでGoalを作成する
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-center">
              <p className="text-subtitle font-semibold sm:text-base">
                Goalはまだ登録されていません
              </p>
            </div>
          )
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
