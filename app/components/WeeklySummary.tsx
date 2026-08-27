"use client";

import { useHadith } from "@/lib/hadith/useHadith";
import { useQuran } from "@/lib/quran/useQuran";
import { useTahajud } from "@/lib/tahajud/useTahajud";
import { CrescentIcon, OpenBookIcon, ScrollIcon } from "./icons";

export function WeeklySummary() {
  const tahajud = useTahajud();
  const quran = useQuran();
  const hadith = useHadith();

  if (!tahajud.loaded || !quran.loaded || !hadith.loaded) return null;

  const stats = [
    { label: "Tahajud", value: tahajud.weekCount, icon: CrescentIcon },
    { label: "Qur'an days", value: quran.weekCount, icon: OpenBookIcon },
    { label: "Hadith read", value: hadith.weekCount, icon: ScrollIcon },
  ];

  return (
    <div className="stagger mb-5 grid grid-cols-3 divide-x divide-hairline overflow-hidden rounded-[28px] border border-hairline bg-surface sm:mb-6">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-2xl leading-none text-ink">
              {value}
              <span className="text-sm text-ink-muted">/7</span>
            </p>
            <p className="mt-1 text-xs text-ink-muted">{label} this week</p>
          </div>
        </div>
      ))}
    </div>
  );
}
