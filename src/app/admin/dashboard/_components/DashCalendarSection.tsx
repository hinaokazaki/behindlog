"use client";
import Calendar from "react-calendar";
import { useEffect, useMemo, useState } from "react";
import Loading from "@/app/_components/Loading";
import { toYmdWithTimezone, toYmLocal } from "@/lib/date";
import { useMonthlyRecordsQuery } from "../../_hooks/useMonthlyRecordsQuery";
import BlockTitle from "../../_components/BlockTitle";

// "YYYY-MM" -> Date(その月の1日)
const ymToDate = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

type CalendarSectionProps = {
  initialMonth?: string;
};

export default function DashCalendarSection({
  initialMonth,
}: CalendarSectionProps) {
  const defaultMonth = initialMonth ?? toYmLocal(new Date());

  const [value, setValue] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    ymToDate(defaultMonth),
  );

  const month = useMemo(() => toYmLocal(activeStartDate), [activeStartDate]);

  const monthlyRecordsQuery = useMonthlyRecordsQuery({ month });
  const monthlyRecords = monthlyRecordsQuery.data?.monthlyRecords;

  useEffect(() => {
    if (!initialMonth) return;
    setActiveStartDate(ymToDate(initialMonth));
  }, [initialMonth]);

  const recordMap = useMemo(() => {
    const map = new Map<string, boolean>();

    monthlyRecords?.record.forEach((item) => {
      if (item.users.length > 0) {
        map.set(item.date, true);
      }
    });

    return map;
  }, [monthlyRecords]);

  const timeZone = monthlyRecords?.viewerTimezone ?? "UTC";

  const formatDate = (date: Date) => {
    return toYmdWithTimezone(date, timeZone);
  };

  if (monthlyRecordsQuery.isLoading) return <Loading />;
  if (monthlyRecordsQuery.error) {
    return <p>カレンダー情報の取得でエラーが発生しました。</p>;
  }

  return (
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Calendar" />

      <p className="mb-6 text-2xl font-bold text-[#2F2F2F]">
        {activeStartDate.getFullYear()}年{activeStartDate.getMonth() + 1}月
      </p>

      <Calendar
        className="mini-calendar"
        value={value}
        locale="en-US"
        onChange={(val) => setValue(val as Date)}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (!activeStartDate) return;
          setActiveStartDate(activeStartDate);
        }}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={false}
        formatDay={(_, date) => String(date.getDate())}
        formatShortWeekday={(_, date) => {
          const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
          return weekDays[date.getDay()];
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const dateString = formatDate(date);
          const hasRecord = recordMap.has(dateString);

          return hasRecord ? "has-record" : "no-record";
        }}
      />
    </section>
  );
}
