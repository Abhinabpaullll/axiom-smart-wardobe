"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, ShieldCheck, Activity, Radio, Sparkles, Sliders } from "lucide-react";
import Image from "next/image";

interface ScrollChamberRevealProps {
  onQuickGenerate?: () => void;
}

export default function ScrollChamberReveal({ onQuickGenerate }: ScrollChamberRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Target offset ["start end", "center center"]
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Map scrollYProgress [0, 1] to horizontal "glass doors opening" clipPath
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.2, 0.8, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const doorLineOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

  return (
    <div ref={containerRef} className="relative w-full my-16 sm:my-24">
      {/* Outer Chamber Frame / Halo */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section title & technical header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber">
                PHYSICAL REVEAL PROTOCOL
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
              The Machined Monolith Chamber
            </h3>
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted flex items-center gap-3">
            <span>BAY: 01-A</span>
            <span className="text-amber/40">|</span>
            <span>FREQ: 13.56 MHz</span>
          </div>
        </div>

        {/* Scroll Reveal Container */}
        <div className="relative overflow-hidden rounded-none p-[1px] bg-gradient-to-b from-amber/30 via-outline/40 to-transparent">
          {/* Motion clipPath Chamber */}
          <motion.div
            style={{
              clipPath,
              opacity,
              scale,
            }}
            className="relative w-full min-h-[460px] sm:min-h-[520px] bg-[#0E0E0E]/90 backdrop-blur-xl border border-amber/20 overflow-hidden shadow-2xl"
          >
            {/* Center seam door line indicating parting glass doors */}
            <motion.div
              style={{ opacity: doorLineOpacity }}
              className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber via-amber/60 to-transparent z-30"
            />

            {/* Corner Machined Accents */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-amber z-20" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-amber z-20" />
            <div className="absolute top-0 right-0 w-8 h-[1px] bg-amber z-20" />
            <div className="absolute top-0 right-0 w-[1px] h-8 bg-amber z-20" />
            <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-amber z-20" />
            <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-amber z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-amber z-20" />
            <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-amber z-20" />

            {/* Subtle background tech grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* OVERLAY BADGE INSIDE CONTAINER: "CHAMBER STATUS: ACTIVE" with 1px #D4AF37 border and monospace text */}
            <div className="absolute top-6 left-6 z-20">
              <div
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-black/80 backdrop-blur-md font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]"
                style={{
                  border: "1px solid #D4AF37",
                  boxShadow: "0 0 16px rgba(212, 175, 55, 0.15)",
                }}
              >
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
                <span className="font-semibold">CHAMBER STATUS: ACTIVE</span>
              </div>
            </div>

            {/* Top Right Specs Telemetry */}
            <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-4 font-mono text-[10px] tracking-[0.15em] text-text-muted">
              <div className="flex items-center gap-1.5">
                <Radio size={12} className="text-amber" />
                <span>20 RFID TAGS LOCKED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={12} className="text-amber" />
                <span>PNEUMATIC SEAL: 100%</span>
              </div>
            </div>

            {/* Chamber Interior Layout */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-12 pt-20 sm:pt-24 items-center">
              {/* Left Column: Monolith Hardware Visualization */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-sm aspect-[4/5] bg-surface-low border border-white/10 overflow-hidden group">
                  <Image
                    src="/hero.png"
                    alt="Axiom Titanium Monolith Chamber"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  
                  {/* Laser scan line inside image preview */}
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber to-transparent animate-pulse top-1/3" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[9px] tracking-[0.15em] text-text-muted uppercase bg-black/60 backdrop-blur-sm p-2 border border-white/5">
                    <span>AEROSPACE CHASSIS</span>
                    <span className="text-amber">7075-T6 TITANIUM</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Chamber Diagnostics */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                    <ShieldCheck size={14} className="text-amber" />
                    <span>OPTICAL SENSING ARRAY &amp; PNEUMATIC CAROUSEL</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-text-primary">
                    Dual Hermetic Aperture with Sub-Millimeter RFID Triangulation
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
                    As you engage the scroll sequence, the motorized titanium glass doors decouple.
                    Integrated sensor beams identify fabric density, thermal insulation grades, and wear history
                    before dispensing the calibrated garment permutation.
                  </p>
                </div>

                {/* Diagnostics matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-surface-low/80 border border-white/5 flex flex-col gap-1">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">
                      DOOR MECHANISM
                    </span>
                    <span className="text-xs font-semibold text-text-primary font-mono">
                      SYNC GLASS SLIDE
                    </span>
                    <span className="text-[9px] text-amber font-mono">0.4 SEC DISPENSE</span>
                  </div>

                  <div className="p-3 bg-surface-low/80 border border-white/5 flex flex-col gap-1">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">
                      CLIMATE SEAL
                    </span>
                    <span className="text-xs font-semibold text-text-primary font-mono">
                      18°C · 42% RH
                    </span>
                    <span className="text-[9px] text-amber font-mono">UV-C STERILIZED</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3 bg-surface-low/80 border border-white/5 flex flex-col gap-1">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">
                      NON-REPEAT BUFFER
                    </span>
                    <span className="text-xs font-semibold text-text-primary font-mono">
                      72 HR PROTOCOL
                    </span>
                    <span className="text-[9px] text-amber font-mono">100% ENFORCED</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (onQuickGenerate) {
                        onQuickGenerate();
                      } else {
                        const el = document.getElementById("command-center-section");
                        if (el) window.scrollTo({ top: el.offsetTop });
                      }
                    }}
                    className="flex items-center gap-2.5 px-6 py-3 bg-amber text-background text-xs font-semibold tracking-[0.12em] uppercase hover:bg-amber-dim transition-all duration-200"
                  >
                    <Sparkles size={14} />
                    INITIALIZE SYNTHESIS
                  </button>

                  <a
                    href="/inventory"
                    className="flex items-center gap-2 px-5 py-3 border border-outline text-text-secondary hover:text-amber hover:border-amber/40 text-xs font-mono tracking-[0.1em] uppercase transition-all duration-200"
                  >
                    <Sliders size={13} />
                    INSPECT BAYS
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom status strip */}
            <div className="relative border-t border-white/5 px-6 py-3 bg-black/40 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-amber" />
                <span>AXIOM CORE OS v4.1 · EDGE RUNTIME READY</span>
              </div>
              <div className="text-text-muted/60">
                SCROLL PROGRESS: SYNCHRONIZED
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
