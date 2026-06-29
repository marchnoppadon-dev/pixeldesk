import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

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

function getMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1).toISOString().slice(0, 10);
  const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);
  return { start, end };
}

async function getTopMoviesThisMonth() {
  const { start, end } = getMonthRange();
  const { data } = await supabase
    .from("movies")
    .select("slug, title_th, poster_path, vote_average, release_date")
    .eq("status", "published")
    .gte("release_date", start)
    .lte("release_date", end)
    .order("vote_average", { ascending: false })
    .limit(10);
  return data ?? [];
}

export const metadata: Metadata = {
  title: "จัดอันดับหนังใหม่ประจำเดือน",
  description: "Top 10 หนังใหม่ที่เข้าฉายเดือนนี้ เรียงตามเรตติ้งสูงสุด พร้อมรีวิวภาษาไทย",
};

export default async function RankingPage() {
  const movies = await getTopMoviesThisMonth();
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const now = new Date();
  const monthLabel = monthNames[now.getMonth()] + " " + now.getFullYear();

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
          <Link href="/platforms" style={{ color: COLORS.text, textDecoration: "none" }}>แพลตฟอร์ม</Link>
          <Link href="/movies" style={{ color: COLORS.text, textDecoration: "none" }}>รีวิวหนัง</Link>
        </nav>
      </div>

      <div style={{ padding: "2rem 1.5rem" }}>
        <p className={pixelFont.className} style={{ fontSize: 9, color: COLORS.gold, margin: "0 0 10px" }}>
          จัดอันดับ
        </p>
        <h1 className={pixelFont.className} style={{ fontSize: 20, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
          หนังใหม่แรงสุด ประจำเดือน {monthLabel}
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 24px", maxWidth: 640 }}>
          รวม 10 หนังใหม่ที่เข้าฉายในเดือนนี้ เรียงตามคะแนนเรตติ้งสูงสุด อัปเดตทุกวัน
          พร้อมรีวิวเต็มและเช็คว่าดูได้ที่ไหนบ้าง
        </p>

        {movies.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            ยังไม่มีหนังที่รีวิวแล้วในเดือนนี้ กลับมาเช็คใหม่เร็วๆนี้
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 720 }}>
            {movies.map((m, i) => {
              const bg = CARD_COLORS[i % CARD_COLORS.length];
              return (
                <Link
                  key={m.slug}
                  href={"/movies/" + m.slug}
                  style={{
                    background: bg,
                    borderRadius: 10,
                    padding: 14,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    className={pixelFont.className}
                    style={{ fontSize: 18, color: CARD_TEXT[bg], width: 32, flexShrink: 0 }}
                  >
                    {i + 1}
                  </span>
                  <div
                    style={{
                      width: 56,
                      height: 80,
                      background: "rgba(0,0,0,0.15)",
                      borderRadius: 5,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {m.poster_path && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={"https://image.tmdb.org/t/p/w200" + m.poster_path}
                        alt={m.title_th}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: CARD_TEXT[bg], margin: "0 0 4px" }}>
                      {m.title_th}
                    </p>
                    {m.vote_average !== null && (
                      <span style={{ color: CARD_TEXT[bg], fontSize: 13 }}>
                        ★ {Number(m.vote_average).toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}