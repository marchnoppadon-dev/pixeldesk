import { config } from "dotenv";
config({ path: ".env.local" });

import { cookies } from "next/headers";

const SESSION_COOKIE = "pixeldesk_admin_session";

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("ADMIN_PASSWORD ยังไม่ถูกตั้งค่า — ปิดกั้นทุก request โดยปริยาย");
    return false;
  }
  return password === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  return session === process.env.ADMIN_SESSION_TOKEN;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, process.env.ADMIN_SESSION_TOKEN!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}