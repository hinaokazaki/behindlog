import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import {
  DailyRecordResponse,
  dailyRecordResponseSchema,
} from "@/schemas/dailyRecord";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";

// GET: /records ユーザー_記録取得（特定日）
export const GET = async (request: NextRequest) => {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json(
      { status: "日付を指定してください" },
      { status: 400 },
    );
  }

  try {
    const user = await getLoggedInUser(request);
    const { recordedDate } = withUserDateParse(
      { recordedDate: date },
      ["recordedDate"],
      user.timezone,
    );
    const dailyRecord = await prisma.dailyRecord.findFirst({
      where: {
        userId: user.id,
        recordedDate,
      },
    });

    if (!dailyRecord) {
      return NextResponse.json(
        { status: "記録を取得できませんでした" },
        { status: 400 },
      );
    }

    const safeDailyRecord: DailyRecordResponse =
      dailyRecordResponseSchema.parse(
        withUserTimezone(
          dailyRecord,
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
