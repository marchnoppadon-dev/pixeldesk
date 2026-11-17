import { supabase } from "./supabase";
import { fetchEnglishTitle } from "./tmdb";
import { isUntranslatedTitle } from "./quality";

function replaceAll(text: string | null, from: string, to: string): string | null {
  return text ? text.split(from).join(to) : text;
}

/**
 * Movies whose title_th is still Korean/Chinese/etc. (TMDB had no Thai title) get the
 * English TMDB title instead, which Thai searchers recognise and Google can match.
 * The old title is swapped in the AI meta title/description and review body too.
 * Safe to run repeatedly: translated titles are skipped.
 */
export async function backfillUntranslatedTitles() {
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, tmdb_id, title_th, title_original");
  if (error) throw new Error("load movies failed: " + error.message);

  const fixed: { from: string; to: string }[] = [];
  const skipped: string[] = [];
  const failed: { title: string; error: string }[] = [];

  for (const m of (movies ?? []).filter((x) => isUntranslatedTitle(x.title_th))) {
    const english = await fetchEnglishTitle(m.tmdb_id);
    if (!english || isUntranslatedTitle(english) || english === m.title_th) {
      skipped.push(m.title_th);
      continue;
    }

    const { error: movieErr } = await supabase
      .from("movies")
      .update({ title_th: english })
      .eq("id", m.id);
    if (movieErr) {
      failed.push({ title: m.title_th, error: movieErr.message });
      continue;
    }

    const { data: ai } = await supabase
      .from("ai_content")
      .select("id, meta_title, meta_description, review_body")
      .eq("movie_id", m.id);
    for (const row of ai ?? []) {
      await supabase
        .from("ai_content")
        .update({
          meta_title: replaceAll(row.meta_title, m.title_th, english),
          meta_description: replaceAll(row.meta_description, m.title_th, english),
          review_body: replaceAll(row.review_body, m.title_th, english),
        })
        .eq("id", row.id);
    }
    fixed.push({ from: m.title_th, to: english });
  }

  return { fixed, skipped, failed };
}
