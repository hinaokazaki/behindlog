"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { UserSummary } from "@/schemas/monthlyRecords";
import { useMonthlyRecordsQuery } from "../_hooks/useMonthlyRecordsQuery";
import { toYmLocal } from "@/lib/date";
import Loading from "@/app/_components/Loading";

export default function CalendarPage() {
  const router = useRouter();
  const [value, setValue] = useState<Date>(new Date());
  const searchParams = useSearchParams();
  const monthParam = searchParams.get("month");
  const month = useMemo(
    () => monthParam ?? toYmLocal(new Date()),
    [monthParam],
  );

  const monthlyRecordsQuery = useMonthlyRecordsQuery({ month });
  const monthlyRecords = monthlyRecordsQuery.data?.monthlyRecords;

  // 日付をmap化
  const recordMap = useMemo(() => {
    const map = new Map<string, UserSummary[]>();
    monthlyRecords?.record.forEach((item) => {
      map.set(item.date, item.users);
    });
    return map;
  }, [monthlyRecords]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (monthlyRecordsQuery.isLoading) return <Loading />;
  if (monthlyRecordsQuery.error)
    return <p>カレンダー情報の取得でエラーが発生しました。</p>;

  return (
    <div className="rounded-2xl bg-[#F6F2E8] p-8">
      <Calendar
        locale="en-US"
        value={value}
        onChange={(val) => setValue(val as Date)}
        onClickDay={(date) => {
          const dateString = formatDate(date);
          router.push(`/records/${dateString}`);
        }}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dateString = formatDate(date);
          const records = recordMap.get(dateString);

          if (!records || records.length === 0) return null;

          const maxVisible = 2;
          const visibleRecords = records.slice(0, maxVisible);
          const remaining = records.length - maxVisible;

          return (
            <div className="mt-1 space-y-1 text-xs">
              {visibleRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-1 text-gray-700"
                >
                  <span className="text-orange-400">👤</span>
                  <span className="truncate">{record.name}</span>
                </div>
              ))}

              {remaining > 0 && (
                <div className="text-xs text-orange-400">+{remaining}</div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
