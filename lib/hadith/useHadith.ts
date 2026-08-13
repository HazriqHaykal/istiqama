"use client";

import { useCallback, useMemo } from "react";
import hadithData from "@/data/hadiths.json";
import { useSyncedState } from "@/lib/sync/useSyncedState";
import { dayOfYear } from "@/lib/date";

export interface Hadith {
  id: string;
  translation: string;
  source: string;
  explanation: string;
}

const READ_HISTORY_KEY = "istiqama:hadith:read";
const EMPTY_READ: string[] = [];

const hadiths = hadithData.hadiths as Hadith[];

function pickForToday(): Hadith {
  const index = dayOfYear(new Date()) % hadiths.length;
  return hadiths[index];
}

export function useHadith() {
  const { value: readIds, setValue: setReadIds, loaded } = useSyncedState<string[]>(
    READ_HISTORY_KEY,
    "hadith_read",
    EMPTY_READ
  );
  const today = useMemo(() => pickForToday(), []);

  const isRead = readIds.includes(today.id);

  const markAsRead = useCallback(() => {
    setReadIds((prev) => (prev.includes(today.id) ? prev : [...prev, today.id]));
  }, [setReadIds, today.id]);

  const history = useMemo(() => hadiths.filter((h) => readIds.includes(h.id)), [readIds]);

  return { loaded, today, isRead, markAsRead, history, note: hadithData.note };
}
