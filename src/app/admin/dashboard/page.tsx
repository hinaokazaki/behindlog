"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashTodoSection from "./_components/DashTodoSection";
import DashGoalSection from "./_components/DashGoalSection";
import DashCommittimeSection from "./_components/DashCommittimeSection";
import DashCalendarSection from "./_components/DashCalendarSection";
import { useProfileQuery } from "../_hooks/useProfileQuery";
import Loading from "@/app/_components/Loading";
import { useTodoQuery } from "../_hooks/useTodoQuery";
import { Todos } from "@/schemas/todo";
import { useGoalQuery } from "../_hooks/useGoalQuery";
import { Goals } from "@/schemas/goal";
import { useCommittimeSummaryQuery } from "../_hooks/useCommittimeSummaryQuery";
import { TotalStudyTime } from "@/schemas/committime";
import { Profile } from "@/schemas/me";

export default function DashboardPage() {
  const profileQuery = useProfileQuery();
  const todosData = useTodoQuery();
  const goalsData = useGoalQuery();
  const committimeSummaryQuery = useCommittimeSummaryQuery();

  if (
    profileQuery.isLoading ||
    todosData.isLoading ||
    goalsData.isLoading ||
    committimeSummaryQuery.isLoading
  )
    return <Loading />;

  if (profileQuery.error || !profileQuery.data?.profile) {
    return <p>プロフィール情報の取得でエラーが発生しました。</p>;
  }

  if (todosData.error)
    return <p>Todoの取得でエラーが発生しました: {todosData.error.message}</p>;

  if (goalsData.error)
    return <p>目標の取得でエラーが発生しました: {goalsData.error.message}</p>;

  if (
    committimeSummaryQuery.error ||
    !committimeSummaryQuery.data?.totalStudyTime
  )
    return (
      <p>
        合計時間の取得でエラーが発生しました:{" "}
        {committimeSummaryQuery.error.message}
      </p>
    );

  const profile: Profile = profileQuery.data?.profile;
  const todos: Todos = todosData.data?.todos ?? [];
  const goals: Goals = goalsData.data?.goals ?? [];
  const totalStudyTime: TotalStudyTime =
    committimeSummaryQuery.data?.totalStudyTime;

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-4 pb-24 sm:px-6 2xl:h-[calc(100vh-120px)] 2xl:overflow-hidden 2xl:px-10 2xl:pb-4">
      <SectionTitle title="Dashboard" />

      <div className="mt-4 flex flex-col gap-4 2xl:grid 2xl:h-[calc(100%-80px)] 2xl:grid-cols-[1.8fr_1.2fr] 2xl:gap-6">
        <div className="flex flex-col gap-4 2xl:grid 2xl:h-full 2xl:min-h-0 2xl:grid-rows-[0.8fr_1.6fr] 2xl:gap-6">
          <DashGoalSection goals={goals} isOwnPage={true} />

          <div className="2xl:hidden">
            <DashTodoSection todos={todos} isOwnPage={true} />
          </div>

          <div className="2xl:hidden">
            <DashCommittimeSection totalStudyTime={totalStudyTime} />
          </div>

          <DashCalendarSection
            userId={profile.id}
            timezone={profile.timezone}
          />
        </div>

        <div className="hidden gap-6 2xl:grid 2xl:h-full 2xl:min-h-0 2xl:grid-rows-[1.5fr_0.55fr]">
          <DashTodoSection todos={todos} isOwnPage={true} />
          <DashCommittimeSection totalStudyTime={totalStudyTime} />
        </div>
      </div>
    </div>
  );
}
