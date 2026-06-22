import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import { TotalStudyTime, TotalStudyTimeResponse } from "@/schemas/committime";
import { ErrorResponse } from "@/schemas/common";
import { toUtcDateOnly } from "@/lib/date";

// GET: /committime/summary?date=xxxx-xx-xx ユーザー_合計学習時間取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

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

    const recordedDate = date
      ? withUserDateParse(
          { recordedDate: date },
          ["recordedDate"],
          user.timezone,
        ).recordedDate
      : null;

    const dailyRecord = recordedDate
      ? await prisma.dailyRecord.findUnique({
          where: {
            userId_recordedDate: {
              userId: user.id,
              recordedDate,
            },
          },
        })
      : null;

    console.log({
      date,
      recordedDate,
      dailyRecordId: dailyRecord?.id,
      commitStartDate: dailyRecord?.commitStartDate,
      commitEndDate: dailyRecord?.commitEndDate,
      commitTargetTime: dailyRecord?.commitTargetTime,
      currentStartDate: committime.startDate,
      currentEndDate: committime.endDate,
    });

    const startDate = dailyRecord?.commitStartDate ?? committime.startDate;
    const endDate = dailyRecord?.commitEndDate ?? committime.endDate;
    const targetTime = dailyRecord?.commitTargetTime ?? committime.targetTime;
    const committimeId = dailyRecord?.commitTimeId ?? committime.id;

    const startDateForQuery = toUtcDateOnly(startDate, user.timezone);
    const endDateForQuery = toUtcDateOnly(endDate, user.timezone);

    const totalStudyTime = await prisma.dailyRecord.aggregate({
      where: {
        userId: user.id,
        // commitTimeId: committimeId,
        recordedDate: {
          gte: startDateForQuery,
          lte: endDateForQuery,
        },
      },
      _sum: {
        totalStudyTime: true,
      },
    });

    const result = {
      committimeId,
      totalStudyTimeByPeriod: totalStudyTime._sum.totalStudyTime ?? 0,
      startDate,
      endDate,
      targetTime,
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
