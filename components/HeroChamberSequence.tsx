"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Radio, Cpu, Sparkles } from "lucide-react";
import wardrobeData from "@/data/wardrobe.json";

export default function HeroChamberSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll timeline across 220vh pinned sequence (120vh active scroll distance)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Camera Motion (Requirement 8): 1.0 -> 1.05 -> 1.09
  const cameraScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    shouldReduceMotion ? [1, 1, 1, 1] : [1, 1.04, 1.07, 1.09]
  );

  // Door Separation Motion (Requirement 5 & 6):
  // 0% - 12%: Closed
  // 12% - 30%: Doors visibly separate
  // 30% - 48%: Doors wide open revealing interior
  const leftDoorX = useTransform(
    scrollYProgress,
    [0.08, 0.45],
    shouldReduceMotion ? ["-100%", "-100%"] : ["0%", "-102%"]
  );
  const rightDoorX = useTransform(
    scrollYProgress,
    [0.08, 0.45],
    shouldReduceMotion ? ["100%", "100%"] : ["0%", "102%"]
  );

  // Center Seam Glow line
  const centerSeamOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.22],
    shouldReduceMotion ? [0, 0] : [1, 0]
  );

  // Interior chamber amber lighting
  const interiorLight = useTransform(
    scrollYProgress,
    [0.12, 0.42],
    shouldReduceMotion ? [0.7, 0.7] : [0.05, 0.8]
  );

  // Garment contents reveal (30% -> 48%)
  const interiorGarmentsOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.45],
    shouldReduceMotion ? [1, 1] : [0, 1]
  );
  const interiorGarmentsY = useTransform(
    scrollYProgress,
    [0.22, 0.45],
    shouldReduceMotion ? [0, 0] : [14, 0]
  );

  // RFID gold laser scan sweep (Requirement 9: 25% -> 65%)
  const scanLineTop = useTransform(
    scrollYProgress,
    [0.25, 0.65],
    ["10%", "88%"]
  );
  const scanLineOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.28, 0.62, 0.7],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );

  // Typography participation in motion (Requirement 10)
  // Headline moves subtly upward and fades slightly as intelligence becomes dominant
  const headlineY = useTransform(
    scrollYProgress,
    [0.1, 0.6, 0.9],
    shouldReduceMotion ? [0, 0, 0] : [0, -18, -35]
  );
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.9],
    shouldReduceMotion ? [1, 1] : [1, 0.35]
  );

  // Dynamic system explanation typography during Phase 4 & 5 (60% -> 85%)
  const explanationOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.65, 0.9],
    shouldReduceMotion ? [1, 1, 1] : [0, 1, 0.8]
  );

  // Floating Chamber Log Card parallax
  const logCardY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -25]
  );

  // Real items from wardrobe.json for the 4-bay preview
  const previewGarments = [
    { bay: "BAY A-01", type: "TOP", item: wardrobeData[0] },   // Charcoal Merino Crew
    { bay: "BAY B-02", type: "LOWER", item: wardrobeData[7] }, // Stone Tapered Chinos
    { bay: "BAY C-02", type: "SHOES", item: wardrobeData[12] }, // Ash Suede Chelsea Boots
    { bay: "BAY D-03", type: "ACC", item: wardrobeData[17] },  // Woven Charcoal Leather Belt
  ];

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) window.scrollTo({ top: el.offsetTop });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#0A0A0A] select-none"
    >
      {/* 
        Sticky Viewport Stage:
        Occupies exactly 100svh with zero top-gap.
      */}
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden">
        {/* Subtle Architectural Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Ambient Radial Illumination */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-amber/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Main Viewport Content Layout (No Artificial Gaps) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* ── LEFT: ASYMMETRIC EDITORIAL COMPOSITION ── */}
            <motion.div
              style={{
                y: headlineY,
                opacity: headlineOpacity,
              }}
              className="lg:col-span-6 flex flex-col gap-4 sm:gap-6 z-20"
            >
              {/* Technical Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-8 sm:w-10 h-[1px] bg-amber" />
                <span className="font-mono text-[9px] font-medium tracking-[0.25em] uppercase text-amber">
                  AXIOM / SMART WARDROBE SYSTEM
                </span>
              </div>

              {/* Massive Tight-Line Headline */}
              <h1
                className="text-4xl sm:text-6xl lg:text-[4.1rem] font-semibold text-[#F5F5F7] tracking-tight leading-[0.98]"
                style={{ letterSpacing: "-0.04em" }}
              >
                YOUR WARDROBE.
                <br />
                <span className="text-amber">WITH INTELLIGENCE.</span>
              </h1>

              {/* Concise Refined Description */}
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-md font-sans">
                Axiom connects a physical wardrobe with a digital intelligence layer that understands
                inventory, context, outfit combinations and visual styling.
              </p>

              {/* Dynamic Scroll-Revealed System Explanation */}
              <motion.div
                style={{ opacity: explanationOpacity }}
                className="p-3 bg-surface-low/90 border border-white/10 font-mono text-[9px] tracking-[0.14em] uppercase text-text-muted max-w-md"
              >
                <div className="flex items-center justify-between text-text-primary pb-1.5 border-b border-white/5">
                  <span className="text-amber font-semibold">CHAMBER STATE:</span>
                  <span>72H BUFFER ACTIVE</span>
                </div>
                <div className="pt-1.5 text-[#A1A1AA] font-sans text-xs normal-case">
                  Scroll drives synchronous glass aperture, laser telemetry, and computational outfit synthesis.
                </div>
              </motion.div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                {/* Primary CTA to /dashboard */}
                <Link
                  href="/dashboard"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-black border border-amber/60 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber/10 shadow-lg shadow-black/80"
                >
                  <span>ENTER THE CHAMBER</span>
                  <ArrowRight size={13} className="text-amber group-hover:translate-x-1 transition-transform duration-200" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber" />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-amber" />
                </Link>

                {/* Secondary CTA: Scroll to System */}
                <button
                  onClick={scrollToAbout}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-white/10 hover:border-amber/40 text-text-muted hover:text-text-primary font-mono text-xs tracking-[0.14em] uppercase transition-colors"
                >
                  <span>EXPLORE SYSTEM</span>
                  <ChevronDown size={14} className="text-amber" />
                </button>
              </div>

              {/* Technical System Status Indicators (Data Truth: No Fake Metrics) */}
              <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-[8.5px] tracking-[0.18em] uppercase text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  <span>CHAMBER: ONLINE</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Radio size={11} className="text-amber" />
                  <span>20 RFID ASSETS</span>
                </div>
                <span>·</span>
                <span>NON-REPEAT BUFFER: 72H</span>
              </div>
            </motion.div>

            {/* ── RIGHT: HERO PRODUCT VISUAL & DUAL DOOR OPENING ANIMATION ── */}
            <motion.div
              style={{ scale: cameraScale }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              {/* 
                Chamber Box:
                Maintains exact aspect-square (1024x1024 natural render proportions).
                Never uses object-fit: fill.
              */}
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[450px] aspect-square bg-[#0E0E0E] border border-amber/30 p-2 shadow-2xl overflow-hidden group">
                
                {/* Aerospace Corner Brackets */}
                <div className="absolute top-0 left-0 w-5 h-[2px] bg-amber z-40" />
                <div className="absolute top-0 left-0 w-[2px] h-5 bg-amber z-40" />
                <div className="absolute top-0 right-0 w-5 h-[2px] bg-amber z-40" />
                <div className="absolute top-0 right-0 w-[2px] h-5 bg-amber z-40" />
                <div className="absolute bottom-0 left-0 w-5 h-[2px] bg-amber z-40" />
                <div className="absolute bottom-0 left-0 w-[2px] h-5 bg-amber z-40" />
                <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-amber z-40" />
                <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-amber z-40" />

                {/* Technical Annotation Labels */}
                <div className="absolute top-2.5 left-2.5 z-30 font-mono text-[7.5px] tracking-[0.2em] uppercase text-amber/80 bg-black/80 px-2 py-0.5 border border-amber/20">
                  CHAMBER 01 · 13.56 MHz
                </div>
                <div className="absolute top-2.5 right-2.5 z-30 font-mono text-[7.5px] tracking-[0.2em] uppercase text-text-muted bg-black/80 px-2 py-0.5 border border-white/10">
                  7075-T6 TITANIUM
                </div>

                {/* Inner Image & Reveal Stage */}
                <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                  {/* Physical Wardrobe Render (Aspect Ratio Preserved) */}
                  <Image
                    src="/hero.png"
                    alt="Axiom Smart Wardrobe Physical Monolith"
                    fill
                    priority
                    className="object-contain opacity-90 transition-transform duration-700"
                  />

                  {/* Dynamic Interior Amber Backlight Illumination */}
                  <motion.div
                    style={{ opacity: interiorLight }}
                    className="absolute inset-0 bg-gradient-to-t from-amber/25 via-amber/10 to-transparent pointer-events-none"
                  />

                  {/* ── REVEALED CHAMBER INTERIOR (Phase 3 & 4) ── */}
                  <motion.div
                    style={{
                      opacity: interiorGarmentsOpacity,
                      y: interiorGarmentsY,
                    }}
                    className="absolute inset-3 z-20 flex flex-col justify-between p-3.5 bg-black/80 backdrop-blur-md border border-amber/30 pointer-events-none"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-[8px] uppercase tracking-[0.16em]">
                      <span className="text-amber flex items-center gap-1">
                        <Sparkles size={10} />
                        CHAMBER INTERIOR REVEALED
                      </span>
                      <span className="text-text-muted">4 SARTORIAL BAYS</span>
                    </div>

                    {/* 4 Detected Chamber Garment Slots */}
                    <div className="grid grid-cols-2 gap-2 my-auto">
                      {previewGarments.map((slot) => (
                        <div
                          key={slot.item.id}
                          className="p-2 bg-surface-low/95 border border-white/10 flex items-center gap-2"
                        >
                          <div
                            className="w-4 h-4 shrink-0 border border-amber/30"
                            style={{ backgroundColor: slot.item.color }}
                          />
                          <div className="min-w-0 flex flex-col">
                            <span className="font-mono text-[6.5px] text-amber uppercase">
                              {slot.bay} · {slot.type}
                            </span>
                            <span className="text-[9.5px] font-medium text-[#F5F5F7] truncate">
                              {slot.item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[7.5px] uppercase tracking-[0.14em] text-text-muted">
                      <span>SYNCHRONIZING RFID UIDs</span>
                      <span className="text-amber">72H PROTOCOL LOCKED</span>
                    </div>
                  </motion.div>

                  {/* ── GOLD RFID HORIZONTAL LASER SCAN LINE (Phase 3 & 4) ── */}
                  <motion.div
                    style={{
                      top: scanLineTop,
                      opacity: scanLineOpacity,
                    }}
                    className="absolute inset-x-0 h-[2px] z-30 pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-amber to-transparent shadow-[0_0_12px_#D4AF37]" />
                    <div className="absolute right-2 px-1.5 py-0.5 bg-black border border-amber text-[6.5px] font-mono uppercase text-amber tracking-[0.18em]">
                      RFID DETECTED
                    </div>
                  </motion.div>

                  {/* ── DUAL MOTORIZED GLASS SLIDING PANELS (Physical Door Separation) ── */}
                  <div className="absolute inset-0 z-25 pointer-events-none flex overflow-hidden">
                    {/* Left Sliding Door Panel */}
                    <motion.div
                      style={{ x: leftDoorX }}
                      className="w-1/2 h-full bg-[#0E0E0E]/90 backdrop-blur-sm border-r border-amber/50 flex flex-col justify-between p-3.5"
                    >
                      <div className="font-mono text-[7px] tracking-[0.2em] uppercase text-amber/60">
                        DOOR_L / 7075-T6
                      </div>
                      <div className="space-y-1">
                        <div className="w-5 h-[1px] bg-amber/40" />
                        <div className="w-2.5 h-[1px] bg-amber/40" />
                      </div>
                    </motion.div>

                    {/* Right Sliding Door Panel */}
                    <motion.div
                      style={{ x: rightDoorX }}
                      className="w-1/2 h-full bg-[#0E0E0E]/90 backdrop-blur-sm border-l border-amber/50 flex flex-col justify-between items-end p-3.5"
                    >
                      <div className="font-mono text-[7px] tracking-[0.2em] uppercase text-amber/60">
                        DOOR_R / 7075-T6
                      </div>
                      <div className="space-y-1 flex flex-col items-end">
                        <div className="w-5 h-[1px] bg-amber/40" />
                        <div className="w-2.5 h-[1px] bg-amber/40" />
                      </div>
                    </motion.div>

                    {/* Center Seam Parting Line (Glows then vanishes as doors decouple) */}
                    <motion.div
                      style={{ opacity: centerSeamOpacity }}
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber via-amber/70 to-transparent shadow-[0_0_10px_#D4AF37]"
                    />
                  </div>
                </div>

                {/* Bottom Chamber Frame Footer */}
                <div className="absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/5 font-mono text-[7.5px] tracking-[0.18em] uppercase text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={9} className="text-amber" />
                    <span>HERMETIC PNEUMATIC SEAL</span>
                  </div>
                  <span className="text-amber">AXIOM CORE</span>
                </div>
              </div>

              {/* ── FLOATING CHAMBER STATUS CARD (Diagnostic Display) ── */}
              <motion.div
                style={{ y: logCardY }}
                className="absolute -bottom-4 -right-1 sm:-right-4 z-35 w-48 sm:w-56 p-3.5 bg-[#121212]/95 backdrop-blur-xl border border-amber/30 shadow-2xl font-mono text-[8px]"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 uppercase tracking-[0.18em]">
                  <span className="text-amber font-semibold">CHAMBER LOG</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                {/* Diagnostics List */}
                <div className="flex flex-col gap-1 tracking-[0.14em] text-text-muted uppercase">
                  <div className="flex items-center justify-between">
                    <span>SYSTEM</span>
                    <span className="text-[#F5F5F7]">READY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>RFID ARRAY</span>
                    <span className="text-amber">INITIALIZED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>STYLE ENGINE</span>
                    <span className="text-[#F5F5F7]">STANDBY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VTO SYSTEM</span>
                    <span className="text-[#F5F5F7]">AVAILABLE</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Prompt to scroll during initial viewport */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[7.5px] tracking-[0.25em] uppercase text-text-muted/60 pointer-events-none">
            <span>SCROLL TO OPEN CHAMBER</span>
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronDown size={12} className="text-amber" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
