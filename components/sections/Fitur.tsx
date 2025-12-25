"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  HardDrive,
  PanelTop,
  DatabaseBackup,
  Headset,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: reduce
      ? { duration: 0.01 }
      : { duration: 0.7, ease: EASE, staggerChildren: 0.08 },
  }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: reduce ? { duration: 0.01 } : { duration: 0.55, ease: EASE },
  }),
};

type Feature = {
  title: string;
  desc: string;
  pill: string;
  icon: React.ReactNode;
};

type CardVariant = "gaming" | "clean";

function FeatureCard({
  f,
  reduce,
  active,
  variant,
  onHoverChange,
}: {
  f: Feature;
  reduce: boolean;
  active: boolean;
  variant: CardVariant;
  onHoverChange?: (hovering: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const isGaming = variant === "gaming";

  return (
    <motion.div
      ref={ref}
      variants={item}
      custom={reduce}
      onPointerMove={reduce ? undefined : handleMove}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      whileHover={
        reduce
          ? undefined
          : {
              y: -6,
              transition: { duration: 0.2, ease: EASE },
            }
      }
      className={clsx(
        "group relative overflow-hidden rounded-[28px]",
        "will-change-transform"
      )}
      data-active={active ? "true" : "false"}
    >
      {/* ===== Gradient Border (active + hover) ===== */}
      <div
        className={clsx(
          "absolute inset-0 rounded-[28px] p-[1px] transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          isGaming
            ? "bg-[linear-gradient(120deg,rgba(220,38,38,.75),transparent_40%,rgba(220,38,38,.75))]"
            : "bg-[linear-gradient(120deg,rgba(255,255,255,.22),transparent_45%,rgba(220,38,38,.55))]"
        )}
      />

      {/* ===== Follow Light (mouse glow) ===== */}
      {!reduce && (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100",
            active && "opacity-100"
          )}
          style={{
            background:
              "radial-gradient(220px 220px at var(--mx, 50%) var(--my, 30%), rgba(220,38,38,.22), transparent 62%)",
          }}
        />
      )}

      {/* ===== Card Body ===== */}
      <div
        className={clsx(
          "relative h-full rounded-[27px] p-6",
          "border border-white/10 backdrop-blur-xl",
          isGaming ? "bg-[#140708]/60" : "bg-[#0f0b10]/55",
          active
            ? "shadow-[0_36px_95px_-55px_rgba(220,38,38,.95)]"
            : "shadow-[0_30px_80px_-60px_rgba(220,38,38,.75)]"
        )}
      >
        {/* ===== Shine Sweep ===== */}
        {!reduce && (
          <span
            className={clsx(
              "pointer-events-none absolute inset-y-0 -left-1/2 w-1/3",
              "bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.12),transparent)]",
              "opacity-0 group-hover:opacity-100",
              "translate-x-0 group-hover:translate-x-[300%]",
              "transition-all duration-700 ease-out"
            )}
          />
        )}

        {/* ===== Subtle active aura (opacity only) ===== */}
        <div
          className={clsx(
            "pointer-events-none absolute -inset-10 rounded-[40px] blur-2xl transition-opacity duration-300",
            isGaming ? "bg-red-600/10" : "bg-red-600/8",
            active ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="relative flex items-start gap-4">
          {/* Icon Box */}
          <div
            className={clsx(
              "relative grid h-14 w-14 place-items-center rounded-2xl",
              "border bg-[#0b0606]/70",
              isGaming ? "border-red-500/25" : "border-white/12",
              active
                ? "shadow-[0_28px_70px_-45px_rgba(220,38,38,.95)]"
                : "shadow-[0_25px_60px_-48px_rgba(220,38,38,.85)]"
            )}
          >
            {!reduce && (
              <span
                className={clsx(
                  "absolute inset-0 rounded-2xl blur-xl transition-opacity",
                  isGaming ? "bg-red-500/30" : "bg-red-500/22",
                  active ? "opacity-70" : "opacity-0 group-hover:opacity-55"
                )}
              />
            )}
            <div className={clsx("relative", isGaming ? "text-red-300" : "text-red-200")}>
              {f.icon}
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0">
            <h3
              className={clsx(
                "text-base font-semibold tracking-wide",
                active ? "text-white" : "text-white/95"
              )}
            >
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>

            {/* Pill */}
            <div className="mt-4">
              <span
                className={clsx(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                  "border transition-colors",
                  active
                    ? "border-red-500/40 bg-red-600/14 text-red-100"
                    : "border-red-500/30 bg-red-600/10 text-red-200"
                )}
              >
                {f.pill}
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function Features({
  variant = "gaming",
}: {
  variant?: CardVariant;
}) {
  const reduce = useReducedMotion();

  const features: Feature[] = [
    {
      title: "DDoS Protection",
      desc: "Perlindungan 24/7 dengan mitigasi otomatis hingga Tbps. Server tetap aman dari serangan.",
      pill: "Stay Active",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      title: "AMD Ryzen™ 9000",
      desc: "Prosesor generasi terbaru untuk performa tinggi. Cocok untuk server game intensif.",
      pill: "Stable Boost",
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      title: "NVMe Storage",
      desc: "Storage super cepat dengan kecepatan read/write tinggi untuk loading instan.",
      pill: "Read & Write",
      icon: <HardDrive className="h-6 w-6" />,
    },
    {
      title: "Akses Panel",
      desc: "Panel modern dan mudah digunakan. Kelola server dengan fitur lengkap.",
      pill: "Easy Management",
      icon: <PanelTop className="h-6 w-6" />,
    },
    {
      title: "Proteksi Data Otomatis",
      desc: "Backup rutin otomatis untuk menjaga data aman. Anti hilang dan siap restore.",
      pill: "Data Secure",
      icon: <DatabaseBackup className="h-6 w-6" />,
    },
    {
      title: "Dukungan Teknis VIP",
      desc: "Support premium dari tim expert. Prioritas penanganan, available 24/7.",
      pill: "VIP Expert",
      icon: <Headset className="h-6 w-6" />,
    },
  ];

  // ===== (1) Auto-highlight =====
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringAny, setIsHoveringAny] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (isHoveringAny) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % features.length);
    }, 2800);

    return () => window.clearInterval(id);
  }, [reduce, isHoveringAny, features.length]);

  const isGaming = variant === "gaming";

  return (
    <section className="relative overflow-hidden bg-[#070409]">
      {/* background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }}
          transition={reduce ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: isGaming
              ? "radial-gradient(1100px 520px at 50% -10%, rgba(220,38,38,.22), transparent 60%), radial-gradient(900px 520px at 85% 25%, rgba(153,27,27,.16), transparent 60%)"
              : "radial-gradient(1100px 520px at 50% -10%, rgba(255,255,255,.10), transparent 60%), radial-gradient(900px 520px at 85% 25%, rgba(220,38,38,.14), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,.7)_92%)]" />
      </div>

      <motion.div
        variants={container}
        custom={!!reduce}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-20 lg:py-24"
      >
        <motion.div variants={item} custom={!!reduce} className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Kenapa Memilih Kami?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/60">
            Infrastruktur terbaik untuk server game kamu — stabil, cepat, dan aman.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <FeatureCard
              key={f.title}
              f={f}
              reduce={!!reduce}
              active={!reduce && !isHoveringAny && idx === activeIndex}
              variant={variant}
              onHoverChange={(h) => setIsHoveringAny(h)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
