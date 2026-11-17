/**
 * Decides whether a movie review page is good enough to ask Google to index.
 *
 * Search Console showed Google crawling most review pages and choosing not to index
 * them ("Crawled - currently not indexed"). Thin or broken pages drag down how Google
 * rates the whole site, so they stay reachable for visitors but get `noindex` and are
 * left out of the sitemap until they are improved.
 */

export const MIN_REVIEW_CHARS = 1200;

export interface QualityInput {
  title_th: string | null;
  vote_average: number | null;
  review_body: string | null | undefined;
}

const THAI = /[฀-๿]/;
// CJK, Hangul, Devanagari, Cyrillic, Arabic: a "Thai title" in these scripts was never translated.
const UNTRANSLATED = /[぀-ヿ㐀-鿿가-힯ऀ-ॿЀ-ӿ؀-ۿ]/;

export function qualityIssues(m: QualityInput): string[] {
  const issues: string[] = [];
  const review = (m.review_body ?? "").trim();
  if (review.length < MIN_REVIEW_CHARS) issues.push("review too short");
  // A missing TMDB score is not a quality problem: many Thai films have no votes yet.
  const title = m.title_th ?? "";
  if (UNTRANSLATED.test(title) && !THAI.test(title.replace(/\(.*?\)/g, ""))) {
    issues.push("untranslated title");
  }
  return issues;
}

export function isIndexable(m: QualityInput): boolean {
  return qualityIssues(m).length === 0;
}
