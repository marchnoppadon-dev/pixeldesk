import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#13090f",
  surf: "#1f1419",
  cardBorder: "#3d2a35",
  accent: "#ff7a5c",
  text: "#f5f0e8",
  muted: "#b8a8b8",
};

const SITE_URL = "https://pixeldeskth.com";
// Streaming lags cinema release by months, so "new on streaming" looks back a year,
// while "not on streaming yet" only covers recent releases.
const STREAMING_WINDOW_DAYS = 365;
const THEATRICAL_WINDOW_DAYS = 120;

export const revalidate = 3600;

interface NewMovie {
  slug: string;
  title_th: string;
  release_date: string;
  vote_average: number | null;
  blurb: string | null;
  providers: { name: string; slug: string }[];
}

function thaiMonthYear(d = new Date()) {
  return d.toLocaleDateString("th-TH", { month: "long", year: "numeric", timeZone: "Asia/Bangkok" });
}

function thaiDate(iso: string) {
  return new Date(iso + "T00:00:00+07:00").toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  });
}

async function getNewMovies(): Promise<NewMovie[]> {
  const since = new Date(Date.now() - STREAMING_WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("movies")
    .select(
      "slug, title_th, release_date, vote_average, ai_content(meta_description), movie_providers(is_active, providers(name, slug))"
    )
    .eq("status", "published")
    .gte("release_date", since)
    .lte("release_date", today)
    .order("release_date", { ascending: false })
    .limit(120);

  return (data ?? []).map((m: any) => {
    const ai = Array.isArray(m.ai_content) ? m.ai_content[0] : m.ai_content;
    const providers = (m.movie_providers ?? [])
      .filter((mp: any) => mp.is_active !== false && mp.providers)
      .map((mp: any) => mp.providers)
      .filter((p: any, i: number, all: any[]) => all.findIndex((q) => q.slug === p.slug) === i);
    return {
      slug: m.slug,
      title_th: m.title_th,
      release_date: m.release_date,
      vote_average: m.vote_average,
      blurb: ai?.meta_description ?? null,
      providers,
    };
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const month = thaiMonthYear();
  return {
    title: `หนังใหม่ ${month} ดูที่ไหน? Netflix, HBO Max, Apple TV+, Viu`,
    description: `รวมหนังใหม่ล่าสุด${month} พร้อมบอกว่าดูได้บนแพลตฟอร์มไหน Netflix, HBO Max, Apple TV+ หรือ Viu และรีวิวสั้นภาษาไทยทุกเรื่อง`,
    alternates: { canonical: "/new" },
  };
}

export default async function NewMoviesPage() {
  const month = thaiMonthYear();
  const all = await getNewMovies();
  const theatricalSince = new Date(Date.now() - THEATRICAL_WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const streaming = all.filter((m) => m.providers.length > 0).slice(0, 40);
  const notYet = all.filter((m) => m.providers.length === 0 && m.release_date >= theatricalSince);
  const movies = [...streaming, ...notYet];

  const byPlatform = new Map<string, { name: string; slug: string; movies: NewMovie[] }>();
  for (const m of streaming) {
    for (const p of m.providers) {
      if (!byPlatform.has(p.slug)) byPlatform.set(p.slug, { ...p, movies: [] });
      byPlatform.get(p.slug)!.movies.push(m);
    }
  }
  const platforms = [...byPlatform.values()].sort((a, b) => b.movies.length - a.movies.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `${SITE_URL}/new`,
    name: `หนังใหม่ ${month}`,
    inLanguage: "th",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: movies.length,
      itemListElement: movies.slice(0, 30).map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/movies/${m.slug}`,
        name: m.title_th,
      })),
    },
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem" }}>
        <Link
          href="/"
          className={pixelFont.className}
          style={{ fontSize: 13, color: "#fff", padding: "4px 10px", border: "3px solid #000", background: "#000", borderRadius: 3, textDecoration: "none" }}
        >
          PIXELDESK
        </Link>
        <nav style={{ display: "flex", gap: 18, fontSize: 13 }}>
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>หน้าแรก</Link>
          <Link href="/platforms" style={{ color: COLORS.text, textDecoration: "none" }}>แพลตฟอร์ม</Link>
        </nav>
      </div>

      <div style={{ padding: "1rem 1.5rem 3rem", maxWidth: 820 }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / หนังใหม่
        </nav>
        <h1 style={{ fontSize: 26, color: "#fff", margin: "0 0 10px", lineHeight: 1.4, fontWeight: 700 }}>
          หนังใหม่ {month} ดูที่ไหนดี
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.7, margin: "0 0 2rem" }}>
          รวมหนังใหม่ที่ดูได้แล้วบนสตรีมมิ่งในไทย {streaming.length} เรื่อง แยกตามแพลตฟอร์มให้เลือกง่ายๆ
          {notYet.length > 0 && <> และหนังเข้าโรงล่าสุดอีก {notYet.length} เรื่องที่ยังไม่เข้าสตรีมมิ่ง</>}{" "}
          พร้อมรีวิวสั้นภาษาไทย อัปเดตอัตโนมัติทุกชั่วโมง
        </p>

        {platforms.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
            {platforms.map((p) => (
              <a
                key={p.slug}
                href={`#${p.slug}`}
                style={{ background: COLORS.surf, border: "1px solid " + COLORS.cardBorder, color: COLORS.text, fontSize: 12, padding: "6px 14px", borderRadius: 20, textDecoration: "none" }}
              >
                {p.name.toUpperCase()} ({p.movies.length})
              </a>
            ))}
          </div>
        )}

        {platforms.map((p) => (
          <section key={p.slug} id={p.slug} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: 19, color: "#fff", margin: "0 0 6px", fontWeight: 700 }}>
              หนังใหม่บน {p.name.toUpperCase()}
            </h2>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 12px" }}>
              {p.movies.length} เรื่องใหม่ที่ดูได้บน {p.name.toUpperCase()} ·{" "}
              <Link href={`/platforms/${p.slug}`} style={{ color: COLORS.accent }}>
                ดูหนังทั้งหมดบน {p.name.toUpperCase()} →
              </Link>
            </p>
            <MovieList movies={p.movies} />
          </section>
        ))}

        {notYet.length > 0 && (
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: 19, color: "#fff", margin: "0 0 6px", fontWeight: 700 }}>
              หนังใหม่ที่ยังไม่เข้าสตรีมมิ่ง
            </h2>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 12px" }}>
              เรื่องเหล่านี้ยังไม่มีบนแพลตฟอร์มในไทย ส่วนใหญ่ยังอยู่ในโรงหรือรอเข้าสตรีมมิ่ง
            </p>
            <MovieList movies={notYet} />
          </section>
        )}
      </div>
    </div>
  );
}

function MovieList({ movies }: { movies: NewMovie[] }) {
  return (
    <ol style={{ margin: 0, paddingLeft: 20 }}>
      {movies.map((m) => (
        <li key={m.slug} style={{ marginBottom: 14, lineHeight: 1.6 }}>
          <Link href={`/movies/${m.slug}`} style={{ color: COLORS.text, fontWeight: 600, fontSize: 15 }}>
            {m.title_th}
          </Link>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>
            {` · ออก ${thaiDate(m.release_date)}`}
            {m.vote_average && m.vote_average > 0 ? ` · ★ ${Number(m.vote_average).toFixed(1)}` : ""}
          </span>
          {m.blurb && <p style={{ fontSize: 13, color: COLORS.muted, margin: "2px 0 0" }}>{m.blurb}</p>}
        </li>
      ))}
    </ol>
  );
}
