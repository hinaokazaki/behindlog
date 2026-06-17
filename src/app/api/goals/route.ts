import { getLoggedInUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withUserDateParse,
  withUserTimezone,
  withUserTimezoneMany,
} from "@/lib/timezone";
import {
  Goal,
  CreateGoalRequest,
  createGoalRequestSchema,
  Goals,
  GoalsResponse,
  GoalResponse,
} from "@/schemas/goal";
import { ErrorResponse } from "@/schemas/common";

// GET: /goals ユーザー_目標一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    });

    const converted = withUserTimezoneMany(
      goals,
      ["deadline", "createdAt", "updatedAt"],
      user.timezone,
    );

    const safegoals: Goals = converted;

    return NextResponse.json<GoalsResponse>(
      { goals: safegoals },
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

// POST: /goals ユーザー_目標新規作成
export const POST = async (request: NextRequest) => {
  try {
    // tokenの確認
    const user = await getLoggedInUser(request);
    const body: CreateGoalRequest = createGoalRequestSchema.parse(
      await request.json(),
    );
    const parsed = withUserDateParse(body, ["deadline"], user.timezone);

    const goal = await prisma.goal.create({
      data: {
        ...parsed,
        userId: user.id,
      },
    });

    const converted = withUserTimezone(
      goal,
      ["deadline", "createdAt", "updatedAt"],
      user.timezone,
    );

    const safeGoal: Goal = converted;

    return NextResponse.json<GoalResponse>({ goal: safeGoal }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};
