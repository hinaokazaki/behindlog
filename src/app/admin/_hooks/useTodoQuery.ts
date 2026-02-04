import { Todos } from "@/schemas/todo";
import useFetch from "./useFetch";

export const useTodoQuery = () => {
  return useFetch<{ todos: Todos }>("/api/todos");
};
