import { GoalData } from "@/app/_types/type";
import { getLoggedInUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withUserDateParse,
  withUserTimezone,
  withUserTimezoneMany,
} from "@/lib/timezone";

// GET: /goals ユーザー_目標一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    });

    const formatted = withUserTimezoneMany(goals, ["deadline"], user.timezone);

    return NextResponse.json(
      { status: "OK", goals: formatted },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// POST: /goals ユーザー_目標新規作成
export const POST = async (request: NextRequest) => {
  try {
    // tokenの確認
    const user = await getLoggedInUser(request);

    const body = await request.json();
    const { title } = body;
    const data = withUserDateParse(body, ["deadline"], user.timezone);

    const newGoal = await prisma.goal.create({
      data: {
        title,
        userId: user.id,
        ...data,
      },
    });

    const formatted = withUserTimezone(
      newGoal,
      ["deadline"],
      user.timezone,
    ) as GoalData;

    return NextResponse.json<{ status: string; goal: GoalData }>({
      status: "OK",
      goal: formatted,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
