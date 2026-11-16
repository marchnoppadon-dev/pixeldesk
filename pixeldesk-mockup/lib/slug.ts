/**
 * Movie URL slugs look like `mariah-careys-magical-christmas-special-766319`:
 * a readable Latin title followed by the TMDB id. The id suffix keeps slugs unique
 * and lets old URLs (`movie-766319`, or a slug whose title part changed) be
 * resolved and 301-redirected to the current slug.
 */

const MAX_TITLE_LENGTH = 60;

export function latinSlug(title: string | null | undefined): string {
  if (!title) return "";
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents: é -> e
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "") // "Carey's" -> "careys"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= MAX_TITLE_LENGTH) return slug;
  const cut = slug.slice(0, MAX_TITLE_LENGTH);
  return cut.slice(0, cut.lastIndexOf("-") > 20 ? cut.lastIndexOf("-") : MAX_TITLE_LENGTH);
}

/** Build a slug from the first title candidate that has enough Latin characters. */
export function makeMovieSlug(tmdbId: number, ...titles: (string | null | undefined)[]): string {
  for (const t of titles) {
    const s = latinSlug(t);
    // Need real words, not just leftover digits (e.g. "寒戰1994" -> "1994").
    if (s.length >= 2 && /[a-z]/.test(s)) return `${s}-${tmdbId}`;
  }
  return `movie-${tmdbId}`;
}

/** Extract the TMDB id from any slug format we have ever used. */
export function tmdbIdFromSlug(slug: string): number | null {
  const m = /(?:^movie-|-)(\d+)$/.exec(slug) ?? /^(\d+)$/.exec(slug);
  return m ? Number(m[1]) : null;
}
