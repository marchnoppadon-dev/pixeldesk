import { config } from "dotenv";
config({ path: ".env.local" });

import { generateMovieContent } from "../lib/ai-content";

async function main() {
  const result = await generateMovieContent({
    titleTh: "ทอย สตอรี่ 5",
    titleOriginal: "Toy Story 5",
    overviewEn: "Woody and the gang face a new rival: a tablet device that has won Bonnie's affection.",
    genres: ["Animation", "Family", "Comedy"],
    releaseDate: "2026-06-17",
    runtime: 102,
    voteAverage: 7.5,
    certification: "G",
    topCast: ["Tom Hanks", "Tim Allen", "Joan Cusack"],
    director: "Andrew Stanton",
  });

  console.log("ความยาวเนื้อรีวิว:", result.reviewBody.length, "ตัวอักษร");
  console.log("จำนวนคำโดยประมาณ:", result.reviewBody.split(/\s+/).length, "คำ");
  console.log("จำนวน FAQ:", result.faq.length, "ข้อ");
  console.log("\n=== เนื้อรีวิวเต็ม ===\n", result.reviewBody);
}

main().catch(console.error);