import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import {
  Committime,
  CommittimeResponse,
  UpdateCommittimeRequest,
  updateCommittimeRequestSchema,
} from "@/schemas/committime";
import { ErrorResponse } from "@/schemas/common";

// GET: /committime ユーザー_目標時間取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const committime = await prisma.commitTime.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!committime) {
      return NextResponse.json({ committime: null }, { status: 200 });
    }

    const converted = withUserTimezone(
      committime,
      ["createdAt", "updatedAt", "startDate", "endDate"],
      user.timezone,
    );

    const safeCommittime: Committime = converted;

    return NextResponse.json<CommittimeResponse>(
      { committime: safeCommittime },
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

// PATCH: /committime ユーザー_目標時間更新
export const PATCH = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body: UpdateCommittimeRequest = updateCommittimeRequestSchema.parse(
      await request.json(),
    );
    const parsed = {
      ...withUserDateParse(body, ["startDate", "endDate"], user.timezone),
      targetTime: Number(body.targetTime),
    };

    const committime = await prisma.commitTime.upsert({
      where: {
        userId: user.id,
      },
      update: parsed,
      create: {
        ...parsed,
        userId: user.id,
      },
    });

    const converted = withUserTimezone(
      committime,
      ["createdAt", "updatedAt", "startDate", "endDate"],
      user.timezone,
    );

    const safeCommittime: Committime = converted;

    return NextResponse.json<CommittimeResponse>(
      { committime: safeCommittime },
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
