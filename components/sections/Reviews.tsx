"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Review } from "@/lib/config";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section
      id="recenzii"
      className="relative bg-[var(--bg)] py-28 sm:py-40"
      aria-labelledby="reviews-heading"
    >
      <div className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-20">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 03 — Voci</MaskReveal>
            </span>
          </div>
          <h2
            id="reviews-heading"
            className="text-serif-italic col-span-12 mt-8 text-[length:var(--fs-700)] leading-[1.05] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1} delay={0.15}>
              <span>Ce rămâne după ușa care </span>
            </MaskReveal>
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">se închide</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-y-16 md:gap-y-24">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  // editorial offset — alternating columns
  const offset =
    index % 3 === 0
      ? "md:col-start-2 md:col-span-7"
      : index % 3 === 1
      ? "md:col-start-5 md:col-span-7"
      : "md:col-start-3 md:col-span-7";

  return (
    <article ref={ref} className={`col-span-12 ${offset}`}>
      <motion.span
        aria-hidden
        className="text-display block text-[clamp(5rem,12vw,9rem)] leading-[0.7] text-[var(--accent)]"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 0.55, y: 0 } : { opacity: 0, y: 30 }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
        }
      >
        “
      </motion.span>

      <blockquote className="mt-2 text-serif-italic text-[length:var(--fs-600)] leading-[1.18]">
        <MaskReveal duration={1.05} delay={0.1}>
          {review.quote}
        </MaskReveal>
      </blockquote>

      <motion.figcaption
        className="mt-8 flex flex-wrap items-center gap-3 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.24em] text-[var(--ink-muted)]"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }
        }
      >
        <span className="h-px w-8 bg-[var(--ink-muted)]" />
        <span className="text-[var(--ink)]">{review.author}</span>
        {review.source && <span>· {review.source}</span>}
      </motion.figcaption>
    </article>
  );
}
