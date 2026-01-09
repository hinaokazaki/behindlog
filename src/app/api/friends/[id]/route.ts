import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserTimezone } from "@/lib/timezone";
import { Friend, FriendResponse } from "@/schemas/friend";
import { ErrorResponse, StatusResponse } from "@/schemas/common";

// PATCH: /api/friends/:id ユーザー_友達申請承認
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);

    const pending = await prisma.friendship.findFirst({
      where: {
        id: Number(id),
        userId2: user.id,
        status: "PENDING",
      },
    });
    if (!pending) {
      return NextResponse.json({ error: "request not found" }, { status: 404 });
    }

    const friendship = await prisma.friendship.update({
      where: { id: pending.id },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
    });

    const converted = withUserTimezone(
      friendship,
      ["createdAt", "updatedAt", "respondedAt"],
      user.timezone,
    );

    const safeFriendship: Friend = converted;

    return NextResponse.json<FriendResponse>(
      { friendship: safeFriendship },
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

// DELETE: /api/friends/:id ユーザー_友達解除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);

    const checkFriendshipForDelete = await prisma.friendship.findUnique({
      where: { id: Number(id) },
    });

    if (
      !checkFriendshipForDelete ||
      (checkFriendshipForDelete.userId1 !== user.id &&
        checkFriendshipForDelete.userId2 !== user.id)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const friendship = await prisma.friendship.delete({
      where: {
        id: Number(id),
        OR: [{ userId2: user.id }, { userId1: user.id }],
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
