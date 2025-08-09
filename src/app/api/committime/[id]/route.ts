import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { CommitTimeData } from "@/app/_types/type";

const prisma = new PrismaClient();

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
