"use client";
import { useApi } from "@/app/_hooks/useApi";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import { useCommittimeSummaryQuery } from "../../_hooks/useCommittimeSummaryQuery";
import { useTodoQuery } from "../../_hooks/useTodoQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import Input from "@/app/_components/Input";
import { useForm } from "react-hook-form";

// type PageState = {
//   source: "record" | "fresh";
//   todoItems: TodoSnapshot;
//   memo: string;
//   totalStudyTime: number;
//   committime: {
//     targetTime: number | null;
//     startDate: string | null;
//     endDate: string | null;
//   };
// };

// type StudyTimeForm = {
//   studyHours: string;
//   studyMinutes: string;
// };

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


export default function RecordsPage({ params }: { params: { date: string } }) {
  const date = params.date;
  const committimeSummaryQuery = useCommittimeSummaryQuery();
  const committimeQuery = useCommittimeQuery();
  const todoQuery = useTodoQuery();
  const recordQuery = useFetch<{ dailyRecord: DailyRecord }>(
    `/api/records/${date}`,
  );
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [page, setPage] = useState<PageState | null>(null);
  // const [studyTime, setStudyTime] = useState<StudyTimeForm>({
  //   studyHours: "",
  //   studyMinutes: "",
  // });

  const {
  register,
  handleSubmit,
  reset,
  watch,
  setValue,
} = useForm<RecordForm>({
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

    const committime = committimeQuery.data?.committime ?? null;
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

  // todo checkbox state
  const todoItems = watch("todoItems");
  const toggleTodo = (index: number, next: boolean) => {
    setValue(`todoItems.items.${index}.isCompleted`, next);
  };

  // submit
  const onSubmit = async (data: RecordForm) => {
    const total =
      Number(data.studyHours || 0) * 60 +
      Number(data.studyMinutes || 0);

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
    <div>
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
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-base text-form-text">目標学習時間</p>
            <p className="ml-4 mt-4 text-base font-bold">
              {page?.committime.targetTime
                ? Math.floor(page.committime.targetTime / 60)
                : 0}
              <span className="ml-8 text-base text-form-text">時間</span>
            </p>
          </div>

          <p className="text-base text-sm font-semibold">
            [{page?.committime.startDate ?? "----"} -{" "}
            {page?.committime.endDate ?? "----"}]
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
          placeholder="今日の記録を記入してください。"
          {...register("memo")}
        />
      </section>
      <div className="mt-8 flex justify-center">
        <Button
          children="今日の記録を保存"
          color="red"
          onClick={handleSave}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
