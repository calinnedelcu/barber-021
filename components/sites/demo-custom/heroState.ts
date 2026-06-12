// Tiny module singleton bridging DOM scroll (GSAP ScrollTrigger, outside the
// canvas) and the R3F scene (read every frame inside useFrame). Mutated in
// place — no React state, no re-renders, no tearing.
export const heroState = {
  /** Scroll progress through the hero, 0 → 1. */
  p: 0,
};
