"use client";
import { useState } from "react";
import PublishButton from "./PublishButton";
import BulkPublishBar from "./BulkPublishBar";

interface PendingMovie {
  id: string;
  title_th: string;
  poster_path: string | null;
  vote_average: number | null;
  ai_content: {
    meta_title: string | null;
    review_body: string | null;
  } | null;
  movie_providers: {
    provider_id: number;
    verified_by_human: boolean;
    providers: { name: string; data_confidence: string } | null;
  }[];
}

export default function MovieList({ movies: initialMovies }: { movies: PendingMovie[] }) {
  const [movies, setMovies] = useState(initialMovies);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleBulkDone(publishedIds: string[]) {
    setMovies((prev) => prev.filter((m) => !publishedIds.includes(m.id)));
    setSelectedIds((prev) => prev.filter((id) => !publishedIds.includes(id)));
  }

  return (
    <>
      <BulkPublishBar selectedIds={selectedIds} onDone={handleBulkDone} />

      {movies.length === 0 && (
        <p style={{ fontSize: 14, color: "#999" }}>ไม่มีรายการรอตรวจสอบตอนนี้</p>
      )}

      {movies.map((m) => {
        const unverifiedProviders = m.movie_providers.filter(
          (p) => p.providers?.data_confidence === "low" && !p.verified_by_human
        );
        const canSelect = unverifiedProviders.length === 0;

        return (
          <div
            key={m.id}
            style={{
              border: "1px solid #e2e2e2",
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              display: "flex",
              gap: 14,
            }}
          >
            {canSelect && (
              <input
                type="checkbox"
                checked={selectedIds.includes(m.id)}
                onChange={() => toggleSelect(m.id)}
                style={{ width: 18, height: 18, marginTop: 4, flexShrink: 0 }}
              />
            )}
            <div
              style={{
                width: 64,
                height: 90,
                background: "#f0f0f0",
                borderRadius: 6,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>
                {m.title_th}
              </p>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>
                เรตติ้ง TMDB: {m.vote_average ?? "-"} ·{" "}
                {m.ai_content?.review_body?.length ?? 0} ตัวอักษร
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#444",
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                  maxHeight: 60,
                  overflow: "hidden",
                }}
              >
                {m.ai_content?.review_body?.slice(0, 160) ?? "(ไม่มีเนื้อหา)"}…
              </p>

              {unverifiedProviders.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#a33", margin: "0 0 6px" }}>
                    ต้องยืนยันแพลตฟอร์มก่อน:
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {unverifiedProviders.map((p) => (
                      <VerifyProviderButton
                        key={p.provider_id}
                        movieId={m.id}
                        providerId={p.provider_id}
                        providerName={p.providers?.name ?? ""}
                      />
                    ))}
                  </div>
                </div>
              )}

              <PublishButton
                movieId={m.id}
                disabled={unverifiedProviders.length > 0}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

function VerifyProviderButton({
  movieId,
  providerId,
  providerName,
}: {
  movieId: string;
  providerId: number;
  providerName: string;
}) {
  return (
    <form action={"/api/admin/movies/" + movieId + "/verify-provider"} method="POST">
      <input type="hidden" name="providerId" value={providerId} />
      <button
        type="submit"
        style={{
          fontSize: 12,
          padding: "4px 10px",
          border: "1px solid #ccc",
          borderRadius: 5,
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ยืนยัน {providerName}
      </button>
    </form>
  );
}