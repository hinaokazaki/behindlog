"use client";
import Image from "next/image";

interface Props {
  handleAdding: () => void;
  label: string;
}

const AddNewButton: React.FC<Props> = ({ handleAdding, label }) => {
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleAdding}
        className={`flex items-center gap-2 rounded-lg p-3`}
      >
        <div className="flex">
          <Image
            src="/add.png"
            width={25}
            height={25}
            alt="追加"
            className="mx-2"
          />
          <span className="mr-2 text-base font-bold">新しい{label}</span>
        </div>
      </button>
    </div>
  );
};

export default AddNewButton;
