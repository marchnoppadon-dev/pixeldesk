import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { backfillMovieSlugs } from "../../../../lib/slug-backfill";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await backfillMovieSlugs();
    // Drop cached pages and the sitemap so links switch to the new slugs right away.
    if (result.renamed.length > 0) revalidatePath("/", "layout");
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    console.error("backfill-slugs cron error:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
