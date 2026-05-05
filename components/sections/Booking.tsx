"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { MaskReveal } from "@/components/primitives/MaskReveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buildWhatsAppDeeplink } from "@/lib/whatsapp";
import type { Service } from "@/lib/config";

const schema = z.object({
  name: z.string().min(2, "Min. 2 caractere"),
  phone: z
    .string()
    .min(8, "Număr prea scurt")
    .regex(/^[+0-9 ()-]+$/, "Format invalid"),
  service: z.string().min(1, "Alege un serviciu"),
  date: z.string().min(1, "Alege o dată"),
  time: z.string().min(1, "Alege un interval"),
  notes: z.string().max(400).optional(),
});

type FormValues = z.infer<typeof schema>;

interface BookingProps {
  services: Service[];
  whatsapp: string;
}

const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

export function Booking({ services, whatsapp }: BookingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const serviceLabel =
      services.find((s) => s.id === values.service)?.name ?? values.service;

    const message = [
      `Salut! Sunt ${values.name}.`,
      `Aș vrea o programare pentru ${serviceLabel}`,
      `pe ${values.date} la ${values.time}.`,
      values.notes ? `Mențiuni: ${values.notes}` : "",
      `Tel: ${values.phone}`,
    ]
      .filter(Boolean)
      .join(" ");

    const url = buildWhatsAppDeeplink({ phone: whatsapp, customMessage: message });
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4500);
  };

  const today = new Date().toISOString().split("T")[0];
  const selectedService = watch("service");
  const selectedTime = watch("time");

  return (
    <section
      id="programare"
      className="relative bg-[var(--surface)] py-28 sm:py-36"
      aria-labelledby="booking-heading"
    >
      <div ref={ref} className="container-x">
        <header className="grid grid-cols-12 items-end gap-x-6 pb-16">
          <div className="col-span-12 md:col-span-3">
            <span className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--accent)]">
              <MaskReveal duration={0.6}>§ 07 — Programare</MaskReveal>
            </span>
          </div>
          <h2
            id="booking-heading"
            className="text-display col-span-12 mt-8 text-[length:var(--fs-800)] leading-[0.85] md:col-span-9 md:mt-0"
          >
            <MaskReveal duration={1.1} delay={0.15}>
              REZERVĂ
            </MaskReveal>
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* meta side */}
          <aside className="col-span-12 md:col-span-4">
            <p className="text-[length:var(--fs-400)] leading-[1.5] text-[var(--ink-muted)]">
              <MaskReveal duration={0.9} delay={0.3}>
                Trimitem datele direct pe WhatsApp. Confirmăm intervalul în maxim 30 de minute, în
                programul de lucru.
              </MaskReveal>
            </p>
            <ul className="mt-12 grid gap-6 text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-6 bg-[var(--accent)]" />
                <span>
                  <span className="block text-[var(--accent)]">01</span>
                  <span className="mt-1 block normal-case tracking-normal text-[var(--ink)]">
                    Completezi formularul de jos
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-6 bg-[var(--accent)]" />
                <span>
                  <span className="block text-[var(--accent)]">02</span>
                  <span className="mt-1 block normal-case tracking-normal text-[var(--ink)]">
                    Se deschide WhatsApp cu mesajul gata
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-px w-6 bg-[var(--accent)]" />
                <span>
                  <span className="block text-[var(--accent)]">03</span>
                  <span className="mt-1 block normal-case tracking-normal text-[var(--ink)]">
                    Confirmăm ora exactă
                  </span>
                </span>
              </li>
            </ul>
          </aside>

          {/* form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="col-span-12 md:col-span-8"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
            }
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <Field label="Nume" error={errors.name?.message}>
                <input
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="Andrei P."
                  className="form-input"
                />
              </Field>

              <Field label="Telefon" error={errors.phone?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register("phone")}
                  placeholder="+40 7XX XXX XXX"
                  className="form-input"
                />
              </Field>

              <Field label="Serviciu" error={errors.service?.message} className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {services.map((svc) => (
                    <label
                      key={svc.id}
                      className={`text-mono cursor-pointer border px-3 py-3 text-center text-[length:var(--fs-100)] uppercase tracking-[0.18em] transition-colors duration-200 ${
                        selectedService === svc.id
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                          : "border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <input
                        type="radio"
                        value={svc.id}
                        {...register("service")}
                        className="sr-only"
                      />
                      <span className="block">{svc.name}</span>
                      <span className="mt-1 block text-[length:var(--fs-100)] opacity-70">
                        {svc.duration}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Dată" error={errors.date?.message} className="sm:col-span-2">
                <input
                  type="date"
                  min={today}
                  {...register("date")}
                  className="form-input"
                />
              </Field>

              <Field label="Interval" error={errors.time?.message} className="sm:col-span-2">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`text-mono cursor-pointer border px-2 py-3 text-center tabular-nums text-[length:var(--fs-100)] tracking-[0.1em] transition-colors duration-200 ${
                        selectedTime === slot
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                          : "border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <input
                        type="radio"
                        value={slot}
                        {...register("time")}
                        className="sr-only"
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </Field>

              <Field
                label="Mențiuni (opțional)"
                error={errors.notes?.message}
                className="sm:col-span-2"
              >
                <textarea
                  rows={3}
                  {...register("notes")}
                  placeholder="Tunsoare scurtă, fade înalt, barbă conturată…"
                  className="form-input resize-none"
                />
              </Field>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <MagneticButton
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Se trimite…" : "Trimite pe WhatsApp"}
              </MagneticButton>
              <p
                aria-live="polite"
                className="text-mono text-[length:var(--fs-100)] uppercase tracking-[0.22em] text-[var(--ink-muted)]"
              >
                {submitted
                  ? "✓ S-a deschis WhatsApp cu mesajul gata."
                  : "Mesajul se deschide în WhatsApp pre-completat."}
              </p>
            </div>
          </motion.form>
        </div>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--line);
          color: var(--ink);
          font-family: var(--font-serif), Georgia, serif;
          font-size: var(--fs-400);
          padding: 0.75rem 0;
          outline: none;
          transition: border-color 220ms var(--ease-default);
        }
        :global(.form-input::placeholder) {
          color: var(--ink-muted);
          opacity: 0.6;
        }
        :global(.form-input:focus) {
          border-bottom-color: var(--accent);
        }
        :global(select.form-input) {
          appearance: none;
          background-image: linear-gradient(
              45deg,
              transparent 50%,
              var(--ink-muted) 50%
            ),
            linear-gradient(135deg, var(--ink-muted) 50%, transparent 50%);
          background-position: calc(100% - 14px) 1.05rem, calc(100% - 8px) 1.05rem;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 2rem;
        }
        :global(input[type="date"].form-input) {
          color-scheme: dark;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-mono mb-3 flex items-baseline justify-between text-[length:var(--fs-100)] uppercase tracking-[0.3em] text-[var(--ink-muted)]">
        <span>{label}</span>
        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              key={error}
              role="alert"
              className="text-[var(--accent)]"
              initial={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(2px)" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {children}
    </label>
  );
}
