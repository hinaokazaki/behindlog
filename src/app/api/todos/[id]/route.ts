import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import { withUserDateParse, withUserTimezone } from "@/lib/timezone";
import {
  Todo,
  TodoResponse,
  todoResponseSchema,
  todoSchema,
  UpdateTodoRequest,
  updateTodoRequestSchema,
} from "@/schemas/todo";

// GET: /todos ユーザー_Todo取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const todo = await prisma.todo.findUnique({
      where: {
        id: Number(id),
        userId: user.id,
      },
    });

    if (!todo) {
      return NextResponse.json(
        { status: "Todoを取得できませんでした" },
        { status: 400 },
      );
    }

    const safeTodo: TodoResponse = todoResponseSchema.parse(
      withUserTimezone(
        todo,
        ["dueDate", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json({ todo: safeTodo }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// PATCH: /todos ユーザー_Todo更新

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  try {
    const user = await getLoggedInUser(request);
    const body: UpdateTodoRequest = updateTodoRequestSchema.parse(
      await request.json(),
    );
    const parsed = withUserDateParse(body, ["dueDate"], user.timezone);

    const todo = await prisma.todo.update({
      where: {
        id: Number(id),
        userId: user.id,
      },
      data: parsed,
    });

    const safeTodo: Todo = todoResponseSchema.parse(
      withUserTimezone(
        todo,
        ["dueDate", "createdAt", "updatedAt"],
        user.timezone,
      ),
    );

    return NextResponse.json({ todo: safeTodo }, { status: 200 });
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
        userId: user.id,
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
