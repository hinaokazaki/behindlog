"use client";
import { Pencil, CircleX } from "lucide-react";

interface Props {
  handleEdit: () => void;
  handleDelete: () => void;
}

const GoalEditButtons: React.FC<Props> = ({ handleEdit, handleDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleEdit}
        className="rounded-full p-2 hover:bg-secondary-hover"
        aria-label="編集"
      >
        <Pencil className="h-5 w-5 text-primary" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="rounded-full p-2 hover:bg-secondary-hover"
        aria-label="削除"
      >
        <CircleX className="h-5 w-5 text-primary" />
      </button>
    </div>
  );
};

export default GoalEditButtons;
