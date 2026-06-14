"use client";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value: { from: Date | null; to: Date | null };
  onChange: (v: { from: Date | null; to: Date | null }) => void;
};

export const DateRangePicker = ({ value, onChange }: Props) => {
  const selected: DateRange | undefined =
    value.from || value.to
      ? { from: value.from ?? undefined, to: value.to ?? undefined }
      : undefined;

  return (
    <div className="overflow-x-auto rounded-xl border border-base p-3 sm:p-4">
      <div className="min-w-[280px]">
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={(range) =>
            onChange({
              from: range?.from ?? null,
              to: range?.to ?? null,
            })
          }
          className="mx-auto text-sm sm:text-base"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 text-form-text font-semibold sm:text-sm">
        <span>
          開始日：
          {value.from ? value.from.toLocaleDateString() : "未選択"}
        </span>

        <span>
          終了日：
          {value.to ? value.to.toLocaleDateString() : "未選択"}
        </span>
      </div>
    </div>
  );
};
