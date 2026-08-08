import "server-only";
import nodemailer from "nodemailer";
import { connectDatabase } from "@/server/database";
import { ContactQueryModel } from "@/server/contact/model";
import type { ContactQueryInput } from "@/server/contact/schema";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) throw new Error("SMTP is not configured.");
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function createAndSendContactQuery(input: ContactQueryInput) {
  await connectDatabase();
  const query = await ContactQueryModel.create({ ...input, deliveryStatus: "failed" });
  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.CONTACT_RECEIVER_EMAIL ?? process.env.ADMIN_EMAIL,
      replyTo: input.email,
      subject: `[Portfolio] ${input.subject}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    });
    query.deliveryStatus = "sent";
    await query.save();
    return { id: query.id, deliveryStatus: "sent" as const };
  } catch (error) {
    await query.save();
    throw error;
  }
}

export async function getContactQueries() {
  await connectDatabase();
  const queries = await ContactQueryModel.find().sort({ createdAt: -1 }).limit(100).lean();
  return queries.map((query) => ({
    id: String(query._id),
    name: query.name,
    email: query.email,
    subject: query.subject,
    message: query.message,
    deliveryStatus: query.deliveryStatus as "sent" | "failed",
    createdAt: query.createdAt.toISOString(),
  }));
}
