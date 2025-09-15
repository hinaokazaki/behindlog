import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";

// GET: /friends/requests/:id ユーザー_友達招待,申請取得（受けた側）
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const user = await getLoggedInUser(request);

    const invitation = await prisma.friendship.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        status: true,
        message: true,
        userId2: true,
        user1: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invitation || invitation.userId2 !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const result = {
      id: invitation.id,
      status: invitation.status,
      message: invitation.message,
      inviter: invitation.user1,
    };

    return NextResponse.json(
      { status: "OK", invitation: result },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
