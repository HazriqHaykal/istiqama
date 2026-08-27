"use client";

import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/storage";
import { toDateKey } from "@/lib/date";

const SETTINGS_KEY = "istiqama:notifications:settings";
const AZAN_NOTIFIED_KEY = "istiqama:notifications:azanNotified";
const TAHAJUD_NOTIFIED_KEY = "istiqama:notifications:tahajudNotified";
const HADITH_NOTIFIED_KEY = "istiqama:notifications:hadithNotified";

const POLL_MS = 30_000;

export interface NotificationSettings {
  azanReminder: boolean;
  azanLeadMinutes: number;
  tahajudReminder: boolean;
  tahajudLeadMinutes: number;
  hadithReminder: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  azanReminder: true,
  azanLeadMinutes: 10,
  tahajudReminder: true,
  tahajudLeadMinutes: 45,
  hadithReminder: true,
};

export type PermissionState = "default" | "granted" | "denied" | "unsupported";

function isSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

function notify(title: string, body: string) {
  if (!isSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.ico" });
  } catch {
    // Some browsers (mainly mobile) require a service worker for direct Notification() — skip silently.
  }
}

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState>("unsupported");
  const [settings, setSettingsState] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettingsState(getItem(SETTINGS_KEY, DEFAULT_SETTINGS));
    setPermission(isSupported() ? Notification.permission : "unsupported");
    setLoaded(true);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported()) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const setSettings = useCallback((update: Partial<NotificationSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...update };
      setItem(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  return { loaded, permission, settings, setSettings, requestPermission };
}

/**
 * Polls (every 30s, while the tab is open) for reminders that should fire:
 * azan countdown, a pre-Fajr Tahajud nudge, and a once-a-day hadith ping.
 * There's no service worker/push here, so nothing fires while the tab is closed.
 */
export function usePrayerReminders(
  permission: PermissionState,
  settings: NotificationSettings,
  next: { name: string; at: Date } | null,
  fajrAt: Date | null
) {
  useEffect(() => {
    if (permission !== "granted") return;

    const tick = () => {
      const now = new Date();

      if (settings.azanReminder && next) {
        const target = new Date(next.at.getTime() - settings.azanLeadMinutes * 60_000);
        const notifiedKey = `${next.name}:${toDateKey(next.at)}`;
        if (now >= target && now < next.at && getItem(AZAN_NOTIFIED_KEY, "") !== notifiedKey) {
          notify(`${next.name} soon`, `${next.name} is in about ${settings.azanLeadMinutes} minutes.`);
          setItem(AZAN_NOTIFIED_KEY, notifiedKey);
        }
      }

      if (settings.tahajudReminder && fajrAt) {
        const target = new Date(fajrAt.getTime() - settings.tahajudLeadMinutes * 60_000);
        const notifiedKey = toDateKey(fajrAt);
        if (now >= target && now < fajrAt && getItem(TAHAJUD_NOTIFIED_KEY, "") !== notifiedKey) {
          notify("Tahajud reminder", `Fajr is in about ${settings.tahajudLeadMinutes} minutes — a good time to pray Tahajud.`);
          setItem(TAHAJUD_NOTIFIED_KEY, notifiedKey);
        }
      }

      if (settings.hadithReminder) {
        const todayKey = toDateKey(now);
        if (getItem(HADITH_NOTIFIED_KEY, "") !== todayKey) {
          notify("Today's hadith is ready", "Open istiqama to read today's hadith and tafsir.");
          setItem(HADITH_NOTIFIED_KEY, todayKey);
        }
      }
    };

    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [permission, settings, next, fajrAt]);
}
