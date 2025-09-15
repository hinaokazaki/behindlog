import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { CommitTimeData } from "@/app/_types/type";
import { withUserDateParse } from "@/lib/timezone";

// POST: /committime ユーザー_目標時間新規作成
export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { targetTime } = body;
    const data = withUserDateParse(
      body,
      ["startDate", "endDate"],
      user.timezone,
    );

    const committime = await prisma.commitTime.upsert({
      where: {
        userId: user.id,
      },
      update: {
        targetTime: Number(targetTime),
        ...data,
      },
      create: {
        targetTime: Number(targetTime),
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json<{ status: string; committime: CommitTimeData }>(
      { status: "OK", committime: committime },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
