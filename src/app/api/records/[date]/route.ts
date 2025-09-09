import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { z } from "zod/v4";

const prisma = new PrismaClient();

// PUT: /records:date ユーザー_記録新規作成,取得,更新

const TodoItemSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  isCompleted: z.boolean(),
  dueDate: z.iso.datetime().nullable().optional(),
});

export const TodoSnapshotSchema = z.object({
  date: z.iso.date(),
  items: z.array(TodoItemSchema),
});

const CreateDailyRecordSchema = z.object({
  totalStudyTime: z.number().int().nonnegative(),
  memo: z.string(),
  todoSnapshot: TodoSnapshotSchema.optional().nullable(),
  applyTodoUpdates: z.boolean().optional(), //  フロント側でtodoに変更があったかを判断するためのフラグ
});

const toISODate = (d: Date) => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

export const PUT = async (
  request: NextRequest,
  { params }: { params: { date: string } },
) => {
  try {
    const user = await getLoggedInUser(request);
    const body = CreateDailyRecordSchema.parse(await request.json());
    const recordedDate = new Date(`${params.date}T00:00:00`);

    // todoのsnapshot
    // requestにsnapshotが含まれていなかった場合、サーバ側でsnapshotを作成
    let snapshot = body.todoSnapshot ?? null;
    if (snapshot === null || snapshot === undefined) {
      const today = new Date();
      const dateOnly = toISODate(today);

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
        date: dateOnly,
        items: todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          isCompleted: todo.isCompleted,
          dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
        })),
      };
    }

    // サーバ側での型崩れ検知のための実行時検証
    const safeSnapshot = TodoSnapshotSchema.parse(snapshot);

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

    return NextResponse.json(
      { status: "OK", dailyRecord: dailyRecordPostResult },
      { status: 200 },
    );
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
