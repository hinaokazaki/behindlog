"use client";
import { Pencil, CircleX } from "lucide-react";

interface Props {
  handleEdit: () => void;
  handleDelete: () => void;
}

const GoalEditButtons: React.FC<Props> = ({ handleEdit, handleDelete }) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={handleEdit}
        className="rounded-full p-2 transition-colors hover:bg-secondary-hover"
        aria-label="編集"
      >
        <Pencil className="h-4 w-4 text-secondary hover:text-white sm:h-5 sm:w-5" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="rounded-full p-2 transition-colors hover:bg-secondary-hover"
        aria-label="削除"
      >
        <CircleX className="h-4 w-4 text-secondary hover:text-white sm:h-5 sm:w-5" />
      </button>
    </div>
  );
};

export default GoalEditButtons;
