import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/utils/auth";
import { ProfileData } from "@/app/_types/type";

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
  timezone: String;
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    const body = await request.json();
    const { timezone } = body;

    if (!user.email) {
      return NextResponse.json(
        { status: "メールアドレスが取得できませんでした" },
        { status: 400 },
      );
    }

    const profile = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        timezone,
      },
      create: {
        id: user.id,
        email: user.email,
        timezone,
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
  timezone: string;
};

export const PATCH = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);

    const { name, colorTheme, timezone }: UpdateProfileRequestBody =
      await request.json();
    const profile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        colorTheme,
        timezone,
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
