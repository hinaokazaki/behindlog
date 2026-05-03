"use client";
import Loading from "@/app/_components/Loading";
import { useTodoQuery } from "../../_hooks/useTodoQuery";
import { Todos } from "@/schemas/todo";
import BlockTitle from "../../_components/BlockTitle";
import TodoCardBase from "../../edit/_components/TodoCardBase";

const DashTodoSection: React.FC = () => {
  const todosData = useTodoQuery();

  if (todosData.isLoading) return <Loading />;
  if (todosData.error)
    return <p>Todoの取得でエラーが発生しました: {todosData.error.message}</p>;

  const todos: Todos = todosData.data?.todos ?? [];

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Todo" />
      <div className="space-y-2">
        {todos.map((t) => (
          <TodoCardBase
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
