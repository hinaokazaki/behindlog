import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuthToken } from "@/utils/auth";

const prisma = new PrismaClient();

// GET: /friends/records?month=YYYY-MM ユーザー_記録保持者月別一覧取得(自分と友達両方)

export const GET = async (request: NextRequest) => {
  const user = await verifyAuthToken(request);

  // URLからmonth=YYYY-MMを取得
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  if (!month) {
    return NextResponse.json({ error: "month is required" }, { status: 400 });
  }

  // 月の開始日と終了日
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  // 自分の友達一覧を取得
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ userId1: user.id }, { userId2: user.id }],
    },
  });

  // 自分以外の相手のIDを取り出す
  const friendIds = friendships.map((f) =>
    f.userId1 === user.id ? f.userId2 : f.userId1,
  );

  // 自分と友達の１か月分の記録をまとめて取得
  const records = await prisma.dailyRecord.findMany({
    where: {
      recordedDate: {
        gte: startDate,
        lt: endDate,
      },
      userId: {
        in: [user.id, ...friendIds],
      },
    },
    select: {
      recordedDate: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // 日付ごとにユーザーをグループ化
  const grouped = records.reduce(
    (acc, record) => {
      const date = record.recordedDate.toISOString().slice(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(record.user);
      return acc;
    },
    {} as Record<string, { id: string; name: string | null }[]>,
  );

  return NextResponse.json({
    month,
    records: Object.entries(grouped).map(([date, users]) => ({
      date,
      users,
    })),
  });
};
