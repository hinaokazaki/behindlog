"use client";
import { CirclePlus } from "lucide-react";

interface Props {
  handleAdding: () => void;
  label: string;
}

const AddNewButton: React.FC<Props> = ({ handleAdding, label }) => {
  return (
    <button
      type="button"
      onClick={handleAdding}
      className={`mt-2 flex items-center gap-2 rounded-lg p-2`}
    >
      <div className="flex rounded-xl border-secondary px-4 py-2 hover:border-[2px]">
        <CirclePlus className="mx-2 h-6 w-6 text-secondary" />
        <span className="mr-2 text-base font-bold">新しい{label}</span>
      </div>
    </button>
  );
};

export default AddNewButton;
