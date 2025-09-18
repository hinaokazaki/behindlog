import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/utils/auth";

// GET: /records ユーザー_記録取得（特定日）
export const GET = async (request: NextRequest) => {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json(
      { status: "日付を指定してください" },
      { status: 400 },
    );
  }

  try {
    const user = await verifyAuthToken(request);
    const recordedDate = new Date(`${date}T00:00:00.000Z`);
    const dailyRecord = await prisma.dailyRecord.findFirst({
      where: {
        userId: user.id,
        recordedDate,
      },
    });

    if (!dailyRecord) {
      return NextResponse.json(
        { status: "記録を取得できませんでした" },
        { status: 400 },
      );
    }

    return NextResponse.json({ status: "OK", dailyRecord }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
