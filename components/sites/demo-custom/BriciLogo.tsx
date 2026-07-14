interface BriciMarkProps {
  size?: number;
  className?: string;
}

export function BriciMark({ size = 36, className = "" }: BriciMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 42"
      fill="none"
      aria-hidden
      className={`brici-logo-mark shrink-0 ${className}`}
    >
      <path
        data-logo-blade
        d="M4 22.4 35.2 4.5H52l-8.7 9.1h-7.1L16.5 27H4Z"
        fill="currentColor"
      />
      <path
        data-logo-edge
        d="m16.5 27 19.7-13.4h7.1L18.4 29.2Z"
        fill="var(--accent)"
      />
      <path
        data-logo-handle
        d="M16.3 26.5c9.5 2 20.1 5.2 31.7 9.3l-3.6 3.7C33.2 36.8 22.8 33.4 13 29Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle data-logo-pivot cx="15.4" cy="27.8" r="3.2" fill="var(--accent)" />
      <circle cx="15.4" cy="27.8" r="1.15" fill="#0a0a0b" />
    </svg>
  );
}

export function BriciLogo({ size = 34 }: { size?: number }) {
  const wordSize = Math.max(0.86, Math.min(1.1, size / 29));

  return (
    <span className="brici-logo inline-flex items-center gap-2.5" style={{ color: "var(--ink)" }}>
      <BriciMark size={size} />
      <span
        className="font-extrabold uppercase"
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: `${wordSize}rem`,
          letterSpacing: "0.12em",
        }}
      >
        BRICI
      </span>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .brici-logo [data-logo-blade] {
            clip-path: inset(0 100% 0 0);
            animation: brici-blade-in .72s cubic-bezier(.16,1,.3,1) .12s forwards;
          }
          .brici-logo [data-logo-edge] {
            opacity: 0;
            animation: brici-edge-in .35s ease .58s forwards;
          }
          .brici-logo [data-logo-handle] {
            opacity: 0;
            transform: rotate(-24deg);
            transform-origin: 15.4px 27.8px;
            animation: brici-handle-in .68s cubic-bezier(.16,1,.3,1) .28s forwards;
          }
          .brici-logo [data-logo-pivot] {
            transform: scale(0);
            transform-origin: 15.4px 27.8px;
            animation: brici-pivot-in .38s cubic-bezier(.34,1.56,.64,1) .72s forwards;
          }
          @keyframes brici-blade-in { to { clip-path: inset(0 0 0 0); } }
          @keyframes brici-edge-in { to { opacity: 1; } }
          @keyframes brici-handle-in { to { opacity: 1; transform: rotate(0); } }
          @keyframes brici-pivot-in { to { transform: scale(1); } }
        }
      `}</style>
    </span>
  );
}
