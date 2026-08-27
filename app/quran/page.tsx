"use client";

import { useState } from "react";
import { Heatmap } from "../components/Heatmap";
import { OpenBookIcon } from "../components/icons";
import { QuranReader } from "../components/QuranReader";
import { SiteNav } from "../components/SiteNav";
import { useQuran } from "@/lib/quran/useQuran";

export default function QuranPage() {
  const {
    loaded,
    todayPages,
    logToday,
    setPosition,
    goal,
    setGoal,
    lastPosition,
    currentStreak,
    longestStreak,
    heatmapDays,
  } = useQuran();
  const [pagesInput, setPagesInput] = useState("");
  const [positionInput, setPositionInput] = useState("");

  const progress = goal > 0 ? Math.min(100, Math.round((todayPages / goal) * 100)) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <OpenBookIcon className="h-5 w-5" />
          </span>
          <h1 className="font-display text-4xl text-ink">Qur&apos;an</h1>
        </div>
        <SiteNav />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <section className="rounded-[28px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(58,42,28,0.05),0_18px_36px_-20px_rgba(58,42,28,0.35)] sm:p-8 lg:col-span-2">
          {!loaded ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <QuranReader lastPosition={lastPosition} onSavePosition={setPosition} />
          )}
        </section>

        <aside className="rounded-[28px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(58,42,28,0.05),0_18px_36px_-20px_rgba(58,42,28,0.35)] sm:p-7 lg:sticky lg:top-8">
          {!loaded ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl text-ink">Today&apos;s log</h2>
                <span className="text-xs text-ink-muted">
                  {todayPages}/{goal} pages
                </span>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-primary-soft">
                <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
              </div>

              <form
                className="mt-4 flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const pages = Number(pagesInput);
                  if (!Number.isFinite(pages) || pages < 0) return;
                  logToday(pages, positionInput.trim() || undefined);
                  setPagesInput("");
                  setPositionInput("");
                }}
              >
                <input
                  type="number"
                  min={0}
                  placeholder="Pages"
                  value={pagesInput}
                  onChange={(e) => setPagesInput(e.target.value)}
                  className="w-24 rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
                />
                <input
                  type="text"
                  placeholder={lastPosition ? `Last: ${lastPosition}` : "Surah/juz (optional)"}
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  className="min-w-[8rem] flex-1 rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
                />
                <button
                  type="submit"
                  className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-surface transition-transform hover:-translate-y-px active:scale-[0.97]"
                >
                  Log
                </button>
              </form>

              <label className="mt-3 block text-xs text-ink-muted">
                Daily goal:{" "}
                <input
                  type="number"
                  min={1}
                  value={goal}
                  onChange={(e) => setGoal(Math.max(1, Number(e.target.value) || 1))}
                  className="w-12 rounded-full border border-hairline bg-transparent px-2 py-0.5 text-xs"
                />{" "}
                pages
              </label>

              <div className="mt-6 flex gap-8 text-sm">
                <div>
                  <div className="font-display text-3xl text-gold">{currentStreak}</div>
                  <div className="text-xs text-ink-muted">day streak</div>
                </div>
                <div>
                  <div className="font-display text-3xl text-ink">{longestStreak}</div>
                  <div className="text-xs text-ink-muted">longest</div>
                </div>
              </div>

              <div className="mt-6">
                <Heatmap days={heatmapDays} tone="gold" />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
