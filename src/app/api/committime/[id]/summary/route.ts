import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserTimezone } from "@/lib/timezone";
import {
  CommittimeTotalStudyTime,
  committimeTotalStudyTimeSchema,
} from "@/schemas/committime";

// GET: /committime/:id/summary ユーザー_合計学習時間取得
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
        { error: "Committime not found" },
        { status: 400 },
      );
    }

    const totalStudyTime = await prisma.dailyRecord.aggregate({
      where: {
        userId: committime.userId,
        recordedDate: {
          gte: committime.startDate,
          lte: committime.endDate,
        },
      },
      _sum: {
        totalStudyTime: true,
      },
    });

    const result = {
      committimeId: committime.id,
      totalStudyTime: totalStudyTime._sum.totalStudyTime ?? 0,
      startDate: committime.startDate,
      endDate: committime.endDate,
    };

    const safeResult: CommittimeTotalStudyTime =
      committimeTotalStudyTimeSchema.parse(
        withUserTimezone(result, ["startDate", "endDate"], user.timezone),
      );

    return NextResponse.json({ committime: safeResult }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
