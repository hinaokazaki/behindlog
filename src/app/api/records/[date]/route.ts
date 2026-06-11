import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { z } from "zod/v4";
import {
  DailyRecord,
  createDailyRecordSchema,
  DailyRecordResponse,
  TodoSnapshot,
  todoSnapshotSchema,
} from "@/schemas/dailyRecord";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import { ErrorResponse, ValidationErrorResponse } from "@/schemas/common";
import { toYmdWithTimezone } from "@/lib/date";

// GET: /records ユーザー_記録取得（特定日）
export const GET = async (
  request: NextRequest,
  { params }: { params: { date: string } },
) => {
  const date = params.date;
  if (!date) {
    return NextResponse.json(
      { status: "日付を指定してください" },
      { status: 400 },
    );
  }

  try {
    const user = await getLoggedInUser(request);
    const [year, month, day] = params.date.split("-").map(Number);
    const recordedDate = new Date(Date.UTC(year, month - 1, day));
    const dailyRecord = await prisma.dailyRecord.findUnique({
      where: {
        userId_recordedDate: {
          userId: user.id,
          recordedDate,
        },
      },
    });

    // frontで初回表示ロジックへ
    if (!dailyRecord) {
      return NextResponse.json(
        { status: "記録を取得できませんでした" },
        { status: 404 },
      );
    }

    const converted = withUserTimezone(
      dailyRecord,
      ["createdAt", "updatedAt", "commitStartDate", "commitEndDate"],
      user.timezone,
    );

    const safeDailyRecord: DailyRecord = {
      ...converted,
      recordedDate: dailyRecord.recordedDate.toISOString(),
    };

    return NextResponse.json<DailyRecordResponse>(
      { dailyRecord: safeDailyRecord },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};

// PUT: /records:date ユーザー_記録新規作成,取得,更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { date: string } },
) => {
  try {
    const user = await getLoggedInUser(request);
    const body = createDailyRecordSchema.parse(await request.json());
    const [year, month, day] = params.date.split("-").map(Number);
    const recordedDate = new Date(Date.UTC(year, month - 1, day));

    // todoのsnapshot,requestにsnapshotが含まれていなかった場合、サーバ側でsnapshotを作成
    let snapshot = body.todoSnapshot ?? null;
    if (snapshot === null || snapshot === undefined) {
      const todos = await prisma.todo.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          isCompleted: true,
          dueDate: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      snapshot = {
        date: params.date,
        items: todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          isCompleted: todo.isCompleted,
          dueDate: todo.dueDate
            ? todo.dueDate.toISOString().slice(0, 10)
            : null,
        })),
      };
    }

    // サーバ側での型崩れ検知のための実行時検証
    const safeSnapshot: TodoSnapshot = todoSnapshotSchema.parse(snapshot);

    // committimeのsnapshot
    const committime = await prisma.commitTime.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        targetTime: true,
        startDate: true,
        endDate: true,
      },
    });

    const isRecordedDateInCurrentCommittime =
      committime &&
      params.date >= toYmdWithTimezone(committime.startDate, user.timezone) &&
      params.date <= toYmdWithTimezone(committime.endDate, user.timezone);

    const commitSnapshotData =
      committime && isRecordedDateInCurrentCommittime
        ? {
            commitTargetTime: committime.targetTime,
            commitStartDate: committime.startDate,
            commitEndDate: committime.endDate,
          }
        : {};

    const dailyRecordPostResult = await prisma.$transaction(async (tx) => {
      //フラグがtrueの時だけtodo本体を更新
      if (body.applyTodoUpdates) {
        const doneIds = safeSnapshot.items
          .filter((item) => item.isCompleted)
          .map((item) => item.id);
        const undoneIds = safeSnapshot.items
          .filter((item) => !item.isCompleted)
          .map((item) => item.id);

        if (doneIds.length) {
          await tx.todo.updateMany({
            where: {
              id: {
                in: doneIds,
              },
              userId: user.id,
            },
            data: {
              isCompleted: true,
            },
          });
        }
        if (undoneIds.length) {
          await tx.todo.updateMany({
            where: {
              id: {
                in: undoneIds,
              },
              userId: user.id,
            },
            data: {
              isCompleted: false,
            },
          });
        }
      }

      // dailyRecord を作成
      const dailyRecord = await tx.dailyRecord.upsert({
        where: {
          userId_recordedDate: {
            userId: user.id,
            recordedDate,
          },
        },
        update: {
          totalStudyTime: body.totalStudyTime,
          memo: body.memo,
          todoSnapshot: safeSnapshot,
          ...commitSnapshotData,
        },
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          recordedDate,
          totalStudyTime: body.totalStudyTime,
          memo: body.memo,
          todoSnapshot: safeSnapshot,
          ...(committime
            ? {
                commitTime: {
                  connect: {
                    id: committime.id,
                  },
                },
              }
            : {}),

          ...commitSnapshotData,
        },
      });

      return dailyRecord;
    });

    const converted = withUserTimezone(
      dailyRecordPostResult,
      ["createdAt", "updatedAt", "commitStartDate", "commitEndDate"],
      user.timezone,
    );

    const safeDailyRecord: DailyRecord = {
      ...converted,
      recordedDate: dailyRecordPostResult.recordedDate.toISOString(),
    };

    return NextResponse.json<DailyRecordResponse>(
      { dailyRecord: safeDailyRecord },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ValidationErrorResponse>(
        {
          status: "VALIDATION_ERROR",
          issues: error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 422 },
      );
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json<{ status: string; message: string }>(
      { status: "ERROR", message },
      { status: 400 },
    );
  }
};
