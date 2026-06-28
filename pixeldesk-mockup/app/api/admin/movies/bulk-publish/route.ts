import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../../lib/admin-auth";
import { supabase } from "../../../../../lib/supabase";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "ไม่มีรายการที่เลือก" }, { status: 400 });
  }

  const published: string[] = [];
  const skipped: string[] = [];

  for (const id of ids) {
    const { data: unverified } = await supabase
      .from("movie_providers")
      .select("provider_id, providers(data_confidence)")
      .eq("movie_id", id)
      .eq("verified_by_human", false);

    const blockingProviders = (unverified ?? []).filter(
      (p: any) => p.providers?.data_confidence === "low"
    );

    if (blockingProviders.length > 0) {
      skipped.push(id);
      continue;
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
      skipped.push(id);
      continue;
    }

    published.push(id);
  }

  return NextResponse.json({ published, skipped });
}