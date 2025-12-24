"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  animate,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Zap, Play, Gamepad2 } from "lucide-react";

const IMAGE_SRC =
  "https://r2.fivemanage.com/marCgEm2FJb3F6lVklz74/ChatGPTImageDec20202502_29_53PM(1).png";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------------- animations ---------------- */

const container: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const floaty: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

/* ---------------- utils ---------------- */

function useParallaxTilt() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x = useSpring(mx, { stiffness: 220, damping: 22 });
  const y = useSpring(my, { stiffness: 220, damping: 22 });

  const rx = useTransform(y, [-1, 1], [6, -6]);
  const ry = useTransform(x, [-1, 1], [-10, 10]);

  return {
    setFromMouse: (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    },
    reset: () => {
      mx.set(0);
      my.set(0);
    },
    rx,
    ry,
    x,
    y,
  };
}

function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [value, setValue] = useState("0");

  useMotionValueEvent(rounded, "change", (v) => setValue(String(v)));

  useEffect(() => {
    const c = animate(mv, to, { duration: 1.2, ease: EASE });
    return () => c.stop();
  }, [mv, to]);

  return (
    <span>
      {value}
      {suffix && <span className="align-top text-2xl">{suffix}</span>}
    </span>
  );
}

function FloatingChip({
  icon,
  className,
  parallaxX,
  parallaxY,
}: {
  icon: React.ReactNode;
  className: string;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}) {
  return (
    <motion.div
      variants={floaty}
      initial="hidden"
      animate="show"
      style={{
        x: useTransform(parallaxX, (v) => v * 10),
        y: useTransform(parallaxY, (v) => v * 10),
      }}
      className={clsx(
        "absolute grid h-14 w-14 place-items-center rounded-2xl",
        "border border-white/10 bg-[#140708]/70 backdrop-blur-xl",
        "shadow-[0_20px_60px_-40px_rgba(0,0,0,.9)]",
        className
      )}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-red-300"
      >
        {icon}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- effects ---------------- */

function Particles() {
  const dots = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const x = (i * 41) % 100;
      const y = (i * 27) % 100;
      const s = 2 + (i % 4);
      const o = 0.14 + (i % 6) * 0.07;
      const d = (i % 7) * 0.35;
      return { x, y, s, o, d };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((p, idx) => (
        <motion.span
          key={idx}
          className="absolute rounded-full bg-red-400/35"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
          }}
          animate={{ y: [0, -10, 0], opacity: [p.o, p.o * 0.55, p.o] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.d,
          }}
        />
      ))}
    </div>
  );
}

/** ❄️ Snowfall */
function SnowFall({ amount = 70 }: { amount?: number }) {
  const flakes = useMemo(() => {
    return Array.from({ length: amount }).map((_, i) => {
      const left = (i * 37) % 100;
      const size = 1.5 + (i % 5);
      const duration = 7 + (i % 7);
      const delay = (i % 10) * 0.35;
      const opacity = 0.18 + (i % 6) * 0.1;
      const drift = (i % 2 === 0 ? 1 : -1) * (14 + (i % 6) * 8);
      return { left, size, duration, delay, opacity, drift };
    });
  }, [amount]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]">
      {flakes.map((f, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            top: "-12vh",
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            filter: "blur(0.3px)",
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: [0, f.drift],
            opacity: [f.opacity, f.opacity * 0.7, f.opacity],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/** 🎮 Gamepad pattern (stick PS vibe) */
function GamepadPattern() {
  const icons = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const x = (i * 23) % 100;
      const y = (i * 41) % 100;
      const size = 22 + (i % 4) * 7; // 22..43px
      const rotate = (i % 2 === 0 ? -1 : 1) * (10 + (i % 4) * 6);
      const delay = (i % 6) * 0.6;
      const opacity = 0.05 + (i % 5) * 0.02; // 0.05..0.13
      return { x, y, size, rotate, delay, opacity };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
      {icons.map((g, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: g.size,
            height: g.size,
            rotate: g.rotate,
            opacity: g.opacity,
            filter: "blur(0.3px)",
          }}
          animate={{ y: [0, -14, 0], opacity: [g.opacity, g.opacity + 0.06, g.opacity] }}
          transition={{
            duration: 10 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: g.delay,
          }}
        >
          <Gamepad2 className="h-full w-full text-red-500" />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- HERO ---------------- */

export default function Hero() {
  const tilt = useParallaxTilt();

  return (
    <section className="relative overflow-hidden bg-[#070409] -mt-32">
      {/* BACKGROUND EFFECT */}
      <div className="pointer-events-none absolute inset-0">
        {/* glow */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(1200px 600px at 50% -10%, rgba(220,38,38,.28), transparent 60%), radial-gradient(900px 520px at 80% 40%, rgba(153,27,27,.22), transparent 60%)",
          }}
        />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,.7)_90%)]" />

        {/* 🎮 pattern */}
        <GamepadPattern />

        {/* particles */}
        <Particles />

        {/* ❄️ snow */}
        <SnowFall amount={70} />
      </div>

      {/* CONTAINER */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-28 lg:py-36"
      >
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div className="max-w-xl">
            <motion.div variants={item} className="inline-flex">
              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-[#140708]/60 px-4 py-2 backdrop-blur-xl">
                <Zap className="h-4 w-4 text-red-400" />
                <span className="text-red-200 font-semibold">#1 Game Hosting • Indonesia</span>
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 text-5xl sm:text-6xl lg:text-6xl font-extrabold text-white"
            >
              NAIKKAN LEVEL
              <span className="block text-red-500 drop-shadow-[0_16px_40px_rgba(220,38,38,.35)]">
                SERVER GAME KAMU
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 text-lg text-white/65">
              Performa stabil, anti-lag, NVMe super cepat, dan{" "}
              <span className="text-red-300 font-semibold">DDoS Protection 24/7</span>. Solusi hosting terbaik
              untuk komunitas game serius.
            </motion.p>

            <motion.div variants={item} className="mt-10 grid grid-cols-3 gap-8 border-y border-white/10 py-8">
              <div>
                <div className="text-4xl font-extrabold text-red-400">
                  <Counter to={314} />
                </div>
                <div className="text-white/55">Server Aktif</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-red-400">
                  <Counter to={99} suffix="%" />
                </div>
                <div className="text-white/55">Uptime Stabil</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-red-400">
                  <Counter to={6} />
                </div>
                <div className="text-white/55">Tahun Pengalaman</div>
              </div>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex gap-4">
              <Link
                href="/hosting"
                className="rounded-2xl bg-red-600 px-7 py-4 font-semibold text-[#070409] shadow-[0_20px_60px_-35px_rgba(220,38,38,1)]"
              >
                Lihat Paket Hosting
              </Link>
              <Link
                href="/about"
                className="rounded-2xl border border-red-500/40 bg-[#140708]/40 px-7 py-4 font-semibold text-red-200 backdrop-blur-xl"
              >
                <span className="inline-flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Kenapa Pilih JGM?
                </span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={item}
            onMouseMove={tilt.setFromMouse}
            onMouseLeave={tilt.reset}
            className="relative flex justify-center"
          >
            <FloatingChip icon={<Zap />} className="right-6 top-20" parallaxX={tilt.x} parallaxY={tilt.y} />

            <motion.img
              src={IMAGE_SRC}
              alt="Hero"
              draggable={false}
              className="w-[420px] lg:w-[520px] ml-32 drop-shadow-[0_50px_100px_rgba(0,0,0,.7)]"
              style={{
                rotateX: tilt.rx,
                rotateY: tilt.ry,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
