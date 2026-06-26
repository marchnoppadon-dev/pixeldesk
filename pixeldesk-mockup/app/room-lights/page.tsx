import type { Metadata } from "next";
import TerminalFrame from "../components/TerminalFrame";
import ListicleEntry from "../components/ListicleEntry";
import SummaryTable from "../components/SummaryTable";
import FAQAccordion from "../components/FAQAccordion";

export const metadata: Metadata = {
  title: "9 ไฟแต่งห้องงบไม่เกิน 500 ที่ดำเกิงลองมาแล้ว (อัปเดต 2026)",
  description:
    "รวม 9 ไฟแต่งห้องที่ดำเกิงทดลองเอง คัดมาเฉพาะของที่สวยจริง ใช้งานคุ้มค่า งบเริ่มต้นไม่เกิน 500 บาท พร้อมจุดเด่นและข้อควรรู้ก่อนซื้อ",
  alternates: {
    canonical: "/room-lights",
  },
  openGraph: {
    type: "article",
    locale: "th_TH",
    title: "9 ไฟแต่งห้องงบไม่เกิน 500 ที่ดำเกิงลองมาแล้ว",
    description:
      "รวม 9 ไฟแต่งห้องที่ดำเกิงทดลองเอง คัดมาเฉพาะของที่สวยจริง ใช้งานคุ้มค่า งบเริ่มต้นไม่เกิน 500 บาท",
    url: "/room-lights",
  },
};

