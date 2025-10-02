import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import {
  Goal,
  GoalResponse,
  goalSchema,
  updateGoalRequest,
  updateGoalRequestSchema,
} from "@/schemas/goal";
import { ErrorResponse, StatusResponse } from "@/schemas/common";

// GET: /goal ユーザー_目標取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const goal = await prisma.goal.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { status: "目標を取得できませんでした" },
        { status: 400 },
      );
    }

    const safeGoal: Goal = goalSchema.parse(
      withUserTimezone(
        goal,
        ["deadline", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json<GoalResponse>({ goal: safeGoal }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};

// PATCH: /goal ユーザー_目標更新
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const user = await getLoggedInUser(request);
    const body: updateGoalRequest = updateGoalRequestSchema.parse(
      await request.json(),
    );
    const parsed = withUserDateParse(body, ["deadline"], user.timezone);

    const goal = await prisma.goal.update({
      where: {
        id: parseInt(id),
      },
      data: parsed,
    });

    const safeGoal: Goal = goalSchema.parse(
      withUserTimezone(
        goal,
        ["deadline", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json<GoalResponse>({ goal: safeGoal }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};

// DELETE: /goal ユーザー_目標削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const goal = await prisma.goal.delete({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    return NextResponse.json<StatusResponse>({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};
