"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const scrollToCommand = () => {
    const el = document.getElementById("command");
    if (el) window.scrollTo({ top: el.offsetTop });
  };

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center overflow-hidden"
    >
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-[1px] bg-amber" />
              <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
                The Machined Monolith
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary leading-[1.05]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Sartorial
              <br />
              <span className="text-amber">Autonomy.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-md"
              style={{ lineHeight: 1.7 }}
            >
              The world&apos;s first AI-integrated physical wardrobe.
              RFID-tagged garments. Climate-aware algorithms.
              Zero decision fatigue.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <button
                id="waitlist-btn"
                className="group flex items-center gap-3 px-8 py-3.5 bg-amber text-background text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 hover:bg-amber-dim"
              >
                Join Waitlist
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
              <button
                onClick={scrollToCommand}
                className="flex items-center gap-2 px-6 py-3.5 text-xs tracking-[0.1em] uppercase text-text-muted hover:text-amber transition-colors duration-200"
                style={{ border: "1px solid var(--outline)" }}
              >
                Try Dashboard
              </button>
            </motion.div>

            {/* Stats micro-bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { value: "20", label: "Garments" },
                { value: "3", label: "Sensors" },
                { value: "<2s", label: "Scan Time" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-text-primary tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Hardware render */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="relative flex items-center justify-center"
          >
            <div
              className="relative w-full aspect-square max-w-lg mx-auto overflow-hidden"
              style={{ border: "1px solid rgba(212, 175, 55, 0.12)" }}
            >
              <Image
                src="/hero.png"
                alt="Axiom Smart Wardrobe hardware unit — brushed titanium monolith with amber interior lighting"
                fill
                className="object-cover"
                priority
              />
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-[1px] bg-amber" />
              <div className="absolute top-0 left-0 w-[1px] h-6 bg-amber" />
              <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-amber" />
              <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-amber" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.2em] uppercase text-text-muted/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-amber/30"
        />
      </motion.div>
    </section>
  );
}