const items = [
  {
    rank: 1,
    name: "ไฟ LED Strip RGB เสียงตอบสนองเพลง",
    price: "฿259",
    damkerngSays:
      "ดำเกิงลองแล้ว ไฟไม่กระพริบกวนตา ตั้งค่าผ่านแอปได้ ไม่ต้องง้อรีโมท เปิดเพลงแล้วไฟเต้นตามจังหวะ บรรยากาศห้องเปลี่ยนไปเยอะกว่าที่คิด",
    goodFor: "คนอยากได้ไฟที่มีมูฟเมนต์ ไม่ใช่แค่เปิด-ปิดสีเดียว",
    watchOut: "ความยาวมาตรฐานมักอยู่ที่ 2-3 เมตร วัดพื้นที่ติดก่อนสั่งจะตัดต่อพอดี",
    tags: [{ label: "งบ <300", tone: "mint" as const }],
  },
  {
    rank: 2,
    name: "ไฟเส้น LED 5050-RGB ม้วนยาว",
    price: "฿199",
    damkerngSays:
      "ราคาประหยัดกว่ารุ่นมีแอปควบคุม แต่ความหนาโค้งงอได้ทำให้ติดได้หลายมุม เหมาะคนอยากลองเล่นไฟก่อนตัดสินใจซื้อรุ่นแพง",
    goodFor: "คนงบจำกัดที่อยากได้ไฟติดผนังเส้นแรก",
    watchOut: "การควบคุมสีอาจทำผ่านรีโมทธรรมดา ไม่มีแอปสมาร์ทโฟนในบางรุ่น เช็คก่อนสั่ง",
    tags: [{ label: "งบ <250", tone: "mint" as const }],
  },
  {
    rank: 3,
    name: "โคมไฟตั้งโต๊ะ RGB 16 สี",
    price: "฿199",
    damkerngSays:
      "ปรับโทนได้ 16 สีและ 3 ระดับแสงขาว ใช้เป็นไฟหลักก็ได้ ไฟมูดก็ได้ ดำเกิงสลับโทนตามอารมณ์งานแต่ละวัน",
    goodFor: "คนอยากมีไฟตั้งโต๊ะที่ปรับมู้ดได้หลายแบบในตัวเดียว",
    watchOut: "ความสว่างสูงสุดอาจไม่พอสำหรับใช้อ่านหนังสือเป็นไฟหลักของห้อง",
    tags: [{ label: "งบ <250", tone: "mint" as const }],
  },
  {
    rank: 4,
    name: "โคมไฟโปรเจคเตอร์ดวงจันทร์/ดาว",
    price: "฿345",
    damkerngSays:
      "ของชิ้นนี้ทำหน้าที่เป็นพร็อพถ่ายรูปมุมไอจีได้ดีมาก เสียบสาย USB เปิดแล้วฉายลายดาว/จันทร์ขึ้นเพดาน บรรยากาศกลางคืนเปลี่ยนไปเลย",
    goodFor: "คนชอบถ่ายรูป setup ลงโซเชียล หรืออยากได้ไฟมู้ดก่อนนอน",
    watchOut: "เหมาะใช้ในห้องมืดหรือไฟปิด แสงโปรเจคเตอร์จะไม่ชัดถ้าเปิดไฟหลักด้วย",
    tags: [{ label: "งบ <350", tone: "mint" as const }],
  },
  {
    rank: 5,
    name: "โคมไฟอ่านหนังสือ USB ชาร์จแบตได้",
    price: "฿229",
    damkerngSays:
      "ใช้คู่กับมุมทำงานได้ดี ไม่ต้องเสียบสายตลอดเวลาเพราะมีแบตในตัว พกไปวางมุมอื่นของบ้านก็ได้",
    goodFor: "คนอยากได้ไฟอ่านหนังสือที่ไม่ติดกับปลั๊กตลอด",
    watchOut: "เวลาใช้งานต่อการชาร์จ 1 ครั้งจะสั้นลงถ้าเปิดความสว่างสูงสุดตลอด",
    tags: [{ label: "งบ <250", tone: "mint" as const }],
  },
  {
    rank: 6,
    name: "ไฟ Track Light ราง LED ขนาดเล็ก",
    price: "฿390",
    damkerngSays:
      "ติดเพดานหรือผนังแล้วปรับมุมแสงเฉพาะจุดได้ เหมาะกับคนอยากได้แสงส่องของสะสมหรือมุมตกแต่งเฉพาะส่วน",
    goodFor: "คนอยากได้แสงทิศทางเฉพาะจุด ไม่ใช่แสงกระจายทั่วห้อง",
    watchOut: "ต้องมีพื้นที่ติดตั้งที่เหมาะสม บางรุ่นต้องเจาะผนัง/เพดานเพิ่ม",
    tags: [{ label: "งบ <400", tone: "coral" as const }],
  },
  {
    rank: 7,
    name: "ไฟเซ็นเซอร์แรงโน้มถ่วง",
    price: "฿179",
    damkerngSays:
      "เปิด-ปิดอัตโนมัติแค่ขยับเอียง ไม่ต้องสัมผัสสวิตช์ ดำเกิงเอาไปแปะใต้ชั้นวางของ สะดวกตอนหยิบของกลางคืน",
    goodFor: "คนอยากได้ไฟส่องเฉพาะจุดที่เปิดง่ายไม่ต้องหาสวิตช์",
    watchOut: "ความไวเซ็นเซอร์บางรุ่นอาจมากไป ทำให้ไฟติดเองตอนไม่ตั้งใจ",
    tags: [{ label: "งบ <200", tone: "mint" as const }],
  },
  {
    rank: 8,
    name: "ไฟแต่งห้องชุด USB ต่อพ่วงได้",
    price: "฿249",
    damkerngSays:
      "เสียบจากพอร์ต USB จอคอมได้เลย ไม่ต้องหาปลั๊กเพิ่ม เหมาะกับคนที่โต๊ะมีปลั๊กไม่พอใช้อยู่แล้ว",
    goodFor: "คนที่ปลั๊กไฟรอบโต๊ะเต็มแล้ว อยากได้ไฟที่ไม่แย่งช่องเสียบ",
    watchOut: "ความสว่างขึ้นกับไฟจ่ายจากพอร์ต USB อาจไม่สว่างเท่ารุ่นที่ใช้อะแดปเตอร์แยก",
    tags: [{ label: "งบ <300", tone: "mint" as const }],
  },
  {
    rank: 9,
    name: "ไฟ LED ติดผนังทรงเรขาคณิต (Hexagon)",
    price: "฿450",
    damkerngSays:
      "งบสูงขึ้นมานิดจากตัวอื่นในลิสต์ แต่เป็นจุดเด่นพื้นหลังกล้องหรือสตรีมได้จริง ต่อกันเป็นแพทเทิร์นได้ตามต้องการ",
    goodFor: "คนอยากได้ฉากหลังสวยสำหรับถ่ายรูป/สตรีม ไม่ใช่แค่ไฟใช้งานทั่วไป",
    watchOut: "ราคาต่อชุดเริ่มสูงขึ้นถ้าต้องการต่อหลายแผงให้เป็นแพทเทิร์นใหญ่",
    tags: [{ label: "งบ <500", tone: "coral" as const }],
  },
];

const summaryRows = items.map((item) => ({
  rank: item.rank,
  name: item.name,
  price: item.price,
  bestFor: item.goodFor,
}));

