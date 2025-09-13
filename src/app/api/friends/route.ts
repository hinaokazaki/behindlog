import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/utils/auth";

// GET: /friends ユーザー_友達一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            status: "ACCEPTED",
            OR: [{ userId1: user.id }, { userId2: user.id }],
          },
          {
            status: "PENDING",
            userId1: user.id,
          },
        ],
      },
      select: {
        id: true,
        status: true,
        user1: { select: { id: true, name: true } },
        user2: { select: { id: true, name: true } },
      },
    });

    // レスポンス成型：相手ユーザーだけをfriendに入れる
    const result = friendships.map((f) => {
      const friend = f.user1.id === user.id ? f.user2 : f.user1;
      return {
        id: f.id,
        status: f.status,
        friend,
      };
    });

    return NextResponse.json(
      { status: "OK", friendship: result },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
