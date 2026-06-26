type Tag = { label: string; tone?: "mint" | "coral" };

export default function ProductCard({
  name,
  blurb,
  price,
  tags,
  rank,
}: {
  name: string;
  blurb: string;
  price: string;
  tags: Tag[];
  rank: number;
}) {
  return (
    <div className="group relative rounded-lg border border-line bg-panel-raised p-5 hover:border-mint/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[13px] text-mint-dim">
          #{String(rank).padStart(2, "0")}
        </span>
        <span className="font-mono text-[15px] font-bold text-ink whitespace-nowrap">
          {price}
        </span>
      </div>

      <div className="aspect-[4/3] rounded-md bg-deep border border-line mb-4 flex items-center justify-center">
        <span className="text-[11px] font-mono text-slate">[ product_img ]</span>
      </div>

      <h3 className="font-sans font-semibold text-ink mb-1.5 leading-snug">
        {name}
      </h3>
      <p className="text-[13px] text-slate leading-relaxed mb-4">{blurb}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {tags.map((t) => (
            <span
              key={t.label}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                t.tone === "coral"
                  ? "border-coral/30 text-coral"
                  : "border-mint/30 text-mint-dim"
              }`}
            >
              {t.label}
            </span>
          ))}
        </div>
        <button className="text-[12px] font-mono font-medium text-deep bg-mint hover:bg-mint-dim px-3 py-1.5 rounded transition-colors whitespace-nowrap">
          ดูราคา →
        </button>
      </div>
    </div>
  );
}
