import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { contactQuerySchema } from "@/server/contact/schema";
import { createAndSendContactQuery } from "@/server/contact/service";

export async function POST(request: Request) {
  try {
    const input = contactQuerySchema.parse(await request.json());
    if (input.website) return NextResponse.json({ success: true }, { status: 201 });
    await createAndSendContactQuery(input);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
    console.error("Contact form delivery failed", error);
    return NextResponse.json(
      { error: "Your message could not be sent. Please email directly instead." },
      { status: 500 },
    );
  }
}
