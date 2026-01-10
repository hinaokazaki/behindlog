import { Todos } from "@/schemas/todo";
import useFetch from "./useFetch";

export const useGoalQuery = () => {
  return useFetch<{ todos: Todos }>("/api/todos");
};
