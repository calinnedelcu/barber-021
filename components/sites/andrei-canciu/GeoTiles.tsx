"use client";

/**
 * Geometric portfolio tiles — deliberate line-art "cut studies", NOT photo
 * placeholders. Each tile is a distinct angular composition so the grid reads
 * as an intentional art piece while the real gallery is "în curând".
 */

type TileArt = (accent: string) => React.ReactNode;

const arts: TileArt[] = [
  // 1 — fan of angled lines
  (accent) => (
    <>
      <line x1="20" y1="180" x2="180" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="180" x2="180" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="180" x2="180" y2="140" stroke={accent} strokeWidth="1.5" />
      <circle cx="20" cy="180" r="3" fill={accent} />
    </>
  ),
  // 2 — measured triangle
  (accent) => (
    <>
      <polygon points="100,30 30,170 170,170" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
      <line x1="100" y1="30" x2="100" y2="170" stroke={accent} strokeWidth="1.5" />
    </>
  ),
  // 3 — concentric arcs (a "round layer" study)
  (accent) => (
    <>
      <path d="M40 160 A 60 60 0 0 1 160 160" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M60 160 A 40 40 0 0 1 140 160" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M80 160 A 20 20 0 0 1 120 160" stroke={accent} strokeWidth="1.5" fill="none" />
      <line x1="40" y1="160" x2="160" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </>
  ),
  // 4 — crossing diagonals / undercut grid
  (accent) => (
    <>
      <line x1="30" y1="30" x2="170" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="170" y1="30" x2="30" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="70" y="70" width="60" height="60" stroke={accent} strokeWidth="1.5" fill="none" />
    </>
  ),
  // 5 — vertical comb / section partings
  (accent) => (
    <>
      {[50, 75, 100, 125, 150].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="40"
          x2={x}
          y2="160"
          stroke={i === 2 ? accent : "currentColor"}
          strokeWidth={i === 2 ? 1.5 : 1}
          opacity={i === 2 ? 1 : 0.45}
        />
      ))}
    </>
  ),
  // 6 — scissor angle / open shears abstraction
  (accent) => (
    <>
      <line x1="40" y1="160" x2="160" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="40" y1="50" x2="160" y2="160" stroke={accent} strokeWidth="1.5" />
      <circle cx="100" cy="105" r="4" fill={accent} />
      <circle cx="40" cy="160" r="7" stroke="currentColor" strokeWidth="1" opacity="0.6" fill="none" />
      <circle cx="40" cy="50" r="7" stroke="currentColor" strokeWidth="1" opacity="0.6" fill="none" />
    </>
  ),
];

export const GEO_TILE_COUNT = arts.length;

export function GeoTileArt({
  index,
  accent = "var(--accent)",
}: {
  index: number;
  accent?: string;
}) {
  const art = arts[index % arts.length] ?? arts[0]!;
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full" aria-hidden="true">
      {art(accent)}
    </svg>
  );
}
