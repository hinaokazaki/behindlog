import { useApi } from "@/app/_hooks/useApi";
import { CreateTodoRequest, TodoResponse, UpdateTodoRequest } from "@/schemas/todo";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Options = {
  onSuccess?: () => void;
};

export const useTodoActions = () => {
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = async (data: CreateTodoRequest, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<TodoResponse>("/api/todos", "POST", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Create todo failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (
    todoId: number,
    data: UpdateTodoRequest,
    opts?: Options,
  ) => {
    try {
      setIsSubmitting(true);
      await callApi<TodoResponse>(`/api/todos/${todoId}`, "PATCH", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Update todo failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTodo = async (todoId: number, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<TodoResponse>(`/api/todos/${todoId}`, "DELETE");
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Delete todo failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { router, isSubmitting, create, update, deleteTodo };
};
