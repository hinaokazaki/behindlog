import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ContactResponse,
  CreateContactRequest,
  createContactRequestSchema,
} from "@/schemas/contact";
import { ErrorResponse } from "@/schemas/common";

// POST: /contact ユーザー_お問い合わせ作成
export const POST = async (request: NextRequest) => {
  try {
    const body: CreateContactRequest = createContactRequestSchema.parse(
      await request.json(),
    );

    await prisma.contactMessage.create({
      data: body,
    });

    return NextResponse.json<ContactResponse>(
      { status: "OK" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json<ErrorResponse>(
        { error: error.message },
        { status: 400 },
      );
  }
};
