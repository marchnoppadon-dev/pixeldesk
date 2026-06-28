import { config } from "dotenv";
config({ path: ".env.local" });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL = "claude-sonnet-4-6";

export interface MovieContext {
  titleTh: string;
  titleOriginal: string;
  overviewEn: string;
  genres: string[];
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  certification: string | null;
  topCast: string[];
  director: string | null;
}

export interface GeneratedContent {
  metaTitle: string;
  metaDescription: string;
  reviewBody: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
}

const SYSTEM_PROMPT = `คุณเป็นนักเขียนรีวิวหนังมือมืออาชีพให้เว็บไซต์ pixeldeskth
กฎที่ต้องทำตามเคร่งครัด:
1. ห้ามแปลเรื่องย่อ (overview) ที่ได้รับมาแบบคำต่อคำ ใช้เป็นข้อมูลอ้างอิงเพื่อ
   เข้าใจเนื้อเรื่องเท่านั้น แล้วเขียนใหม่ทั้งหมดด้วยมุมมอง น้ำเสียงของตัวเอง
2. เขียนเป็นภาษาไทยธรรมชาติ ไม่ใช่ภาษาแปล ห้ามมีโครงสร้างประโยคแบบอังกฤษ
3. โครงเนื้อรีวิวต้องมีครบ 4 ส่วนนี้ เขียนเป็นเนื้อความต่อกัน ไม่ต้องมีหัวข้อย่อย:
   ก เปิดเรื่องด้วยมุมที่น่าสนใจ ไม่ใช่แค่บอกชื่อหนังตรงๆ
   ข เล่าฉากตั้งต้นของเรื่องแบบไม่สปอยล์
   ค วิเคราะห์งานฝีมือ เช่น การกำกับ การแสดง งานภาพ ดนตรีประกอบ จังหวะตัดต่อ
   ง สรุปว่าเหมาะกับใคร เทียบกับหนังแนวเดียวกันหรือผลงานก่อนหน้าของผู้กำกับ นักแสดง
4. ความยาวต้องมีสาระครบตามข้อ 3 จริง ห้ามยืดประโยคซ้ำความหมายเดิมเพื่อให้ยาว
5. ห้ามสปอยล์ตอนจบ เว้นแต่จะถูกขอให้ทำหน้าสปอยล์แยกต่างหาก
6. ตอบตามรูปแบบที่กำหนดเป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้เด็ดขาด:

===META===
{"metaTitle": "...", "metaDescription": "...", "pros": ["...", "...", "..."], "cons": ["...", "..."], "faq": [{"question": "...", "answer": "..."}]}
===REVIEW===
เนื้อรีวิวเต็มเขียนตรงนี้เป็นข้อความธรรมดา ไม่ต้องอยู่ในรูปแบบ JSON ใส่เครื่องหมายคำพูดได้ตามปกติเพราะส่วนนี้ไม่ใช่ JSON
===END===

7. ส่วน META ต้องเป็น JSON ที่ valid จริง ห้ามใส่เครื่องหมายคำพูดคู่ในเนื้อหาของ
   metaTitle metaDescription pros cons และ faq เด็ดขาด เพราะส่วนนี้ parse แบบ JSON จริง`;

function buildUserPrompt(ctx: MovieContext): string {
  return "ข้อมูลอ้างอิงจาก TMDB (ห้ามแปลตรง ใช้แค่เข้าใจเนื้อเรื่อง):\n" +
    "ชื่อไทย: " + ctx.titleTh + "\n" +
    "ชื่อต้นฉบับ: " + ctx.titleOriginal + "\n" +
    "เรื่องย่อ (อังกฤษ อ้างอิงเท่านั้น): " + ctx.overviewEn + "\n" +
    "แนว: " + ctx.genres.join(", ") + "\n" +
    "วันฉาย: " + ctx.releaseDate + "\n" +
    "ความยาว: " + ctx.runtime + " นาที\n" +
    "เรตติ้ง TMDB: " + ctx.voteAverage + "/10\n" +
    "เรตอายุไทย: " + (ctx.certification ?? "ไม่ระบุ") + "\n" +
    "นักแสดงหลัก: " + ctx.topCast.join(", ") + "\n" +
    "ผู้กำกับ: " + (ctx.director ?? "ไม่ระบุ") + "\n\n" +
    "เขียนตามรูปแบบ ===META=== ===REVIEW=== ===END=== ที่กำหนดไว้ในระบบ " +
    "เนื้อรีวิวยาว 700-900 คำ ครอบคลุมครบ 4 ส่วนตามกฎข้อ 3";
}

export async function generateMovieContent(
  ctx: MovieContext
): Promise<GeneratedContent> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 12000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(ctx) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Claude API error: " + res.status + " " + errText);
  }

  const data = await res.json();
  const textBlock = data.content.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("ไม่มี text block ในผลลัพธ์จาก Claude API");

  const fullText = textBlock.text;
  console.log("=== RAW CLAUDE RESPONSE ===\n", fullText, "\n=== END LOG ===");

  const metaMatch = fullText.match(/===META===([\s\S]*?)===REVIEW===/);
  const reviewMatch = fullText.match(/===REVIEW===([\s\S]*?)===END===/);

  if (!metaMatch || !reviewMatch) {
    throw new Error("หาส่วน META หรือ REVIEW ไม่เจอในคำตอบของ Claude");
  }

  let metaParsed: any;
  try {
    metaParsed = JSON.parse(metaMatch[1].trim());
  } catch (err) {
    throw new Error("Parse JSON ส่วน META ไม่สำเร็จ: " + (err as Error).message + " | เนื้อหา: " + metaMatch[1].trim());
  }

  return {
    metaTitle: metaParsed.metaTitle,
    metaDescription: metaParsed.metaDescription,
    reviewBody: reviewMatch[1].trim(),
    pros: metaParsed.pros,
    cons: metaParsed.cons,
    faq: metaParsed.faq,
  };
}