import { GoalData } from "@/app/_types/type";
import { getLoggedInUser } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  withUserDateParse,
  withUserTimezone,
  withUserTimezoneMany,
} from "@/lib/timezone";
import {
  CreateGoalRequest,
  createGoalRequestSchema,
  GoalsResponse,
  goalsResponseSchema,
} from "@/schemas/goal";

// GET: /goals ユーザー_目標一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    });

    const safegoals: GoalsResponse = goalsResponseSchema.parse(
      withUserTimezoneMany(
        goals,
        ["deadline", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json({ goals: safegoals }, { status: 200 });
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

    const safegoal: GoalsResponse = goalsResponseSchema.parse(
      withUserTimezone(
        goal,
        ["deadline", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json({ goal: safegoal }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
