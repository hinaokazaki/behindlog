import { GoalData } from "@/app/_types/type";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: /goals ユーザー_目標一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!goals) {
      return NextResponse.json(
        { status: "目標を取得できませんでした" },
        { status: 400 },
      );
    }

    return NextResponse.json<{ status: string; goal: GoalData[] }>(
      { status: "OK", goal: goals },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// POST: /goals ユーザー_目標新規作成

type CreateGoalRequestBody = {
  title: string;
  deadline: string; //Date
};

export const POST = async (request: NextRequest) => {
  try {
    // tokenの確認
    const user = await getLoggedInUser(request);

    const body = await request.json();
    const { title, deadline }: CreateGoalRequestBody = body;
    const newGoal = await prisma.goal.create({
      data: {
        title,
        deadline: new Date(deadline), //Date型に変換
        userId: user.id,
      },
    });

    return NextResponse.json<{ status: string; goal: GoalData }>({
      status: "OK",
      goal: newGoal,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
