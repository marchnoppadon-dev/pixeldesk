type Row = {
  rank: number;
  name: string;
  price: string;
  bestFor: string;
};

export default function SummaryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto border border-line rounded-lg">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-panel-raised border-b border-line">
            <th className="text-left font-mono font-medium text-slate px-4 py-3 whitespace-nowrap">
              #
            </th>
            <th className="text-left font-sans font-medium text-ink px-4 py-3">
              สินค้า
            </th>
            <th className="text-left font-mono font-medium text-slate px-4 py-3 whitespace-nowrap">
              ราคาเริ่มต้น
            </th>
            <th className="text-left font-sans font-medium text-slate px-4 py-3">
              เหมาะกับ
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rank} className="border-b border-line last:border-0 bg-panel">
              <td className="px-4 py-3 font-mono text-mint-dim">
                {String(r.rank).padStart(2, "0")}
              </td>
              <td className="px-4 py-3 text-ink font-medium">{r.name}</td>
              <td className="px-4 py-3 font-mono text-ink whitespace-nowrap">
                {r.price}
              </td>
              <td className="px-4 py-3 text-slate">{r.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
