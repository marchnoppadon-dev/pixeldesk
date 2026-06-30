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
export interface ProviderContext {
  name: string;
  movieTitles: string[];
}

const PROVIDER_SYSTEM_PROMPT = `คุณเป็นนักเขียนคอนเทนต์ให้เว็บไซต์ pixeldeskth
หน้าที่คือเขียนคำโปรยสั้นๆ แนะนำแพลตฟอร์มสตรีมมิ่ง โดยอ้างอิงจากรายชื่อหนังตัวอย่าง
ที่มีอยู่บนแพลตฟอร์มนั้นตอนนี้
กฎที่ต้องทำตามเคร่งครัด:
1. เขียนเป็นภาษาไทยธรรมชาติ 3-5 ประโยค ไม่ต้องมีหัวข้อย่อย เขียนต่อกันเป็นพารากราฟเดียว
2. กล่าวถึงชื่อแพลตฟอร์ม จุดเด่นของแพลตฟอร์มในเชิงตัวอย่างแนวหนังที่มี (อิงจากรายชื่อ
   หนังที่ได้รับ) และปิดท้ายด้วยการชวนให้ดูรีวิวหนังในหน้านี้
3. ห้ามแต่งข้อมูลที่ไม่มีอยู่ในรายชื่อหนังที่ได้รับ เช่น ห้ามเอ่ยชื่อหนังที่ไม่ได้อยู่
   ในรายชื่อ ห้ามอ้างจำนวนหนังหรือราคาสมาชิกที่ไม่ได้รับมา
4. ห้ามใส่เครื่องหมายคำพูดคู่ในคำตอบเด็ดขาด
5. ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามมีคำนำ ห้ามมี markdown ห้ามมีข้อความอื่นนอกเหนือ
   จากคำโปรยที่ขอ`;

function buildProviderPrompt(ctx: ProviderContext): string {
  const titleList = ctx.movieTitles.length > 0
    ? ctx.movieTitles.slice(0, 10).join(", ")
    : "ยังไม่มีข้อมูลหนังตัวอย่าง";
  return "แพลตฟอร์ม: " + ctx.name + "\n" +
    "ตัวอย่างหนังที่มีอยู่ตอนนี้: " + titleList + "\n\n" +
    "เขียนคำโปรยสั้นๆ 3-5 ประโยคตามกฎที่กำหนดไว้ในระบบ";
}

export async function generateProviderDescription(
  ctx: ProviderContext
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: PROVIDER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildProviderPrompt(ctx) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Claude API error: " + res.status + " " + errText);
  }

  const data = await res.json();
  const textBlock = data.content.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("ไม่มี text block ในผลลัพธ์จาก Claude API");

  return textBlock.text.trim();
}

const PROVIDER_LONG_SYSTEM_PROMPT = `คุณเป็นนักเขียนคอนเทนต์ SEO ให้เว็บไซต์ pixeldeskth
หน้าที่คือเขียนบทความยาวสำหรับหน้ารวมหนังของแพลตฟอร์มสตรีมมิ่งหนึ่งๆ เพื่อให้ติดอันดับ
การค้นหาคำว่า "แนะนำหนัง [ชื่อแพลตฟอร์ม] ดูอะไรดี" บน Google
กฎที่ต้องทำตามเคร่งครัด:
1. เขียนเป็นภาษาไทยธรรมชาติ แบ่งเป็น 3-4 ย่อหน้า แยกด้วยการขึ้นบรรทัดใหม่สองครั้ง
   ไม่ต้องมีหัวข้อย่อยหรือ markdown ใดๆ
2. ย่อหน้าที่ 1: พูดถึงปัญหาที่คนเจอตอนเปิดแพลตฟอร์มนี้ (เลือกหนังไม่ถูก หนังเยอะ)
   แล้วบอกว่าเว็บนี้ช่วยอะไรได้
3. ย่อหน้าที่ 2-3: พูดถึงจุดเด่นของแพลตฟอร์มนี้ในเชิงแนวหนังที่มี โดยอ้างอิงจากรายชื่อ
   หนังตัวอย่างที่ได้รับเท่านั้น ห้ามแต่งชื่อหนังที่ไม่ได้อยู่ในรายการ
4. ย่อหน้าสุดท้าย: ชวนให้เลื่อนดูรายการหนังด้านล่าง และแนะนำว่าสามารถดูรีวิวแต่ละเรื่อง
   ได้จากเว็บนี้
5. ความยาวรวม 350-500 คำ ห้ามยืดประโยคซ้ำความหมายเดิมเพื่อให้ยาว
6. ห้ามใส่เครื่องหมายคำพูดคู่ในคำตอบเด็ดขาด
7. ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามมีคำนำ ห้ามมีข้อความอื่นนอกเหนือจากบทความที่ขอ`;

function buildProviderLongPrompt(ctx: ProviderContext): string {
  const titleList = ctx.movieTitles.length > 0
    ? ctx.movieTitles.slice(0, 15).join(", ")
    : "ยังไม่มีข้อมูลหนังตัวอย่าง";
  return "แพลตฟอร์ม: " + ctx.name + "\n" +
    "ตัวอย่างหนังที่มีอยู่ตอนนี้: " + titleList + "\n\n" +
    "เขียนบทความ SEO ยาวตามกฎที่กำหนดไว้ในระบบ";
}

export async function generateProviderLongContent(
  ctx: ProviderContext
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: PROVIDER_LONG_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildProviderLongPrompt(ctx) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Claude API error: " + res.status + " " + errText);
  }

  const data = await res.json();
  const textBlock = data.content.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("ไม่มี text block ในผลลัพธ์จาก Claude API");

  return textBlock.text.trim();
}