import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";

// GET: /users/[userId]/dashboard 友達のダッシュボード用データ取得
