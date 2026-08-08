import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const sessionName = "portfolio_admin_session";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "development-only-change-me");

export async function createSession(adminId: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const token = await new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);
  (await cookies()).set(sessionName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSessionAdminId() {
  const token = (await cookies()).get(sessionName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.adminId === "string" ? payload.adminId : null;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(sessionName);
}
