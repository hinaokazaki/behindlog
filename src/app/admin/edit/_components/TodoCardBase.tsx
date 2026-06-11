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
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`flex w-full min-w-0 flex-col gap-1 rounded-lg p-2 text-left sm:flex-row sm:items-center sm:justify-between ${
          onClick
            ? "cursor-pointer rounded-xl border-secondary px-4 py-2 font-semibold text-secondary hover:border-[2px]"
            : ""
        }`}
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

          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
              completed ? "border-buttonMain bg-white" : "border-buttonMain"
            } ${
              isToggleEnabled ? "cursor-pointer" : "cursor-default opacity-60"
            }`}
            aria-hidden="true"
          >
            {completed && <span className="text-sm text-buttonMain">✓</span>}
          </span>

          <span
            className={`min-w-0 truncate text-base text-sm sm:text-base ${
              completed ? "line-through" : ""
            }`}
          >
            {todo}
          </span>
        </label>

        <p className="shrink-0 pl-7 text-base text-xs font-semibold sm:pl-0 sm:text-sm">
          [{dueDate}]
        </p>
      </button>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default TodoCardBase;
