"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Review } from "@/lib/config";

interface ReviewsProps {
  reviews: Review[];
}

const REVIEW_PHOTOS = [
  "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=1100&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1657105052497-f996284ffff8?w=1100&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1100&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1100&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1100&q=80&auto=format&fit=crop",
];

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
              <span>Ce rămâne după ușa care</span>
            </MaskReveal>{" "}
            <MaskReveal duration={1} delay={0.3}>
              <span className="text-[var(--accent)]">se închide</span>
              <span>.</span>
            </MaskReveal>
          </h2>
        </header>

        <div className="grid gap-y-24 md:gap-y-36">
          {reviews.map((review, i) => (
            <ReviewSpread
              key={review.id}
              review={review}
              index={i}
              photoSrc={REVIEW_PHOTOS[i % REVIEW_PHOTOS.length] ?? REVIEW_PHOTOS[0]!}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewSpread({
  review,
  index,
  photoSrc,
}: {
  review: Review;
  index: number;
  photoSrc: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  // Alternate sides: even index = photo LEFT / text RIGHT;
  //                   odd index = text LEFT / photo RIGHT
  const photoOnLeft = index % 2 === 0;

  const enter = (delay: number) =>
    reduced
      ? { duration: 0 }
      : {
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1] as const,
          delay,
        };

  return (
    <article
      ref={ref}
      className="grid grid-cols-12 items-center gap-x-6 gap-y-10"
    >
      {/* PHOTO */}
      <motion.figure
        initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
        animate={
          inView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 28, filter: "blur(6px)" }
        }
        transition={enter(0)}
        className={`col-span-8 sm:col-span-6 ${
          photoOnLeft
            ? "md:col-start-1 md:col-span-4 md:row-start-1"
            : "md:col-start-9 md:col-span-4 md:row-start-1"
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
          <Image
            src={photoSrc}
            alt={`${review.author} — atelier`}
            fill
            sizes="(max-width: 768px) 60vw, 30vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, rgb(20 17 15 / 0.55) 100%)",
            }}
          />
          <span className="text-mono absolute left-4 top-4 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            № {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </motion.figure>

      {/* QUOTE */}
      <div
        className={`col-span-12 ${
          photoOnLeft
            ? "md:col-start-6 md:col-span-7 md:row-start-1"
            : "md:col-start-1 md:col-span-7 md:row-start-1"
        }`}
      >
        <motion.span
          aria-hidden
          className="text-display block text-[clamp(4rem,9vw,7rem)] leading-[0.7] text-[var(--accent)]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 24 }}
          transition={enter(0.1)}
        >
          “
        </motion.span>

        <blockquote className="mt-3 text-serif-italic text-[length:var(--fs-600)] leading-[1.2]">
          <MaskReveal duration={1.05} delay={0.2}>
            {review.quote}
          </MaskReveal>
        </blockquote>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.24em] text-[var(--ink-muted)]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={enter(0.55)}
        >
          <span aria-hidden className="h-px w-8 bg-[var(--ink-muted)]" />
          <span className="text-[var(--ink)]">{review.author}</span>
          {review.source && <span>· {review.source}</span>}
        </motion.div>
      </div>
    </article>
  );
}
