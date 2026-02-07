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

type PageState = {
  source: "record" | "fresh";
  todoItems: TodoSnapshot;
  memo: string;
  totalStudyTime: number;
  committime: {
    targetTime: number | null;
    startDate: string | null;
    endDate: string | null;
  };
};

type StudyTimeForm = {
  studyHours: string;
  studyMinutes: string;
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
  const [page, setPage] = useState<PageState | null>(null);
  const [studyTime, setStudyTime] = useState<StudyTimeForm>({
    studyHours: "",
    studyMinutes: "",
  });

  useEffect(() => {
    if (recordQuery.data?.dailyRecord) {
      const dailyRecord = recordQuery.data.dailyRecord;

      // unknown型をTodoSnapshotに変換
      const snapshot = todoSnapshotSchema.parse(dailyRecord.todoSnapshot);

      const total = dailyRecord.totalStudyTime ?? 0;
      setStudyTime({
        studyHours: String(Math.floor(total / 60)),
        studyMinutes: String(total % 60),
      });

      setPage({
        source: "record",
        todoItems: snapshot,
        memo: dailyRecord.memo ?? "",
        totalStudyTime: total,
        committime: {
          targetTime: dailyRecord.commitTargetTime ?? null,
          startDate: dailyRecord.commitStartDate
            ? String(dailyRecord.commitStartDate)
            : null,
          endDate: dailyRecord.commitEndDate
            ? String(dailyRecord.commitEndDate)
            : null,
        },
      });
      return;
    }

    setStudyTime({ studyHours: "", studyMinutes: "" });
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

    setPage({
      source: "fresh",
      todoItems: snapshot,
      memo: "",
      totalStudyTime: 0,
      committime: {
        targetTime: committime?.targetTime ?? null,
        startDate: committime?.startDate ?? null,
        endDate: committime?.endDate ?? null,
      },
    });
  }, [date, recordQuery.data, todoQuery.data, committimeQuery.data]);

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
  const toggleTodo = (todoId: number, next: boolean) => {
    setPage((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        todoItems: {
          ...prev.todoItems,
          items: prev.todoItems.items.map((t) =>
            t.id === todoId ? { ...t, isCompleted: next } : t,
          ),
        },
      };
    });
  };

  // submit
  const handleSave = async () => {
    if (!page) return;

    const total =
      Number(studyTime.studyHours || 0) * 60 +
      Number(studyTime.studyMinutes || 0);
    const payload: CreateDailyRecord = {
      memo: page.memo,
      totalStudyTime: total,
      todoSnapshot: page.todoItems,
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
          {page?.todoItems.items.map((t) => (
            <TodoCardBase
              key={t.id}
              todo={t.title}
              dueDate={t.dueDate || ""}
              completed={t.isCompleted}
              onToggle={(next) => toggleTodo(t.id, next)}
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
                  name="studyHours"
                  placeholder="0"
                  inputMode="numeric"
                  value={studyTime.studyHours}
                  className="w-20 rounded-md border-2 p-2 text-center"
                  onChange={(e) =>
                    setStudyTime((p) => ({
                      ...p,
                      studyHours: e.target.value,
                    }))
                  }
                />
                <span className="text-base text-form-text font-medium">
                  時間
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="studyMinutes"
                  placeholder="0"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={studyTime.studyMinutes}
                  className="w-20 rounded-md border-2 p-2 text-center"
                  onChange={(e) =>
                    setStudyTime((p) => ({
                      ...p,
                      studyMinutes: e.target.value,
                    }))
                  }
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
          value={page?.memo ?? ""}
          onChange={(e) =>
            setPage((prev) => (prev ? { ...prev, memo: e.target.value } : prev))
          }
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
