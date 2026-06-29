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

async function getProviders() {
  const { data } = await supabase.from("providers").select("id, name, slug").order("name");
  return data ?? [];
}

export const metadata: Metadata = {
  title: "แพลตฟอร์มสตรีมมิ่งทั้งหมด",
  description: "เลือกแพลตฟอร์มสตรีมมิ่ง Netflix, HBO Max, Apple TV, Viu และอื่นๆ ดูว่ามีหนังเรื่องไหนน่าดูบ้าง",
};

export default async function PlatformsListPage() {
  const providers = await getProviders();

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
          เลือกแพลตฟอร์ม
        </p>
        <h1 className={pixelFont.className} style={{ fontSize: 20, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
          ดูหนังแพลตฟอร์มไหนดี
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 24px", maxWidth: 640 }}>
          รวมแพลตฟอร์มสตรีมมิ่งทั้งหมดที่เรารีวิว เลือกแพลตฟอร์มที่ใช้อยู่
          แล้วดูว่ามีหนังเรื่องไหนน่าดูบ้าง อัปเดตทุกวัน
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {providers.map((p, i) => {
            const bg = CARD_COLORS[p.id % CARD_COLORS.length];
            return (
              <Link
                key={p.slug}
                href={"/platforms/" + p.slug}
                style={{
                  background: bg,
                  borderRadius: 10,
                  padding: 20,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 80,
                }}
              >
                <span
                  className={pixelFont.className}
                  style={{ fontSize: 14, color: CARD_TEXT[bg], textAlign: "center" }}
                >
                  {p.name.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}