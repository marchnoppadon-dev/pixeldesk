import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { backfillMovieSlugs } from "../../../../lib/slug-backfill";
import { backfillUntranslatedTitles } from "../../../../lib/title-backfill";
import { isAuthorizedCron } from "../../../../lib/cron-auth";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request, "backfill-slugs")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const titles = await backfillUntranslatedTitles();
    const slugs = await backfillMovieSlugs();
    console.log("[backfill] titles fixed", titles.fixed, "skipped", titles.skipped, "failed", titles.failed);
    console.log("[backfill] slugs renamed", slugs.renamed.length, "failed", slugs.failed);
    // Drop cached pages and the sitemap so links pick up the new titles/slugs right away.
    if (titles.fixed.length > 0 || slugs.renamed.length > 0) revalidatePath("/", "layout");
    return NextResponse.json({ success: true, titles, slugs });
  } catch (err: unknown) {
    console.error("backfill-slugs cron error:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
