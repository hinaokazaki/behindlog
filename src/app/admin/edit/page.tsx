"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import GoalSection from "./_components/GoalSection";
import TodoSection from "./_components/TodoSection";
import CommitTimeSection from "./_components/CommitTimeSection";

export default function EditPage() {
  return (
    <div>
      <SectionTitle title="Edit your record - 編集" />
      <GoalSection />
      <TodoSection />
      <CommitTimeSection />
    </div>
  );
}
