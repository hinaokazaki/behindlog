"use client";
import { Todos } from "@/schemas/todo";
import BlockTitle from "../../_components/BlockTitle";
import TodoCardBase from "../../edit/_components/TodoCardBase";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

type DashTodoSectionProps = {
  todos: Todos;
  isOwnPage?: boolean;
};

const DashTodoSection: React.FC<DashTodoSectionProps> = ({
  todos,
  isOwnPage = true,
}) => {
  const router = useRouter();

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Todo" />
      <div className="space-y-2">
        {todos.length === 0 ? (
          isOwnPage ? (
            <div className="flex flex-col items-center">
              <div className="flex flex-col">
                <p className="text-base text-subtitle font-semibold">
                  Todoリストが登録されていません
                </p>
                <p className="text-base text-subtitle font-semibold">
                  編集ページで作成してみましょう!
                </p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => router.push("/admin/edit")}
                  type="button"
                  color="red"
                  children="編集ページでTodoを作成する"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <p className="text-base text-subtitle font-semibold">
                Todoはまだ登録されていません
              </p>
            </div>
          )
        ) : (
          todos.map((t) => (
            <TodoCardBase
              key={t.id}
              todo={t.title}
              dueDate={t.dueDate}
              completed={t.isCompleted}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default DashTodoSection;
