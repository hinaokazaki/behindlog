import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import {
  Committime,
  CommittimeResponse,
  committimeSchema,
  CreateCommittimeRequest,
  createCommittimeRequestSchema,
} from "@/schemas/committime";
import { ErrorResponse } from "@/schemas/common";

// POST: /committime ユーザー_目標時間新規作成
export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body: CreateCommittimeRequest = createCommittimeRequestSchema.parse(
      await request.json(),
    );
    const parsed = {
      ...withUserDateParse(body, ["startDate", "endDate"], user.timezone),
      targetztime: Number(body.targetTime),
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

    const safeCommittime: Committime = committimeSchema.parse(
      withUserTimezone(
        committime,
        ["createdAt", "updatedAt", "startDate", "endDate"],
        user.timezone,
      ),
    );

    return NextResponse.json<CommittimeResponse>(
      { committime: safeCommittime },
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
