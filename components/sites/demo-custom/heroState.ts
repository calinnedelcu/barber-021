// Tiny module singleton bridging DOM scroll (GSAP ScrollTrigger, outside the
// canvas) and the R3F scene (read every frame inside useFrame). Mutated in
// place — no React state, no re-renders, no tearing.
export const heroState = {
  /** Scroll progress through the hero, 0 → 1. */
  p: 0,
  /** Active cinema band: hero, manifest, services, gallery, team, reviews, contact. */
  cinemaScene: 0,
  /** Local progress while the horizontal manifesto is pinned. */
  cinemaManifest: 0,
  /** Local progress while the services list crosses the viewport. */
  cinemaServices: 0,
  /** Local progress while the horizontal gallery is pinned. */
  cinemaGallery: 0,
  /** Local progress while the stacked team cards cross the viewport. */
  cinemaTeam: 0,
  /** Local progress while the review quotes are pinned. */
  cinemaReviews: 0,
  /** Local progress through the contact section for the final background drift. */
  cinemaContact: 0,
};
