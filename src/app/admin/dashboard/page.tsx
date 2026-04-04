"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashTodoSection from "./_components/DashTodoSection";
import DashGoalSection from "./_components/DashGoalSection";
import DashCommittimeSection from "./_components/DashCommittimeSection";
import DashCalendarSection from "./_components/DashCalendarSection";

export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden px-10 py-4">
      <SectionTitle title="Dashboard" />

      <div className="mt-4 grid h-[calc(100%-80px)] grid-cols-[1.8fr_1.2fr] gap-6">
        <div className="grid h-full min-h-0 grid-rows-[0.8fr_1.6fr] gap-6">
          <DashGoalSection />
          <DashCalendarSection />
        </div>
        <div className="grid h-full min-h-0 grid-rows-[1.5fr_0.55fr] gap-6">
          <DashTodoSection />
          <DashCommittimeSection />
        </div>
      </div>
    </div>
  );
}
