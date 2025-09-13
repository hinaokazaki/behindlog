import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";

// PATCH: /api/friends/:id ユーザー_友達申請承認
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { status } = body;

    // status確認
    if (status !== "ACCEPTED" && status !== "DECLINED") {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }

    // userId2確認
    const checkFriendshipForUserId2 = await prisma.friendship.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (
      !checkFriendshipForUserId2 ||
      checkFriendshipForUserId2.userId2 !== user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const friendship = await prisma.friendship.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({ status: "OK", friendship }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
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
      },
    });

    return NextResponse.json({ status: "OK", friendship }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
