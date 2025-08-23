import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser } from "@/utils/auth";
import { CommitTimeData } from "@/app/_types/type";

const prisma = new PrismaClient();

// POST: /committime ユーザー_目標時間新規作成
type CreateCommitTimeRequestBody = {
  targetTime: number; // 単位: 分
  startDate: string; //Date
  endDate: string; //Date
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { targetTime, startDate, endDate }: CreateCommitTimeRequestBody =
      body;

    const committime = await prisma.commitTime.upsert({
      where: {
        userId: user.id,
      },
      update: {
        targetTime: Number(targetTime),
        startDate: new Date(startDate), //Date型に変換
        endDate: new Date(endDate), //Date型に変換
      },
      create: {
        targetTime: Number(targetTime),
        startDate: new Date(startDate), //Date型に変換
        endDate: new Date(endDate), //Date型に変換
        userId: user.id,
      },
    });

    return NextResponse.json<{ status: string; committime: CommitTimeData }>(
      { status: "OK", committime: committime },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
