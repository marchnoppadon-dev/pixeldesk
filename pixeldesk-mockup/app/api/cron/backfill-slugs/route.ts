import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { backfillMovieSlugs } from "../../../../lib/slug-backfill";
import { backfillUntranslatedTitles } from "../../../../lib/title-backfill";
import { isAuthorizedCron } from "../../../../lib/cron-auth";
import { submitToIndexNow } from "../../../../lib/indexnow";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request, "backfill-slugs")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const titles = await backfillUntranslatedTitles();
    const slugs = await backfillMovieSlugs();
    console.log("[backfill] titles", JSON.stringify(titles));
    console.log("[backfill] slugs renamed", slugs.renamed.length, "failed", JSON.stringify(slugs.failed));
    // Drop cached pages and the sitemap so links pick up the new titles/slugs right away.
    const changed =
      titles.titlesFixed.length + titles.textFixed.length + titles.castFixed.length + slugs.renamed.length;
    if (changed > 0) revalidatePath("/", "layout");
    if (slugs.renamed.length > 0) {
      await submitToIndexNow(slugs.renamed.map((r) => `/movies/${r.to}`));
    }
    return NextResponse.json({ success: true, titles, slugs });
  } catch (err: unknown) {
    console.error("backfill-slugs cron error:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
