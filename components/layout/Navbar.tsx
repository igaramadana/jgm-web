"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import clsx from "clsx";
import { Home, Server, Mail, ChevronDown, Menu, X } from "lucide-react";

type NavChild = { label: string; href: string };

type NavLink = {
  type: "link";
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavDropdown = {
  type: "dropdown";
  label: string;
  icon: React.ReactNode;
  children: NavChild[];
};

type NavItem = NavLink | NavDropdown;

function hasChildren(item: NavItem): item is NavDropdown {
  return item.type === "dropdown";
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const headerVariants: Variants = {
  hidden: { y: -14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14, ease: EASE_OUT } },
};

export default function Navbar() {
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRootRef = useRef<HTMLDivElement | null>(null);

  const closeAll = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const nav = useMemo<NavItem[]>(
    () => [
      { type: "link", label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
      {
        type: "dropdown",
        label: "Hosting",
        icon: <Server className="h-5 w-5" />,
        children: [
          { label: "Shared Hosting", href: "/hosting/shared" },
          { label: "VPS Hosting", href: "/hosting/vps" },
          { label: "Dedicated", href: "/hosting/dedicated" },
        ],
      },
      { type: "link", label: "Contact", href: "/contact", icon: <Mail className="h-5 w-5" /> },
    ],
    []
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  // Scroll blur/shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!dropdownRootRef.current) return;
      if (!dropdownRootRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Close on route change (safe)
  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setOpenDropdown(null);
    });
  }, [pathname]);

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 lg:px-10"
    >
      {/* FULL WIDTH: no container */}
      <div className="w-full">
        <div
          className={clsx(
            "relative mt-4 flex items-center justify-between",
            "rounded-[22px]",
            "border border-red-900/30",
            "bg-[#090909]/80 backdrop-blur-xl",
            "transition-all duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          {/* top glow */}
          <div className="pointer-events-none absolute -inset-0.5 rounded-[22px] opacity-45 blur-2xl bg-linear-to-r from-red-950 via-red-700/25 to-red-950" />
          {/* subtle inner highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/5" />

          {/* Brand */}
          <Link
            href="/"
            onClick={closeAll}
            className="group relative z-10 flex items-center gap-3 pl-6 pr-3"
          >
            <div
              className={clsx(
                "relative grid place-items-center",
                "h-12 w-12 rounded-2xl",
                "bg-red-950/45 ring-1 ring-red-700/40",
                "shadow-[0_0_26px_rgba(220,38,38,.33)]"
              )}
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-red-600/20 to-transparent opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
              <img
                src="https://r2.fivemanage.com/marCgEm2FJb3F6lVklz74/jgmlogo.png"
                alt="jgm logo"
                className="relative h-12 w-auto"
              />
            </div>

            {/* optional brand text */}
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-white font-semibold tracking-wide text-lg">JGM STORE</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="relative z-10 hidden items-center gap-2 md:flex" ref={dropdownRootRef}>
            {nav.map((item) => {
              if (hasChildren(item)) {
                const opened = openDropdown === item.label;

                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(opened ? null : item.label)}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      className={clsx(
                        "group relative flex items-center gap-3",
                        "rounded-2xl px-5 py-3",
                        "text-base",
                        "text-white/75 hover:text-white transition-colors"
                      )}
                    >
                      <span className="text-white/55 transition-colors group-hover:text-red-200">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>

                      <motion.span
                        animate={{ rotate: opened ? 180 : 0 }}
                        transition={{ duration: 0.18, ease: EASE_OUT }}
                        className="text-white/45"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </motion.span>

                      {/* hover bg */}
                      <span className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-b from-red-600/18 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-transparent transition group-hover:ring-red-700/35" />
                    </button>

                    <AnimatePresence>
                      {opened && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          onMouseLeave={() => setOpenDropdown(null)}
                          className={clsx(
                            "absolute left-0 top-[112%] w-64 overflow-hidden rounded-2xl",
                            "border border-red-900/40 bg-[#0b0606]/95 backdrop-blur-xl",
                            "shadow-[0_30px_70px_-35px_rgba(127,29,29,1)]"
                          )}
                        >
                          <div className="p-2">
                            {item.children.map((c) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                onClick={closeAll}
                                className={clsx(
                                  "group block rounded-xl px-4 py-3",
                                  "text-sm md:text-base",
                                  "text-white/75 hover:text-white",
                                  "hover:bg-red-600/12 transition-colors"
                                )}
                              >
                                <span className="flex items-center justify-between">
                                  {c.label}
                                  <span className="h-2 w-2 rounded-full bg-red-600/0 group-hover:bg-red-600/70 transition-colors" />
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeAll}
                  className={clsx(
                    "group relative flex items-center gap-3",
                    "rounded-2xl px-5 py-3",
                    "text-base font-medium",
                    active ? "text-white" : "text-white/75 hover:text-white"
                  )}
                >
                  <span className={clsx("transition-colors", active ? "text-red-200" : "text-white/55 group-hover:text-red-200")}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-red-600 shadow-[0_0_16px_rgba(220,38,38,.9)]"
                      transition={{ type: "spring", stiffness: 520, damping: 36 }}
                    />
                  )}

                  <span className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-b from-red-600/18 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-transparent transition group-hover:ring-red-700/35" />
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="relative z-10 flex items-center gap-3 pr-4 sm:pr-6">
            <LanguagePill />

            <button
              type="button"
              className={clsx(
                "md:hidden inline-flex items-center justify-center",
                "h-12 w-12 rounded-2xl",
                "border border-red-900/40 bg-red-950/35 text-red-100",
                "shadow-[0_0_22px_rgba(220,38,38,.25)]",
                "hover:bg-red-900/35 hover:text-white transition-colors"
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.14, ease: EASE_OUT } }}
              className={clsx(
                "md:hidden mt-3 overflow-hidden rounded-2xl",
                "border border-red-900/40 bg-[#0b0606]/92 backdrop-blur-xl",
                "shadow-[0_30px_70px_-35px_rgba(127,29,29,1)]"
              )}
            >
              <div className="p-3">
                {nav.map((item) => {
                  if (hasChildren(item)) {
                    const opened = openDropdown === item.label;

                    return (
                      <div key={item.label} className="mb-2">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(opened ? null : item.label)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base text-white/90 hover:bg-red-600/12"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-red-200">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </span>
                          <motion.span
                            animate={{ rotate: opened ? 180 : 0 }}
                            transition={{ duration: 0.18, ease: EASE_OUT }}
                            className="text-white/50"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {opened && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } }}
                              exit={{ height: 0, opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } }}
                              className="overflow-hidden"
                            >
                              <div className="ml-3 mt-2 space-y-1 border-l border-red-900/40 pl-3">
                                {item.children.map((c) => (
                                  <Link
                                    key={c.href}
                                    href={c.href}
                                    onClick={closeAll}
                                    className="block rounded-2xl px-4 py-3 text-base text-white/75 hover:bg-red-600/12 hover:text-white"
                                  >
                                    {c.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeAll}
                      className={clsx(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium",
                        active ? "bg-red-600/12 text-white ring-1 ring-red-900/40" : "text-white/85 hover:bg-red-600/12 hover:text-white"
                      )}
                    >
                      <span className="text-red-200">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function LanguagePill() {
  const [open, setOpen] = useState(false);

  const items = [
    { code: "ID", label: "Indonesia", flag: "🇮🇩" },
    { code: "EN", label: "English", flag: "🇺🇸" },
  ];

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "group inline-flex items-center gap-3",
          "rounded-2xl px-5 py-3 text-base",
          "border border-red-900/40 bg-red-950/40 text-red-100",
          "shadow-[0_0_22px_rgba(220,38,38,.22)]",
          "hover:bg-red-900/35 hover:text-white transition-colors"
        )}
      >
        <span className="text-lg leading-none">{items[0].flag}</span>
        <span className="font-medium">{items[0].label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="text-white/45"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>

        <span className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-b from-red-600/18 to-transparent opacity-0 blur-md transition-opacity group-hover:opacity-100" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={clsx(
              "absolute right-0 top-[112%] w-48 overflow-hidden rounded-2xl",
              "border border-red-900/40 bg-[#0b0606]/95 backdrop-blur-xl",
              "shadow-[0_30px_70px_-35px_rgba(127,29,29,1)]"
            )}
          >
            <div className="p-2">
              {items.map((it) => (
                <button
                  type="button"
                  key={it.code}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base text-white/75 hover:bg-red-600/12 hover:text-white"
                >
                  <span className="text-lg">{it.flag}</span>
                  <span>{it.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
