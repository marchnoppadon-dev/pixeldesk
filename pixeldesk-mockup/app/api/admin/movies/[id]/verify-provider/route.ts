import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../../../lib/admin-auth";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { id } = await params;
  const formData = await request.formData();
  const providerId = Number(formData.get("providerId"));

  const { error } = await supabase
    .from("movie_providers")
    .update({ verified_by_human: true, last_checked_at: new Date().toISOString() })
    .eq("movie_id", id)
    .eq("provider_id", providerId);

  if (error) {
    console.error("verify-provider ล้มเหลว:", error.message);
  }

  return NextResponse.redirect(new URL("/admin/review-queue", request.url));
}