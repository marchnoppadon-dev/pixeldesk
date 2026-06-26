import TerminalFrame from "./components/TerminalFrame";
import ProductCard from "./components/ProductCard";

const categories = [
  {
    slug: "room-lights",
    title: "ไฟแต่งห้อง",
    desc: "ไฟสวย ไม่ทำกระเป๋าฉีก",
    count: 18,
  },
  {
    slug: "gadget-desk-setup",
    title: "Gadget แต่งโต๊ะคอม",
    desc: "ของเล็กที่เปลี่ยนโต๊ะได้เยอะ",
    count: 12,
  },
];

const pillarGuide = {
  slug: "pillar-guide",
  path: "~/damkerng/guide/อุปกรณ์แต่งโต๊ะคอม.md",
  title: "รวมอุปกรณ์แต่งโต๊ะคอมที่ดำเกิงแนะนำ อัปเดตทุกเดือน",
  blurb:
    "บทความนี้รวมทุกอย่างที่ดำเกิงทดลองมาเอง ตั้งแต่ไฟแต่งห้องไปจนถึง gadget เล็กๆ ที่เปลี่ยนโต๊ะธรรมดาให้ดูดีขึ้นได้ แบ่งงบให้เลือกตามที่มี ไม่ต้องอ่านทุกหมวดถ้าไม่ว่าง",
};

