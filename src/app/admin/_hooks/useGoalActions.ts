import { useApi } from "@/app/_hooks/useApi";
import {
  CreateGoalRequest,
  GoalResponse,
  updateGoalRequest,
} from "@/schemas/goal";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Options = {
  onSuccess?: () => void;
};

export const useCommunityActions = () => {
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = async (data: CreateGoalRequest, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<GoalResponse>("/api/goals", "POST", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Create goal failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (
    goalId: number,
    data: updateGoalRequest,
    opts?: Options,
  ) => {
    try {
      setIsSubmitting(true);
      await callApi<GoalResponse>(`/api/goal/${goalId}`, "PATCH", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Update goal failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGoal = async (goalId: number, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<GoalResponse>(`/api/goal/${goalId}`, "DELETE");
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Delete goal failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { router, isSubmitting, create, update, deleteGoal };
};
