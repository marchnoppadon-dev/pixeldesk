import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#1c1320",
  surf: "#2a2030",
  gold: "#ffd24a",
  text: "#f5f0e8",
  muted: "#b8a8b8",
};
const CARD_COLORS = ["#e0608f", "#e0a83c", "#8b7fd1", "#2bb89c", "#3a8bd8"];
const CARD_TEXT: Record<string, string> = {
  "#e0608f": "#3d1428",
  "#e0a83c": "#412a06",
  "#8b7fd1": "#241f57",
  "#2bb89c": "#0a3b30",
  "#3a8bd8": "#0c2c4d",
};

interface Provider {
  id: number;
  name: string;
  slug: string;
  description_th: string | null;
}

interface ProviderMovie {
  slug: string;
  title_th: string;
  poster_path: string | null;
  vote_average: number | null;
}

async function getProvider(slug: string): Promise<Provider | null> {
  const { data } = await supabase
    .from("providers")
    .select("id, name, slug, description_th")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

async function getMoviesForProvider(providerId: number): Promise<ProviderMovie[]> {
  const { data } = await supabase
    .from("movie_providers")
    .select("movies(slug, title_th, poster_path, vote_average, status)")
    .eq("provider_id", providerId)
    .eq("is_active", true);

  return (data ?? [])
    .map((row: any) => row.movies)
    .filter((m: any) => m && m.status === "published");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return {};

  return {
    title: "หนังบน " + provider.name.toUpperCase() + " ที่น่าดู",
    description:
      "รวมหนังที่ดูได้บน " + provider.name.toUpperCase() + " พร้อมรีวิวภาษาไทย อัปเดตล่าสุด",
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
  const heroColor = CARD_COLORS[provider.id % CARD_COLORS.length];
  const heroText = CARD_TEXT[heroColor];

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
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

      <div
        style={{
          background: heroColor,
          padding: "2.5rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <p className={pixelFont.className} style={{ fontSize: 10, color: heroText, margin: "0 0 10px", opacity: 0.8 }}>
          แพลตฟอร์มสตรีมมิ่ง
        </p>
        <p className={pixelFont.className} style={{ fontSize: 24, color: heroText, margin: "0 0 8px", lineHeight: 1.5 }}>
          {provider.name.toUpperCase()}
        </p>
        <p style={{ fontSize: 14, color: heroText, margin: "0 0 6px", opacity: 0.85 }}>
          {movies.length > 0
            ? "รวมหนัง " + movies.length + " เรื่องที่ดูได้บน " + provider.name.toUpperCase()
            : "เร็วๆนี้ — กำลังรวบรวมหนังบนแพลตฟอร์มนี้"}
        </p>
        {provider.description_th && (
          <p style={{ fontSize: 14, color: heroText, margin: 0, opacity: 0.9, lineHeight: 1.7, maxWidth: 640 }}>
            {provider.description_th}
          </p>
        )}
      </div>

      <div style={{ padding: "0 1.5rem 3rem" }}>
        {movies.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            ยังไม่มีหนังที่รีวิวแล้วบนแพลตฟอร์มนี้ กลับมาเช็คใหม่เร็วๆนี้
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            {movies.map((m, i) => {
              const bg = CARD_COLORS[i % CARD_COLORS.length];
              return (
                <Link
                  key={m.slug}
                  href={"/movies/" + m.slug}
                  style={{
                    background: bg,
                    borderRadius: 10,
                    padding: 10,
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 160,
                      background: "rgba(0,0,0,0.15)",
                      borderRadius: 5,
                      marginBottom: 8,
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
                  <p className={pixelFont.className} style={{ fontSize: 9, color: CARD_TEXT[bg], margin: "0 0 6px", lineHeight: 1.5 }}>
                    {m.title_th}
                  </p>
                  {m.vote_average !== null && (
                    <span style={{ color: CARD_TEXT[bg], fontSize: 11 }}>
                      ★ {Number(m.vote_average).toFixed(1)}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}