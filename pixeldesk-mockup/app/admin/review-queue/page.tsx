import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { supabase } from "../../../lib/supabase";
import MovieList from "./MovieList";

export const dynamic = "force-dynamic";

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

async function getPendingMovies(): Promise<PendingMovie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(
      `id, title_th, poster_path, vote_average,
       ai_content(meta_title, review_body),
       movie_providers(provider_id, verified_by_human, providers(name, data_confidence))`
    )
    .eq("status", "ai_generated")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ดึงรายการรอตรวจสอบไม่สำเร็จ:", error.message);
    return [];
  }
  return (data ?? []).map((m: any) => ({
    ...m,
    ai_content: Array.isArray(m.ai_content) ? m.ai_content[0] : m.ai_content,
  }));
}

export default async function ReviewQueuePage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const movies = await getPendingMovies();

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>รอตรวจสอบก่อน publish</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        {movies.length} เรื่อง — ติ๊กเลือกหลายเรื่องแล้วกด Publish ที่เลือก ได้เลย
        (เรื่องที่ยังต้องยืนยันแพลตฟอร์มจะไม่มี checkbox ให้เลือก)
      </p>
      <MovieList movies={movies} />
    </div>
  );
}