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
  studyHours: number;
  studyMinutes: number;
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
    studyHours: 0,
    studyMinutes: 0,
  });

  useEffect(() => {
    if (recordQuery.data?.dailyRecord) {
      const dailyRecord = recordQuery.data.dailyRecord;

      // unknown型をTodoSnapshotに変換
      const snapshot = todoSnapshotSchema.parse(dailyRecord.todoSnapshot);

      const total = dailyRecord.totalStudyTime ?? 0;
      setStudyTime({
        studyHours: Math.floor(total / 60),
        studyMinutes: total % 60,
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

    setStudyTime({ studyHours: 0, studyMinutes: 0 });
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

    const total = studyTime.studyHours * 60 + studyTime.studyMinutes;
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
    } catch (error) {
      console.error("save records failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div>
          <p className="text-base">目標学習時間</p>
          <p className="text-base">
            {page?.committime.targetTime ? page.committime.targetTime / 60 : 0}
            時間
          </p>
          <span className="text-base">
            [{`${page?.committime.startDate} - ${page?.committime.endDate}`}]
          </span>
        </div>
        <hr />
        <div>
          <div>
            <p className="text-base">今日の学習時間</p>
            <div>
              <Input
                type="number"
                name="studyHours"
                value={studyTime.studyHours}
                onChange={(e) =>
                  setStudyTime((p) => ({
                    ...p,
                    studyHours: Number(e.target.value),
                  }))
                }
              />
              時間
              <Input
                type="number"
                name="studyMinutes"
                min={0}
                max={59}
                value={studyTime.studyMinutes}
                onChange={(e) =>
                  setStudyTime((p) => ({
                    ...p,
                    studyMinutes: Number(e.target.value),
                  }))
                }
              />
              分
            </div>
          </div>
          <div>
            <p className="text-base">合計学習時間</p>
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
