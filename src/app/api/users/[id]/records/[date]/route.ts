import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import {
  UserRecord,
  UserRecordResponse,
  userRecordSchema,
} from "@/schemas/userRecord";
import { withUserTimezone } from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

// GET: /users/[id]/records/[date] ユーザー_友達の記録取得（特定日）

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; date: string } },
) => {
  const { id, date } = params;
  const user = await getLoggedInUser(request);

  try {
    // 友達関係の確認
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId1: user.id, userId2: id },
          { userId1: id, userId2: user.id },
        ],
        status: "ACCEPTED",
      },
    });

    if (!friendship) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const record = await prisma.dailyRecord.findFirst({
      where: {
        userId: id,
        recordedDate: date,
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 400 },
      );
    }

    const converted = withUserTimezone(
      record,
      [
        "createdAt",
        "updatedAt",
        "recordedDate",
        "commitStartDate",
        "commitEndDate",
      ],
      user.timezone,
    );

    const safeDailyRecord: UserRecord = converted;

    return NextResponse.json<UserRecordResponse>(
      { dailyRecord: safeDailyRecord },
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
