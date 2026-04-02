"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashCommittimeSection from "@/app/admin/dashboard/_components/DashCommittimeSection";
import DashGoalSection from "@/app/admin/dashboard/_components/DashGoalSection";
import DashTodoSection from "@/app/admin/dashboard/_components/DashTodoSection";
import DashCalendarSection from "@/app/admin/dashboard/_components/DashCalendarSection";

export default function DashboardPage() {
  return (
    <div>
      <SectionTitle title="Dashboard" />
      <DashGoalSection />
      <DashCalendarSection />
      <DashTodoSection />
      <DashCommittimeSection />
    </div>
  );
}
