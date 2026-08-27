"use client";

import { useState } from "react";
import { PRAYER_NAMES, type PrayerTimesState } from "@/lib/prayer/usePrayerTimes";
import { useCompassHeading } from "@/lib/prayer/useCompassHeading";
import { Card } from "./Card";
import { CompassIcon, MosqueIcon } from "./icons";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PrayerCard({ prayer }: { prayer: PrayerTimesState }) {
  const {
    status,
    error,
    timings,
    method,
    setMethod,
    methodOptions,
    setManualCity,
    clearLocation,
    next,
    countdown,
    progress,
    qiblaBearing,
  } = prayer;
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const compass = useCompassHeading();
  const liveRotation =
    qiblaBearing !== null && compass.state === "active" && compass.heading !== null
      ? (qiblaBearing - compass.heading + 360) % 360
      : qiblaBearing;

  return (
    <Card
      title="Prayer Times"
      icon={<MosqueIcon className="h-5 w-5" />}
      action={
        <select
          value={method}
          onChange={(e) => setMethod(Number(e.target.value))}
          className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs text-ink"
        >
          {methodOptions.map((m) => (
            <option key={m.value} value={m.value} className="bg-surface text-ink">
              {m.label}
            </option>
          ))}
        </select>
      }
    >
      {status === "needs-location" && (
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (city && country) setManualCity(city, country);
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className="rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-surface transition-transform hover:-translate-y-px active:scale-[0.97]"
          >
            Use city
          </button>
        </form>
      )}

      {(status === "locating" || status === "loading") && (
        <p className="text-sm text-ink-muted">Loading prayer times…</p>
      )}

      {status === "error" && (
        <div className="text-sm text-ink-muted">
          {error ?? "Couldn't load prayer times."}{" "}
          <button onClick={clearLocation} className="text-primary underline">
            Change location
          </button>
        </div>
      )}

      {status === "ready" && timings && (
        <>
          {next && countdown && (
            <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--primary-soft)" strokeWidth="7" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ink-muted">Next</p>
                  <p className="font-display text-base text-primary">{next.name}</p>
                  <p className="mt-1 font-display text-xl tabular-nums text-ink">
                    {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ul className="grid grid-cols-5 gap-2 text-center text-xs">
            {PRAYER_NAMES.map((name) => (
              <li
                key={name}
                className={`rounded-2xl border py-2.5 transition-colors ${
                  next?.name === name
                    ? "border-primary bg-primary text-surface"
                    : "border-hairline bg-transparent text-ink"
                }`}
              >
                <div className={next?.name === name ? "text-surface/70" : "text-ink-muted"}>{name}</div>
                <div className="mt-0.5 font-medium tabular-nums">
                  {timings[name]?.match(/\d{1,2}:\d{2}/)?.[0]}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4 text-sm">
            <span className="flex items-center gap-2 text-ink-muted">
              <CompassIcon className="h-4 w-4" />
              Qibla
            </span>
            {qiblaBearing !== null ? (
              <div className="flex items-center gap-3">
                {compass.state !== "active" && compass.state !== "unsupported" && (
                  <button onClick={compass.enable} className="text-xs text-primary underline decoration-dotted underline-offset-2">
                    {compass.state === "denied" ? "Compass blocked — retry" : "Live compass"}
                  </button>
                )}
                <span className="flex items-center gap-2 font-medium text-ink">
                  <CompassIcon
                    className="h-4 w-4 text-gold transition-transform duration-200 ease-linear"
                    style={{ transform: `rotate(${liveRotation}deg)` }}
                  />
                  {compass.state === "active" ? "Facing marker" : `${Math.round(qiblaBearing)}° from North`}
                </span>
              </div>
            ) : (
              <span className="text-xs text-ink-muted">Enable location for Qibla direction</span>
            )}
          </div>

          <button onClick={clearLocation} className="mt-3 text-xs text-ink-muted underline">
            Change location
          </button>
        </>
      )}
    </Card>
  );
}
