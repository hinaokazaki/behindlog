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
import { StatusResponse, ErrorResponse } from "@/schemas/common";

// GET: /committime ユーザー_目標時間取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const committime = await prisma.commitTime.findUnique({
      where: {
        id: Number(id),
        userId: user.id,
      },
    });

    if (!committime) {
      return NextResponse.json(
        { status: "目標時間設定を取得できませんでした" },
        { status: 400 },
      );
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
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const body: UpdateCommittimeRequest = updateCommittimeRequestSchema.parse(
      await request.json(),
    );
    const parsed = {
      ...withUserDateParse(body, ["startDate", "endDate"], user.timezone),
      targetTime: Number(body.targetTime),
    };

    const committime = await prisma.commitTime.update({
      where: {
        id: Number(id),
        userId: user.id,
      },
      data: parsed,
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

// DELETE: /committime ユーザー_目標時間削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const commitTime = await prisma.commitTime.delete({
      where: {
        id: Number(id),
        userId: user.id,
      },
    });

    return NextResponse.json<StatusResponse>({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};
