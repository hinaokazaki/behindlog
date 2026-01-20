import SectionTitle from "@/app/_components/SectionTitle";
import GoalSection from "./_components/GoalSection";
import TodoSection from "./_components/TodoSection";

export default function EditPage() {
  return (
    <div>
      <SectionTitle title="Edit your record - 編集" />
      <GoalSection />
      <TodoSection />
    </div>
  );
}
