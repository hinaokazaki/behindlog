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
      className={`flex items-center justify-between gap-3 ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={[
          "flex flex-1 items-center justify-between gap-3 rounded-xl px-4 py-3",
          onClick
            ? "cursor-pointer border-[2px] border-secondary text-secondary hover:bg-white"
            : "cursor-default border-[2px] border-transparent text-body",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-3 w-3 shrink-0 rounded-full bg-secondary" />
          <p className="truncate text-base font-semibold">{goal}</p>
          <p className="shrink-0 text-sm font-semibold">{deadline}</p>
        </div>
      </button>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default GoalCardBase;
