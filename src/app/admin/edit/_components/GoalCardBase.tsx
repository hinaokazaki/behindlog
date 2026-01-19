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
    <div
      className={`flex items-center justify-between ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`flex w-full items-center justify-between rounded-lg p-3 ${onClick ? "min-w-52 cursor-pointer rounded-xl px-4 py-2 font-semibold text-secondary hover:border-[2px] border-secondary" : ""}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-secondary" />
          <p className="truncate text-base font-semibold">{goal}</p>
        </div>
        <p className="shrink-0 text-base text-sm font-semibold">[{deadline}]</p>
      </button>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default GoalCardBase;
