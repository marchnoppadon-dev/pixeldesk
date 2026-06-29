import { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const BASE_URL = "https://pixeldeskth.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: movies } = await supabase
    .from("movies")
    .select("slug, updated_at")
    .eq("status", "published");

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
      url: BASE_URL + "/ranking",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...platformEntries,
    ...movieEntries,
  ];
}