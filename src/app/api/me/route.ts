import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuthToken } from "@/utils/auth";
import { ProfileData } from "@/app/_types/type";

const prisma = new PrismaClient();

// POST: /me ユーザー_プロフィール新規作成

type CreateProfileRequestBody = {
  id: string; // Supabaseのuser.id
  email: string; // Supabaseのuser.email
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    if (!user.email) {
      return NextResponse.json(
        { status: "メールアドレスが取得できませんでした" },
        { status: 400 },
      );
    }

    const profile = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });

    return NextResponse.json<{ status: string; user: ProfileData }>({
      status: "OK",
      user: profile,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
