"use client";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import Loading from "@/app/_components/Loading";
import SectionTitle from "@/app/_components/SectionTitle";
import Textarea from "@/app/_components/Textarea";
import BlockTitle from "@/app/admin/_components/BlockTitle";
import { useCommittimeSummaryQuery } from "@/app/admin/_hooks/useCommittimeSummaryQuery";
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

  const committimeSummaryQuery = useCommittimeSummaryQuery();
  const friendRecordData = useFetch<{ dailyRecord: UserRecord }>(
    `/api/users/${id}/records/${date}`,
  );

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
  // const todoItems: TodoSnapshot = friendRecord?.todoSnapshot
  //   ? friendRecord?.todoSnapshot
  //   : undefined;

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
    committimeSummaryQuery.data?.totalStudyTime.totalStudyTimeByPeriod ?? 0;

  return (
    <form>
      <div className="flex items-center justify-between">
        <SectionTitle title="Today's Record" />
        <p className="text-heading-3 font-extrabold text-primary">{date}</p>
      </div>
      <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
        <BlockTitle title="Todo list" />
        <div className="space-y-2">
          {snapshot?.items.map((t, index) => (
            <TodoCardBase
              key={t.id}
              todo={t.title}
              dueDate={t.dueDate || ""}
              completed={t.isCompleted}
              // onToggle={(next) => toggleTodo(index, next)}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
        <BlockTitle title="Commit time" />
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-base text-form-text">目標学習時間</p>
            <p className="ml-4 mt-4 text-base font-bold">
              {displayCommittime.targetTime
                ? Math.floor(displayCommittime.targetTime / 60)
                : 0}
              <span className="ml-8 text-base text-form-text">時間</span>
            </p>
          </div>

          <p className="text-base text-sm font-semibold">
            [{displayCommittime.startDate ?? "----"} -{" "}
            {displayCommittime.endDate ?? "----"}]
          </p>
        </div>

        <div className="mt-4 border-t border-gray-200" />

        <div className="mt-4 grid grid-cols-2 gap-8">
          <div>
            <p className="text-base text-form-text">今日の学習時間</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  className="w-20 rounded-md border-2 p-2 text-center"
                  {...register("studyHours")}
                />
                <span className="text-base text-form-text font-medium">
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
                  className="w-20 rounded-md border-2 p-2 text-center"
                  {...register("studyMinutes")}
                />
                <span className="text-base text-form-text font-medium">分</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-base text-form-text">合計学習時間</p>
            <p className="mt-4 text-base font-semibold">
              {Math.floor(totalStudyTimeByPeriod / 60)}
              <span className="mx-4 text-base text-form-text font-medium">
                時間
              </span>
              {totalStudyTimeByPeriod % 60}
              <span className="mx-4 text-base text-form-text font-medium">
                分
              </span>
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
        <BlockTitle title="Note" />
        <Label name="memo" title="今日の記録" />
        <Textarea
          id="memo"
          placeholder="今日の記録はありません"
          {...register("memo")}
        />
      </section>
    </form>
  );
}
