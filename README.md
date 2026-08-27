# istiqama

*Stay consistent. Stay connected.*

A lightweight, no-signup-required dashboard for daily Muslim worship habits — prayer times, Tahajud, Qur'an reading, and a daily hadith, all in one place instead of four separate apps.

## Features

**Prayer Times** — live countdown to the next prayer, GPS or manual city lookup, selectable calculation method (JAKIM, MWL, ISNA, Umm Al-Qura, Egyptian), and a Qibla compass that tracks your phone's live heading (falls back to a static bearing when device orientation isn't available).

**Tahajud tracker** — one-tap daily toggle, current/longest streak, and a 90-day heatmap.

**Qur'an reading** — a dedicated `/quran` page for reading Arabic text with translation (Al Quran Cloud API), plus daily page logging, a progress goal, last-read position, streak, and heatmap.

**Hadith of the day** — one curated hadith + short explanation per day on a dedicated `/hadith` page, with a full browsable read history.

**Weekly summary** — an at-a-glance strip showing Tahajud/Qur'an/Hadith consistency for the week.

**Reminders** — optional browser notifications for an upcoming azan, a pre-Fajr Tahajud nudge, and a daily hadith ping (fires only while a tab is open — there's no push/service worker backend).

**Works with zero setup** — everything runs on `localStorage` by default. Signing in (optional, via Supabase) syncs the same data across devices.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- [Supabase](https://supabase.com) — optional auth + Postgres sync
- [AlAdhan API](https://aladhan.com/prayer-times-api) — prayer timings
- [Al Quran Cloud API](https://alquran.cloud/api) — Qur'an text + translation
- A static, self-curated JSON hadith dataset (`data/hadiths.json`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: enable cross-device sync

1. Create a [Supabase](https://supabase.com) project.
2. Run `supabase/schema.sql` in the Supabase SQL editor to create the `app_state` table.
3. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon/publishable key.
4. Restart the dev server. A "Sign in to sync" button appears once Supabase is configured.

Without this step, the app works fully offline-first using `localStorage` — signing in is never required.

## Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard — prayer times, Tahajud, quick Qur'an/Hadith summaries, weekly progress |
| `/quran` | Wide-format Qur'an reader + daily logging |
| `/hadith` | Today's hadith + full read history |

## Scripts

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Notes on data accuracy

Prayer times come from AlAdhan; Qur'an text (Uthmani script + Saheeh International translation) comes from Al Quran Cloud. Neither documents a formal scholarly verification partnership, so treat them as generally reliable but not infallible — cross-check against a printed mushaf or a source like Quran.com if precision matters to you. The hadith dataset is a small curated starter set; see the `note` field in `data/hadiths.json` for sourcing caveats.
