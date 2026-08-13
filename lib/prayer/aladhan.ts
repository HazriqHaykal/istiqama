export interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface AladhanResponse {
  data: {
    timings: PrayerTimings;
  };
}

async function requestTimings(url: string): Promise<PrayerTimings> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Couldn't reach the prayer times service. Try again shortly.");
  }
  const body: AladhanResponse = await res.json();
  return body.data.timings;
}

export async function fetchTimingsByCoords(
  lat: number,
  lng: number,
  method: number,
  date: Date = new Date()
): Promise<PrayerTimings> {
  const timestamp = Math.floor(date.getTime() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${method}`;
  return requestTimings(url);
}

export async function fetchTimingsByCity(
  city: string,
  country: string,
  method: number,
  date: Date = new Date()
): Promise<PrayerTimings> {
  const timestamp = Math.floor(date.getTime() / 1000);
  const url = `https://api.aladhan.com/v1/timingsByCity/${timestamp}?city=${encodeURIComponent(
    city
  )}&country=${encodeURIComponent(country)}&method=${method}`;
  return requestTimings(url);
}

/** AlAdhan timings sometimes include a timezone suffix like "05:12 (AWST)" — pull out just HH:MM. */
export function parseTimeToday(value: string, base: Date): Date {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  const h = match ? Number(match[1]) : 0;
  const m = match ? Number(match[2]) : 0;
  const date = new Date(base);
  date.setHours(h, m, 0, 0);
  return date;
}
