import { supabase } from "./supabase";
import { fetchEnglishCastNames, fetchEnglishTitle } from "./tmdb";
import { isUntranslatedTitle } from "./quality";

// Korean, Chinese/Japanese, Devanagari, Cyrillic, Arabic runs.
const FOREIGN_SCRIPT = /[぀-ヿ㐀-鿿가-힯ऀ-ॿЀ-ӿ؀-ۿ]/;

function replaceAll(text: string | null, from: string | null, to: string): string | null {
  if (!text || !from || from === to) return text;
  return text.split(from).join(to);
}

/**
 * Cleans native-script text that TMDB hands back when it has no Thai translation:
 *  1. title_th still Korean/Chinese/...  -> English TMDB title
 *  2. the original-script title inside the AI meta title/description/review -> title_th
 *  3. cast names in native script -> English TMDB names
 * Safe to run repeatedly; rows that are already clean are left alone.
 */
export async function backfillUntranslatedTitles() {
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, tmdb_id, title_th, title_original");
  if (error) throw new Error("load movies failed: " + error.message);

  const titlesFixed: { from: string; to: string }[] = [];
  const textFixed: string[] = [];
  const castFixed: { movie: string; count: number }[] = [];
  const failed: { title: string; error: string }[] = [];

  for (const m of movies ?? []) {
    let title = m.title_th as string;

    // 1. Title
    if (isUntranslatedTitle(title)) {
      const english = await fetchEnglishTitle(m.tmdb_id);
      if (english && !isUntranslatedTitle(english) && english !== title) {
        const { error: e } = await supabase.from("movies").update({ title_th: english }).eq("id", m.id);
        if (e) {
          failed.push({ title, error: e.message });
          continue;
        }
        titlesFixed.push({ from: title, to: english });
        await replaceInAiContent(m.id, title, english);
        title = english;
      }
    }

    // 2. Original-script title left in AI text (e.g. "รีวิวหนัง 소방관 ...")
    if (!isUntranslatedTitle(title) && m.title_original && FOREIGN_SCRIPT.test(m.title_original)) {
      if (await replaceInAiContent(m.id, m.title_original, title)) textFixed.push(title);
    }

    // 3. Cast names
    // movie_cast has no surrogate id: rows are keyed by (movie_id, person_tmdb_id).
    const { data: cast, error: castErr } = await supabase
      .from("movie_cast")
      .select("person_tmdb_id, name")
      .eq("movie_id", m.id);
    if (castErr) failed.push({ title, error: "load cast: " + castErr.message });
    const foreign = (cast ?? []).filter((c) => FOREIGN_SCRIPT.test(c.name ?? ""));
    if (foreign.length > 0) {
      const english = await fetchEnglishCastNames(m.tmdb_id);
      let count = 0;
      for (const c of foreign) {
        const name = english.get(Number(c.person_tmdb_id));
        if (name && !FOREIGN_SCRIPT.test(name)) {
          const { error: e } = await supabase
            .from("movie_cast")
            .update({ name })
            .eq("movie_id", m.id)
            .eq("person_tmdb_id", c.person_tmdb_id);
          if (e) failed.push({ title, error: "update cast: " + e.message });
          else count++;
        }
      }
      if (count > 0) castFixed.push({ movie: title, count });
    }
  }

  return { titlesFixed, textFixed, castFixed, failed };
}

/** Replace `from` with `to` in the movie's AI texts; returns true if anything changed. */
async function replaceInAiContent(movieId: string, from: string, to: string): Promise<boolean> {
  // ai_content is keyed by movie_id (one row per movie), not by a separate id.
  const { data: ai, error } = await supabase
    .from("ai_content")
    .select("meta_title, meta_description, review_body")
    .eq("movie_id", movieId);
  if (error) {
    console.error("[backfill] load ai_content failed", movieId, error.message);
    return false;
  }
  let changed = false;
  for (const row of ai ?? []) {
    const next = {
      meta_title: replaceAll(row.meta_title, from, to),
      meta_description: replaceAll(row.meta_description, from, to),
      review_body: replaceAll(row.review_body, from, to),
    };
    if (
      next.meta_title !== row.meta_title ||
      next.meta_description !== row.meta_description ||
      next.review_body !== row.review_body
    ) {
      const { error: e } = await supabase.from("ai_content").update(next).eq("movie_id", movieId);
      if (e) console.error("[backfill] update ai_content failed", movieId, e.message);
      else changed = true;
    }
  }
  return changed;
}
