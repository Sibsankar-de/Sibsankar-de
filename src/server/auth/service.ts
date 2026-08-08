import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connectDatabase } from "@/server/database";
import { AdminModel } from "@/server/auth/model";
import { getSessionAdminId } from "@/server/auth/session";

export const requireAdmin = cache(async () => {
  const adminId = await getSessionAdminId();
  if (!adminId) redirect("/admin/login");
  await connectDatabase();
  const admin = await AdminModel.findById(adminId).lean();
  if (!admin) redirect("/admin/login");
  return { id: String(admin._id), email: admin.email };
});
