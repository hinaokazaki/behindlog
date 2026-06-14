"use client";
import Calendar from "react-calendar";
import { useEffect, useMemo, useState } from "react";
import Loading from "@/app/_components/Loading";
import { toYmdWithTimezone, toYmLocal } from "@/lib/date";
import BlockTitle from "../../_components/BlockTitle";
import { useMonthlyRecordDatesQuery } from "../../_hooks/useMonthlyRecordDatesQuery";

// "YYYY-MM" -> Date(その月の1日)
const ymToDate = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

type CalendarSectionProps = {
  userId: string;
  initialMonth?: string;
  timezone: string;
};

export default function DashCalendarSection({
  userId,
  initialMonth,
  timezone,
}: CalendarSectionProps) {
  const defaultMonth = initialMonth ?? toYmLocal(new Date());

  const [value, setValue] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    ymToDate(defaultMonth),
  );

  const month = useMemo(() => toYmLocal(activeStartDate), [activeStartDate]);

  const monthlyRecordDatesQuery = useMonthlyRecordDatesQuery({ userId, month });
  const monthlyRecordDates = monthlyRecordDatesQuery.data?.monthlyRecordDates;

  useEffect(() => {
    if (!initialMonth) return;
    setActiveStartDate(ymToDate(initialMonth));
  }, [initialMonth]);

  const recordMap = useMemo(() => {
    const map = new Map<string, boolean>();

    monthlyRecordDates?.recordedDates.forEach((date) => {
      map.set(date, true);
    });

    return map;
  }, [monthlyRecordDates]);

  const formatDate = (date: Date) => {
    return toYmdWithTimezone(date, timezone);
  };

  if (monthlyRecordDatesQuery.isLoading) return <Loading />;
  if (monthlyRecordDatesQuery.error) {
    return <p>カレンダー情報の取得でエラーが発生しました。</p>;
  }

  return (
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] overflow-hidden rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <BlockTitle title="Calendar" />

      <p className="mb-4 text-lg font-bold text-[#2F2F2F] sm:mb-6 sm:text-2xl">
        {activeStartDate.getFullYear()}年{activeStartDate.getMonth() + 1}月
      </p>

      <div className="w-full overflow-x-auto">
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
      </div>
    </section>
  );
}
