import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { toYmdFromDbDate } from "@/lib/date";
import {
  MonthlyRecords,
  MonthlyRecordsResponse,
} from "@/schemas/monthlyRecords";
import { ErrorResponse } from "@/schemas/common";
import z from "zod";

// GET: /api/records/${userId}/monthly?month=${month}
export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } },
) => {
  try {
    const { userId } = params;
    const viewer = await getLoggedInUser(request);

    // URLからmonth=YYYY-MMを取得
    const { searchParams } = new URL(request.url);
    const monthSchema = z.string().regex(/^\d{4}-\d{2}$/);
    const month = monthSchema.parse(searchParams.get("month"));
    if (!month) {
      return NextResponse.json({ error: "month is required" }, { status: 400 });
    }

    // 月の開始日と終了日
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(startDate.getUTCMonth() + 1);

    // // 自分の友達一覧を取得
    // const friendships = await prisma.friendship.findMany({
    //   where: {
    //     status: "ACCEPTED",
    //     OR: [{ userId1: user.id }, { userId2: user.id }],
    //   },
    // });

    // // 自分以外の相手のIDを取り出す
    // const friendIds = friendships
    //   .map((f) => (f.userId1 === user.id ? f.userId2 : f.userId1))
    //   .filter((id): id is string => id !== null)

    // 閲覧権限チェック
    const isSelf = viewer.id === userId;
    if (!isSelf) {
      // 友達関係チェック
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { userId1: userId, userId2: viewer.id },
            { userId1: viewer.id, userId2: userId },
          ],
        },
      });

      if (!friendship) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // 対象ユーザーの１か月分の記録を取得
    const records = await prisma.dailyRecord.findMany({
      where: {
        userId,
        recordedDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        recordedDate: true,
      },
      orderBy: {
        recordedDate: "asc",
      },
    });

    // // 日付ごとにユーザーをグループ化
    // const grouped = records.reduce(
    //   (acc, record) => {
    //     const date = toYmdFromDbDate(record.recordedDate);
    //     if (!acc[date]) acc[date] = [];
    //     acc[date].push({
    //       id: record.user.id,
    //       name: record.user.name,
    //     });
    //     return acc;
    //   },
    //   {} as Record<string, { id: string; name: string | null }[]>,
    // );

    const response: MonthlyRecords = {
      month,
      viewerUserId: user.id,
      viewerTimezone: user.timezone,
      record: Object.entries(grouped).map(([date, users]) => ({
        date,
        users,
      })),
    };

    return NextResponse.json<MonthlyRecordsResponse>(
      { monthlyRecords: response },
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
