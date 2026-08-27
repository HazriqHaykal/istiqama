-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- One row per user, mirroring the app's localStorage shapes so sync/migration is a direct copy.

create table if not exists app_state (
  user_id uuid primary key references auth.users on delete cascade,
  tahajud_log jsonb not null default '{}',
  quran_log jsonb not null default '{}',
  quran_goal int not null default 5,
  hadith_read jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table app_state enable row level security;

create policy "own row" on app_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
