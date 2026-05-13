"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashTodoSection from "./_components/DashTodoSection";
import DashGoalSection from "./_components/DashGoalSection";
import DashCommittimeSection from "./_components/DashCommittimeSection";
import DashCalendarSection from "./_components/DashCalendarSection";
import { useProfileQuery } from "../_hooks/useProfileQuery";
import Loading from "@/app/_components/Loading";

export default function DashboardPage() {
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data?.profile;

  if (profileQuery.isLoading) return <Loading />;

  if (profileQuery.error || !profile) {
    return <p>プロフィール情報の取得でエラーが発生しました。</p>;
  }

  return (
    <div className="h-auto min-h-[calc(100vh-120px)] px-4 py-4 sm:px-6 lg:h-[calc(100vh-120px)] lg:overflow-hidden lg:px-10">
      <SectionTitle title="Dashboard" />
      <div className="mt-4 grid gap-6 lg:h-[calc(100%-80px)] lg:grid-cols-[1.8fr_1.2fr]">
        <div className="grid gap-6 lg:h-full lg:min-h-0 lg:grid-rows-[0.8fr_1.6fr]">
          <DashGoalSection />
          <DashCalendarSection userId={profile.id} />
        </div>
        <div className="grid gap-6 lg:h-full lg:min-h-0 lg:grid-rows-[1.5fr_0.55fr]">
          <DashTodoSection />
          <DashCommittimeSection />
        </div>
      </div>
    </div>
  );
}
