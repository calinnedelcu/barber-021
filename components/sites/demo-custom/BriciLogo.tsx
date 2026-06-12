// Custom BRICI mark — an open straight razor reduced to two strokes — plus the
// wordmark. The blade draws itself in on first paint (pure CSS, respects
// prefers-reduced-motion). This is the "logo custom" module of the Custom
// package, demonstrated for a fictional brand.
export function BriciLogo({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="brici-mark shrink-0"
      >
        {/* blade */}
        <path
          className="brici-draw"
          d="M6 19 L24 4.5 L27.5 8.5 L10.5 22 Z"
          stroke="var(--ink)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* pivot */}
        <circle className="brici-pop" cx="8" cy="21" r="1.6" fill="var(--accent)" />
        {/* handle, swung open */}
        <path
          className="brici-draw brici-draw-2"
          d="M8 21 L8 29.5"
          stroke="var(--ink-muted)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="text-[1.15rem] font-extrabold tracking-[0.08em]"
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        BRICI
      </span>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .brici-mark .brici-draw {
            stroke-dasharray: 70;
            stroke-dashoffset: 70;
            animation: brici-draw 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          }
          .brici-mark .brici-draw-2 { animation-delay: 0.65s; animation-duration: 0.5s; }
          .brici-mark .brici-pop {
            transform-origin: 8px 21px;
            transform: scale(0);
            animation: brici-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s forwards;
          }
          @keyframes brici-draw { to { stroke-dashoffset: 0; } }
          @keyframes brici-pop { to { transform: scale(1); } }
        }
      `}</style>
    </span>
  );
}
