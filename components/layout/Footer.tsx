"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Zap,
  Server,
  Gamepad2,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type FooterLink = { label: string; href: string };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={clsx(
                "group inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/0 group-hover:bg-red-400/70 transition-colors" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={clsx(
        "group inline-flex h-10 w-10 items-center justify-center rounded-xl",
        "border border-white/10 bg-[#140708]/45 backdrop-blur-xl",
        "text-white/70 hover:text-white transition-colors",
        "shadow-[0_18px_45px_-35px_rgba(220,38,38,.85)]"
      )}
    >
      <span className="transition-transform group-hover:scale-110">{children}</span>
    </Link>
  );
}

function FeaturePill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
        "border border-white/10 bg-[#140708]/40 backdrop-blur-xl",
        "text-sm text-white/75",
        "shadow-[0_18px_45px_-35px_rgba(220,38,38,.7)]"
      )}
    >
      <span className="text-red-300">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Particles() {
  const dots = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const x = (i * 41) % 100;
      const y = (i * 29) % 100;
      const s = (i % 4) + 2;
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
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const productLinks: FooterLink[] = [
    { label: "Game Hosting", href: "/hosting" },
    { label: "VPS / Dedicated", href: "/hosting/vps" },
    { label: "DDoS Protection", href: "/features/ddos" },
    { label: "Status Server", href: "/status" },
  ];

  const companyLinks: FooterLink[] = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
    { label: "Karir", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ];

  const legalLinks: FooterLink[] = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund" },
    { label: "SLA", href: "/sla" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#070409]" />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(1000px 520px at 15% 10%, rgba(220,38,38,.22), transparent 60%), radial-gradient(900px 500px at 85% 20%, rgba(153,27,27,.18), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,.7)_92%)]" />
        <Particles />
      </div>

      {/* Divider top */}
      <div className="relative z-10 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="relative z-10 px-4 sm:px-8 lg:px-14 py-14">
        {/* Top row */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Brand */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "grid h-12 w-12 place-items-center rounded-2xl",
                  "border border-white/10 bg-[#140708]/55 backdrop-blur-xl",
                  "shadow-[0_20px_55px_-40px_rgba(220,38,38,.95)]"
                )}
              >
                <Gamepad2 className="h-6 w-6 text-red-300" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight text-white">
                  JGM Store Hosting
                </div>
                <div className="text-sm text-white/60">
                  Premium game hosting dengan maroon vibe ✦
                </div>
              </div>
            </div>

            <p className="mt-5 text-white/65 leading-relaxed">
              Hosting premium untuk FiveM, Minecraft, dan berbagai game lainnya.
              Performa tinggi, NVMe super cepat, dan proteksi DDoS 24/7.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <FeaturePill icon={<Zap className="h-4 w-4" />} label="Ultra Performance" />
              <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} label="DDoS 24/7" />
              <FeaturePill icon={<Server className="h-4 w-4" />} label="NVMe Storage" />
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <div className="text-sm font-semibold text-white">Newsletter</div>
              <p className="mt-2 text-sm text-white/60">
                Dapatkan update promo, maintenance, dan fitur terbaru.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    className={clsx(
                      "w-full rounded-2xl pl-11 pr-4 py-3 text-sm",
                      "border border-white/10 bg-[#140708]/45 text-white placeholder:text-white/35",
                      "outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/20"
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className={clsx(
                    "rounded-2xl px-6 py-3 text-sm font-semibold",
                    "bg-red-600 text-[#070409]",
                    "shadow-[0_20px_55px_-40px_rgba(220,38,38,1)]",
                    "transition-transform hover:scale-[1.02] active:scale-[0.99]"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <div>
              <FooterColumn title="Legal" links={legalLinks} />

              {/* Contact card */}
              <div
                className={clsx(
                  "mt-8 rounded-3xl p-5",
                  "border border-white/10 bg-[#140708]/45 backdrop-blur-xl",
                  "shadow-[0_24px_70px_-55px_rgba(220,38,38,.9)]"
                )}
              >
                <div className="text-sm font-semibold text-white">Contact</div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-300" />
                    <span>+62 8xx-xxxx-xxxx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-300" />
                    <span>support@jgmstore.id</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-300" />
                    <span>Indonesia</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <SocialIcon href="#" label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </SocialIcon>
                  <SocialIcon href="#" label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </SocialIcon>
                  <SocialIcon href="#" label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </SocialIcon>
                  <SocialIcon href="#" label="YouTube">
                    <Youtube className="h-5 w-5" />
                  </SocialIcon>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/55">
              © {new Date().getFullYear()} JGM Store. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.9)]" />
                System Online
              </span>
              <span className="text-white/25">•</span>
              <Link href="/status" className="hover:text-white transition-colors">
                Status
              </Link>
              <span className="text-white/25">•</span>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
