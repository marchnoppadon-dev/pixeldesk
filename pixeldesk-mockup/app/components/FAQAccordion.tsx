"use client";

import { useState } from "react";

type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="bg-panel">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-panel-raised transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-sans text-[14px] font-medium text-ink">
                {item.question}
              </span>
              <span className="font-mono text-mint flex-shrink-0">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-[13px] text-slate leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
