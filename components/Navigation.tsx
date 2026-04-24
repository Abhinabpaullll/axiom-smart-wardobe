"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "hardware", label: "Hardware" },
  { id: "command", label: "Command" },
  { id: "mirror", label: "Mirror" },
  { id: "specs", label: "Specs" },
] as const;

export default function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Determine active section
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-low/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(212, 175, 55, 0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 group"
        >
          <Cpu size={18} strokeWidth={1.5} className="text-amber" />
          <span className="text-xs font-semibold tracking-[0.1em] uppercase text-text-primary group-hover:text-amber transition-colors duration-200">
            Axiom
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 ${
                active === item.id
                  ? "text-amber"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {item.label}
              {active === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-amber"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile: minimal indicator */}
        <div className="sm:hidden flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-1.5 h-1.5 transition-colors duration-200 ${
                active === item.id ? "bg-amber" : "bg-outline"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
