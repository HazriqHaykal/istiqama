"use client";

import { useState } from "react";
import { usePrayerReminders, useNotifications } from "@/lib/notifications/useNotifications";
import { BellIcon } from "./icons";

export function NotificationsWidget({ next, fajrAt }: { next: { name: string; at: Date } | null; fajrAt: Date | null }) {
  const { loaded, permission, settings, setSettings, requestPermission } = useNotifications();
  const [open, setOpen] = useState(false);
  usePrayerReminders(permission, settings, next, fajrAt);

  if (!loaded || permission === "unsupported") return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
      >
        <BellIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Reminders</span>
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-2 w-72 rounded-2xl border border-hairline bg-surface p-5 text-left shadow-[0_18px_36px_-20px_rgba(58,42,28,0.35)]">
          {permission === "default" && (
            <>
              <p className="text-sm text-ink">Get notified before azan, before Fajr for Tahajud, and when a new hadith is ready.</p>
              <button
                onClick={requestPermission}
                className="mt-3 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-surface transition-transform hover:-translate-y-px active:scale-[0.97]"
              >
                Enable notifications
              </button>
            </>
          )}

          {permission === "denied" && (
            <p className="text-sm text-ink-muted">
              Notifications are blocked for this site. Enable them in your browser&apos;s site settings to use
              reminders.
            </p>
          )}

          {permission === "granted" && (
            <div className="flex flex-col gap-4 text-sm">
              <label className="flex items-center justify-between gap-3">
                <span className="text-ink">Azan reminder</span>
                <input
                  type="checkbox"
                  checked={settings.azanReminder}
                  onChange={(e) => setSettings({ azanReminder: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </label>
              {settings.azanReminder && (
                <label className="-mt-2 flex items-center justify-between gap-3 text-xs text-ink-muted">
                  Minutes before
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={settings.azanLeadMinutes}
                    onChange={(e) => setSettings({ azanLeadMinutes: Math.max(1, Number(e.target.value) || 1) })}
                    className="w-14 rounded-full border border-hairline bg-transparent px-2 py-1 text-xs"
                  />
                </label>
              )}

              <label className="flex items-center justify-between gap-3">
                <span className="text-ink">Tahajud reminder</span>
                <input
                  type="checkbox"
                  checked={settings.tahajudReminder}
                  onChange={(e) => setSettings({ tahajudReminder: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </label>
              {settings.tahajudReminder && (
                <label className="-mt-2 flex items-center justify-between gap-3 text-xs text-ink-muted">
                  Minutes before Fajr
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={settings.tahajudLeadMinutes}
                    onChange={(e) => setSettings({ tahajudLeadMinutes: Math.max(5, Number(e.target.value) || 5) })}
                    className="w-14 rounded-full border border-hairline bg-transparent px-2 py-1 text-xs"
                  />
                </label>
              )}

              <label className="flex items-center justify-between gap-3">
                <span className="text-ink">Daily hadith ping</span>
                <input
                  type="checkbox"
                  checked={settings.hadithReminder}
                  onChange={(e) => setSettings({ hadithReminder: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </label>

              <p className="text-[11px] leading-snug text-ink-muted">
                Reminders only fire while this tab is open — there&apos;s no background/push delivery.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
