"use client";
import { Modal } from "../../_components/Modal";
import Button from "@/app/_components/Button";
import { Todo } from "@/schemas/todo";
import TodoCardBase from "./TodoCardBase";

interface Props {
  isOpen: boolean;
  todo: Todo | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const DeleteTodoModal: React.FC<Props> = ({
  isOpen,
  todo,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {todo && (
        <div>
          <div>
            <h1 className="mb-6 text-base text-subtitle-top font-bold">
              Todoの削除
            </h1>
            <p className="mb-2 flex items-center text-base text-body">
              このTodoを削除しますか？
            </p>
            <TodoCardBase todo={todo.title} dueDate={todo.dueDate} completed={todo.isCompleted} />
          </div>
          <div className="mt-8 flex items-center justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              color="red"
              variant="outlined"
              children="キャンセル"
            />
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              color="red"
              variant="filled"
              children="削除"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteTodoModal;
