"use client";
import React from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  goal: string;
  deadline: string;
  rightSlot?: React.ReactNode;
}

const GoalCardBase: React.FC<Props> = ({
  onClick,
  className,
  goal,
  deadline,
  rightSlot,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`flex w-full min-w-0 flex-col gap-1 rounded-lg p-3 text-left sm:flex-row sm:items-center sm:justify-between ${
          onClick
            ? "cursor-pointer rounded-xl px-4 py-2 font-semibold text-secondary hover:border-[2px] hover:border-secondary"
            : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-secondary" />
          <p className="truncate text-base text-sm font-semibold sm:text-base">
            {goal}
          </p>
        </div>

        <p className="shrink-0 pl-6 text-base text-xs font-semibold sm:pl-0 sm:text-sm">
          [{deadline}]
        </p>
      </button>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default GoalCardBase;
