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
      className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-hairline bg-surface p-6 shadow-[0_1px_2px_rgba(18,40,30,0.05),0_18px_36px_-20px_rgba(18,40,30,0.35)] sm:p-7 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />
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
