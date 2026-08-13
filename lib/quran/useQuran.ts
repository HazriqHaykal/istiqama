"use client";

import { useCallback, useMemo } from "react";
import { useSyncedState } from "@/lib/sync/useSyncedState";
import { lastNDateKeys, todayKey } from "@/lib/date";
import { computeStreaks } from "@/lib/streak";

const LOG_KEY = "istiqama:quran:log";
const GOAL_KEY = "istiqama:quran:goal";
const DEFAULT_GOAL = 5;

export interface QuranEntry {
  pages: number;
  position?: string;
}

export type QuranLog = Record<string, QuranEntry>;

const EMPTY_LOG: QuranLog = {};

export function useQuran() {
  const { value: log, setValue: setLog, loaded: logLoaded } = useSyncedState<QuranLog>(
    LOG_KEY,
    "quran_log",
    EMPTY_LOG
  );
  const { value: goal, setValue: setGoal, loaded: goalLoaded } = useSyncedState<number>(
    GOAL_KEY,
    "quran_goal",
    DEFAULT_GOAL
  );
  const loaded = logLoaded && goalLoaded;

  const logToday = useCallback(
    (pages: number, position?: string) => {
      setLog((prev) => {
        const key = todayKey();
        const existing = prev[key];
        return { ...prev, [key]: { pages, position: position ?? existing?.position } };
      });
    },
    [setLog]
  );

  const todayPages = log[todayKey()]?.pages ?? 0;

  const lastPosition = useMemo(() => {
    const keys = Object.keys(log).sort();
    for (let i = keys.length - 1; i >= 0; i--) {
      const entry = log[keys[i]];
      if (entry?.position) return entry.position;
    }
    return undefined;
  }, [log]);

  const { current, longest } = useMemo(() => {
    const completed = new Set(Object.keys(log).filter((k) => (log[k]?.pages ?? 0) > 0));
    return computeStreaks(completed);
  }, [log]);

  const heatmapDays = useMemo(
    () => lastNDateKeys(90).map((key) => ({ key, value: log[key]?.pages ?? 0 })),
    [log]
  );

  return {
    loaded,
    todayPages,
    logToday,
    goal,
    setGoal,
    lastPosition,
    currentStreak: current,
    longestStreak: longest,
    heatmapDays,
  };
}
