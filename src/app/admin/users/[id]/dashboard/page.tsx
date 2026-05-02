// 次のブランチで修正します
"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashCalendarSection from "@/app/admin/dashboard/_components/DashCalendarSection";
import DashCommittimeSection from "@/app/admin/dashboard/_components/DashCommittimeSection";
import DashGoalSection from "@/app/admin/dashboard/_components/DashGoalSection";
import DashTodoSection from "@/app/admin/dashboard/_components/DashTodoSection";

export default function FriendsDashboardPage() {
  return (
    <div className="h-auto min-h-[calc(100vh-120px)] px-4 py-4 sm:px-6 lg:h-[calc(100vh-120px)] lg:overflow-hidden lg:px-10">
      <SectionTitle title="Dashboard" />
      <div className="mt-4 grid gap-6 lg:h-[calc(100%-80px)] lg:grid-cols-[1.8fr_1.2fr]">
        <div className="grid gap-6 lg:h-full lg:min-h-0 lg:grid-rows-[0.8fr_1.6fr]">
          <DashGoalSection />
          <DashCalendarSection />
        </div>
        <div className="grid gap-6 lg:h-full lg:min-h-0 lg:grid-rows-[1.5fr_0.55fr]">
          <DashTodoSection />
          <DashCommittimeSection />
        </div>
      </div>
    </div>
  );
}
