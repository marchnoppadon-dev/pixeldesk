import { supabase } from "./supabase";

/**
 * IndexNow tells Bing, Yandex, Naver, Seznam (and through Bing, ChatGPT/Copilot search)
 * about new or changed URLs immediately instead of waiting for a crawl. Google does not
 * use IndexNow; it relies on the sitemap.
 *
 * The key is public by design: search engines verify it by fetching /<key>.txt.
 */
export const INDEXNOW_KEY = "1eee33af6f270b22a7236ca660420c28";
const HOST = "pixeldeskth.com";
const SITE_URL = `https://${HOST}`;

/** Submit site paths (e.g. "/movies/harbin-610251"). Never throws; returns the HTTP status. */
export async function submitToIndexNow(paths: string[]): Promise<number | null> {
  const urlList = [...new Set(paths)].map((p) => (p.startsWith("http") ? p : SITE_URL + p));
  if (urlList.length === 0) return null;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlList.slice(0, 10000),
      }),
    });
    console.log("[indexnow] submitted", urlList.length, "urls, status", res.status);
    return res.status;
  } catch (err) {
    console.error("[indexnow] submit failed", err);
    return null;
  }
}

/** Submit the review pages of the given movie ids plus the pages that list them. */
export async function submitMoviesToIndexNow(movieIds: string[]) {
  if (movieIds.length === 0) return null;
  const { data } = await supabase.from("movies").select("slug").in("id", movieIds);
  const paths = (data ?? []).map((m) => `/movies/${m.slug}`);
  return submitToIndexNow([...paths, "/", "/movies", "/new"]);
}
