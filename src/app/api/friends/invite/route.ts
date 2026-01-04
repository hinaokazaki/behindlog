import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import {
  CreateFriendRequest,
  createFriendRequestSchema,
  Friend,
  FriendInvite,
  FriendInviteResponse,
  friendInviteSchema,
  FriendResponse,
  friendSchema,
} from "@/schemas/friend";
import { withUserTimezone } from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInviteEmail(to: string, token: string) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?inviteToken=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Behindlogに招待されました",
    html: `
      <p>Behindlogに招待されました🎉</p>
      <p>以下のリンクをクリックして招待を承認してください:</p>
      <a href="${inviteUrl}">Join Now</a>
    `,
  });
}

// POST: /api/friends/invite ユーザー_友達招待作成

export const POST = async (request: NextRequest) => {
  const user = await getLoggedInUser(request);
  const body: CreateFriendRequest = createFriendRequestSchema.parse(
    await request.json(),
  );

  try {
    if (body.inviteeEmail === user.email) {
      return NextResponse.json(
        {
          error: {
            message: "自分自身にリクエストは送れません",
            code: "SELF_INVITE",
          },
        },
        { status: 400 },
      );
    }

    const invitedUser = await prisma.user.findUnique({
      where: {
        email: body.inviteeEmail,
      },
    });

    if (invitedUser) {
      // 既存の関係チェック（向き関係なし）
      const existing = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId1: user.id, userId2: invitedUser.id },
            { userId1: invitedUser.id, userId2: user.id },
          ],
        },
      });

      if (existing) {
        if (existing.status === "ACCEPTED") {
          return NextResponse.json(
            { error: "すでに友達です" },
            { status: 409 },
          );
        }

        if (existing.status === "PENDING") {
          return NextResponse.json(
            { error: "すでに友達リクエストが存在します" },
            { status: 409 },
          );
        }
      }

      const friendship = await prisma.friendship.create({
        data: {
          userId1: user.id,
          userId2: invitedUser.id,
          inviterUserId: user.id,
          inviteeEmail: body.inviteeEmail,
          message: body.message,
          status: "PENDING",
        },
      });

      const safeFriendship: Friend = friendSchema.parse(
        withUserTimezone(
          friendship,
          ["createdAt", "updatedAt", "respondedAt"],
          user.timezone,
        ),
      );

      return NextResponse.json<FriendResponse>(
        { friendship: safeFriendship },
        { status: 200 },
      );
    } else {
      const token = uuidv4();
      // すでに同じ相手に招待を送っていないか確認
      const existingEmailInvite = await prisma.friendship.findFirst({
        where: {
          inviterUserId: user.id,
          inviteeEmail: body.inviteeEmail,
          status: "PENDING",
        },
      });

      if (existingEmailInvite) {
        return NextResponse.json(
          { error: "すでに招待中です" },
          { status: 409 },
        );
      }

      const friendship = await prisma.friendship.create({
        data: {
          userId1: user.id,
          inviterUserId: user.id,
          inviteeEmail: body.inviteeEmail,
          message: body.message,
          token,
          status: "PENDING",
        },
      });

      // tokenを含んだ招待メールを送信する操作
      try {
        await sendInviteEmail(body.inviteeEmail, token);
      } catch (err) {
        console.error("Failed to send email", err);
        return NextResponse.json(
          { status: "Failed to send email" },
          { status: 500 },
        );
      }

      const safeFriendship: Friend = friendSchema.parse(
        withUserTimezone(
          friendship,
          ["createdAt", "updatedAt", "respondedAt"],
          user.timezone,
        ),
      );

      return NextResponse.json<FriendResponse>(
        { friendship: safeFriendship },
        { status: 200 },
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};

// GET /api/friends/invite?token=xxxx ユーザー_招待お知らせ情報取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const token = request.nextUrl.searchParams.get("inviteToken");
    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const friendShip = await prisma.friendship.findFirst({
      where: {
        token,
      },
      include: {
        inviterUser: true,
      },
    });

    if (!friendShip) {
      return NextResponse.json({ error: "invalid token" }, { status: 404 });
    }

    const friendInvite = {
      inviterName: friendShip.inviterUser.name,
      message: friendShip.message,
      status: friendShip.status,
      alreadyRegistered: friendShip.userId2 !== null,
    };

    const safeFriendInvite: FriendInvite =
      friendInviteSchema.parse(friendInvite);

    return NextResponse.json<FriendInviteResponse>(
      { friendInvite: safeFriendInvite },
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
