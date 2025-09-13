import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { CommitTimeData } from "@/app/_types/type";

// GET: /committime ユーザー_目標時間取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await verifyAuthToken(request);
    const committime = await prisma.commitTime.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!committime) {
      return NextResponse.json(
        { status: "目標時間設定を取得できませんでした" },
        { status: 400 },
      );
    }

    return NextResponse.json<{ status: string; committime: CommitTimeData }>(
      { status: "OK", committime: committime },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// PATCH: /committime ユーザー_目標時間更新
type UpdateCommitTimeRequestBody = {
  targetTime: number; // 単位: 分
  startDate: Date;
  endDate: Date;
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { targetTime, startDate, endDate } = body;
    const committime = await prisma.commitTime.update({
      where: {
        id: Number(id),
      },
      data: {
        targetTime: Number(targetTime),
        startDate: new Date(startDate),
        endDate: new Date(startDate),
      },
    });

    return NextResponse.json<{ status: string; committime: CommitTimeData }>(
      { status: "OK", committime: committime },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
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
      },
    });

    return NextResponse.json<{ status: string }>(
      { status: "OK" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
