"use client";

import { useTahajud } from "@/lib/tahajud/useTahajud";
import { Card } from "./Card";
import { CrescentIcon } from "./icons";
import { Heatmap } from "./Heatmap";

export function TahajudCard() {
  const { loaded, isTodayDone, toggleToday, currentStreak, longestStreak, weekCount, heatmapDays } =
    useTahajud();

  if (!loaded) {
    return (
      <Card title="Tahajud" icon={<CrescentIcon className="h-5 w-5" />}>
        <p className="text-sm text-ink-muted">Loading…</p>
      </Card>
    );
  }

  return (
    <Card
      title="Tahajud"
      icon={<CrescentIcon className="h-5 w-5" />}
      action={<span className="text-xs text-ink-muted">{weekCount}/7 this week</span>}
    >
      <button
        onClick={toggleToday}
        className={`w-full rounded-full py-3 text-sm font-medium transition-all ${
          isTodayDone
            ? "bg-primary text-surface"
            : "border border-hairline text-ink hover:-translate-y-px active:scale-[0.97] hover:border-primary"
        }`}
      >
        {isTodayDone ? "Prayed Tahajud today ✓" : "Mark Tahajud as done today"}
      </button>

      <div className="mt-5 flex gap-8 text-sm">
        <div>
          <div className="font-display text-3xl text-primary">{currentStreak}</div>
          <div className="text-xs text-ink-muted">day streak</div>
        </div>
        <div>
          <div className="font-display text-3xl text-ink">{longestStreak}</div>
          <div className="text-xs text-ink-muted">longest</div>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Heatmap days={heatmapDays} tone="primary" />
      </div>
    </Card>
  );
}
