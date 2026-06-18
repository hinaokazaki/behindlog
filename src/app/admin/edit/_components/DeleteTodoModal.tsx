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

            <p className="mb-2 flex items-center text-body sm:text-base">
              このTodoを削除しますか？
            </p>

            <TodoCardBase
              todo={todo.title}
              dueDate={todo.dueDate}
              completed={todo.isCompleted}
            />
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

export default DeleteTodoModal;
