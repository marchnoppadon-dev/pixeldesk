import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "./supabase";
import {
  fetchMovieBundle,
  extractThaiCertification,
  extractTrailerKey,
  extractThaiProviders,
  fetchEnglishTitle,
  fetchEnglishCastNames,
} from "./tmdb";
import { generateMovieContent, type MovieContext } from "./ai-content";
import { makeMovieSlug } from "./slug";
import { isUntranslatedTitle } from "./quality";

/**
 * ตรวจสอบว่าหนังเรื่องนี้มีอยู่ในระบบแล้วหรือยัง ถ้ายังไม่มี จะสร้างขึ้นใหม่ครบ
 * ทุกขั้นตอน (ดึง TMDB ผูก genre cast provider และให้ AI เขียนรีวิว)
 * คืนค่า internal movie id (uuid) เสมอ ไม่ว่าจะมีอยู่แล้วหรือสร้างใหม่
 *
 * ใช้ร่วมกันทั้ง sync-reviews.ts (จาก now_playing) และ sync-platforms.ts
 * (จาก discover by provider) เพื่อไม่ให้ logic การสร้างหนังซ้ำกันสองที่
 */
export async function ensureMovieExists(tmdbId: number): Promise<string | null> {
  const { data: existing } = await supabase
    .from("movies")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  console.log("พบหนังใหม่ tmdb_id=" + tmdbId + " ที่ยังไม่มีในระบบ กำลังสร้าง");

  const bundle = await fetchMovieBundle(tmdbId);
  const { detail, credits, releaseDates, videos, watchProviders } = bundle;

  const director = credits?.crew?.find((c: any) => c.job === "Director")?.name ?? null;
  const topCast = (credits?.cast ?? []).slice(0, 5).map((c: any) => c.name);
  const englishTitle = await fetchEnglishTitle(tmdbId);
  // No Thai title on TMDB (detail.title comes back Korean/Chinese/...): use the English one.
  const titleTh =
    isUntranslatedTitle(detail.title) && englishTitle && !isUntranslatedTitle(englishTitle)
      ? englishTitle
      : detail.title;

  const ctx: MovieContext = {
    titleTh,
    titleOriginal: detail.original_title,
    overviewEn: detail.overview,
    genres: (detail.genres ?? []).map((g: any) => g.name),
    releaseDate: detail.release_date,
    runtime: detail.runtime,
    voteAverage: detail.vote_average,
    certification: extractThaiCertification(releaseDates),
    topCast,
    director,
  };

  const { data: movieRow, error: movieErr } = await supabase
    .from("movies")
    .insert({
      tmdb_id: tmdbId,
      slug: makeMovieSlug(tmdbId, englishTitle, detail.original_title),
      title_th: ctx.titleTh,
      title_original: ctx.titleOriginal,
      release_date: ctx.releaseDate,
      runtime: ctx.runtime,
      poster_path: detail.poster_path,
      backdrop_path: detail.backdrop_path,
      vote_average: ctx.voteAverage,
      vote_count: detail.vote_count,
      popularity: detail.popularity,
      certification_th: ctx.certification,
      trailer_youtube_key: extractTrailerKey(videos),
      status: "draft",
      tmdb_synced_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (movieErr || !movieRow) {
    console.error("insert หนัง tmdb_id=" + tmdbId + " ไม่สำเร็จ:", movieErr?.message);
    return null;
  }

  for (const g of detail.genres ?? []) {
    await supabase.from("genres").upsert({ id: g.id, name_th: g.name });
    await supabase.from("movie_genres").insert({ movie_id: movieRow.id, genre_id: g.id });
  }
  const castList = (credits?.cast ?? []).slice(0, 10);
  // Korean/Chinese casts come back in native script; prefer the English names.
  const englishCast = castList.some((c: any) => isUntranslatedTitle(c.name))
    ? await fetchEnglishCastNames(tmdbId)
    : new Map<number, string>();
  for (const [i, c] of castList.entries()) {
    const english = englishCast.get(c.id);
    await supabase.from("movie_cast").insert({
      movie_id: movieRow.id,
      person_tmdb_id: c.id,
      name: isUntranslatedTitle(c.name) && english ? english : c.name,
      character: c.character,
      billing_order: i,
    });
  }

  const providerIds = extractThaiProviders(watchProviders);
  if (providerIds.length > 0) {
    const { data: knownProviders } = await supabase
      .from("providers")
      .select("id, data_confidence")
      .in("id", providerIds);

    for (const p of knownProviders ?? []) {
      await supabase.from("movie_providers").insert({
        movie_id: movieRow.id,
        provider_id: p.id,
        verified_by_human: p.data_confidence === "high",
      });
    }
  }

  try {
    const generated = await generateMovieContent(ctx);
    await supabase.from("ai_content").insert({
      movie_id: movieRow.id,
      meta_title: generated.metaTitle,
      meta_description: generated.metaDescription,
      review_body: generated.reviewBody,
      pros_cons: { pros: generated.pros, cons: generated.cons },
      faq: generated.faq,
      ai_model_used: "claude-sonnet-4-6",
    });
    await supabase.from("movies").update({ status: "ai_generated" }).eq("id", movieRow.id);
    console.log("สร้างรีวิว " + ctx.titleTh + " สำเร็จ (รอตรวจก่อน publish)");
  } catch (err) {
    console.error("AI generate เนื้อหาให้ " + ctx.titleTh + " ไม่สำเร็จ:", err);
  }

  return movieRow.id;
}