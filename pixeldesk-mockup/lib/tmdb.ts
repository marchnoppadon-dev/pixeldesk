import { config } from "dotenv";
config({ path: ".env.local" });

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY!;

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("language", "th-TH");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`TMDB ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export interface TmdbMovieBundle {
  detail: any;
  credits: any;
  releaseDates: any;
  videos: any;
  watchProviders: any;
  similar: any;
}

export async function fetchMovieBundle(tmdbId: number): Promise<TmdbMovieBundle> {
  const detail = await tmdbFetch(`/movie/${tmdbId}`, {
    append_to_response: "credits,release_dates,videos,watch/providers,similar",
  });

  return {
    detail,
    credits: detail.credits,
    releaseDates: detail.release_dates,
    videos: detail.videos,
    watchProviders: detail["watch/providers"],
    similar: detail.similar,
  };
}

export function extractThaiCertification(releaseDates: any): string | null {
  const thEntry = releaseDates?.results?.find((r: any) => r.iso_3166_1 === "TH");
  const cert = thEntry?.release_dates?.find((d: any) => d.certification)?.certification;
  return cert || null;
}

export function extractTrailerKey(videos: any): string | null {
  const trailer = videos?.results?.find(
    (v: any) => v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer?.key || null;
}

export function extractThaiProviders(watchProviders: any): number[] {
  const thFlatrate = watchProviders?.results?.TH?.flatrate || [];
  return thFlatrate.map((p: any) => p.provider_id);
}

export async function fetchNowPlaying(page = 1) {
  return tmdbFetch("/movie/now_playing", { page: String(page), region: "TH" });
}

export async function fetchMoviesByProvider(providerId: number, page = 1) {
  return tmdbFetch("/discover/movie", {
    watch_region: "TH",
    with_watch_providers: String(providerId),
    watch_monetization_types: "flatrate",
    sort_by: "popularity.desc",
    page: String(page),
  });
}