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

  // DBにユーザーがある前提（callbackでupsert済み）
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    throw new Error("ユーザーがDBに存在しません");
  }

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
