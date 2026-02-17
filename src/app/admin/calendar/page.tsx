"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { UserSummary } from "@/schemas/monthlyRecords";
import { useMonthlyRecordsQuery } from "../_hooks/useMonthlyRecordsQuery";
import { toYmdLocal, toYmLocal } from "@/lib/date";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import UserName from "./_component/UserName";
import Image from "next/image";

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
    <div className="p-4">
      <SectionTitle title="Calendar" />
      <div className="mx-auto w-full max-w-[1080px] rounded-3xl bg-white p-8 shadow-sm">
        <Calendar
          className="bl-calendar"
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
                  <UserName
                    key={record.id}
                    name={record.name ? record.name : ""}
                    link={`/users/${record.recordId}/records/${toYmdLocal(new Date())}`}
                  />
                ))}

                {remaining > 0 && (
                  <Image
                    src="/more.png"
                    width={20}
                    height={20}
                    alt="more"
                    className="mx-2"
                  />
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
