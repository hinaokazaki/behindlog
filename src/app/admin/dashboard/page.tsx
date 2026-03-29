"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashTodoSection from "./_components/DashTodoSection";
import DashGoalSection from "./_components/DashGoalSection";
import DashCommittimeSection from "./_components/DashCommittimeSection";
import DashCalendarSection from "./_components/DashCalendarSection";

export default function DashboardPage() {
  return (
    <div>
      <SectionTitle title="Dashboard" />
      <DashGoalSection />
      <DashTodoSection />
      <DashCalendarSection />
      <DashCommittimeSection />
    </div>
  );
}
