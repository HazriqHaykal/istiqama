"use client";

import { useCallback, useMemo } from "react";
import hadithData from "@/data/hadiths.json";
import { useSyncedState } from "@/lib/sync/useSyncedState";
import { dayOfYear, lastNDateKeys, todayKey } from "@/lib/date";

export interface Hadith {
  id: string;
  translation: string;
  source: string;
  explanation: string;
}

/** Which date's hadith was marked read, keyed by date so weekly/streak stats are derivable. */
const READ_LOG_KEY = "istiqama:hadith:readLog";
const EMPTY_LOG: Record<string, true> = {};

const hadiths = hadithData.hadiths as Hadith[];
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pickForDate(date: Date): Hadith | null {
  if (Number.isNaN(date.getTime())) return null;
  const index = dayOfYear(date) % hadiths.length;
  return hadiths[index] ?? null;
}

export function useHadith() {
  const { value: readLog, setValue: setReadLog, loaded } = useSyncedState<Record<string, true>>(
    READ_LOG_KEY,
    "hadith_read",
    EMPTY_LOG
  );
  // hadiths is a static, non-empty dataset, so today's pick can never be null.
  const today = useMemo(() => pickForDate(new Date()) as Hadith, []);
  const key = todayKey();

  const isRead = !!readLog[key];

  const markAsRead = useCallback(() => {
    setReadLog((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, [setReadLog, key]);

  const history = useMemo(
    () =>
      Object.keys(readLog)
        .filter((dateKey) => DATE_KEY_PATTERN.test(dateKey))
        .sort()
        .reverse()
        .map((dateKey) => ({ date: dateKey, hadith: pickForDate(new Date(`${dateKey}T00:00:00`)) }))
        .filter((entry): entry is { date: string; hadith: Hadith } => entry.hadith !== null),
    [readLog]
  );

  const weekCount = useMemo(() => lastNDateKeys(7).filter((k) => readLog[k]).length, [readLog]);

  return { loaded, today, isRead, markAsRead, history, note: hadithData.note, weekCount };
}
