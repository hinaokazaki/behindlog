import { supabase } from "./supabase";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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

  if (!user.email) {
    throw new Error("メールアドレスが取得できませんでした");
  }

  // 自動でupsert（ユーザー未登録の場合に作成）
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email,
      name: user.email ?? "no-name",
      colorTheme: "ORIGINAL",
      timezone: "Asia/Tokyo",
    },
  });

  return dbUser;
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
    console.log("Auth Error:", error);
    throw new Error("Unauthorized");
  }

  return user;
};
