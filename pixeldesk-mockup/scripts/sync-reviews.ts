import { config } from "dotenv";
config({ path: ".env.local" });

import { fetchNowPlaying } from "../lib/tmdb";
import { ensureMovieExists } from "../lib/movie-pipeline";

async function main() {
  const { results } = await fetchNowPlaying(1);
  console.log("พบหนังเข้าฉาย เข้าใหม่ " + results.length + " เรื่องจาก TMDB");
  for (const m of results) {
    await ensureMovieExists(m.id);
  }
  return { processedCount: results.length };
}

export async function runSyncReviews() {
  return main();
}

if (process.argv[1]?.endsWith("sync-reviews.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}