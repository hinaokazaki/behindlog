import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import {
  CreateProfileRequest,
  createProfileRequestSchema,
  ProfileResponse,
  profileResponseSchema,
  UpdateProfileRequest,
  updateProfileRequestSchema,
} from "@/schemas/me";
import { withUserTimezone } from "@/lib/timezone";

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

    const safeProfile: ProfileResponse = profileResponseSchema.parse(
      withUserTimezone(profile, ["createdAt", "updatedAt"], user.timezone),
    );

    return NextResponse.json({ user: safeProfile }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// POST: /me ユーザー_プロフィール新規作成

export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
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
      },
    });

    const safeProfile: ProfileResponse = profileResponseSchema.parse(
      withUserTimezone(profile, ["createdAt", "updatedAt"], user.timezone),
    );

    return NextResponse.json({ user: safeProfile }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
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

    const safeProfile: ProfileResponse = profileResponseSchema.parse(
      withUserTimezone(profile, ["createdAt", "updatedAt"], user.timezone),
    );

    return NextResponse.json({ user: safeProfile }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
