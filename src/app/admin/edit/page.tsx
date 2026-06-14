"use client";
import SectionTitle from "@/app/_components/SectionTitle";
import GoalSection from "./_components/GoalSection";
import TodoSection from "./_components/TodoSection";
import CommitTimeSection from "./_components/CommitTimeSection";

export default function EditPage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-10">
      <SectionTitle title="Edit your record - 編集" />

      <div className="mt-4 flex flex-col gap-4 sm:gap-6">
        <GoalSection />
        <TodoSection />
        <CommitTimeSection />
      </div>
    </div>
  );
}
