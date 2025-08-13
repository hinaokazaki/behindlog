import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser, verifyAuthToken } from "@/utils/auth";
import { TodoData } from "@/app/_types/type";

const prisma = new PrismaClient();

// GET: /todos ユーザー_Todo取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await verifyAuthToken(request);
    const todo = await prisma.todo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!todo) {
      return NextResponse.json(
        { status: "Todoを取得できませんでした" },
        { status: 400 },
      );
    }

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

// PATCH: /todos ユーザー_Todo更新
type UpdateTodoRequestBody = {
  title: string;
  dueDate: Date;
  isCompleted: boolean;
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { title, dueDate, isCompleted }: UpdateTodoRequestBody = body;

    const todo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        dueDate: new Date(dueDate),
        isCompleted,
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

// DELETE: /todos ユーザー_Todo削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const todo = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json<{ status: string }>(
      { status: "OK" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