const products = [
  {
    rank: 1,
    name: "ไฟ LED Strip RGB เสียงตอบสนอง 2 เมตร",
    blurb: "ดำเกิงลองแล้ว ไฟไม่กระพริบกวนตา ตั้งค่าผ่านแอปได้ ไม่ต้องง้อรีโมท",
    price: "฿259",
    tags: [{ label: "งบ <300", tone: "mint" as const }, { label: "ติดตั้งเอง", tone: "mint" as const }],
  },
  {
    rank: 2,
    name: "คลิปจัดสาย USB-C แม่เหล็ก แพ็ค 6 ชิ้น",
    blurb: "ของเล็กแต่เปลี่ยนโต๊ะได้เยอะสุด แปะใต้โต๊ะ สายลอดไม่เกะกะ",
    price: "฿129",
    tags: [{ label: "งบ <150", tone: "mint" as const }],
  },
  {
    rank: 3,
    name: "ไมค์ตั้งโต๊ะ USB คอนเดนเซอร์ เริ่มสาย",
    blurb: "เสียงดีเกินราคา ดำเกิงเทียบกับรุ่นแพงกว่าแล้ว ต่างกันแค่ฟีลเล็กน้อย",
    price: "฿890",
    tags: [{ label: "Gadget แต่งโต๊ะ", tone: "coral" as const }],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-line bg-deep/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-mint text-lg">{"<"}</span>
            <span className="font-mono font-bold text-ink">PixelDesk</span>
            <span className="font-mono text-mint text-lg">{"/>"}</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 font-mono text-[13px] text-slate">
            <a href="#categories" className="hover:text-mint transition-colors">หมวดหมู่</a>
            <a href="#reviews" className="hover:text-mint transition-colors">รีวิวล่าสุด</a>
            <a href="#damkerng" className="hover:text-mint transition-colors">รู้จักดำเกิง</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-12">
          <TerminalFrame path="~/damkerng/intro.sh" className="scanlines">
            <p className="font-mono text-[13px] text-mint-dim mb-3">
              $ whoami
            </p>
            <h1 className="font-mono text-2xl sm:text-4xl font-bold leading-tight text-ink mb-4">
              งบน้อยก็จัดโต๊ะให้เท่ได้
              <span className="text-mint">.</span>
              <br />
              ดำเกิงคัดของจริงมาให้แล้ว
              <span className="cursor-blink text-mint">_</span>
            </h1>
            <p className="font-sans text-[15px] text-slate leading-relaxed max-w-2xl mb-6">
              ผมเทสของแต่งโต๊ะเกมมิ่งและอุปกรณ์สตรีมมิ่งมาเรื่อยๆ
              เอาที่คุ้มค่าจริง ไม่ใช่ของมันต้องมีแต่ใช้ไม่ได้จริง
              งบจำกัดไม่ใช่ข้อจำกัด ถ้าเลือกถูกตัว
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#categories"
                className="font-mono text-[13px] font-medium bg-mint text-deep px-4 py-2 rounded hover:bg-mint-dim transition-colors"
              >
                ดูของที่คัดมาแล้ว →
              </a>
              <a
                href="#damkerng"
                className="font-mono text-[13px] font-medium border border-line text-ink px-4 py-2 rounded hover:border-mint/40 transition-colors"
              >
                รู้จักดำเกิง
              </a>
            </div>
          </TerminalFrame>
        </section>

        {/* Categories */}
        <section id="categories" className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-mono text-[13px] text-slate">
              <span className="text-mint-dim">$</span> ls ./หมวดหมู่
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-lg border border-line bg-panel p-5 hover:border-mint/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] text-slate">
                    {c.count} รีวิว
                  </span>
                  <span className="font-mono text-mint opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-ink mb-1">
                  {c.title}
                </h3>
                <p className="text-[13px] text-slate">{c.desc}</p>
              </a>
            ))}
          </div>
          <a
            href={`#${pillarGuide.slug}`}
            className="block rounded-lg border border-mint/30 bg-panel-raised p-5 hover:border-mint/60 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] text-mint-dim mb-1">บทความหลัก</p>
                <h3 className="font-sans font-semibold text-ink">{pillarGuide.title}</h3>
              </div>
              <span className="font-mono text-mint opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                →
              </span>
            </div>
          </a>
        </section>

        {/* Product reviews */}
        <section id="reviews" className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <h2 className="font-mono text-[13px] text-slate mb-6">
            <span className="text-mint-dim">$</span> cat ./rgb-budget/top-picks.md
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.rank} {...p} />
            ))}
          </div>
        </section>

        {/* Pillar guide article */}
        <section id={pillarGuide.slug} className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <TerminalFrame path={pillarGuide.path}>
            <p className="font-mono text-[12px] text-mint-dim mb-2"># บทความหลัก</p>
            <h2 className="text-xl font-sans font-semibold text-ink mb-3 leading-snug">
              {pillarGuide.title}
            </h2>
            <p className="text-[14px] text-slate leading-relaxed mb-5">
              {pillarGuide.blurb}
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <a
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="text-[12px] font-mono px-3 py-1.5 rounded border border-mint/30 text-mint-dim hover:border-mint/60 transition-colors"
                >
                  → {c.title}
                </a>
              ))}
            </div>
          </TerminalFrame>
        </section>

        {/* Damkerng intro */}
        <section id="damkerng" className="max-w-5xl mx-auto px-5 sm:px-8 py-10 pb-20">
          <TerminalFrame path="~/damkerng/about.md">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-lg bg-deep border border-mint/30 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-mint text-2xl font-bold">D</span>
              </div>
              <div>
                <p className="font-mono text-[12px] text-mint-dim mb-2"># รู้จักดำเกิง</p>
                <p className="text-[14px] text-ink leading-relaxed mb-3">
                  ผมดำเกิง — แกะกล่องของแต่งโต๊ะมาเรื่อยๆ
                  จนเพื่อนๆ ทักมาถามว่า &ldquo;อันนี้คุ้มมั้ย&rdquo; บ่อยจนต้องเปิดเว็บนี้ขึ้นมา
                  เพื่อรวบรวมคำตอบไว้ที่เดียว
                </p>
                <p className="text-[14px] text-slate leading-relaxed">
                  ของทุกชิ้นที่แนะนำ ผมเช็คสเปคจริง เทียบราคาจริง
                  ไม่มีของที่ไม่เคยเห็นมาก่อนโผล่มาในรีวิว
                </p>
                <p className="font-mono text-[13px] text-mint mt-4">— ดำเกิง</p>
              </div>
            </div>
          </TerminalFrame>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[12px] text-slate">
          <span>© 2026 PixelDesk · เขียนโดยดำเกิง</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mint transition-colors">Affiliate Disclosure</a>
            <a href="#" className="hover:text-mint transition-colors">ติดต่อเรา</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
