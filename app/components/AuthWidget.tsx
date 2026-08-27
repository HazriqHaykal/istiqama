"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";

export function AuthWidget() {
  const { user, status, error, signIn, signUp, signOut, isSupabaseConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isSupabaseConfigured) return null;

  if (status === "signed-in" && user) {
    return (
      <div className="flex items-center gap-3 text-xs text-ink-muted">
        <span className="hidden sm:inline">{user.email}</span>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-hairline px-3 py-1.5 transition-colors hover:border-primary hover:text-primary"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-hairline px-4 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
      >
        Sign in to sync
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-2xl border border-hairline bg-surface p-5 text-left shadow-[0_18px_36px_-20px_rgba(58,42,28,0.35)]">
          <div className="mb-3 flex gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={mode === "sign-in" ? "text-primary" : "text-ink-muted"}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={mode === "sign-up" ? "text-primary" : "text-ink-muted"}
            >
              Sign up
            </button>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setMessage(null);
              if (mode === "sign-in") {
                await signIn(email, password);
              } else {
                await signUp(email, password);
                setMessage("Check your email to confirm your account, then sign in.");
              }
              setSubmitting(false);
            }}
          >
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full border border-hairline bg-transparent px-4 py-2 text-sm placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-surface transition-all active:scale-[0.97] disabled:opacity-60"
            >
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {message && <p className="mt-2 text-xs text-ink-muted">{message}</p>}

          <p className="mt-3 text-[11px] leading-snug text-ink-muted">
            Optional — syncs Tahajud, Qur&apos;an, and Hadith progress across devices. Everything keeps working
            locally without an account.
          </p>
        </div>
      )}
    </div>
  );
}
