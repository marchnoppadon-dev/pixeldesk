import { cache } from "react";
import { supabase } from "./supabase";
import { tmdbIdFromSlug } from "./slug";

export const SITE_URL = "https://pixeldeskth.com";

export interface WidgetMovie {
  slug: string;
  title_th: string;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  blurb: string | null;
  providers: { name: string; slug: string }[];
}

const FIELDS =
  "slug, title_th, poster_path, vote_average, release_date, ai_content(meta_description), movie_providers(is_active, providers(name, slug))";

function toWidgetMovie(m: any): WidgetMovie {
  const ai = Array.isArray(m.ai_content) ? m.ai_content[0] : m.ai_content;
  const providers = (m.movie_providers ?? [])
    .filter((mp: any) => mp.is_active !== false && mp.providers)
    .map((mp: any) => mp.providers)
    .filter((p: any, i: number, all: any[]) => all.findIndex((q) => q.slug === p.slug) === i);
  return {
    slug: m.slug,
    title_th: m.title_th,
    poster_path: m.poster_path,
    vote_average: m.vote_average,
    release_date: m.release_date,
    blurb: ai?.meta_description ?? null,
    providers,
  };
}

/** Looks a movie up by slug, falling back to the TMDB id so old embed codes keep working. */
export const getWidgetMovie = cache(async (slug: string): Promise<WidgetMovie | null> => {
  const { data } = await supabase
    .from("movies")
    .select(FIELDS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (data) return toWidgetMovie(data);

  const tmdbId = tmdbIdFromSlug(slug);
  if (tmdbId === null) return null;
  const { data: byId } = await supabase
    .from("movies")
    .select(FIELDS)
    .eq("tmdb_id", tmdbId)
    .eq("status", "published")
    .maybeSingle();
  return byId ? toWidgetMovie(byId) : null;
});
