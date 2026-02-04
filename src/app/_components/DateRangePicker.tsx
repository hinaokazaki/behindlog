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
    <div className="rounded-lg border p-3">
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={(range) =>
          onChange({
            from: range?.from ?? null,
            to: range?.to ?? null,
          })
        }
      />
      <div className="mt-2 text-sm">
        {value.from ? value.from.toLocaleDateString() : "開始日未選択"}
        {"~"}
        {value.to ? value.to.toLocaleDateString() : "終了日未選択"}
      </div>
    </div>
  );
};
