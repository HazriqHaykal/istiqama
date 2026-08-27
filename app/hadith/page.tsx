"use client";

import { ScrollIcon } from "../components/icons";
import { SiteNav } from "../components/SiteNav";
import { useHadith } from "@/lib/hadith/useHadith";

export default function HadithPage() {
  const { loaded, today, isRead, markAsRead, history, note } = useHadith();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ScrollIcon className="h-5 w-5" />
          </span>
          <h1 className="font-display text-4xl text-ink">Hadith</h1>
        </div>
        <SiteNav />
      </header>

      {!loaded ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <>
          <section className="rounded-[28px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(58,42,28,0.05),0_18px_36px_-20px_rgba(58,42,28,0.35)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">Today</p>
            <p className="font-display mt-4 text-2xl italic leading-relaxed text-ink sm:text-3xl">
              “{today.translation}”
            </p>
            <p className="mt-4 text-sm font-medium text-gold">{today.source}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{today.explanation}</p>
            <button
              onClick={markAsRead}
              disabled={isRead}
              className={`mt-6 w-fit rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                isRead ? "border border-hairline text-ink-muted" : "bg-gold text-surface hover:-translate-y-px active:scale-[0.97]"
              }`}
            >
              {isRead ? "Read ✓" : "Mark as read"}
            </button>
            <p className="mt-6 border-t border-hairline pt-5 text-xs leading-snug text-ink-muted">{note}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl text-ink">History ({history.length})</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No hadiths marked as read yet.</p>
            ) : (
              <ul className="mt-5 space-y-4">
                {history.map(({ date, hadith }) => (
                  <li
                    key={date}
                    className="rounded-2xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(58,42,28,0.05)]"
                  >
                    <p className="text-sm text-ink">{hadith.translation}</p>
                    <p className="mt-2 text-xs text-ink-muted">
                      <span className="font-medium text-gold">{hadith.source}</span> · {date}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
