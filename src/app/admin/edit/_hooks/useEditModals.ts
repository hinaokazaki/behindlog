import { Goal } from "@/schemas/goal";
import { useState } from "react";

export const useEditModals = () => {
  // 目標新規作成モーダル
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const openCreateGoal = () => setIsCreateGoalOpen(true);
  const closeCreateGoal = () => setIsCreateGoalOpen(false);

  // 目標編集モーダル
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const openUpdateGoal = (goal: Goal) => setSelectedGoal(goal);
  const closeUpdateGoal = () => setSelectedGoal(null);

  // 目標削除モーダル
  // const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const openDeleteGoal = (goal: Goal) => setSelectedGoal(goal);
  const closeDeleteGoal = () => setSelectedGoal(null);

  // Todo新規作成モーダル
  const [isCreateTodoOpen, setIsCreateTodoOpen] = useState(false);
  const openCreateTodo = () => setIsCreateTodoOpen(true);
  const closeCreateTodo = () => setIsCreateTodoOpen(false);

  // Todo編集モーダル

  // Todo削除モーダル

  return {
    // 目標新規作成モーダル
    isCreateGoalOpen,
    openCreateGoal,
    closeCreateGoal,

    // 目標編集モーダル
    selectedGoal,
    isUpdateGoalOpen: !!selectedGoal,
    openUpdateGoal,
    closeUpdateGoal,

    // 目標削除モーダル
    isDeleteGoalOpen: !!selectedGoal,
    openDeleteGoal,
    closeDeleteGoal,

    // Todo新規作成モーダル
    isCreateTodoOpen,
    openCreateTodo,
    closeCreateTodo,

    // Todo編集モーダル

    // Todo削除モーダル
  };
};
