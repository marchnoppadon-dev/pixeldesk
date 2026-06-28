"use client";
import { useState } from "react";

export default function BulkPublishBar({
  selectedIds,
  onDone,
}: {
  selectedIds: string[];
  onDone: (publishedIds: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBulkPublish() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/movies/bulk-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (res.ok) {
        onDone(json.published ?? []);
        if ((json.skipped ?? []).length > 0) {
          alert(
            "publish สำเร็จ " +
              (json.published?.length ?? 0) +
              " เรื่อง, ข้าม " +
              json.skipped.length +
              " เรื่อง (อาจติดเงื่อนไข verify หรือ error)"
          );
        }
      } else {
        alert("publish ไม่สำเร็จ: " + (json.error ?? "ไม่ทราบสาเหตุ"));
      }
    } finally {
      setLoading(false);
    }
  }

  if (selectedIds.length === 0) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#111",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 14 }}>เลือกไว้ {selectedIds.length} เรื่อง</span>
      <button
        onClick={handleBulkPublish}
        disabled={loading}
        style={{
          fontSize: 13,
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: 6,
          border: "none",
          background: loading ? "#555" : "#1d9e75",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "กำลัง publish..." : "Publish ที่เลือก (" + selectedIds.length + ")"}
      </button>
    </div>
  );
}