"use client";

import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import { getItem, setItem } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/useAuth";

export type SyncColumn = "tahajud_log" | "quran_log" | "quran_goal" | "hadith_read";

const DEBOUNCE_MS = 800;

/**
 * localStorage-backed state (works with no account) that additionally syncs
 * to a single Supabase `app_state` column once the user is signed in:
 * first login either migrates the local value up or pulls the existing
 * remote value down (remote wins if it already exists), then every local
 * change is debounced and upserted.
 */
export function useSyncedState<T>(localKey: string, column: SyncColumn, fallback: T) {
  const { user, status } = useAuth();
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  const migratedForUser = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reads localStorage on mount only — this must run after hydration since
    // the server has no window/localStorage to read from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(getItem<T>(localKey, fallback));
    setLoaded(true);
    // fallback is expected to be a stable module-level constant per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localKey]);

  useEffect(() => {
    if (!supabase || status !== "signed-in" || !user) return;
    if (migratedForUser.current === user.id) return;
    migratedForUser.current = user.id;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("app_state")
          .select(column)
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) return;

        const remoteValue = (data as Record<string, unknown> | null)?.[column];
        if (remoteValue !== undefined && remoteValue !== null) {
          setValue(remoteValue as T);
          setItem(localKey, remoteValue as T);
        } else {
          const current = getItem<T>(localKey, fallback);
          await supabase.from("app_state").upsert({ user_id: user.id, [column]: current });
        }
      } catch {
        // Supabase not reachable/configured yet — keep working from localStorage.
      }
    })();
  }, [status, user, column, localKey, fallback]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const update = useCallback(
    (action: SetStateAction<T>) => {
      setValue((prev) => {
        const next = typeof action === "function" ? (action as (prev: T) => T)(prev) : action;
        setItem(localKey, next);

        const client = supabase;
        if (client && user) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            (async () => {
              await client.from("app_state").upsert({ user_id: user.id, [column]: next });
            })();
          }, DEBOUNCE_MS);
        }

        return next;
      });
    },
    [localKey, column, user]
  );

  return { value, setValue: update, loaded };
}
