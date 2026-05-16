import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserTimezone, withUserTimezoneMany } from "@/lib/timezone";
import { Todos } from "@/schemas/todo";
import { Goals } from "@/schemas/goal";
import { ErrorResponse } from "@/schemas/common";
import { TotalStudyTime } from "@/schemas/committime";
import {
  FriendDashboard,
  FriendDashboardResponse,
} from "@/schemas/friendDashboard";

// GET: /users/[id]/dashboard 友達のダッシュボード用データ取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id: ownerId } = params;

  try {
    const viewer = await getLoggedInUser(request);

    // 友達関係の確認
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId1: viewer.id, userId2: ownerId },
          { userId1: ownerId, userId2: viewer.id },
        ],
        status: "ACCEPTED",
      },
    });

    if (!friendship) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 記録の持ち主（友達）の timezone を取得（検索に必要）
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { timezone: true },
    });

    if (!owner) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 友達のTodoリスト取得
    const friendTodo = await prisma.todo.findMany({
      where: {
        userId: ownerId,
      },
    });

    const converted = withUserTimezoneMany(
      friendTodo,
      ["createdAt", "updatedAt", "dueDate"],
      owner.timezone,
    );

    const safeTodos: Todos = converted;

    // 友達のGoalリスト取得
    const friendGoal = await prisma.goal.findMany({
      where: {
        userId: ownerId,
      },
    });

    const goalConverted = withUserTimezoneMany(
      friendGoal,
      ["deadline", "createdAt", "updatedAt"],
      owner.timezone,
    );

    const safegoals: Goals = goalConverted;

    // 友達のコミットタイム情報の取得
    const committime = await prisma.commitTime.findUnique({
      where: {
        userId: ownerId,
      },
    });

    if (!committime) {
      return NextResponse.json(
        { totalStudyTime: 0, committime: null },
        { status: 200 },
      );
    }

    const totalStudyTime = await prisma.dailyRecord.aggregate({
      where: {
        userId: committime.userId,
        recordedDate: {
          gte: committime.startDate,
          lte: committime.endDate,
        },
      },
      _sum: {
        totalStudyTime: true,
      },
    });

    const result = {
      committimeId: committime.id,
      totalStudyTimeByPeriod: totalStudyTime._sum.totalStudyTime ?? 0,
      startDate: committime.startDate,
      endDate: committime.endDate,
      targetTime: committime.targetTime,
    };

    const committimeConverted = withUserTimezone(
      result,
      ["startDate", "endDate"],
      owner.timezone,
    );

    const safeCommittime: TotalStudyTime = committimeConverted;

    const friendDashboard: FriendDashboard = {
      todos: safeTodos,
      goals: safegoals,
      committime: safeCommittime,
    };

    return NextResponse.json<FriendDashboardResponse>(
      { friendDashboard: friendDashboard },
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
