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
            <p className="mb-2 flex items-center text-base text-body">
              この目標を削除しますか？
            </p>
            <GoalCardBase goal={goal.title} deadline={goal.deadline} />
          </div>
          <div className="mt-8 flex items-center justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              color="red"
              variant="outlined"
              label="キャンセル"
            />
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              color="red"
              variant="filled"
              label="削除"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteGoalModal;
