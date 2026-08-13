import { addDays, toDateKey } from "./date";

export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * current: consecutive completed days ending today (or yesterday, if today
 * isn't logged yet — so the streak doesn't look broken before the day is over).
 * longest: longest consecutive run anywhere in the log.
 */
export function computeStreaks(completedDates: Set<string>, today: Date = new Date()): StreakResult {
  let current = 0;
  let cursor = today;
  if (!completedDates.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (completedDates.has(toDateKey(cursor))) {
    current++;
    cursor = addDays(cursor, -1);
  }

  const sorted = Array.from(completedDates).sort();
  let longest = 0;
  let run = 0;
  let prevDate: Date | null = null;
  for (const key of sorted) {
    const d = new Date(`${key}T00:00:00`);
    if (prevDate && addDays(prevDate, 1).getTime() === d.getTime()) {
      run++;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prevDate = d;
  }

  return { current, longest: Math.max(longest, current) };
}
