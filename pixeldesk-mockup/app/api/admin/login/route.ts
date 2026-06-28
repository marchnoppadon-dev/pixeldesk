import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, setAdminSession } from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString() ?? "";

  if (!checkAdminPassword(password)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url)
    );
  }

  await setAdminSession();
  return NextResponse.redirect(new URL("/admin/review-queue", request.url));
}