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
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <BlockTitle title="Todo" />

      <div className="space-y-2">
        {todos.length === 0 ? (
          isOwnPage ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex flex-col">
                <p className="text-subtitle font-semibold sm:text-base">
                  Todoリストが登録されていません
                </p>

                <p className="text-subtitle font-semibold sm:text-base">
                  編集ページで作成してみましょう!
                </p>
              </div>

              <div className="mt-4 w-full sm:w-auto">
                <Button
                  onClick={() => router.push("/admin/edit")}
                  type="button"
                  color="red"
                  children="編集ページでTodoを作成する"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-center">
              <p className="text-subtitle font-semibold sm:text-base">
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
