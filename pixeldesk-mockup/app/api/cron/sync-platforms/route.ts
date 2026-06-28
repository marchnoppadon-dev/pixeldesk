import { NextRequest, NextResponse } from "next/server";
import { runSyncPlatforms } from "../../../../scripts/sync-platforms";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer " + process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSyncPlatforms();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("sync-platforms cron error:", err);
    return NextResponse.json({ error: err?.message ?? "unknown error" }, { status: 500 });
  }
}