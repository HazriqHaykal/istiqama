"use client";

import { useState } from "react";
import { useHadith } from "@/lib/hadith/useHadith";
import { Card } from "./Card";
import { ScrollIcon } from "./icons";

export function HadithCard() {
  const { loaded, today, isRead, markAsRead, history, note } = useHadith();
  const [showHistory, setShowHistory] = useState(false);

  if (!loaded) {
    return (
      <Card title="Hadith of the Day" icon={<ScrollIcon className="h-5 w-5" />}>
        <p className="text-sm text-ink-muted">Loading…</p>
      </Card>
    );
  }

  return (
    <Card
      title="Hadith of the Day"
      icon={<ScrollIcon className="h-5 w-5" />}
      action={
        <button onClick={() => setShowHistory((v) => !v)} className="text-xs text-ink-muted hover:text-primary">
          {showHistory ? "Today" : `History (${history.length})`}
        </button>
      }
    >
      {showHistory ? (
        <ul className="max-h-64 space-y-4 overflow-y-auto text-sm">
          {history.length === 0 && <li className="text-ink-muted">No hadiths marked as read yet.</li>}
          {history.map((h) => (
            <li key={h.id} className="border-b border-hairline pb-3 last:border-0">
              <p className="text-ink">{h.translation}</p>
              <p className="mt-1 text-xs text-ink-muted">{h.source}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col">
          <p className="font-display text-lg italic leading-relaxed text-ink">“{today.translation}”</p>
          <p className="mt-2 text-xs font-medium text-gold">{today.source}</p>
          <p className="mt-3 text-sm text-ink-muted">{today.explanation}</p>
          <button
            onClick={markAsRead}
            disabled={isRead}
            className={`mt-5 w-fit rounded-full px-5 py-2 text-sm font-medium transition-all ${
              isRead
                ? "border border-hairline text-ink-muted"
                : "bg-gold text-surface hover:-translate-y-px"
            }`}
          >
            {isRead ? "Read ✓" : "Mark as read"}
          </button>
          <p className="mt-auto pt-5 text-[11px] leading-snug text-ink-muted">{note}</p>
        </div>
      )}
    </Card>
  );
}
