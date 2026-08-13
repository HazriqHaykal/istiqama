🕌 istiqama (Stay consistent. Stay connected. ) — Full Project Description
📌 1. Project Overview
istiqama is a responsive web application designed to help Muslims build consistency in daily worship habits. It brings together prayer time tracking, night prayer (Tahajud) goal tracking, Qur'an reading streaks, and daily hadith learning — all in one simple, visual dashboard.
The core problem it solves: Muslims often use 3–4 separate apps (one for prayer times, one for Qur'an, one for hadith, a notes app for tracking habits). Deen Companion combines these into one lightweight, no-friction web app that works instantly without forcing a signup.
Target user: Muslims (starting with yourself as the primary user) who want a simple daily companion to stay consistent with worship — especially useful for students balancing busy schedules.

🎯 2. Core Objectives
Objective
Description
🕋 Never miss prayer times
Show accurate azan timings + countdown to next prayer
🌙 Build Tahajud consistency
Simple daily tracker + streak to build the habit
📖 Build Qur'an reading habit
Daily streak tracker with progress logging
📜 Daily Islamic learning
One hadith + tafsir per day, in simple language
💻 Accessible anywhere
Fully responsive — works on desktop & mobile browser, no app install needed
🔓 Zero friction to start
No forced login — works immediately, login optional for data sync


⚙️ 3. Core Features (Full Breakdown)
🕌 A. Prayer Times & Azan Countdown
Auto-detect location (GPS) or manual city search
Calculation method: JAKIM (Malaysia) by default, since that fits your location — other methods selectable
Live countdown to next prayer (e.g. "Asr in 1h 23m")
Visual indicator showing current prayer window
Qibla direction (using compass/geolocation)
Data source: AlAdhan API (free, no API key required)
🌙 B. Tahajud Goal Tracker
Daily toggle: "Did you pray Tahajud today?" ✅ / ❌
Weekly & monthly streak counter
Reminder notification ~30–60 mins before Fajr
GitHub-style heatmap calendar to visualize consistency over time
📖 C. Al-Qur'an Reading Streak
Daily log: pages/juz read (not just yes/no — more motivating)
Streak counter + "longest streak" record
Tracks last read position (surah/juz) so user doesn't lose their place
Optional in-app Qur'an reading via Al-Qur'an Cloud API (free)
Visual progress bar toward personal daily goal
📜 D. One Hadith a Day + Tafsir
One curated hadith shown per day (auto-rotates, no repeats until full cycle)
Short, simple-language tafsir/explanation included
Source reference shown (e.g. Sahih Bukhari, Book X, Hadith Y)
"Mark as read" + history log of all hadiths seen
Data source: static curated JSON dataset (~100–300 hadiths) for accuracy & quality control
🏠 E. Daily Dashboard (Home Screen)
One-glance view of: next azan countdown, today's Tahajud status, Qur'an streak, today's hadith
Weekly progress summary (e.g. "You prayed Tahajud 4/7 days this week")
Clean white-background UI with soft accent colors, visual & simple (not text-heavy)

🏗️ 4. Technical Architecture
Frontend
React + Tailwind CSS — responsive, clean, fast to build
Fully responsive design (desktop-first but mobile-browser friendly) — no native app needed
Data Storage Strategy (Hybrid Approach ✅ your chosen plan)
Mode
Storage
Behavior
🟢 Default (no login)
Browser localStorage
Works instantly, data stays on that device/browser only
🔵 Optional login
Supabase (Auth + Database)
Data syncs across devices; localStorage migrates to database on first login

App never forces signup — matches good UX for daily-use tools
Login button appears as: "Sign in to save your progress across devices"
External APIs
API
Purpose
Cost
AlAdhan API
Prayer times & azan timings
Free, no key
Al-Qur'an Cloud API
Qur'an text for in-app reading
Free, no key
Static JSON (self-curated)
Hadith + tafsir content
N/A (built by us)

Notifications
Browser push notifications (via Web Notifications API) for:
Upcoming azan
Tahajud reminder before Fajr
Daily hadith available

🎨 5. Visual Design Direction
White background, clean and minimal — calming, mosque-inspired aesthetic
Soft green/gold accent colors (Islamic app convention, easy on the eyes)
Visual-first UI: progress bars, streak heatmaps, countdown rings — minimal walls of text
Fully responsive: dashboard layout reflows cleanly from desktop → tablet → mobile browser

🚧 6. Build Phases
Phase
What's built
Phase 1 ✅ (current)
Full app UI + all 4 features working with localStorage (no login needed)
Phase 2
Add Supabase Auth (optional login) + database sync + localStorage → database migration
Phase 3 (future ideas)
Daily dua card, dark/light auto theme by time of day, community streak sharing, multi-language support


💡 7. Why This Project Is a Strong Portfolio Piece (as a SE student)
Combines frontend (React/Tailwind), API integration (2 external APIs), state management, local storage, and later auth + database (Supabase)
Real-world UX decision-making (optional login, offline-first design)
Solves a genuine personal problem — strong storytelling for interviews/portfolio
Extendable — easy to keep adding features over time (great for showing iterative development)

Next step: Build Phase 1 — full working dashboard with all 4 features using localStorage.

