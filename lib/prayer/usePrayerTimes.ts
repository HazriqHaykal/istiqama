"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getItem, setItem } from "@/lib/storage";
import { addDays, todayKey } from "@/lib/date";
import { fetchTimingsByCity, fetchTimingsByCoords, parseTimeToday, type PrayerTimings } from "./aladhan";
import { calculateQiblaBearing } from "./qibla";

const LOCATION_KEY = "istiqama:prayer:location";
const METHOD_KEY = "istiqama:prayer:method";
const CACHE_KEY = "istiqama:prayer:cache";

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export const METHOD_OPTIONS = [
  { value: 17, label: "JAKIM (Malaysia)" },
  { value: 3, label: "Muslim World League" },
  { value: 2, label: "ISNA (North America)" },
  { value: 4, label: "Umm Al-Qura, Makkah" },
  { value: 5, label: "Egyptian General Authority" },
];

type Location =
  | { type: "coords"; lat: number; lng: number }
  | { type: "city"; city: string; country: string };

type Status = "idle" | "locating" | "loading" | "ready" | "error" | "needs-location";

interface CachedTimings {
  date: string;
  method: number;
  locationKey: string;
  timings: PrayerTimings;
}

function locationKey(loc: Location): string {
  return loc.type === "coords"
    ? `coords:${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`
    : `city:${loc.city.toLowerCase()},${loc.country.toLowerCase()}`;
}

export function usePrayerTimes() {
  const [location, setLocationState] = useState<Location | null>(null);
  const [method, setMethodState] = useState<number>(17);
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Reads localStorage on mount only — this must run after hydration since
    // the server has no window/localStorage to read from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMethodState(getItem<number>(METHOD_KEY, 17));

    const storedLocation = getItem<Location | null>(LOCATION_KEY, null);
    if (storedLocation) {
      setLocationState(storedLocation);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setStatus("locating");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: Location = { type: "coords", lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocationState(loc);
          setItem(LOCATION_KEY, loc);
        },
        () => setStatus("needs-location"),
        { timeout: 10000 }
      );
    } else {
      setStatus("needs-location");
    }
  }, []);

  const setManualCity = useCallback((city: string, country: string) => {
    const loc: Location = { type: "city", city, country };
    setLocationState(loc);
    setItem(LOCATION_KEY, loc);
  }, []);

  const setMethod = useCallback((value: number) => {
    setMethodState(value);
    setItem(METHOD_KEY, value);
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    setItem<Location | null>(LOCATION_KEY, null);
    setStatus("needs-location");
  }, []);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    const key = locationKey(location);

    const cached = getItem<CachedTimings | null>(CACHE_KEY, null);
    if (cached && cached.date === todayKey() && cached.method === method && cached.locationKey === key) {
      // Cache hit — reuse it instead of refetching from the network.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimings(cached.timings);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    setError(null);

    (async () => {
      try {
        const result =
          location.type === "coords"
            ? await fetchTimingsByCoords(location.lat, location.lng, method)
            : await fetchTimingsByCity(location.city, location.country, method);
        if (cancelled) return;
        setTimings(result);
        setStatus("ready");
        setItem<CachedTimings>(CACHE_KEY, { date: todayKey(), method, locationKey: key, timings: result });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load prayer times");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location, method]);

  const qiblaBearing = useMemo(() => {
    if (location?.type === "coords") return calculateQiblaBearing(location.lat, location.lng);
    return null;
  }, [location]);

  const next = useMemo(() => {
    if (!timings) return null;
    const upcoming = PRAYER_NAMES.map((name) => ({ name, at: parseTimeToday(timings[name], now) })).find(
      (prayer) => prayer.at.getTime() > now.getTime()
    );
    if (upcoming) return upcoming;
    const fajr = parseTimeToday(timings.Fajr, now);
    return { name: "Fajr" as PrayerName, at: addDays(fajr, 1) };
  }, [timings, now]);

  const countdown = useMemo(() => {
    if (!next) return null;
    const totalSeconds = Math.max(0, Math.floor((next.at.getTime() - now.getTime()) / 1000));
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [next, now]);

  const previous = useMemo(() => {
    if (!timings || !next) return null;
    const idx = PRAYER_NAMES.indexOf(next.name as PrayerName);
    const prevName = PRAYER_NAMES[(idx - 1 + PRAYER_NAMES.length) % PRAYER_NAMES.length];
    const at = parseTimeToday(timings[prevName], now);
    return { name: prevName, at: at.getTime() >= next.at.getTime() ? addDays(at, -1) : at };
  }, [timings, next, now]);

  // Fraction of the current prayer window that has elapsed — drives the countdown ring.
  const progress = useMemo(() => {
    if (!next || !previous) return 0;
    const total = next.at.getTime() - previous.at.getTime();
    if (total <= 0) return 0;
    return Math.min(1, Math.max(0, (now.getTime() - previous.at.getTime()) / total));
  }, [next, previous, now]);

  return {
    status,
    error,
    timings,
    method,
    setMethod,
    methodOptions: METHOD_OPTIONS,
    location,
    setManualCity,
    clearLocation,
    next,
    countdown,
    progress,
    qiblaBearing,
  };
}
