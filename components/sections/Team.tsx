"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TeamMember } from "@/lib/config";

interface TeamProps {
  members: TeamMember[];
}

export function Team({ members }: TeamProps) {
  if (members.length === 0) return null;

  return (
    <section
      id="echipa"
      className="relative bg-[var(--surface)] py-28 sm:py-36"
      aria-labelledby="team-heading"
    >
      <div className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-20">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 04 — Echipa</MaskReveal>
            </span>
          </div>
          <h2
            id="team-heading"
            className="text-display col-span-12 mt-8 text-[length:var(--fs-800)] leading-[0.85] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1.1} delay={0.15}>
              MAESTRII
            </MaskReveal>
          </h2>
        </header>

        <ul className="grid grid-cols-12 gap-x-6 gap-y-16">
          {members.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} total={members.length} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TeamCard({
  member,
  index,
  total,
}: {
  member: TeamMember;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  // editorial offset — middle card sinks lower
  const yOffset = index === 1 ? "md:mt-20" : index === 2 ? "md:mt-10" : "";
  const initials = member.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const span = total <= 3 ? "md:col-span-4" : "md:col-span-3";
  const hasRealPortrait =
    typeof member.portrait === "string" && member.portrait.length > 0 &&
    (member.portrait.startsWith("http") || member.portrait.startsWith("/clients/"));

  return (
    <motion.li
      ref={ref}
      className={`col-span-12 sm:col-span-6 ${span} ${yOffset} group`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }
      }
    >
      {/* Portrait frame — editorial 4:5, duotone overlay */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg)]">
        {hasRealPortrait ? (
          <Image
            src={member.portrait}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            {/* duotone gradient placeholder */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 30%, rgb(217 118 77 / 0.18), transparent 55%),
                  radial-gradient(ellipse at 70% 80%, rgb(20 17 15) 30%, var(--bg) 80%),
                  linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)
                `,
              }}
            />
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full opacity-[0.08]"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id={`hatch-${member.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#hatch-${member.id})`} />
            </svg>
            <span
              aria-hidden
              className="text-display absolute inset-0 flex items-center justify-center text-[clamp(5rem,12vw,9rem)] leading-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px var(--ink-muted)",
              }}
            >
              {initials}
            </span>
          </>
        )}
        {/* duotone tint over photo */}
        {hasRealPortrait && (
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, rgb(20 17 15 / 0.3) 0%, rgb(20 17 15 / 0.6) 100%)",
            }}
          />
        )}
        {/* serial chip */}
        <span className="text-mono absolute left-4 top-4 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {/* role chip */}
        <span className="text-mono absolute bottom-4 right-4 text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--accent)]">
          {member.role}
        </span>
        {/* hover veil */}
        <div className="absolute inset-0 bg-[var(--accent)] opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-30" />
      </div>

      <div className="mt-6">
        <h3 className="text-display text-[length:var(--fs-600)] leading-[0.95]">
          {member.name}
        </h3>
        {member.bio && (
          <p className="mt-3 max-w-xs text-[length:var(--fs-200)] leading-[1.5] text-[var(--ink-muted)]">
            {member.bio}
          </p>
        )}
      </div>
    </motion.li>
  );
}
