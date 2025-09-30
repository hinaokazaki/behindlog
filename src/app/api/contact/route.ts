import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Contact,
  ContactResponse,
  contactSchema,
  CreateContactRequest,
  createContactRequestSchema,
} from "@/schemas/contact";
import { withUserTimezone } from "@/lib/timezone";
import { ErrorResponse } from "@/schemas/common";

// POST: /contact ユーザー_お問い合わせ作成

export const POST = async (request: NextRequest) => {
  try {
    const body: CreateContactRequest = createContactRequestSchema.parse(
      await request.json(),
    );

    const contact = await prisma.contactMessage.create({
      data: body,
    });

    const safeContact: Contact = contactSchema.parse(
      withUserTimezone(contact, ["createdAt"], "UTC"),
    );

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
