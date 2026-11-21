import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { SITE_URL } from "../../lib/widget";
import WidgetBuilder from "./WidgetBuilder";

export const metadata: Metadata = {
  title: "Widget ฟรี: บอกผู้อ่านว่าหนังดูได้ที่ไหน สำหรับบล็อกและเพจหนัง",
  description:
    "ฝังกล่อง 'ดูได้ที่ไหน' ลงในบทความรีวิวหนังของคุณฟรี บอกว่าหนังเรื่องนั้นอยู่บน Netflix, HBO Max, Apple TV+ หรือ Viu อัปเดตอัตโนมัติ ไม่ต้องสมัคร",
  alternates: { canonical: "/widget" },
};

async function getMovies() {
  const { data } = await supabase
    .from("movies")
    .select("slug, title_th")
    .eq("status", "published")
    .order("release_date", { ascending: false });
  return data ?? [];
}

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ movie?: string }>;
}) {
  const { movie } = await searchParams;
  const movies = await getMovies();

  return (
    <div style={{ background: "#13090f", color: "#f5f0e8", minHeight: "100vh" }}>
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: 18, fontSize: 13 }}>
        <Link href="/" style={{ color: "#f5f0e8", textDecoration: "none", fontWeight: 700 }}>
          PIXELDESK
        </Link>
        <Link href="/new" style={{ color: "#f5f0e8", textDecoration: "none" }}>หนังใหม่เดือนนี้</Link>
        <Link href="/platforms" style={{ color: "#f5f0e8", textDecoration: "none" }}>แพลตฟอร์ม</Link>
      </div>

      <div style={{ padding: "0 1.5rem 3rem", maxWidth: 720 }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.4, margin: "1rem 0 10px", fontWeight: 700 }}>
          Widget ฟรี: บอกผู้อ่านว่าหนังดูได้ที่ไหน
        </h1>
        <p style={{ fontSize: 14, color: "#b8a8b8", lineHeight: 1.8, margin: "0 0 8px" }}>
          เขียนรีวิวหนังอยู่ใช่ไหม? คำถามแรกที่ผู้อ่านถามเสมอคือ &quot;เรื่องนี้ดูได้ที่ไหน&quot;
          ฝังกล่องนี้ลงในบทความ ผู้อ่านจะเห็นทันทีว่าหนังอยู่บน Netflix, HBO Max, Apple TV+ หรือ Viu
        </p>
        <ul style={{ fontSize: 14, color: "#b8a8b8", lineHeight: 1.8, margin: "0 0 24px", paddingLeft: 20 }}>
          <li>ฟรี ไม่ต้องสมัคร ไม่มีโฆษณา</li>
          <li>ข้อมูลอัปเดตอัตโนมัติเมื่อหนังย้ายแพลตฟอร์ม</li>
          <li>ใช้ได้กับ WordPress, Blogger, Blockdit (โหมด HTML) และเว็บทั่วไป</li>
        </ul>

        <WidgetBuilder movies={movies} initialSlug={movie ?? null} siteUrl={SITE_URL} />

        <p style={{ fontSize: 12, color: "#b8a8b8", lineHeight: 1.7, marginTop: 28 }}>
          โค้ดมีลิงก์เครดิต &quot;ข้อมูลแพลตฟอร์มจาก pixeldesk&quot; ใต้กล่อง แก้ไขหรือลบได้ตามต้องการ
          ข้อมูลแพลตฟอร์มอ้างอิงจาก TMDB และการตรวจสอบของทีมงาน อาจคลาดเคลื่อนได้ตามการเปลี่ยนแปลงของแต่ละแพลตฟอร์ม
        </p>
      </div>
    </div>
  );
}
