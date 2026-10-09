"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Menu, X, ArrowUpRight } from "lucide-react";
import { useLenis } from "@/components/SmoothScrollProvider";

interface NavItem {
  label: string;
  href: string;
  isHash?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "/#about", isHash: true },
  { label: "INVENTORY", href: "/inventory" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "LAB", href: "/lab" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);
    if (item.isHash && pathname === "/") {
      const targetId = item.href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem && lenis) {
        lenis.scrollTo(elem, { offset: 0 });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-transparent backdrop-blur-sm border-b border-white/[0.04]"
      }`}
    >

      {/* 2. ARCHITECTURAL NAVIGATION ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-surface-mid border border-amber/30 group-hover:border-amber transition-colors duration-200">
            <Cpu size={16} strokeWidth={1.5} className="text-amber" />
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-text-primary group-hover:text-amber transition-colors duration-200">
              AXIOM
            </span>
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-text-muted">
              SMART WARDROBE
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              !item.isHash && (pathname === item.href || pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`relative px-4 py-2 font-mono text-[10px] tracking-[0.22em] uppercase transition-all duration-200 group flex items-center ${
                  isActive
                    ? "text-amber font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{item.label}</span>
                {/* Understated gold bottom line on hover/active (150-250ms) */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[1px] bg-amber transition-transform duration-200 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Enter Chamber CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-black border border-amber/50 hover:border-amber text-text-primary hover:text-amber font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-200 hover:bg-amber/10"
          >
            <span>ENTER CHAMBER</span>
            <span className="text-amber group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text-primary hover:text-amber border border-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-[#0C0C0C] border-b border-amber/20 px-6 py-6 flex flex-col gap-4 overflow-hidden"
          >
            <div className="font-mono text-[8.5px] tracking-[0.25em] uppercase text-text-muted pb-2 border-b border-white/10 flex items-center justify-between">
              <span>SYSTEM NAVIGATION</span>
              <span className="text-amber">[ PUBLIC INTERFACE ]</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  !item.isHash &&
                  (pathname === item.href || pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center justify-between px-3.5 py-2.5 border ${
                      isActive
                        ? "border-amber/40 bg-amber/10 text-amber font-semibold"
                        : "border-white/5 bg-surface-low text-text-secondary hover:text-text-primary"
                    } font-mono text-xs tracking-[0.16em] uppercase transition-colors`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={12} className="text-text-muted" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber text-black font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-amber-dim transition-colors"
              >
                <span>ENTER THE CHAMBER</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
