"use client";

import { useState } from "react";
import { useQuran } from "@/lib/quran/useQuran";
import { Card } from "./Card";
import { Heatmap } from "./Heatmap";
import { OpenBookIcon } from "./icons";

export function QuranCard() {
  const { loaded, todayPages, logToday, goal, setGoal, lastPosition, currentStreak, longestStreak, heatmapDays } =
    useQuran();
  const [pagesInput, setPagesInput] = useState("");
  const [positionInput, setPositionInput] = useState("");

  if (!loaded) {
    return (
      <Card title="Qur'an" icon={<OpenBookIcon className="h-5 w-5" />}>
        <p className="text-sm text-ink-muted">Loading…</p>
      </Card>
    );
  }

  const progress = goal > 0 ? Math.min(100, Math.round((todayPages / goal) * 100)) : 0;

  return (
    <Card
      title="Qur'an"
      icon={<OpenBookIcon className="h-5 w-5" />}
      action={
        <span className="text-xs text-ink-muted">
          {todayPages}/{goal} pages today
        </span>
      }
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-soft">
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
          className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-surface transition-transform hover:-translate-y-px"
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

      <div className="mt-5 flex gap-8 text-sm">
        <div>
          <div className="font-display text-3xl text-gold">{currentStreak}</div>
          <div className="text-xs text-ink-muted">day streak</div>
        </div>
        <div>
          <div className="font-display text-3xl text-ink">{longestStreak}</div>
          <div className="text-xs text-ink-muted">longest</div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Heatmap days={heatmapDays} tone="gold" />
      </div>
    </Card>
  );
}
