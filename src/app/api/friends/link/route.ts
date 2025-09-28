import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLoggedInUser } from "@/utils/auth";
import {
  FriendResponse,
  friendResponseSchema,
  ReceiveFriendRequest,
  receiveFriendRequestSchema,
} from "@/schemas/friend";
import { withUserTimezone } from "@/lib/timezone";

// PATCH: /api/friends/invite ユーザー_友達招待による新規登録後のユーザー確定
export const PATCH = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body: ReceiveFriendRequest = receiveFriendRequestSchema.parse(
      await request.json(),
    );

    if (!body.inviteToken) {
      return NextResponse.json(
        { error: "inviteToken required" },
        { status: 400 },
      );
    }

    const friendShip = await prisma.friendship.update({
      where: {
        token: body.inviteToken,
      },
      data: {
        userId2: user.id,
      },
    });

    const safeFriendship: FriendResponse = friendResponseSchema.parse(
      withUserTimezone(
        friendShip,
        ["createdAt", "updatedAt", "respondedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json({ friendShip: safeFriendship }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to link friendship" },
      { status: 500 },
    );
  }
};
