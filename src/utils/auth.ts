import { supabase } from "./supabase";
import { PrismaClient } from "@prisma/client"; // utils/prisma.ts作成するべき？
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// user.id を使って DB操作（create, update, delete）するばあいに使用する
export const getLoggedInUser = async (request: NextRequest) => {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Unauthorised");
  }

  // 自動でupsert（ユーザー未登録の場合に作成）
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      name: user.email ?? "no-name",
      colorTheme: "ORIGINAL",
    },
  });

  return user;
};

// 認証済みかどうかのチェックだけ（DB登録は不要）
export const verifyAuthToken = async (request: NextRequest) => {
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
};
