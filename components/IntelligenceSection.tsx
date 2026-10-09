"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Sparkles } from "lucide-react";

export default function IntelligenceSection() {
  return (
    <section id="intelligence" className="relative py-28 sm:py-36 bg-[#0A0A0A] border-t border-white/5">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 sm:mb-24">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber">
              SECTION 03 / THE INTELLIGENCE LAYER
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.04]"
                style={{ letterSpacing: "-0.035em" }}
              >
                ZERO DECISION FATIGUE.
                <br />
                <span className="text-amber">COMPUTATIONAL HARMONY.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 font-mono text-[10px] tracking-[0.16em] uppercase text-text-muted">
              DETERMINISTIC EVALUATION · 72H PROTOCOL · &lt;50MS LATENCY
            </div>
          </div>
        </div>

        {/* Large Editorial Equation Composition */}
        <div className="p-8 sm:p-12 bg-[#121212]/90 border border-white/10 backdrop-blur-xl shadow-2xl relative mb-12">
          {/* Corner Machined Accents */}
          <div className="absolute top-0 left-0 w-6 h-[1px] bg-amber" />
          <div className="absolute top-0 left-0 w-[1px] h-6 bg-amber" />
          <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-amber" />
          <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-amber" />

          {/* Equation Pipeline Header */}
          <div className="pb-6 mb-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted">
            <span className="text-amber font-semibold flex items-center gap-2">
              <Cpu size={14} />
              SARTORIAL SYNTHESIS FORMULATION
            </span>
            <span>AXIOM ALGORITHM v4.1</span>
          </div>

          {/* 4 Pipeline Input Vectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Input Vector 1 */}
            <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-amber mb-2">
                [ VECTOR 01 ]
              </span>
              <div className="text-base font-semibold text-[#F5F5F7] mb-1">
                Digital Inventory
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Real-time active wardrobe pool categorized across Tops, Bottoms, Footwear, and Accessories.
              </p>
            </div>

            {/* Input Vector 2 */}
            <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-amber mb-2">
                [ VECTOR 02 ]
              </span>
              <div className="text-base font-semibold text-[#F5F5F7] mb-1">
                Ambient Climate
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Garment thermal insulation ratings cross-checked with chamber ambient temperature parameters.
              </p>
            </div>

            {/* Input Vector 3 */}
            <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-amber mb-2">
                [ VECTOR 03 ]
              </span>
              <div className="text-base font-semibold text-[#F5F5F7] mb-1">
                72h Non-Repeat
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Strict 3-day history lockout prevents any single garment from repeating within the rotation window.
              </p>
            </div>

            {/* Input Vector 4 */}
            <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-amber mb-2">
                [ VECTOR 04 ]
              </span>
              <div className="text-base font-semibold text-[#F5F5F7] mb-1">
                Style Matrix
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Color harmony, silhouette proportions, and formality convergence (Casual, Smart-Casual, Formal).
              </p>
            </div>
          </div>

          {/* Transformation Arrow & Synthesis Result */}
          <div className="p-6 bg-surface-mid/80 border border-amber/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black border border-amber/40 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-amber" />
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber font-semibold">
                  SYNTHESIS OUTPUT
                </div>
                <h3 className="text-lg font-semibold text-[#F5F5F7] tracking-tight">
                  A Calibrated 4-Piece Uniform
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans">
                  Dispenses top, lower piece, footwear, and accessory harmonized for immediate wear.
                </p>
              </div>
            </div>

            {/* Action CTA to /lab */}
            <Link
              href="/lab"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-black border border-amber/60 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber/10 shrink-0"
            >
              <span>OPEN STYLE LAB</span>
              <ArrowRight size={13} className="text-amber group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
