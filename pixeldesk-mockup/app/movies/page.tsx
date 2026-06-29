import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#1c1320",
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

async function getAllMovies() {
  const { data } = await supabase
    .from("movies")
    .select("slug, title_th, poster_path, vote_average")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export const metadata: Metadata = {
  title: "รีวิวหนังทั้งหมด",
  description: "รวมรีวิวหนังภาษาไทยทุกเรื่อง พร้อมเช็คว่าดูได้ที่ไหนบ้าง อัปเดตทุกวัน",
};

export default async function MoviesListPage() {
  const movies = await getAllMovies();

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
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>หน้าแรก</Link>
        </nav>
      </div>

      <div style={{ padding: "2rem 1.5rem" }}>
        <p className={pixelFont.className} style={{ fontSize: 9, color: "#ffd24a", margin: "0 0 10px" }}>
          รีวิวหนังทั้งหมด
        </p>
        <h1 className={pixelFont.className} style={{ fontSize: 20, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
          รวมรีวิวหนัง {movies.length} เรื่อง
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 24px", maxWidth: 640 }}>
          รีวิวหนังภาษาไทยต้นฉบับทุกเรื่อง พร้อมสปอยล์ เรื่องย่อ และเช็คว่าดูได้ที่ไหนบ้าง
        </p>

        {movies.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>ยังไม่มีรีวิวหนังตอนนี้</p>
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