import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser } from "@/utils/auth";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInviteEmail(to: string, token: string) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`;

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
type CreateFriendRequestBody = {
  inviteeEmail: string;
  message: string;
};

export const POST = async (request: NextRequest) => {
  const user = await getLoggedInUser(request);
  const body = await request.json();
  const { inviteeEmail, message }: CreateFriendRequestBody = body;

  try {
    const invitedUser = await prisma.user.findUnique({
      where: {
        email: inviteeEmail,
      },
    });

    if (invitedUser) {
      const friendShip = await prisma.friendship.create({
        data: {
          userId1: user.id,
          userId2: invitedUser.id,
          inviterUserId: user.id,
          inviteeEmail,
          message,
          status: "PENDING",
        },
      });

      // どっちにしても招待を知らせるメールは送らないといけない？ー後々必要なら追加する
      return NextResponse.json({ status: "OK", friendShip }, { status: 200 });
    } else {
      const token = uuidv4();
      const friendShip = await prisma.friendship.create({
        data: {
          userId1: user.id,
          inviterUserId: user.id,
          inviteeEmail,
          message,
          token,
          status: "PENDING",
        },
      });

      // tokenを含んだ招待メールを送信する操作
      try {
        await sendInviteEmail(inviteeEmail, token);
      } catch (err) {
        console.error("Failed to send email", err);
        return NextResponse.json(
          { status: "Failed to send email" },
          { status: 500 },
        );
      }

      return NextResponse.json({ status: "OK", friendShip }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
