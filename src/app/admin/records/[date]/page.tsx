"use client";
import { useApi } from "@/app/_hooks/useApi";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import { useCommittimeSummaryQuery } from "../../_hooks/useCommittimeSummaryQuery";
import { useTodoQuery } from "../../_hooks/useTodoQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/app/_components/Loading";
import useFetch from "../../_hooks/useFetch";
import {
  CreateDailyRecord,
  DailyRecord,
  TodoSnapshot,
  todoSnapshotSchema,
} from "@/schemas/dailyRecord";
import TodoCardBase from "../../edit/_components/TodoCardBase";
import Button from "@/app/_components/Button";
import Label from "@/app/_components/Label";
import Textarea from "@/app/_components/Textarea";
import BlockTitle from "../../_components/BlockTitle";
import SectionTitle from "@/app/_components/SectionTitle";
import CommittimeRecordForm from "./_components/CommittimeRecordForm";
import { isCommittimeExpired } from "./_utils/isCommittimeExpired";
import UpdateCommittimeModal from "./_components/UpdateCommittimeModal";
import CommittimeExpiredAlert from "./_components/CommittimeExpiredAlert";

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

const toDateOnly = (value: string | Date | null | undefined) => {
  if (!value) return null;
  return typeof value === "string"
    ? value.slice(0, 10)
    : value.toISOString().slice(0, 10);
};

export default function RecordsPage({ params }: { params: { date: string } }) {
  const date = params.date;
  const committimeSummaryQuery = useCommittimeSummaryQuery(date);
  const committimeQuery = useCommittimeQuery();
  const todoQuery = useTodoQuery();
  const recordQuery = useFetch<{ dailyRecord: DailyRecord }>(
    `/api/records/${date}`,
  );
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<RecordForm>({
      defaultValues: {
        memo: "",
        studyHours: "",
        studyMinutes: "",
        todoItems: { date, items: [] },
      },
    });

  useEffect(() => {
    if (recordQuery.data?.dailyRecord) {
      const dailyRecord = recordQuery.data.dailyRecord;

      // unknown型をTodoSnapshotに変換
      const snapshot = todoSnapshotSchema.parse(dailyRecord.todoSnapshot);

      const total = dailyRecord.totalStudyTime ?? 0;
      reset({
        memo: dailyRecord.memo ?? "",
        studyHours: String(Math.floor(total / 60)),
        studyMinutes: String(total % 60),
        todoItems: snapshot,
      });
      return;
    }

    const todos = todoQuery.data?.todos ?? [];
    const snapshot: TodoSnapshot = {
      date,
      items: todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        isCompleted: todo.isCompleted,
        dueDate: todo.dueDate ?? null,
      })),
    };

    reset({
      memo: "",
      studyHours: "",
      studyMinutes: "",
      todoItems: snapshot,
    });
  }, [date, recordQuery.data, todoQuery.data, reset]);

  if (
    committimeSummaryQuery.isLoading ||
    committimeQuery.isLoading ||
    todoQuery.isLoading
  )
    return <Loading />;

  if (committimeSummaryQuery.error)
    return (
      <p>
        合計学習時間の取得でエラーが発生しました:{" "}
        {committimeSummaryQuery.error.message}
      </p>
    );

  if (committimeQuery.error)
    return (
      <p>
        目標時間の取得でエラーが発生しました: {committimeQuery.error.message}
      </p>
    );

  if (todoQuery.error)
    return <p>Todoの取得でエラーが発生しました: {todoQuery.error.message}</p>;

  // committime
  const record = recordQuery.data?.dailyRecord ?? null;
  const currentCommittime = committimeQuery.data?.committime ?? null;

  const displayCommittime = {
    targetTime:
      record?.commitTargetTime ?? currentCommittime?.targetTime ?? null,
    startDate: record?.commitStartDate ?? currentCommittime?.startDate ?? null,
    endDate: record?.commitEndDate ?? currentCommittime?.endDate ?? null,
  };

  // committime編集可能期間チェック
  const currentStartDate = toDateOnly(currentCommittime?.startDate);
  const currentEndDate = toDateOnly(currentCommittime?.endDate);

  const isWithinCurrentCommittimePeriod =
    !!currentStartDate &&
    !!currentEndDate &&
    date >= currentStartDate &&
    date <= currentEndDate;

  // Check committime's deadline
  const isExistingRecord = !!record;
  const isExpired =
    !isExistingRecord && !!currentEndDate && date > currentEndDate;
  const canEditStudyTime = isWithinCurrentCommittimePeriod && !isExpired;

  // todo checkbox state
  const todoItems = watch("todoItems");
  const toggleTodo = (index: number, next: boolean) => {
    setValue(`todoItems.items.${index}.isCompleted`, next);
  };

  // submit
  const onSubmit = async (data: RecordForm) => {
    const total = canEditStudyTime
      ? Number(data.studyHours || 0) * 60 + Number(data.studyMinutes || 0)
      : (record?.totalStudyTime ?? 0);

    const payload: CreateDailyRecord = {
      memo: data.memo,
      totalStudyTime: total,
      todoSnapshot: data.todoItems,
      applyTodoUpdates: true,
    };

    setIsSubmitting(true);
    try {
      await callApi<{ dailyRecord: DailyRecord }>(
        `/api/records/${date}`,
        "PUT",
        payload,
      );
      router.refresh();
      committimeSummaryQuery.mutate();
      recordQuery.mutate();
    } catch (error) {
      console.error("save records failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // totalStudyTimeByPeriod
  const totalStudyTimeByPeriod =
    committimeSummaryQuery.data?.totalStudyTime.totalStudyTimeByPeriod ?? 0;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <SectionTitle title="Today's Record" />
          <p className="text-heading-3 font-extrabold text-primary">{date}</p>
        </div>
        <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
          <BlockTitle title="Todo list" />
          <div className="space-y-2">
            {todoItems.items.map((t, index) => (
              <TodoCardBase
                key={t.id}
                todo={t.title}
                dueDate={t.dueDate || ""}
                completed={t.isCompleted}
                onToggle={(next) => toggleTodo(index, next)}
              />
            ))}
          </div>
        </section>
        <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
          <BlockTitle title="Commit time" />
          {isExpired ? (
            <CommittimeExpiredAlert
              targetTime={displayCommittime.targetTime}
              endDate={displayCommittime.endDate}
              onOpenModal={() => setIsModalOpen(true)}
            />
          ) : (
            <>
              <CommittimeRecordForm
                displayCommittime={displayCommittime}
                totalStudyTimeByPeriod={totalStudyTimeByPeriod}
                register={register}
                disabled={!canEditStudyTime}
              />
            </>
          )}
        </section>
        <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
          <BlockTitle title="Note" />
          <Label name="memo" title="今日の記録" />
          <Textarea
            id="memo"
            placeholder="今日の記録を記入してください。"
            {...register("memo")}
          />
        </section>
        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            children="今日の記録を保存"
            color="main"
            disabled={isSubmitting || isExpired}
          />
        </div>
      </form>

      <UpdateCommittimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        committime={displayCommittime}
        date={date}
      />
    </>
  );
}
