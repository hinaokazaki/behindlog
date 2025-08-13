import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { TodoData } from "@/app/_types/type";

const prisma = new PrismaClient();

// POST: /todos ユーザー_Todo新規作成
type CreateTodoRequestBody = {
  title: string;
  dueDate: Date;
  isCompleted: boolean;
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { title, dueDate, isCompleted }: CreateTodoRequestBody = body;

    const todo = await prisma.todo.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        isCompleted,
        userId: user.id,
      },
    });

    return NextResponse.json<{ status: string; todo: TodoData }>(
      { status: "OK", todo: todo },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// GET: /todos ユーザー_Todo一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyAuthToken(request);
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json<{ status: string; todo: TodoData[] }>(
      { status: "OK", todo: todos },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
