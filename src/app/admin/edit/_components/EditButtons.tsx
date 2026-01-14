"use client";
import Image from "next/image";

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
        className="rounded-full p-2 hover:bg-[#FFF3F0]"
        aria-label="編集"
      >
        <Image src="/editRed.png" width={22} height={22} alt="編集" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="rounded-full p-2 hover:bg-[#FFF3F0]"
        aria-label="削除"
      >
        <Image src="/delete.png" width={22} height={22} alt="削除" />
      </button>
    </div>
  );
};

export default GoalEditButtons;
