"use client";
import { Todos } from "@/schemas/todo";
import BlockTitle from "../../_components/BlockTitle";
import TodoCardBase from "../../edit/_components/TodoCardBase";

type DashTodoSectionProps = {
  todos: Todos;
};

const DashTodoSection: React.FC<DashTodoSectionProps> = ({ todos }) => {
  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Todo" />
      <div className="space-y-2">
        {todos.map((t) => (
          <TodoCardBase
            key={t.id}
            todo={t.title}
            dueDate={t.dueDate}
            completed={t.isCompleted}
          />
        ))}
      </div>
    </section>
  );
};

export default DashTodoSection;
