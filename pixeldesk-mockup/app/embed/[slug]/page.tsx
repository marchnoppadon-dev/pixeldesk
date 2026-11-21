import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWidgetMovie, SITE_URL } from "../../../lib/widget";

// Rendered inside other sites' iframes: small, fast, cached, and kept out of Google's
// index (the full review page is the one we want ranked).
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getWidgetMovie(slug);
  return {
    title: movie ? `${movie.title_th} ดูได้ที่ไหน` : "pixeldesk",
    robots: { index: false, follow: true },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = await getWidgetMovie(slug);
  if (!movie) notFound();

  const page = `${SITE_URL}/movies/${movie.slug}`;
  const year = movie.release_date?.slice(0, 4);

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        background: "#1f1419",
        color: "#f5f0e8",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Noto Sans Thai', sans-serif",
        borderRadius: 12,
        border: "1px solid #3d2a35",
        minHeight: 166,
        boxSizing: "border-box",
      }}
    >
      {movie.poster_path && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          alt={movie.title_th}
          width={96}
          height={142}
          style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
          {movie.title_th}
          <span style={{ color: "#b8a8b8", fontWeight: 400, fontSize: 12 }}>
            {year ? ` (${year})` : ""}
            {movie.vote_average && movie.vote_average > 0 ? ` · ★ ${movie.vote_average.toFixed(1)}` : ""}
          </span>
        </p>
        <p style={{ margin: "8px 0 6px", fontSize: 12, color: "#ff7a5c", fontWeight: 600 }}>ดูได้ที่ไหนในไทย</p>
        {movie.providers.length > 0 ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {movie.providers.map((p) => (
              <a
                key={p.slug}
                href={`${SITE_URL}/platforms/${p.slug}`}
                target="_blank"
                rel="noopener"
                style={{
                  background: "#ff7a5c",
                  color: "#3d1006",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                {p.name.toUpperCase()}
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 12, color: "#b8a8b8" }}>ยังไม่มีบนสตรีมมิ่งในไทย</p>
        )}
        <a
          href={page}
          target="_blank"
          rel="noopener"
          style={{ marginTop: "auto", paddingTop: 8, fontSize: 12, color: "#f5f0e8" }}
        >
          อ่านรีวิวเต็มที่ pixeldesk →
        </a>
      </div>
    </div>
  );
}
