import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import {
  CreateProfileRequest,
  createProfileRequestSchema,
  Profile,
  ProfileResponse,
  UpdateProfileRequest,
  updateProfileRequestSchema,
} from "@/schemas/me";
import { withUserTimezone } from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

// GET: /me ユーザー_プロフィール取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
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

    const converted = withUserTimezone(
      profile,
      ["createdAt", "updatedAt"],
      user.timezone,
    );

    const safeProfile: Profile = converted;

    return NextResponse.json<ProfileResponse>(
      { profile: safeProfile },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};

// POST: /me ユーザー_プロフィール新規作成
export const POST = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    const body: CreateProfileRequest = createProfileRequestSchema.parse(
      await request.json(),
    );

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
        timezone: body.timezone,
      },
      create: {
        id: user.id,
        email: user.email,
        timezone: body.timezone,
        colorTheme: "ORIGINAL",
        name: "No name",
      },
    });

    const converted = withUserTimezone(
      profile,
      ["createdAt", "updatedAt"],
      body.timezone,
    );

    const safeProfile: Profile = converted;

    return NextResponse.json<ProfileResponse>(
      { profile: safeProfile },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/me failed:", error);
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};

// PATCH: /me ユーザー_プロフィール更新
export const PATCH = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body: UpdateProfileRequest = updateProfileRequestSchema.parse(
      await request.json(),
    );

    const profile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: body,
    });

    const converted = withUserTimezone(
      profile,
      ["createdAt", "updatedAt"],
      user.timezone,
    );

    const safeProfile: Profile = converted;

    return NextResponse.json<ProfileResponse>(
      { profile: safeProfile },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};
