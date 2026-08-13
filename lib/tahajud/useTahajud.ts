"use client";

import { useCallback, useMemo } from "react";
import { useSyncedState } from "@/lib/sync/useSyncedState";
import { lastNDateKeys, todayKey } from "@/lib/date";
import { computeStreaks } from "@/lib/streak";

const STORAGE_KEY = "istiqama:tahajud:log";

export type TahajudLog = Record<string, boolean>;

const EMPTY_LOG: TahajudLog = {};

export function useTahajud() {
  const { value: log, setValue: setLog, loaded } = useSyncedState<TahajudLog>(
    STORAGE_KEY,
    "tahajud_log",
    EMPTY_LOG
  );

  const toggleToday = useCallback(() => {
    setLog((prev) => {
      const key = todayKey();
      return { ...prev, [key]: !prev[key] };
    });
  }, [setLog]);

  const isTodayDone = !!log[todayKey()];

  const { current, longest } = useMemo(() => {
    const completed = new Set(Object.keys(log).filter((k) => log[k]));
    return computeStreaks(completed);
  }, [log]);

  const weekCount = useMemo(() => lastNDateKeys(7).filter((k) => log[k]).length, [log]);

  const heatmapDays = useMemo(
    () => lastNDateKeys(90).map((key) => ({ key, value: log[key] ? 1 : 0 })),
    [log]
  );

  return {
    loaded,
    isTodayDone,
    toggleToday,
    currentStreak: current,
    longestStreak: longest,
    weekCount,
    heatmapDays,
  };
}
