"use client";

import { useMemo, useState } from "react";

interface Option {
  slug: string;
  title_th: string;
}

export default function WidgetBuilder({
  movies,
  initialSlug,
  siteUrl,
}: {
  movies: Option[];
  initialSlug: string | null;
  siteUrl: string;
}) {
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState(
    initialSlug && movies.some((m) => m.slug === initialSlug) ? initialSlug : movies[0]?.slug ?? ""
  );
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? movies.filter((m) => m.title_th.toLowerCase().includes(q)).slice(0, 50) : movies.slice(0, 50);
  }, [movies, query]);

  const movie = movies.find((m) => m.slug === slug);
  // The credit link sits outside the iframe so it belongs to the host page. It uses the
  // plain brand name (no keyword-stuffed anchor) and the host may edit or remove it.
  const code = movie
    ? [
        `<iframe src="${siteUrl}/embed/${movie.slug}" title="${movie.title_th.replace(/"/g, "&quot;")} ดูได้ที่ไหน" width="100%" height="190" style="border:0;max-width:520px;border-radius:12px" loading="lazy"></iframe>`,
        `<p style="font-size:12px;margin:4px 0 0">ข้อมูลแพลตฟอร์มจาก <a href="${siteUrl}/movies/${movie.slug}">pixeldesk</a></p>`,
      ].join("\n")
    : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <label htmlFor="q" style={{ fontSize: 13, color: "#b8a8b8" }}>
          1. ค้นหาหนัง
        </label>
        <input
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="พิมพ์ชื่อหนัง เช่น Harbin, ทอย สตอรี่"
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #3d2a35",
            background: "#1f1419",
            color: "#f5f0e8",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
        <select
          aria-label="เลือกหนัง"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          size={6}
          style={{
            display: "block",
            width: "100%",
            marginTop: 8,
            borderRadius: 8,
            border: "1px solid #3d2a35",
            background: "#1f1419",
            color: "#f5f0e8",
            fontSize: 14,
            padding: 4,
          }}
        >
          {filtered.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.title_th}
            </option>
          ))}
        </select>
      </div>

      {movie && (
        <>
          <div>
            <p style={{ fontSize: 13, color: "#b8a8b8", margin: "0 0 6px" }}>2. ตัวอย่าง</p>
            <iframe
              key={movie.slug}
              src={`/embed/${movie.slug}`}
              title={`${movie.title_th} ดูได้ที่ไหน`}
              width="100%"
              height={190}
              style={{ border: 0, maxWidth: 520, borderRadius: 12 }}
            />
          </div>
          <div>
            <p style={{ fontSize: 13, color: "#b8a8b8", margin: "0 0 6px" }}>3. คัดลอกโค้ดไปวางในบทความ (โหมด HTML)</p>
            <textarea
              readOnly
              value={code}
              rows={5}
              onFocus={(e) => e.currentTarget.select()}
              style={{
                width: "100%",
                fontFamily: "ui-monospace, Consolas, monospace",
                fontSize: 12,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #3d2a35",
                background: "#13090f",
                color: "#f5f0e8",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={copy}
              style={{
                marginTop: 8,
                background: "#ff7a5c",
                color: "#3d1006",
                border: 0,
                borderRadius: 6,
                padding: "8px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copied ? "คัดลอกแล้ว ✓" : "คัดลอกโค้ด"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
