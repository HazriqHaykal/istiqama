import type { SVGProps } from "react";

export function MosqueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c-1.8 1.4-2.6 2.8-2.6 4.2 0 1.5 1.2 2.6 2.6 2.6s2.6-1.1 2.6-2.6C14.6 5.8 13.8 4.4 12 3Z" />
      <path d="M3.5 20.5v-6c0-2.4 1.9-4.4 4.3-4.7v-1.1M20.5 20.5v-6c0-2.4-1.9-4.4-4.3-4.7v-1.1" />
      <path d="M8 20.5v-3.8a4 4 0 0 1 8 0v3.8" />
      <path d="M2.5 20.5h19M6.3 20.5v-2M17.7 20.5v-2" />
    </svg>
  );
}

export function CrescentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.8 3.4A8.6 8.6 0 1 0 20.6 16a7 7 0 0 1-5.8-12.6Z" />
      <path d="M17 6.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function OpenBookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5.5c-1.6-1.2-3.7-1.7-6.5-1.5v13c2.8-.2 4.9.3 6.5 1.5 1.6-1.2 3.7-1.7 6.5-1.5v-13c-2.8-.2-4.9.3-6.5 1.5Z" />
      <path d="M12 5.5v13" />
    </svg>
  );
}

export function ScrollIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4.5h11a2 2 0 0 1 2 2V17a2.5 2.5 0 0 1-2.5 2.5H8" />
      <path d="M6 4.5a2 2 0 0 0-2 2V17a2.5 2.5 0 0 0 2.5 2.5" />
      <path d="M6 4.5v15" />
      <path d="M9.5 9h6M9.5 12.5h6" />
    </svg>
  );
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l2 4.5-2 4.5-2-4.5 2-4.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Ornament(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 18" fill="none" stroke="currentColor" strokeWidth={1} {...props}>
      <line x1="0" y1="9" x2="55" y2="9" />
      <path d="M70 0l9 9-9 9-9-9 9-9Z" fill="currentColor" stroke="none" />
      <line x1="85" y1="9" x2="140" y2="9" />
    </svg>
  );
}
