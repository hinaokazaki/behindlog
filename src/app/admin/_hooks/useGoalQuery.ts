import { Goals } from "@/schemas/goal";
import useFetch from "./useFetch";

export const useGoalQuery = () => {
  return useFetch<{ goals: Goals }>("/api/goals");
};
