"use client";

import Link from "next/link";
import { useHadith } from "@/lib/hadith/useHadith";
import { Card } from "./Card";
import { ScrollIcon } from "./icons";

export function HadithCard() {
  const { loaded, today, isRead, markAsRead, history, note } = useHadith();

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
        <Link href="/hadith" className="text-xs text-ink-muted hover:text-primary">
          History ({history.length}) →
        </Link>
      }
    >
      <div className="flex flex-1 flex-col">
        <p className="font-display text-lg italic leading-relaxed text-ink">“{today.translation}”</p>
        <p className="mt-2 text-xs font-medium text-gold">{today.source}</p>
        <p className="mt-3 text-sm text-ink-muted">{today.explanation}</p>
        <button
          onClick={markAsRead}
          disabled={isRead}
          className={`mt-5 w-fit rounded-full px-5 py-2 text-sm font-medium transition-all ${
            isRead ? "border border-hairline text-ink-muted" : "bg-gold text-surface hover:-translate-y-px active:scale-[0.97]"
          }`}
        >
          {isRead ? "Read ✓" : "Mark as read"}
        </button>
        <p className="mt-auto pt-5 text-[11px] leading-snug text-ink-muted">{note}</p>
      </div>
    </Card>
  );
}
