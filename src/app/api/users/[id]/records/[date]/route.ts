import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { UserRecord } from "@/schemas/userRecord";
import { withUserTimezone } from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

// GET: /users/[id]/records/[date] ユーザー_友達の記録取得（特定日）

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; date: string } },
) => {
  // owner=記録保有者, viewer=閲覧者(ログインユーザー)
  const { id: ownerId, date } = params;

  try {
    const viewer = await getLoggedInUser(request);

    // 友達関係の確認
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId1: viewer.id, userId2: ownerId },
          { userId1: ownerId, userId2: viewer.id },
        ],
        status: "ACCEPTED",
      },
    });

    if (!friendship) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 記録の持ち主（友達）の timezoneと名前を取得（検索に必要）
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { timezone: true, name: true },
    });

    if (!owner) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // "YYYY-MM-DD" を UTC 00:00:00.000Z に固定して Date を作る
    const recordedDate = new Date(`${date}T00:00:00.000Z`);

    const record = await prisma.dailyRecord.findUnique({
      where: {
        userId_recordedDate: {
          userId: ownerId,
          recordedDate,
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 },
      );
    }

    const totalStudyTimeByPeriod =
      record.commitStartDate && record.commitEndDate
        ? await prisma.dailyRecord.aggregate({
            where: {
              userId: ownerId,
              recordedDate: {
                gte: record.commitStartDate,
                lte: recordedDate,
              },
            },
            _sum: {
              totalStudyTime: true,
            },
          })
        : null;

    const converted = withUserTimezone(
      record,
      ["createdAt", "updatedAt", "commitStartDate", "commitEndDate"],
      owner.timezone,
    );

    const safeDailyRecord: UserRecord = {
      ...converted,
      recordedDate: record.recordedDate.toISOString(),
    };

    return NextResponse.json(
      {
        dailyRecord: safeDailyRecord,
        userName: owner.name,
        totalStudyTime: {
          totalStudyTimeByPeriod:
            totalStudyTimeByPeriod?._sum.totalStudyTime ?? 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};
