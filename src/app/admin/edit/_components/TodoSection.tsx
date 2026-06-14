"use client";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import AddNewButton from "../../_components/AddNewButton";
import BlockTitle from "../../_components/BlockTitle";
import { EditModal } from "../../_components/EditModal";
import { useTodoQuery } from "../../_hooks/useTodoQuery";
import Loading from "@/app/_components/Loading";
import { CreateTodoRequest, Todos, UpdateTodoRequest } from "@/schemas/todo";
import TodoCardBase from "./TodoCardBase";
import { useTodoActions } from "../../_hooks/useTodoActions";
import { useEditModals } from "../_hooks/useEditModals";
import EditButtons from "./EditButtons";
import {
  TodoModalFormValues,
  todoModalSchema,
} from "@/schemas/todoModalSchema";
import DeleteTodoModal from "./DeleteTodoModal";
import { todoStatusOptions } from "@/constants/todoStatusOptions";

const TodoSection: React.FC = () => {
  const todosData = useTodoQuery();
  const actions = useTodoActions();
  const modals = useEditModals();

  const fields: FieldProps[] = [
    {
      name: "title",
      title: "Todo",
      type: "text",
      inputProps: { placeholder: "Todoを作成しよう" },
    },
    {
      name: "isCompleted",
      title: "ステータス",
      type: "select",
      options: todoStatusOptions,
    },
    {
      name: "dueDate",
      title: "期限",
      type: "date",
    },
  ];

  const createModalButtons: ButtonProps[] = [
    {
      children: "キャンセル",
      className: "",
      type: "button",
      disabled: actions.isSubmitting,
      onClick: modals.selectedTodo
        ? modals.closeUpdateTodo
        : modals.closeCreateTodo,
      color: "main",
      variant: "outlined",
    },
    {
      children: "作成",
      className: "",
      type: "submit",
      disabled: actions.isSubmitting,
      color: "main",
      variant: "filled",
    },
  ];

  if (todosData.isLoading) return <Loading />;
  if (todosData.error)
    return <p>Todoの取得でエラーが発生しました: {todosData.error.message}</p>;

  const todos: Todos = todosData.data?.todos ?? [];

  const handleAdding = async (data: CreateTodoRequest) => {
    try {
      await actions.create(data, {
        onSuccess: async () => {
          modals.closeCreateTodo();
          await todosData.mutate();
        },
      });
    } catch (error) {
      console.log("Todoの作成に失敗しました");
    }
  };

  const handleEdit = async (todoId: number, data: UpdateTodoRequest) => {
    try {
      await actions.update(todoId, data, {
        onSuccess: async () => {
          modals.closeUpdateTodo();
          await todosData.mutate();
        },
      });
    } catch (error) {
      console.log("Todoの更新に失敗しました");
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await actions.deleteTodo(todoId, {
        onSuccess: async () => {
          modals.closeDeleteTodo();
          await todosData.mutate();
        },
      });
    } catch (error) {
      console.log("Todoの削除に失敗しました");
    }
  };

  return (
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <BlockTitle title="Todo" />
      <div className="space-y-2">
        {todos.map((t) => (
          <TodoCardBase
            todo={t.title}
            dueDate={t.dueDate}
            completed={t.isCompleted}
            onClick={() => modals.openUpdateTodo(t)}
            rightSlot={
              <EditButtons
                handleEdit={() => modals.openUpdateTodo(t)}
                handleDelete={() => modals.openDeleteTodo(t)}
              />
            }
          />
        ))}
      </div>
      <AddNewButton
        label="Todoを追加"
        handleAdding={() => modals.openCreateTodo()}
      />

      <EditModal<TodoModalFormValues>
        modalTitle="新しいTodo"
        isOpen={modals.isCreateTodoOpen}
        onClose={modals.closeCreateTodo}
        onSubmit={handleAdding}
        schema={todoModalSchema}
        buttons={createModalButtons}
        fields={fields}
        defaultValues={{ title: "", dueDate: "", isCompleted: "false" }}
      />

      {modals.selectedTodo && (
        <EditModal<TodoModalFormValues>
          modalTitle="Todoを編集する"
          isOpen={modals.isUpdateTodoOpen}
          onClose={() => modals.closeUpdateTodo()}
          onSubmit={(data) => {
            handleEdit(modals.selectedTodo!.id, {
              title: data.title,
              dueDate: data.dueDate,
              isCompleted: data.isCompleted === "true",
            });
          }}
          defaultValues={{
            title: modals.selectedTodo.title,
            dueDate: modals.selectedTodo.dueDate,
            isCompleted: modals.selectedTodo.isCompleted ? "true" : "false",
          }}
          schema={todoModalSchema}
          buttons={createModalButtons}
          fields={fields}
        />
      )}

      {modals.selectedTodo && (
        <DeleteTodoModal
          isOpen={modals.isDeleteTodoOpen}
          todo={modals.selectedTodo}
          onClose={() => modals.closeDeleteTodo()}
          onConfirm={() => {
            handleDelete(modals.selectedTodo!.id);
          }}
          isSubmitting={actions.isSubmitting}
        />
      )}
    </section>
  );
};

export default TodoSection;
