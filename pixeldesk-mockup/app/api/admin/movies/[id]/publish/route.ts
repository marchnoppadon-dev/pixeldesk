import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../../../lib/admin-auth";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: unverified } = await supabase
    .from("movie_providers")
    .select("provider_id, providers(data_confidence)")
    .eq("movie_id", id)
    .eq("verified_by_human", false);

  const blockingProviders = (unverified ?? []).filter(
    (p: any) => p.providers?.data_confidence === "low"
  );
  if (blockingProviders.length > 0) {
    return NextResponse.json(
      { error: "ยังมีแพลตฟอร์มที่ต้องยืนยันก่อน publish" },
      { status: 400 }
    );
  }

  const { error: movieErr } = await supabase
    .from("movies")
    .update({ status: "published" })
    .eq("id", id);

  const { error: contentErr } = await supabase
    .from("ai_content")
    .update({ human_reviewed: true, human_reviewed_at: new Date().toISOString() })
    .eq("movie_id", id);

  if (movieErr || contentErr) {
    return NextResponse.json(
      { error: movieErr?.message ?? contentErr?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}