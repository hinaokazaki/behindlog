import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { z } from "zod/v4";
import {
  createDailyRecordSchema,
  DailyRecordResponse,
  dailyRecordResponseSchema,
  TodoSnapshot,
  todoSnapshotSchema,
} from "@/schemas/dailyRecord";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";

// PUT: /records:date ユーザー_記録新規作成,取得,更新

const toISODate = (d: Date) => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

export const PUT = async (
  request: NextRequest,
  { params }: { params: { date: string } },
) => {
  try {
    const user = await getLoggedInUser(request);
    const body = createDailyRecordSchema.parse(await request.json());
    const { recordedDate } = withUserDateParse(
      { recordedDate: params.date },
      ["recordedDate"],
      user.timezone,
    );

    // todoのsnapshot
    // requestにsnapshotが含まれていなかった場合、サーバ側でsnapshotを作成
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
          dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
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
          ...(committime
            ? { commitTime: { connect: { id: committime.id } } }
            : {}),
          commitTargetTime: committime?.targetTime ?? null,
          commitStartDate: committime?.startDate ?? null,
          commitEndDate: committime?.endDate ?? null,
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
            ? { commitTime: { connect: { id: committime.id } } }
            : {}),
          commitTargetTime: committime?.targetTime ?? null,
          commitStartDate: committime?.startDate ?? null,
          commitEndDate: committime?.endDate ?? null,
        },
      });

      return dailyRecord;
    });

    const safeDailyRecord: DailyRecordResponse =
      dailyRecordResponseSchema.parse(
        withUserTimezone(
          dailyRecordPostResult,
          [
            "createdAt",
            "updatedAt",
            "recordedDate",
            "commitStartDate",
            "commitEndDate",
          ],
          user.timezone,
        ),
      );

    return NextResponse.json({ dailyRecord: safeDailyRecord }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: "VALIDATION_ERROR", issues: error.issues },
        { status: 422 },
      );
    }
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ status: "ERROR", message }, { status: 400 });
  }
};
