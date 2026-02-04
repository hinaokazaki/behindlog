import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/utils/auth";
import {
  CreateTodoRequest,
  createTodoRequestSchema,
  Todo,
  TodoResponse,
  Todos,
  TodosResponse,
} from "@/schemas/todo";
import {
  withUserDateParse,
  withUserTimezone,
  withUserTimezoneMany,
} from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

// POST: /todos ユーザー_Todo新規作成

export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body: CreateTodoRequest = createTodoRequestSchema.parse(
      await request.json(),
    );
    const parsed = withUserDateParse(body, ["dueDate"], user.timezone);

    const todo = await prisma.todo.create({
      data: {
        ...parsed,
        userId: user.id,
        isCompleted: false,
      },
    });

    const converted = withUserTimezone(
        todo,
        ["dueDate", "createdAt", "updatedAt"],
        user.timezone,
      );

    const safeTodo: Todo = converted;

    return NextResponse.json<TodoResponse>({ todo: safeTodo }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};

// GET: /todos ユーザー_Todo一覧取得
export const GET = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });

    const converted = withUserTimezoneMany(
        todos,
        ["createdAt", "updatedAt", "dueDate"],
        user.timezone,
      );

    const safeTodos: Todos = converted;

    return NextResponse.json<TodosResponse>(
      { todos: safeTodos },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
    }
  }
};
