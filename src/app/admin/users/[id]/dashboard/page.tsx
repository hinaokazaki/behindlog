"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashCommittimeSection from "@/app/admin/dashboard/_components/DashCommittimeSection";
import DashGoalSection from "@/app/admin/dashboard/_components/DashGoalSection";
import DashTodoSection from "@/app/admin/dashboard/_components/DashTodoSection";

export default function DashboardPage() {
  return (
    <div>
      <SectionTitle title="Dashboard" />
      <DashGoalSection />
      <DashTodoSection />
      <DashCommittimeSection />
    </div>
  );
}
