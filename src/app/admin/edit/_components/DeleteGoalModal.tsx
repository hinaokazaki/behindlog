"use client";
import { Goal } from "@/schemas/goal";
import { Modal } from "../../_components/Modal";
import GoalCardBase from "./GoalCardBase";
import Button from "@/app/_components/Button";

interface Props {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const DeleteGoalModal: React.FC<Props> = ({
  isOpen,
  goal,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {goal && (
        <div>
          <div>
            <h1 className="mb-6 text-base text-subtitle-top font-bold">
              目標の削除
            </h1>

            <p className="mb-2 flex items-center text-body sm:text-base">
              この目標を削除しますか？
            </p>

            <GoalCardBase goal={goal.title} deadline={goal.deadline} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              color="main"
              variant="outlined"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              color="main"
              variant="filled"
            >
              削除
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteGoalModal;
