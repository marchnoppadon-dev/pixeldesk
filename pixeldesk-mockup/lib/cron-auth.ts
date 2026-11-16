import type { NextRequest } from "next/server";

/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Values pasted into the
 * Vercel dashboard often carry a trailing newline/space, which HTTP strips from the
 * header, so compare trimmed values. On failure, log only presence/lengths (never
 * the secret) to make mismatches diagnosable from the runtime logs.
 */
export function isAuthorizedCron(request: NextRequest, route: string): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const header = request.headers.get("authorization")?.trim() ?? "";
  const ok = !!secret && header === "Bearer " + secret;
  if (!ok) {
    console.warn(`[${route}] cron auth failed`, {
      hasSecret: !!secret,
      secretLength: secret?.length ?? 0,
      rawSecretLength: process.env.CRON_SECRET?.length ?? 0,
      hasHeader: header.length > 0,
      headerLength: header.length,
      userAgent: request.headers.get("user-agent"),
    });
  }
  return ok;
}
