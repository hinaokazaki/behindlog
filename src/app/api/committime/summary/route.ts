import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserTimezone } from "@/lib/timezone";
import { TotalStudyTime, TotalStudyTimeResponse } from "@/schemas/committime";
import { ErrorResponse } from "@/schemas/common";

// GET: /committime/:id/summary ユーザー_合計学習時間取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);

    const committime = await prisma.commitTime.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!committime) {
      return NextResponse.json(
        { totalStudyTime: 0, committime: null },
        { status: 200 },
      );
    }

    const totalStudyTime = await prisma.dailyRecord.aggregate({
      where: {
        userId: committime.userId,
        recordedDate: {
          gte: committime.startDate,
          lte: committime.endDate,
        },
      },
      _sum: {
        totalStudyTime: true,
      },
    });

    const result = {
      committimeId: committime.id,
      totalStudyTimeByPeriod: totalStudyTime._sum.totalStudyTime ?? 0,
      startDate: committime.startDate,
      endDate: committime.endDate,
    };

    const converted = withUserTimezone(
      result,
      ["startDate", "endDate"],
      user.timezone,
    );

    const safeResult: TotalStudyTime = converted;

    return NextResponse.json<TotalStudyTimeResponse>(
      { totalStudyTime: safeResult },
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
