import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getLoggedInUser } from "@/utils/auth";

const prisma = new PrismaClient();

// POST: /contact ユーザー_お問い合わせ作成
type CreateContactRequestBody = {
  name: string;
  email: string;
  message: string;
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getLoggedInUser(request);
    const body = await request.json();
    const { name, email, message }: CreateContactRequestBody = body;
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json<{ status: string }>(
      { status: "OK" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
