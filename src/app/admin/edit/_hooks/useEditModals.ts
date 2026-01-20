import { Goal } from "@/schemas/goal";
import { Todo } from "@/schemas/todo";
import { useState } from "react";

type ActiveModal = 
  | { type: "none" }
  | { type: "updateGoal"; goal: Goal }
  | { type: "deleteGoal"; goal: Goal }
  | { type: "updateTodo"; todo: Todo }
  | { type: "deleteTodo"; todo: Todo };

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

  // Todo:編集/削除モーダル
  const openUpdateTodo = (todo: Todo) => setActiveModal({ type: "updateTodo", todo });
  const closeUpdateTodo = () => setActiveModal({ type: "none" });

  const openDeleteTodo = (todo: Todo) => setActiveModal({ type: "deleteTodo", todo });
  const closeDeleteTodo = () => setActiveModal({ type: "none" });

  const selectedTodo = 
    activeModal.type === "updateTodo" || activeModal.type === "deleteTodo"
      ? activeModal.todo : null;
  

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
    openCreateTodo: () => setIsCreateTodoOpen(true),
    closeCreateTodo: () => setIsCreateTodoOpen(false),

    // Todo編集モーダル
    selectedTodo,
    isUpdateTodoOpen: activeModal.type === "updateTodo",
    openUpdateTodo,
    closeUpdateTodo,

    // Todo削除モーダル
    isDeleteTodoOpen: activeModal.type === "deleteTodo",
    openDeleteTodo,
    closeDeleteTodo,
  };
};
