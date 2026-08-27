import type { ReactNode } from "react";

export function Card({
  title,
  icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(58,42,28,0.06),0_18px_36px_-20px_rgba(58,42,28,0.4)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(58,42,28,0.08),0_28px_48px_-20px_rgba(58,42,28,0.5)] sm:p-7 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <svg
        viewBox="0 0 40 40"
        className="pointer-events-none absolute left-0 top-0 h-7 w-7 text-gold opacity-20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path d="M1 14V5a4 4 0 0 1 4-4h9" />
        <path d="M1 9c5 0 8 3 8 8" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        className="pointer-events-none absolute right-0 top-0 h-7 w-7 -scale-x-100 text-gold opacity-20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path d="M1 14V5a4 4 0 0 1 4-4h9" />
        <path d="M1 9c5 0 8 3 8 8" />
      </svg>
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              {icon}
            </span>
          )}
          <h2 className="font-display text-xl text-ink">{title}</h2>
        </div>
        {action}
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}
