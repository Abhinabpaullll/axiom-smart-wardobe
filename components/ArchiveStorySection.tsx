"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

export default function ArchiveStorySection() {
  const SAMPLE_ENTRIES = [
    {
      date: "2026-08-19",
      formality: "SMART-CASUAL",
      temp: "19°C",
      top: "Charcoal Merino Crew",
      bottom: "Stone Tapered Chinos",
      shoes: "Ash Suede Chelsea Boots",
      acc: "Woven Charcoal Leather Belt",
      status: "COMPLIANT",
    },
    {
      date: "2026-08-17",
      formality: "CASUAL",
      temp: "24°C",
      top: "Graphite Heavyweight Henley",
      bottom: "Raw Indigo Selvedge Denim",
      shoes: "Titanium Sneakers",
      acc: "Polarized Frames",
      status: "COMPLIANT",
    },
    {
      date: "2026-08-15",
      formality: "FORMAL",
      temp: "15°C",
      top: "Ivory Oxford Shirt",
      bottom: "Obsidian Tailored Trousers",
      shoes: "Espresso Derby Shoes",
      acc: "Machined Chronograph",
      status: "COMPLIANT",
    },
  ];

  return (
    <section id="archive" className="relative py-28 sm:py-36 bg-[#080808] border-t border-white/5">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 sm:mb-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-amber">
              SECTION 04 / SARTORIAL ROTATION ARCHIVE
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.04]"
                style={{ letterSpacing: "-0.035em" }}
              >
                EVERY WEAR
                <br />
                <span className="text-amber">BECOMES DATA.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl mt-4 font-sans">
                Axiom maintains an immutable chronological ledger of every combination worn.
                By mapping asset rest intervals and wear frequency, your wardrobe remains in perpetual balance
                without repeating key looks within the 72-hour window.
              </p>
            </div>

            {/* CTA to /archive */}
            <Link
              href="/archive"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-black border border-amber/50 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber/10 shrink-0 self-start lg:self-end"
            >
              <span>VIEW ARCHIVE</span>
              <ArrowRight size={13} className="text-amber group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Refined Timeline Ledger Preview */}
        <div className="space-y-3 font-mono">
          {SAMPLE_ENTRIES.map((entry) => (
            <div
              key={entry.date}
              className="p-5 sm:p-6 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Date & Protocol Badge */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="flex items-center gap-2 text-text-primary text-xs">
                  <Calendar size={13} className="text-amber" />
                  <span className="font-semibold">{entry.date}</span>
                </div>
                <span className="px-2 py-0.5 bg-surface-highest text-amber text-[9px] border border-amber/30 uppercase">
                  {entry.formality}
                </span>
              </div>

              {/* 4-Piece Manifest Preview */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A1AA] flex-1">
                <span className="text-text-primary">{entry.top}</span>
                <span className="text-white/20">·</span>
                <span>{entry.bottom}</span>
                <span className="text-white/20">·</span>
                <span>{entry.shoes}</span>
                <span className="text-white/20">·</span>
                <span>{entry.acc}</span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 shrink-0">
                <CheckCircle2 size={12} />
                <span>72H PROTOCOL COMPLIANT</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Information Line */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          <span>HISTORICAL ROTATION REGISTER ACTIVE</span>
          <span className="text-amber">LOCAL LOG SYNCHRONIZED</span>
        </div>
      </div>
    </section>
  );
}
