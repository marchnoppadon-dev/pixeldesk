import { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";
import { isIndexable } from "../lib/quality";

const BASE_URL = "https://pixeldeskth.com";

// Build on every request (one cheap query) so new/renamed movie slugs show up
// immediately; the time-based cache kept serving the build-time copy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: movieRows } = await supabase
    .from("movies")
    .select("slug, updated_at, title_th, vote_average, ai_content(review_body)")
    .eq("status", "published");

  // Only list pages we want indexed; thin ones are noindex (see lib/quality.ts).
  const movies = (movieRows ?? []).filter((m) => {
    const ai = Array.isArray(m.ai_content) ? m.ai_content[0] : m.ai_content;
    return isIndexable({
      title_th: m.title_th,
      vote_average: m.vote_average,
      review_body: (ai as { review_body?: string | null } | null)?.review_body,
    });
  });

  const { data: providers } = await supabase
    .from("providers")
    .select("slug");

  const movieEntries = (movies ?? []).map((m) => ({
    url: BASE_URL + "/movies/" + m.slug,
    lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const platformEntries = (providers ?? []).map((p) => ({
    url: BASE_URL + "/platforms/" + p.slug,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: BASE_URL + "/movies",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: BASE_URL + "/platforms",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: BASE_URL + "/new",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: BASE_URL + "/widget",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: BASE_URL + "/ranking",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...platformEntries,
    ...movieEntries,
  ];
}