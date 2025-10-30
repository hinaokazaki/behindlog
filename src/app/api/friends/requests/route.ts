import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import {
  FriendRequestrecords,
  FriendRequestRecordsResponse,
  friendRequestRecordsSchema,
} from "@/schemas/friendRequest";
import { ErrorResponse } from "@/schemas/common";

// GET: /friends/requests ユーザー_友達一覧取得（受けた側）
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);

    const friendships = await prisma.friendship.findMany({
      where: {
        userId2: user.id,
        status: "PENDING",
      },
      select: {
        id: true,
        user1: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 整形して相手ユーザー情報だけ返す
    const result = friendships.map((f) => ({
      friendshipId: f.id,
      inviter: f.user1,
    }));

    const safeResult: FriendRequestrecords =
      friendRequestRecordsSchema.parse(result);

    return NextResponse.json<FriendRequestRecordsResponse>(
      { invitations: safeResult },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};
