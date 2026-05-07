import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserTimezone, withUserTimezoneMany } from "@/lib/timezone";
import { Todos } from "@/schemas/todo";
import { Goals } from "@/schemas/goal";
import { ErrorResponse } from "@/schemas/common";
import { Committime } from "@/schemas/committime";

type FriendDashboardResponse = {
  friendDashboard: {
    todos: Todos;
    goals: Goals;
  };
};

// GET: /users/[userId]/dashboard 友達のダッシュボード用データ取得
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

    if (!friendTodo) {
      return NextResponse.json(
        { message: "friendTodo not found" },
        { status: 404 },
      );
    }

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

    if (!friendGoal) {
      return NextResponse.json(
        { message: "friendGoal not found" },
        { status: 404 },
      );
    }

    const goalConverted = withUserTimezoneMany(
      friendGoal,
      ["deadline", "createdAt", "updatedAt"],
      owner.timezone,
    );

    const safegoals: Goals = goalConverted;

    // 友達のコミットタイムとミニカレンダー情報の取得、
    const committime = await prisma.commitTime.findUnique({
      where: {
        userId: ownerId,
      },
    });

    if (!committime) {
      return NextResponse.json({ committime: null }, { status: 200 });
    }

    const committimeConverted = withUserTimezone(
      committime,
      ["createdAt", "updatedAt", "startDate", "endDate"],
      owner.timezone,
    );

    const safeCommittime: Committime = committimeConverted;

    const friendDashboard = {
      todos: safeTodos,
      goals: safegoals,
      Committime: safeCommittime,
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
