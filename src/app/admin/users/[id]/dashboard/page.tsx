"use client";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import { useFriendDashboardQuery } from "@/app/admin/_hooks/useFriendDashboardQuery";
import DashCalendarSection from "@/app/admin/dashboard/_components/DashCalendarSection";
import DashCommittimeSection from "@/app/admin/dashboard/_components/DashCommittimeSection";
import DashGoalSection from "@/app/admin/dashboard/_components/DashGoalSection";
import DashTodoSection from "@/app/admin/dashboard/_components/DashTodoSection";

export default function FriendsDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const { isLoading, error, data } = useFriendDashboardQuery({ id });

  if (isLoading) return <Loading />;

  if (error || !data?.friendDashboard) {
    return <p>友達のダッシュボードの取得でエラーが発生しました。</p>;
  }
  const friendDashboard = data.friendDashboard;
  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-4 pb-24 sm:px-6 2xl:h-[calc(100vh-120px)] 2xl:overflow-hidden 2xl:px-10 2xl:pb-4">
      <SectionTitle title={`${friendDashboard.name}'s Dashboard`} />

      <div className="mt-4 flex flex-col gap-4 2xl:grid 2xl:h-[calc(100%-80px)] 2xl:grid-cols-[1.8fr_1.2fr] 2xl:gap-6">
        <div className="flex flex-col gap-4 2xl:grid 2xl:h-full 2xl:min-h-0 2xl:grid-rows-[0.8fr_1.6fr] 2xl:gap-6">
          <DashGoalSection goals={friendDashboard.goals} isOwnPage={false} />
          <div className="2xl:hidden">
            <DashTodoSection todos={friendDashboard.todos} isOwnPage={false} />
          </div>
          <div className="2xl:hidden">
            <DashCommittimeSection
              totalStudyTime={friendDashboard.committime}
            />
          </div>
          <DashCalendarSection
            userId={id}
            timezone={friendDashboard.timezone}
          />
        </div>
        <div className="hidden gap-6 2xl:grid 2xl:h-full 2xl:min-h-0 2xl:grid-rows-[1.5fr_0.55fr]">
          <DashTodoSection todos={friendDashboard.todos} isOwnPage={false} />
          <DashCommittimeSection totalStudyTime={friendDashboard.committime} />
        </div>
      </div>
    </div>
  );
}
