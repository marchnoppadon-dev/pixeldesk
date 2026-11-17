import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#13090f",
  surf: "#1f1419",
  card: "#1f1419",
  cardBorder: "#3d2a35",
  accent: "#ff7a5c",
  text: "#f5f0e8",
  muted: "#b8a8b8",
};

interface Provider {
  id: number;
  name: string;
  slug: string;
  description_th: string | null;
  long_content_th: string | null;
}

interface ProviderMovie {
  slug: string;
  title_th: string;
  poster_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  blurb: string | null;
}

export const revalidate = 3600;

// Empty list + revalidate = render each platform on first visit, then serve it from cache.
export async function generateStaticParams() {
  return [];
}

const SITE_URL = "https://pixeldeskth.com";

function thaiMonthYear(d = new Date()) {
  return d.toLocaleDateString("th-TH", { month: "long", year: "numeric", timeZone: "Asia/Bangkok" });
}

async function getProvider(slug: string): Promise<Provider | null> {
  const { data } = await supabase
    .from("providers")
    .select("id, name, slug, description_th, long_content_th")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

async function getAllProviders(): Promise<{ name: string; slug: string }[]> {
  const { data } = await supabase.from("providers").select("name, slug").order("name");
  return data ?? [];
}

async function getMoviesForProvider(providerId: number): Promise<ProviderMovie[]> {
  const { data } = await supabase
    .from("movie_providers")
    .select(
      "movies(slug, title_th, poster_path, vote_average, release_date, status, ai_content(meta_description))"
    )
    .eq("provider_id", providerId)
    .eq("is_active", true);

  const seen = new Set<string>();
  return (data ?? [])
    .map((row: any) => row.movies)
    .filter((m: any) => m && m.status === "published" && !seen.has(m.slug) && seen.add(m.slug))
    .map((m: any) => {
      const ai = Array.isArray(m.ai_content) ? m.ai_content[0] : m.ai_content;
      return { ...m, blurb: ai?.meta_description ?? null } as ProviderMovie;
    });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return {};

  const name = provider.name.toUpperCase();
  const month = thaiMonthYear();
  return {
    title: `แนะนำหนัง ${name} ดูอะไรดี (${month})`,
    description: `หนัง ${name} ดูอะไรดี? รวมหนังใหม่และหนังคะแนนสูงบน ${name} ในไทย พร้อมรีวิวภาษาไทยสั้นๆ ทุกเรื่อง อัปเดต${month}`,
    alternates: { canonical: "/platforms/" + slug },
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) notFound();

  const movies = await getMoviesForProvider(provider.id);
  const allProviders = await getAllProviders();
  const otherProviders = allProviders.filter((p) => p.slug !== provider.slug);

  const name = provider.name.toUpperCase();
  const month = thaiMonthYear();
  const newest = [...movies]
    .filter((m) => m.release_date)
    .sort((a, b) => (b.release_date! > a.release_date! ? 1 : -1))
    .slice(0, 6);
  const topRated = [...movies]
    .filter((m) => (m.vote_average ?? 0) > 0)
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    .slice(0, 6);
  const pageUrl = `${SITE_URL}/platforms/${provider.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `แนะนำหนัง ${name} ดูอะไรดี`,
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "แพลตฟอร์ม", item: `${SITE_URL}/platforms` },
          { "@type": "ListItem", position: 3, name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem" }}>
        <Link
          href="/"
          className={pixelFont.className}
          style={{ fontSize: 13, color: "#fff", padding: "4px 10px", border: "3px solid #000", background: "#000", borderRadius: 3, textDecoration: "none" }}
        >
          PIXELDESK
        </Link>
        <nav style={{ display: "flex", gap: 18, fontSize: 13, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>
            หน้าแรก
          </Link>
        </nav>
      </div>

      <nav style={{ fontSize: 12, color: COLORS.muted, padding: "0 1.5rem", marginBottom: "0.5rem" }}>
        <Link href="/" style={{ color: COLORS.muted }}>
          หน้าแรก
        </Link>{" "}
        /{" "}
        <Link href="/platforms" style={{ color: COLORS.muted }}>
          แพลตฟอร์ม
        </Link>{" "}
        / {provider.name.toUpperCase()}
      </nav>

      <div
        style={{
          background: "linear-gradient(160deg, " + COLORS.surf + " 0%, " + COLORS.bg + " 75%)",
          padding: "2.5rem 1.5rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid " + COLORS.cardBorder,
        }}
      >
        <p className={pixelFont.className} style={{ fontSize: 10, color: COLORS.accent, margin: "0 0 10px", letterSpacing: 2 }}>
          แพลตฟอร์มสตรีมมิ่ง
        </p>
        <h1 style={{ fontSize: 24, color: "#fff", margin: "0 0 10px", lineHeight: 1.4, fontWeight: 700 }}>
          แนะนำหนัง {name} ดูอะไรดี
        </h1>
        <p style={{ fontSize: 12, color: COLORS.accent, margin: "0 0 8px" }}>อัปเดต{month}</p>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 6px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          {movies.length > 0
            ? "รวมหนัง " + movies.length + " เรื่องที่ดูได้บน " + provider.name.toUpperCase()
            : "เร็วๆนี้ — กำลังรวบรวมหนังบนแพลตฟอร์มนี้"}
        </p>
        {provider.description_th && (
          <p style={{ fontSize: 14, color: COLORS.muted, margin: 0, lineHeight: 1.7, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {provider.description_th}
          </p>
        )}
      </div>

      <div style={{ padding: "0 1.5rem 3rem" }}>
        {newest.length > 0 && (
          <PickList
            heading={`หนังใหม่บน ${name} ที่น่าดู`}
            intro={`หนังที่เพิ่งเข้า ${name} ล่าสุด เรียงจากใหม่ไปเก่า พร้อมสรุปสั้นๆ ว่าเรื่องไหนเหมาะกับใคร`}
            movies={newest}
          />
        )}
        {topRated.length > 0 && (
          <PickList
            heading={`หนัง ${name} คะแนนสูงสุด`}
            intro={`ถ้ายังไม่รู้จะดูอะไรบน ${name} เริ่มจากเรื่องที่คนดูให้คะแนนสูงสุดเหล่านี้ (คะแนนจาก TMDB)`}
            movies={topRated}
          />
        )}

        <h2 style={{ fontSize: 17, color: "#fff", margin: "2rem 0 12px", fontWeight: 700 }}>
          หนังทั้งหมดบน {name} ({movies.length} เรื่อง)
        </h2>
        {movies.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            ยังไม่มีหนังที่รีวิวแล้วบนแพลตฟอร์มนี้ กลับมาเช็คใหม่เร็วๆนี้
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 10,
            }}
          >
            {movies.map((m) => (
              <Link
                key={m.slug}
                href={"/movies/" + m.slug}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    background: COLORS.surf,
                    border: "1px solid " + COLORS.cardBorder,
                    borderBottom: "none",
                    borderRadius: "6px 6px 0 0",
                    overflow: "hidden",
                  }}
                >
                  {m.poster_path && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={"https://image.tmdb.org/t/p/w300" + m.poster_path}
                      alt={m.title_th}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div
                  style={{
                    background: COLORS.card,
                    border: "1px solid " + COLORS.cardBorder,
                    borderTop: "none",
                    borderRadius: "0 0 6px 6px",
                    padding: 8,
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m.title_th}
                  </p>
                  {!!m.vote_average && m.vote_average > 0 && (
                    <span style={{ color: COLORS.accent, fontSize: 10 }}>
                      ★ {Number(m.vote_average).toFixed(1)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {otherProviders.length > 0 && (
          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid " + COLORS.cardBorder }}>
            <p className={pixelFont.className} style={{ fontSize: 11, color: COLORS.text, margin: "0 0 12px" }}>
              ดูแพลตฟอร์มอื่น
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {otherProviders.map((p) => (
                <Link
                  key={p.slug}
                  href={"/platforms/" + p.slug}
                  style={{
                    background: COLORS.surf,
                    border: "1px solid " + COLORS.cardBorder,
                    color: COLORS.text,
                    fontSize: 12,
                    padding: "6px 14px",
                    borderRadius: 20,
                    textDecoration: "none",
                  }}
                >
                  {p.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        )}

        {provider.long_content_th && (
          <div style={{ marginTop: "3rem", maxWidth: 760 }}>
            <h2 style={{ fontSize: 17, color: "#fff", margin: "0 0 14px", lineHeight: 1.6, fontWeight: 700 }}>
              {name} ดูอะไรดี? คู่มือเลือกหนังฉบับย่อ
            </h2>
            {provider.long_content_th.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** A short, text-first list: unique per platform and readable by search engines. */
function PickList({
  heading,
  intro,
  movies,
}: {
  heading: string;
  intro: string;
  movies: ProviderMovie[];
}) {
  return (
    <section style={{ marginBottom: "2rem", maxWidth: 760 }}>
      <h2 style={{ fontSize: 17, color: "#fff", margin: "0 0 6px", fontWeight: 700 }}>{heading}</h2>
      <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 12px", lineHeight: 1.6 }}>{intro}</p>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {movies.map((m) => (
          <li key={m.slug} style={{ marginBottom: 12, lineHeight: 1.6 }}>
            <Link href={"/movies/" + m.slug} style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>
              {m.title_th}
            </Link>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>
              {m.release_date ? ` · ${m.release_date.slice(0, 4)}` : ""}
              {m.vote_average ? ` · ★ ${Number(m.vote_average).toFixed(1)}` : ""}
            </span>
            {m.blurb && (
              <p style={{ fontSize: 13, color: COLORS.muted, margin: "2px 0 0" }}>{m.blurb}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}