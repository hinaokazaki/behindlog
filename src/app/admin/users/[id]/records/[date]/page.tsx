"use client";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import Textarea from "@/app/_components/Textarea";
import BlockTitle from "@/app/admin/_components/BlockTitle";
import useFetch from "@/app/admin/_hooks/useFetch";
import TodoCardBase from "@/app/admin/edit/_components/TodoCardBase";
import { todoSnapshotSchema } from "@/schemas/dailyRecord";
import { UserRecord } from "@/schemas/userRecord";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type RecordForm = {
  memo: string;
  studyHours: string;
  studyMinutes: string;
  todoItems: {
    date: string;
    items: {
      id: number;
      title: string;
      isCompleted: boolean;
      dueDate: string | null;
    }[];
  };
};

export default function FriendRecordsPage({
  params,
}: {
  params: { id: string; date: string };
}) {
  const id = params.id;
  const date = params.date;

  const friendRecordData = useFetch<{
    dailyRecord: UserRecord;
    totalStudyTime: {
      totalStudyTimeByPeriod: number;
    };
    userName: string;
  }>(`/api/users/${id}/records/${date}`);

  const { register, reset } = useForm<RecordForm>({
    defaultValues: {
      memo: "",
      studyHours: "",
      studyMinutes: "",
      todoItems: { date, items: [] },
    },
  });

  useEffect(() => {
    if (!friendRecordData.data?.dailyRecord) return;
    const friendRecord = friendRecordData.data.dailyRecord;
    const total = friendRecord.totalStudyTime ?? 0;

    reset({
      memo: friendRecord.memo ?? "",
      studyHours: String(Math.floor(total / 60)),
      studyMinutes: String(total % 60),
      todoItems: { date, items: [] },
    });
  }, [friendRecordData.data?.dailyRecord, date, reset]);

  if (friendRecordData.isLoading) return <Loading />;

  if (friendRecordData.error) {
    return <p>取得に失敗しました: {String(friendRecordData.error)}</p>;
  }

  if (!friendRecordData.data?.dailyRecord) {
    return <p>記録が見つかりません</p>;
  }

  const friendRecord = friendRecordData.data?.dailyRecord;
  // unknown型をTodoSnapshotに変換
  const snapshot = todoSnapshotSchema.parse(friendRecord.todoSnapshot);

  const displayCommittime = {
    targetTime: friendRecord?.commitTargetTime
      ? friendRecord?.commitTargetTime
      : null,
    startDate: friendRecord?.commitStartDate
      ? friendRecord?.commitStartDate
      : null,
    endDate: friendRecord?.commitEndDate ? friendRecord?.commitEndDate : null,
  };

  // totalStudyTimeByPeriod
  const totalStudyTimeByPeriod =
    friendRecordData.data?.totalStudyTime.totalStudyTimeByPeriod ?? 0;

  return (
    <form className="px-4 pb-24 sm:px-6 lg:px-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle title={`${friendRecordData.data.userName}'s Record`} />
        <p className="text-subtitle-top font-extrabold text-primary sm:text-heading-3">
          {date}
        </p>
      </div>

      <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <BlockTitle title="Todo list" />
        <div className="space-y-2">
          {snapshot?.items.map((t) => (
            <TodoCardBase
              key={t.id}
              todo={t.title}
              dueDate={t.dueDate || ""}
              completed={t.isCompleted}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <BlockTitle title="Commit time" />

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-form-text sm:text-base">目標学習時間</p>
            <p className="mt-3 text-base font-bold sm:ml-4 sm:mt-4">
              {displayCommittime.targetTime
                ? Math.floor(displayCommittime.targetTime / 60)
                : 0}
              <span className="ml-3 text-form-text sm:ml-8 sm:text-base">
                時間
              </span>
            </p>
          </div>

          <p className="text-xs font-semibold sm:text-sm">
            [{displayCommittime.startDate ?? "----"} -{" "}
            {displayCommittime.endDate ?? "----"}]
          </p>
        </div>

        <div className="mt-4 border-t border-gray-200" />

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <div>
            <p className="text-form-text sm:text-base">今日の学習時間</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  readOnly
                  className="w-20 cursor-default rounded-md border-2 bg-gray-50 p-2 text-center text-base"
                  {...register("studyHours")}
                />
                <span className="text-form-text font-medium sm:text-base">
                  時間
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  readOnly
                  className="w-20 rounded-md border-2 bg-gray-50 p-2 text-center text-base"
                  {...register("studyMinutes")}
                />
                <span className="text-form-text font-medium sm:text-base">
                  分
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-form-text sm:text-base">合計学習時間</p>
            <p className="mt-4 text-base font-semibold">
              {Math.floor(totalStudyTimeByPeriod / 60)}
              <span className="mx-2 text-form-text font-medium sm:mx-4 sm:text-base">
                時間
              </span>
              {totalStudyTimeByPeriod % 60}
              <span className="mx-2 text-form-text font-medium sm:mx-4 sm:text-base">
                分
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <BlockTitle title="Note" />
        <Label name="memo" title="今日の記録" />
        <Textarea
          id="memo"
          placeholder="今日の記録はありません"
          className="cursor-default bg-gray-50 text-base"
          readOnly
          {...register("memo")}
        />
      </section>
    </form>
  );
}
