import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const TARGET_PROVIDERS: Record<string, "high" | "low"> = {
  Netflix: "high",
  "Disney Plus": "high",
  "HBO Max": "high",
  "Apple TV": "high",
  WeTV: "low",
  Viu: "low",
  iQIYI: "low",
};

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/\+/g, "plus");
}

async function main() {
  const res = await fetch(
    `https://api.themoviedb.org/3/watch/providers/movie?language=th-TH&watch_region=TH`,
    { headers: { Authorization: `Bearer ${TMDB_API_KEY}` } }
  );
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${await res.text()}`);
  }
  const { results } = await res.json();

  const matched: { id: number; name: string; confidence: "high" | "low" }[] = [];

  for (const [targetName, confidence] of Object.entries(TARGET_PROVIDERS)) {
    const found = results.find((p: { provider_name: string }) =>
      p.provider_name.toLowerCase().includes(targetName.toLowerCase())
    );
    if (found) {
      matched.push({ id: found.provider_id, name: targetName, confidence });
    } else {
      console.warn(`⚠️  ไม่พบ "${targetName}" ในผลลัพธ์ TMDB โซน TH — ต้องเช็คมือ`);
    }
  }

  for (const p of matched) {
    const { error } = await supabase.from("providers").upsert({
      id: p.id,
      name: p.name,
      slug: slugify(p.name),
      data_confidence: p.confidence,
    });
    if (error) console.error(`เพิ่ม ${p.name} ไม่สำเร็จ:`, error.message);
    else console.log(`✓ ${p.name} → provider_id=${p.id} (confidence=${p.confidence})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});