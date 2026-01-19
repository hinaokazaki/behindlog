import { Goal } from "@/schemas/goal";
import { useState } from "react";

type ActiveModal = 
  | { type: "none" }
  | { type: "updateGoal"; goal: Goal }
  | { type: "deleteGoal"; goal: Goal };

export const useEditModals = () => {
  // 目標新規作成モーダル
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  // 目標:編集/削除モーダル
  const [activeModal, setActiveModal] = useState<ActiveModal>({ type: "none" });

  const openUpdateGoal = (goal: Goal) => setActiveModal({ type: "updateGoal", goal });
  const closeUpdateGoal = () => setActiveModal({ type: "none" });

  const openDeleteGoal = (goal: Goal) => setActiveModal({ type: "deleteGoal", goal });
  const closeDeleteGoal = () => setActiveModal({ type: "none" });

  const selectedGoal = 
    activeModal.type === "updateGoal" || activeModal.type === "deleteGoal"
      ? activeModal.goal : null;

  // Todo新規作成モーダル
  const [isCreateTodoOpen, setIsCreateTodoOpen] = useState(false);

  // Todo編集モーダル

  // Todo削除モーダル

  return {
    // 目標新規作成モーダル
    isCreateGoalOpen,
    openCreateGoal: () => setIsCreateGoalOpen(true),
    closeCreateGoal: () => setIsCreateGoalOpen(false),

    // 目標編集モーダル
    selectedGoal,
    isUpdateGoalOpen: activeModal.type === "updateGoal",
    openUpdateGoal,
    closeUpdateGoal,

    // 目標削除モーダル
    isDeleteGoalOpen: activeModal.type === "deleteGoal",
    openDeleteGoal,
    closeDeleteGoal,

    // Todo新規作成モーダル
    isCreateTodoOpen,

    // Todo編集モーダル

    // Todo削除モーダル
  };
};
