"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ScanLine } from "lucide-react";

export default function VirtualTryOnSection() {
  return (
    <section id="vto" className="relative py-28 sm:py-36 bg-[#0A0A0A] border-t border-white/5">
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
        <div className="flex flex-col gap-4 mb-16 sm:mb-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber">
              SECTION 05 / VIRTUAL SILHOUETTE &amp; TRY-ON LAB
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.04]"
                style={{ letterSpacing: "-0.035em" }}
              >
                SEE THE DECISION
                <br />
                <span className="text-amber">BEFORE YOU WEAR IT.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl mt-4 font-sans">
                Axiom integrates a modular 4-piece styling canvas with virtual biometric projection.
                Evaluate drape, shoulder-to-inseam ratios, and color synergy before physically dispensing a single garment from the chamber.
              </p>
            </div>

            {/* CTA to /lab */}
            <Link
              href="/lab"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-black border border-amber/50 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber/10 shrink-0 self-start lg:self-end"
            >
              <span>ENTER LAB</span>
              <ArrowRight size={13} className="text-amber group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Visual Lab Matrix Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Simulated VTO Display Box (Col 1-7) */}
          <div className="lg:col-span-7 relative aspect-[16/10] bg-[#0E0E0E] border border-amber/30 p-2 shadow-2xl overflow-hidden group">
            {/* Corner Machined Accents */}
            <div className="absolute top-0 left-0 w-6 h-[2px] bg-amber z-30" />
            <div className="absolute top-0 left-0 w-[2px] h-6 bg-amber z-30" />
            <div className="absolute top-0 right-0 w-6 h-[2px] bg-amber z-30" />
            <div className="absolute top-0 right-0 w-[2px] h-6 bg-amber z-30" />
            <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-amber z-30" />
            <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-amber z-30" />
            <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-amber z-30" />
            <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-amber z-30" />

            {/* Simulated Model & Reticle Visualizer */}
            <div className="relative w-full h-full bg-black/80 flex items-center justify-center overflow-hidden">
              <Image
                src="/hero.png"
                alt="Axiom Biometric Virtual Model Preview"
                fill
                className="object-cover opacity-60"
              />

              {/* Laser Scan HUD Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                <div className="p-3 bg-black/80 border border-amber/50">
                  <ScanLine size={24} className="text-amber animate-pulse" />
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#F5F5F7] font-semibold">
                  BIOMETRIC SILHOUETTE SYNCHRONIZED
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted">
                  VTO ENGINE v4.1 · MODULAR 4-SLOT FIT CALIBRATION
                </div>
              </div>

              {/* Precision Reticles */}
              <div className="absolute top-4 left-4 font-mono text-[8px] tracking-[0.2em] uppercase text-amber">
                + RETICLE_01 [SHOULDER]
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[8px] tracking-[0.2em] uppercase text-amber">
                + RETICLE_02 [HEM]
              </div>
            </div>
          </div>

          {/* Right: Technical Capabilities Dock (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-4 font-mono text-xs">
            <div className="p-5 bg-surface-low border border-white/10 flex flex-col gap-1.5">
              <span className="text-[9px] text-amber uppercase tracking-[0.18em]">
                01 / MODULAR 4-SLOT CANVAS
              </span>
              <h4 className="text-sm font-semibold text-[#F5F5F7] font-sans">
                Drag-and-Drop Composition
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Independently swap tops, bottoms, shoes, and accessories from your active wardrobe inventory with instant synergy scoring.
              </p>
            </div>

            <div className="p-5 bg-surface-low border border-white/10 flex flex-col gap-1.5">
              <span className="text-[9px] text-amber uppercase tracking-[0.18em]">
                02 / SIMULATED BIOMETRIC SCAN
              </span>
              <h4 className="text-sm font-semibold text-[#F5F5F7] font-sans">
                2-Second Laser Mapping
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Upload your silhouette photo or select studio presets to preview garment drape and proportions under simulated lighting.
              </p>
            </div>

            <div className="p-5 bg-surface-low border border-white/10 flex flex-col gap-1.5">
              <span className="text-[9px] text-amber uppercase tracking-[0.18em]">
                03 / DIRECT ARCHIVE EXPORT
              </span>
              <h4 className="text-sm font-semibold text-[#F5F5F7] font-sans">
                One-Click Rotation Logging
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                Approved configurations can be saved directly to the rotation archive, updating the 72-hour protocol buffer automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
