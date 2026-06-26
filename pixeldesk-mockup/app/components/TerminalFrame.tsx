import { ReactNode } from "react";

export default function TerminalFrame({
  path,
  children,
  className = "",
}: {
  path: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-line bg-panel overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-panel-raised border-b border-line">
        <span className="w-2.5 h-2.5 rounded-full bg-coral/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-mint/40" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate/40" />
        <span className="ml-2 text-[12px] font-mono text-slate truncate">
          {path}
        </span>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}
