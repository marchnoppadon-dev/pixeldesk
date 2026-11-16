import { supabase } from "./supabase";
import { fetchEnglishTitle } from "./tmdb";
import { makeMovieSlug } from "./slug";

/**
 * Renames legacy `movie-{tmdbId}` slugs to readable `{english-title}-{tmdbId}` slugs.
 * Old URLs keep working: the movie page 301-redirects any slug ending in the TMDB id
 * to the current one. Safe to run repeatedly; movies that already have a readable
 * slug, or whose title has no Latin form, are left as they are.
 */
export async function backfillMovieSlugs(limit = 200) {
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, tmdb_id, slug, title_original")
    .like("slug", "movie-%")
    .limit(limit);
  if (error) throw new Error("load movies failed: " + error.message);

  const renamed: { from: string; to: string }[] = [];
  const skipped: string[] = [];
  const failed: { slug: string; error: string }[] = [];

  for (const m of movies ?? []) {
    const englishTitle = await fetchEnglishTitle(m.tmdb_id);
    const next = makeMovieSlug(m.tmdb_id, englishTitle, m.title_original);
    if (next === m.slug) {
      skipped.push(m.slug);
      continue;
    }
    const { error: updErr } = await supabase
      .from("movies")
      .update({ slug: next })
      .eq("id", m.id);
    if (updErr) failed.push({ slug: m.slug, error: updErr.message });
    else renamed.push({ from: m.slug, to: next });
  }

  return { checked: movies?.length ?? 0, renamed, skipped, failed };
}
