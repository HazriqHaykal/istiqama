"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchSurah, fetchSurahList, type SurahMeta, type SurahText } from "@/lib/quran/alquranCloud";

/** Parses a position string like "Al-Baqara 2:15" (surah number : ayah number) back into ids. */
function parsePosition(position: string | undefined): { surah: number; ayah: number } | null {
  if (!position) return null;
  const match = position.match(/(\d+):(\d+)\s*$/);
  if (!match) return null;
  return { surah: Number(match[1]), ayah: Number(match[2]) };
}

export function QuranReader({
  lastPosition,
  onSavePosition,
}: {
  lastPosition?: string;
  onSavePosition: (position: string) => void;
}) {
  const [surahs, setSurahs] = useState<SurahMeta[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [surah, setSurah] = useState<SurahText | null>(null);
  const [textError, setTextError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSurahList()
      .then((data) => {
        if (cancelled) return;
        setSurahs(data);
        const resume = parsePosition(lastPosition);
        setSurahNumber(resume?.surah ?? 1);
      })
      .catch((e) => !cancelled && setListError(e instanceof Error ? e.message : "Couldn't load surahs."));
    return () => {
      cancelled = true;
    };
    // Only resolve the initial surah once, from whatever lastPosition was on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (surahNumber === null) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingText(true);
    setTextError(null);
    fetchSurah(surahNumber)
      .then((data) => !cancelled && setSurah(data))
      .catch((e) => !cancelled && setTextError(e instanceof Error ? e.message : "Couldn't load this surah."))
      .finally(() => !cancelled && setLoadingText(false));
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  const resumeAyah = useMemo(() => {
    const resume = parsePosition(lastPosition);
    return resume && resume.surah === surahNumber ? resume.ayah : null;
  }, [lastPosition, surahNumber]);

  return (
    <div>
      {listError && <p className="text-sm text-ink-muted">{listError}</p>}

      {surahs && (
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={surahNumber ?? 1}
            onChange={(e) => setSurahNumber(Number(e.target.value))}
            className="rounded-full border border-hairline bg-transparent px-4 py-2.5 text-sm text-ink"
          >
            {surahs.map((s) => (
              <option key={s.number} value={s.number} className="bg-surface text-ink">
                {s.number}. {s.englishName} — {s.englishNameTranslation}
              </option>
            ))}
          </select>
          {resumeAyah && <span className="text-xs text-ink-muted">Resuming at ayah {resumeAyah}</span>}
        </div>
      )}

      {loadingText && <p className="mt-6 text-sm text-ink-muted">Loading surah…</p>}
      {textError && <p className="mt-6 text-sm text-ink-muted">{textError}</p>}

      {surah && !loadingText && (
        <ul className="mt-6 space-y-8">
          {surah.arabic.map((ayah, i) => {
            const translation = surah.translation[i]?.text;
            const isResume = resumeAyah === ayah.numberInSurah;
            return (
              <li
                key={ayah.number}
                className={`rounded-2xl p-4 transition-colors sm:p-5 ${isResume ? "bg-primary-soft" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-display flex-1 text-right text-3xl leading-loose text-ink sm:text-4xl"
                  >
                    {ayah.text}
                  </p>
                  <span className="mt-1 shrink-0 rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-muted">
                    {ayah.numberInSurah}
                  </span>
                </div>
                {translation && <p className="mt-3 text-base leading-relaxed text-ink-muted">{translation}</p>}
                <button
                  onClick={() =>
                    onSavePosition(`${surah.meta.englishName} ${surah.meta.number}:${ayah.numberInSurah}`)
                  }
                  className="mt-3 text-xs text-primary underline decoration-dotted underline-offset-2"
                >
                  Save as last read
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
