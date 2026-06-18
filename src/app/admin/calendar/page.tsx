"use client";
import Calendar from "react-calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { UserSummary } from "@/schemas/monthlyRecords";
import { useMonthlyRecordsQuery } from "../_hooks/useMonthlyRecordsQuery";
import { toYmdWithTimezone, toYmLocal } from "@/lib/date";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import UserName from "./_components/UserName";
import { Modal } from "../_components/Modal";
import "react-calendar/dist/Calendar.css";
import { CircleEllipsis, CirclePlus } from "lucide-react";

const ymToDate = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

function CalendarPageFunction() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monthParam = searchParams.get("month");
  const initialMonth = monthParam ?? toYmLocal(new Date());

  const [value, setValue] = useState<Date>(() => new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(() =>
    ymToDate(initialMonth),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserSummary[]>([]);

  const month = useMemo(() => toYmLocal(activeStartDate), [activeStartDate]);

  useEffect(() => {
    if (!monthParam) return;
    setActiveStartDate(ymToDate(monthParam));
  }, [monthParam]);

  const monthlyRecordsQuery = useMonthlyRecordsQuery({ month });
  const monthlyRecords = monthlyRecordsQuery.data?.monthlyRecords;

  const recordMap = useMemo(() => {
    const map = new Map<string, UserSummary[]>();
    monthlyRecords?.record.forEach((item) => {
      map.set(item.date, item.users);
    });
    return map;
  }, [monthlyRecords]);

  const timeZone = monthlyRecords?.viewerTimezone ?? "UTC";
  const formatDate = (date: Date) => toYmdWithTimezone(date, timeZone);

  const updateMonth = (date: Date) => {
    setActiveStartDate(date);

    const nextMonth = toYmLocal(date);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", nextMonth);
    router.replace(`?${params.toString()}`);
  };

  const openMobileModal = (date: Date) => {
    const dateString = formatDate(date);
    setSelectedDate(dateString);
    setSelectedUsers(recordMap.get(dateString) ?? []);
    setIsOpen(true);
  };

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
    <div className="px-4 pb-24 sm:px-6 lg:px-10">
      <SectionTitle title="Calendar" />

      <div className="mx-auto w-full max-w-[1080px] overflow-hidden rounded-3xl bg-white p-4 shadow-sm sm:p-8">
        {/* mobile calendar */}
        <div className="md:hidden">
          <p className="mb-4 text-lg font-bold text-[#2F2F2F]">
            {activeStartDate.getFullYear()}年{activeStartDate.getMonth() + 1}月
          </p>

          <Calendar
            className="mini-calendar"
            locale="en-US"
            value={value}
            onChange={(val) => setValue(val as Date)}
            onClickDay={openMobileModal}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (!activeStartDate) return;
              updateMonth(activeStartDate);
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
              const records = recordMap.get(dateString) ?? [];
              return records.length > 0 ? "has-record" : "no-record";
            }}
          />
        </div>

        {/* desktop calendar */}
        <div className="hidden md:block">
          <Calendar
            className="main-calendar"
            locale="en-US"
            value={value}
            onChange={(val) => setValue(val as Date)}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (!activeStartDate) return;
              updateMonth(activeStartDate);
            }}
            tileContent={({ date, view }) => {
              if (view !== "month") return null;

              const dateString = formatDate(date);
              const records = recordMap.get(dateString) ?? [];

              const maxVisible = 2;
              const visibleRecords = records.slice(0, maxVisible);
              const remaining = records.length - maxVisible;

              return (
                <div className="tile-content group relative h-full w-full text-xs">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openRecordPage(e, dateString)}
                    onKeyDown={(e) =>
                      handleEnterOrSpace(e, () =>
                        router.push(`/admin/records/${dateString}`),
                      )
                    }
                    className="calendar-add-btn absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full p-1 opacity-0 transition-opacity duration-200 hover:bg-secondary-hover focus:opacity-100 group-hover:opacity-100"
                    aria-label="create new record"
                  >
                    <CirclePlus className="h-5 w-5 text-buttonMain" />
                  </div>

                  {records.length > 0 && (
                    <>
                      <div className="space-y-1 pt-2">
                        {visibleRecords.map((record) => {
                          const isMe =
                            record.id === monthlyRecords?.viewerUserId;

                          const href = isMe
                            ? `/admin/records/${dateString}`
                            : `/admin/users/${record.id}/records/${dateString}`;

                          return (
                            <UserName
                              key={record.id}
                              name={record.name ?? ""}
                              link={href}
                            />
                          );
                        })}
                      </div>

                      {remaining > 0 && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => openMoreModal(e, dateString, records)}
                          onKeyDown={(e) =>
                            handleEnterOrSpace(e, () => {
                              setSelectedDate(dateString);
                              setSelectedUsers(records);
                              setIsOpen(true);
                            })
                          }
                          className="mt-1 rounded-full p-1 hover:bg-secondary-hover"
                          aria-label="More"
                        >
                          <CircleEllipsis className="mx-2 h-5 w-5 text-buttonMain" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <p className="text-base font-bold">{selectedDate}</p>

          <div className="space-y-2">
            {selectedUsers.length === 0 ? (
              <p className="text-base font-semibold">
                この日の記録はまだありません
              </p>
            ) : (
              selectedUsers.map((record) => {
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
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!selectedDate) return;
              router.push(`/admin/records/${selectedDate}`);
            }}
            className="mt-2 flex items-center gap-2 rounded-lg p-2"
          >
            <div className="flex rounded-xl border-secondary px-4 py-2 hover:border-[2px]">
              <CirclePlus className="mx-2 h-6 w-6 text-buttonMain" />
              <span className="mr-2 text-base font-bold">新しい記録を作成</span>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CalendarPageFunction />
    </Suspense>
  );
}
