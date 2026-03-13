"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UserSummary } from "@/schemas/monthlyRecords";
import { useMonthlyRecordsQuery } from "../_hooks/useMonthlyRecordsQuery";
import { toYmdWithTimezone, toYmLocal } from "@/lib/date";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import UserName from "./_components/UserName";
import Image from "next/image";
import { Modal } from "../_components/Modal";

// "YYYY-MM" -> Date(その月の1日) にする
const ymToDate = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monthParam = searchParams.get("month");
  const initialMonth = monthParam ?? toYmLocal(new Date());
  const [value, setValue] = useState<Date>(() => new Date()); // 選択している日
  const [activeStartDate, setActiveStartDate] = useState<Date>(() =>
    ymToDate(initialMonth),
  ); // 表示している月
  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserSummary[]>([]);

  // 表示中の月からYYYY-MMを作る
  const month = useMemo(() => toYmLocal(activeStartDate), [activeStartDate]);

  // 初回や、外部からURL month が変わった時に表示月を同期
  useEffect(() => {
    if (!monthParam) return;
    setActiveStartDate(ymToDate(monthParam));
  }, [monthParam]);

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

  const timeZone = monthlyRecords?.viewerTimezone ?? "UTC";
  const formatDate = (date: Date) => toYmdWithTimezone(date, timeZone);

  const stopTileEvent = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openRecordPage = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    dateString: string,
  ) => {
    stopTileEvent(e);
    router.push(`/admin/records/${dateString}`);
  };

  const openMoreModal = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    dateString: string,
    records: UserSummary[],
  ) => {
    stopTileEvent(e);
    setSelectedDate(dateString);
    setSelectedUsers(records);
    setIsOpen(true);
  };

  const handleEnterOrSpace = (
    e: React.KeyboardEvent<HTMLElement>,
    callback: () => void,
  ) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    stopTileEvent(e);
    callback();
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
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (!activeStartDate) return;

            setActiveStartDate(activeStartDate);

            // URLも更新
            const nextMonth = toYmLocal(activeStartDate);
            const params = new URLSearchParams(searchParams.toString());
            params.set("month", nextMonth);
            router.replace(`?${params.toString()}`);
          }}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dateString = formatDate(date);
            const records = recordMap.get(dateString) ?? [];

            const maxVisible = 2;
            const visibleRecords = records.slice(0, maxVisible);
            const remaining = records.length - maxVisible;

            return (
              <div className="tile-content group h-full w-full text-xs">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/admin/records/${dateString}`);
                  }}
                  onKeyDown={(e) =>
                    handleEnterOrSpace(e, () =>
                      router.push(`/admin/records/${dateString}`),
                    )
                  }
                  className="calendar-add-btn absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full p-1 opacity-0 transition-opacity duration-200 hover:bg-[#FFF3F0] focus:opacity-100 group-hover:opacity-100"
                  aria-label="create new record"
                >
                  <Image
                    src="/add.png"
                    width={20}
                    height={20}
                    alt="add new page"
                  />
                </div>

                {records.length > 0 && (
                  <>
                    <div className="space-y-1 pt-2 text-sm">
                      {visibleRecords.map((record) => {
                        const isMe = record.id === monthlyRecords?.viewerUserId;

                        const href = isMe
                          ? `/admin/records/${dateString}`
                          : `/admin/users/${record.id}/records/${dateString}`;

                        return (
                          <UserName
                            key={record.id}
                            name={record.name ? record.name : ""}
                            link={href}
                          />
                        );
                      })}
                    </div>

                    {remaining > 0 && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedDate(dateString);
                          setSelectedUsers(records);
                          setIsOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedDate(dateString);
                            setSelectedUsers(records);
                            setIsOpen(true);
                          }
                        }}
                        className="mt-1 rounded-full p-1 hover:bg-[#FFF3F0]"
                        aria-label="More"
                      >
                        <Image
                          src="/more.png"
                          width={20}
                          height={20}
                          alt="more"
                          className="mx-2"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        children={
          <div className="space-y-2">
            <p className="mb-4 text-base font-bold">{selectedDate}</p>
            {selectedUsers.map((record) => {
              const isMe = record.id === monthlyRecords?.viewerUserId;

              const href = isMe
                ? `/admin/records/${selectedDate}`
                : `/admin/users/${record.id}/records/${selectedDate}`;
              return (
                <UserName
                  key={record.id}
                  name={record.name ?? ""}
                  link={selectedDate ? href : "#"}
                />
              );
            })}
          </div>
        }
      />
    </div>
  );
}
