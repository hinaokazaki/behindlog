"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import DashTodoSection from "./_components/DashTodoSection";
import DashGoalSection from "./_components/DashGoalSection";

export default function DashboardPage() {
  return (
    <div>
      <SectionTitle title="Dashboard" />
      <DashGoalSection />
      <DashTodoSection />
    </div>
  );
}
