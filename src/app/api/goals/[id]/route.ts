import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoalData } from "@/app/_types/type";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";

const prisma = new PrismaClient();

// GET: /goal ユーザー_目標取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await verifyAuthToken(request);
    const goal = await prisma.goal.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!goal) {
      return NextResponse.json(
        { status: "目標を取得できませんでした" },
        { status: 400 },
      );
    }

    return NextResponse.json<{ status: string; goal: GoalData }>(
      { status: "OK", goal: goal },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// PATCH: /goal ユーザー_目標更新
type UpdateGoalRequestBody = {
  title: string;
  deadline: string; //Date
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const { title, deadline }: UpdateGoalRequestBody = await request.json();
  try {
    const user = await getLoggedInUser(request);
    const goal = await prisma.goal.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        deadline,
      },
    });

    return NextResponse.json<{ status: string; goal: GoalData }>(
      { status: "OK", goal: goal },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
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
      },
    });

    return NextResponse.json<{ status: string }>(
      { status: "OK" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
