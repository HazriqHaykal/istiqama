"use client";

import { AuthWidget } from "./components/AuthWidget";
import { HadithCard } from "./components/HadithCard";
import { Ornament } from "./components/icons";
import { NotificationsWidget } from "./components/NotificationsWidget";
import { PrayerCard } from "./components/PrayerCard";
import { QuranCard } from "./components/QuranCard";
import { SiteNav } from "./components/SiteNav";
import { TahajudCard } from "./components/TahajudCard";
import { WeeklySummary } from "./components/WeeklySummary";
import { usePrayerTimes } from "@/lib/prayer/usePrayerTimes";

export default function Home() {
  const prayer = usePrayerTimes();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="relative mb-12 text-center sm:mb-16">
        <div className="absolute left-0 top-0">
          <NotificationsWidget next={prayer.next} fajrAt={prayer.fajrAt} />
        </div>
        <div className="absolute right-0 top-0">
          <AuthWidget />
        </div>
        <p className="font-display text-sm uppercase tracking-[0.35em] text-gold">
          Stay consistent. Stay connected.
        </p>
        <h1 className="mt-3 font-display text-6xl text-ink sm:text-7xl">istiqama</h1>
        <Ornament className="ornament-glow mx-auto mt-6 h-4 w-32 text-gold" />
        <div className="mt-6 flex justify-center">
          <SiteNav />
        </div>
      </header>

      <WeeklySummary />

      <div className="stagger grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:grid-rows-2">
        <div className="lg:col-span-2">
          <PrayerCard prayer={prayer} />
        </div>
        <div className="lg:row-span-2">
          <HadithCard />
        </div>
        <TahajudCard />
        <QuranCard />
      </div>
    </div>
  );
}
