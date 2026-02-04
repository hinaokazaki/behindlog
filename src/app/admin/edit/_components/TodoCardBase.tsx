"use client";
import React from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  todo: string;
  dueDate: string;
  completed: boolean;
  onToggle?: (next: boolean) => void | null;
  rightSlot?: React.ReactNode;
}

const TodoCardBase: React.FC<Props> = ({
  onClick,
  className,
  todo,
  dueDate,
  completed,
  onToggle,
  rightSlot,
}) => {
  const isToggleEnabled = !!onToggle;

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
        <label className="flex min-w-0 items-center gap-2">
          <input
            type="checkbox"
            checked={completed}
            disabled={!isToggleEnabled}
            onChange={(e) => {
              e.stopPropagation();
              onToggle?.(e.target.checked);
            }}
            className="sr-only"
          />

          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 
            ${completed ? "bg-white border-secondary" : "border-secondary"} 
            ${isToggleEnabled ? "cursor-pointer" : "cursor-default opacity-60"}`}
            aria-hidden="true"
          >
            {completed && <span className="text-secondary text-sm">✓</span>}
          </span>

          <span className={`min-w-0 truncate text-base ${completed ? "line-through text-base" : ""}`}>{todo}</span>
        </label>
        <p className="shrink-0 text-base text-sm font-semibold">[{dueDate}]</p>
      </button>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default TodoCardBase;
