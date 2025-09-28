import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ContactResponse,
  contactResponseSchema,
  CreateContactRequest,
  createContactRequestSchema,
} from "@/schemas/contact";
import { withUserTimezone } from "@/lib/timezone";

// POST: /contact ユーザー_お問い合わせ作成

export const POST = async (request: NextRequest) => {
  try {
    const body: CreateContactRequest = createContactRequestSchema.parse(
      await request.json(),
    );

    const contact = await prisma.contactMessage.create({
      data: body,
    });

    const safeContact: ContactResponse = contactResponseSchema.parse(
      withUserTimezone(contact, ["createdAt"], "UTC"),
    );

    return NextResponse.json({ contact: safeContact }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
