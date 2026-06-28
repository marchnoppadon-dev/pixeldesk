import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";
import { fetchMoviesByProvider } from "../lib/tmdb";
import { ensureMovieExists } from "../lib/movie-pipeline";

async function syncProvider(providerId: number, confidence: "high" | "low") {
  const { results } = await fetchMoviesByProvider(providerId, 1);

  for (const m of results) {
    const movieId = await ensureMovieExists(m.id);
    if (!movieId) continue;

    await supabase.from("movie_providers").upsert({
      movie_id: movieId,
      provider_id: providerId,
      monetization: "flatrate",
      verified_by_human: confidence === "high",
      is_active: true,
      last_checked_at: new Date().toISOString(),
    });
  }

  console.log("sync provider_id=" + providerId + " แล้ว (" + results.length + " เรื่องจาก TMDB)");
}

async function main() {
  const { data: providers } = await supabase
    .from("providers")
    .select("id, name, data_confidence");

  if (!providers?.length) {
    console.error("ไม่มีข้อมูล provider ในตาราง รัน fetch-provider-ids.ts ก่อน");
    return { syncedProviders: 0 };
  }

  for (const p of providers) {
    await syncProvider(p.id, p.data_confidence as "high" | "low");
  }
  return { syncedProviders: providers.length };
}

export async function runSyncPlatforms() {
  return main();
}

if (process.argv[1]?.endsWith("sync-platforms.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}