const faqs = [
  {
    question: "ไฟแต่งห้องงบน้อย เริ่มจากแบบไหนก่อนดี?",
    answer:
      "ดำเกิงแนะนำให้เริ่มจากไฟเส้น LED ม้วนยาวหรือโคมไฟตั้งโต๊ะ RGB ก่อน เพราะราคาไม่แรงและเห็นความเปลี่ยนแปลงของห้องชัด ค่อยขยับไปของที่ติดตั้งซับซ้อนขึ้นอย่าง track light ทีหลัง",
  },
  {
    question: "ไฟแต่งห้องงบรวมไม่เกิน 1000 บาท ซื้ออะไรดี?",
    answer:
      "จากลิสต์นี้ เลือกไฟเส้น LED (199) + โคมไฟตั้งโต๊ะ RGB (199) + ไฟเซ็นเซอร์แรงโน้มถ่วง (179) + โคมไฟอ่านหนังสือ (229) รวมแล้วประมาณ 806 บาท ครอบคลุมทั้งไฟบรรยากาศและไฟใช้งานจริง",
  },
  {
    question: "ไฟแต่งห้อง RGB กับไฟแต่งห้องสีเดียว ต่างกันยังไง ควรเลือกแบบไหน?",
    answer:
      "ไฟ RGB ปรับสีได้หลายแบบ เหมาะกับคนชอบเปลี่ยนมู้ดบ่อยหรือถ่ายรูป setup ส่วนไฟสีเดียว (มักเป็นสีขาวหรือเหลืองนวล) ราคาถูกกว่าและให้แสงใช้งานที่นิ่งกว่า เหมาะกับคนอยากได้ไฟใช้งานจริงมากกว่าไฟตกแต่ง",
  },
];

export default function RoomLightsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "9 ไฟแต่งห้องงบไม่เกิน 500 ที่ดำเกิงลองมาแล้ว",
    inLanguage: "th-TH",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.rank,
      item: {
        "@type": "Product",
        name: item.name,
        offers: {
          "@type": "Offer",
          price: item.price.replace("฿", ""),
          priceCurrency: "THB",
        },
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "th-TH",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-b border-line bg-deep/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-mono font-bold text-mint text-lg">{"<"}</span>
            <span className="font-mono font-bold text-ink">PixelDesk</span>
            <span className="font-mono text-mint text-lg">{"/>"}</span>
          </a>
          <a
            href="/#categories"
            className="font-mono text-[13px] text-slate hover:text-mint transition-colors"
          >
            ← กลับหมวดหมู่
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <nav className="font-mono text-[12px] text-slate mb-6">
            <a href="/" className="hover:text-mint transition-colors">
              หน้าแรก
            </a>
            {" / "}
            <a href="/#categories" className="hover:text-mint transition-colors">
              ไฟแต่งห้อง
            </a>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink leading-snug mb-4">
            9 ไฟแต่งห้องงบไม่เกิน 500 ที่ดำเกิงลองมาแล้ว
          </h1>

          <p className="text-[15px] text-slate leading-relaxed mb-8">
            ดำเกิงคัดมาเฉพาะไฟที่สวยจริงและใช้งานคุ้มราคา ไม่ใช่ไฟที่ซื้อมาแล้วเปิดสองวันก็เลิกใช้
            งบเริ่มต้นแค่ 179 บาทไปจนถึง 450 บาท เลือกตามบรรยากาศที่อยากได้ในห้องตัวเองได้เลย
            ทุกชิ้นในลิสต์นี้ดำเกิงใช้เองหรือเทียบสเปคจริงก่อนแนะนำทั้งหมด
          </p>

          <div className="mb-10">
            <SummaryTable rows={summaryRows} />
          </div>

          <div className="space-y-5 mb-12">
            {items.map((item) => (
              <ListicleEntry key={item.rank} {...item} />
            ))}
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-sans font-semibold text-ink mb-4">
              คำถามที่พบบ่อย
            </h2>
            <FAQAccordion items={faqs} />
          </section>

          <TerminalFrame path="~/damkerng/note.txt">
            <p className="text-[14px] text-ink leading-relaxed mb-2">
              ลิสต์นี้อัปเดตเรื่อยๆ ตามไฟที่ดำเกิงทดลองใหม่
              ถ้ามีไฟตัวไหนอยากให้รีวิว ทักมาได้ที่หน้าติดต่อเรา
            </p>
            <p className="font-mono text-[13px] text-mint mt-3">— ดำเกิง</p>
          </TerminalFrame>

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="/gadget-desk-setup"
              className="text-[12px] font-mono px-3 py-1.5 rounded border border-mint/30 text-mint-dim hover:border-mint/60 transition-colors"
            >
              → ดูหมวด Gadget แต่งโต๊ะคอม
            </a>
            <a
              href="/#pillar-guide"
              className="text-[12px] font-mono px-3 py-1.5 rounded border border-mint/30 text-mint-dim hover:border-mint/60 transition-colors"
            >
              → รวมอุปกรณ์แต่งโต๊ะคอมทั้งหมด
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[12px] text-slate">
          <span>© 2026 PixelDesk · เขียนโดยดำเกิง</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mint transition-colors">
              Affiliate Disclosure
            </a>
            <a href="#" className="hover:text-mint transition-colors">
              ติดต่อเรา
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
