"use client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value: Date | null;
  onChange: (v: Date | null) => void;
};

export const DatePicker = ({ value, onChange }: Props) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-base p-3 sm:p-4">
      <div className="min-w-[280px]">
        <DayPicker
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => onChange(date ?? null)}
          className="mx-auto text-sm sm:text-base"
        />
      </div>

      <div className="mt-4 text-form-text font-semibold sm:text-sm">
        {value ? value.toLocaleDateString() : "日付未選択"}
      </div>
    </div>
  );
};
