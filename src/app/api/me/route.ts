import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuthToken } from "@/utils/auth";
import { ProfileData } from "@/app/_types/type";

const prisma = new PrismaClient();

// GET: /me ユーザー_プロフィール取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { status: "プロフィール情報が取得できませんでした" },
        { status: 400 },
      );
    }

    return NextResponse.json<{ status: string; user: ProfileData }>(
      { status: "OK", user: profile },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

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

// PATCH: /me ユーザー_プロフィール更新
type UpdateProfileRequestBody = {
  name: string;
  colorTheme: "ORIGINAL" | "COOL" | "WARM" | "NATURE" | "SUNSHINE";
};

export const PATCH = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);

    const { name, colorTheme }: UpdateProfileRequestBody = await request.json();
    const profile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        colorTheme,
      },
    });

    return NextResponse.json<{ status: string; user: ProfileData }>(
      { status: "OK", user: profile },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
