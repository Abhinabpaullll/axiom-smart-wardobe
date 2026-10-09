"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalChamberCTA() {
  return (
    <section id="chamber" className="relative py-32 sm:py-44 bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-amber" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber">
            SECTION 06 / SYSTEM ENGAGEMENT
          </span>
          <div className="w-8 h-[1px] bg-amber" />
        </div>

        {/* Headline */}
        <h2
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.0] mb-6"
          style={{ letterSpacing: "-0.04em" }}
        >
          THE PHYSICAL SYSTEM
          <br />
          <span className="text-amber">AWAITS.</span>
        </h2>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xl mb-10 font-sans">
          Step into the chamber command console. Synthesize calibrated outfit permutations in under 50 milliseconds,
          enforce the 72-hour non-repeat buffer, and command your physical wardrobe with computational precision.
        </p>

        {/* Primary CTA Button */}
        <Link
          href="/dashboard"
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-black border border-amber/60 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 hover:bg-amber/10 shadow-2xl shadow-black"
        >
          <span>ENTER THE CHAMBER</span>
          <ArrowRight size={14} className="text-amber group-hover:translate-x-1.5 transition-transform duration-200" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-amber" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-amber" />
        </Link>

        {/* Status Line */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted">
          <span className="flex items-center gap-1.5 text-text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            CHAMBER: ONLINE
          </span>
          <span>·</span>
          <span>13.56 MHz RFID READY</span>
          <span>·</span>
          <span>72H PROTOCOL ACTIVE</span>
        </div>
      </div>
    </section>
  );
}
