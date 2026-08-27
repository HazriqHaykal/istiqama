export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  page: number;
}

export interface SurahText {
  meta: SurahMeta;
  arabic: Ayah[];
  translation: Ayah[];
}

const BASE = "https://api.alquran.cloud/v1";

let surahListCache: SurahMeta[] | null = null;
const surahTextCache = new Map<number, SurahText>();

export async function fetchSurahList(): Promise<SurahMeta[]> {
  if (surahListCache) return surahListCache;
  const res = await fetch(`${BASE}/surah`);
  if (!res.ok) throw new Error("Couldn't load the surah list.");
  const body = await res.json();
  surahListCache = body.data as SurahMeta[];
  return surahListCache;
}

export async function fetchSurah(number: number): Promise<SurahText> {
  const cached = surahTextCache.get(number);
  if (cached) return cached;

  const res = await fetch(`${BASE}/surah/${number}/editions/quran-uthmani,en.sahih`);
  if (!res.ok) throw new Error("Couldn't load this surah. Try again shortly.");
  const body = await res.json();
  const [arabicEd, translationEd] = body.data as Array<{
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs: Ayah[];
  }>;

  const surah: SurahText = {
    meta: {
      number: arabicEd.number,
      name: arabicEd.name,
      englishName: arabicEd.englishName,
      englishNameTranslation: arabicEd.englishNameTranslation,
      numberOfAyahs: arabicEd.numberOfAyahs,
      revelationType: arabicEd.revelationType,
    },
    arabic: arabicEd.ayahs,
    translation: translationEd.ayahs,
  };
  surahTextCache.set(number, surah);
  return surah;
}
