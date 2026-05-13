import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { toYmdFromDbDate } from "@/lib/date";
import { ErrorResponse } from "@/schemas/common";
import z from "zod";
import {
  MonthlyRecordDates,
  MonthlyRecordDatesResponse,
} from "@/schemas/monthlyRecordDates";

// GET: /api/records/users/${userId}/monthly?month=${month}
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
    const monthParam = searchParams.get("month");
    if (!monthParam) {
      return NextResponse.json<ErrorResponse>(
        { error: "month is required" },
        { status: 400 },
      );
    }
    const month = monthSchema.parse(monthParam);

    // 月の開始日と終了日
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(startDate.getUTCMonth() + 1);

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

    const recordedDates = records.map((record) =>
      toYmdFromDbDate(record.recordedDate),
    );

    const response: MonthlyRecordDates = {
      month,
      userId,
      recordedDates,
    };

    return NextResponse.json<MonthlyRecordDatesResponse>(
      { monthlyRecordDates: response },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch monthly record dates" },
      { status: 500 },
    );
  }
};
