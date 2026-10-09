"use client";

import CommandCenter from "@/components/CommandCenter";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-[#E7E5E4] overflow-x-hidden pt-20 sm:pt-24 pb-24">
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-text-secondary hover:text-amber transition-colors"
            >
              <ArrowLeft size={12} />
              <span>RETURN TO LANDING</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-amber">CHAMBER COMMAND CONSOLE</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CHAMBER STATUS: READY
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">20 TRANSPONDERS DETECTED</span>
          </div>
        </div>
      </div>

      {/* Interactive Command Center Chamber Engine */}
      <CommandCenter />

      {/* Chamber Ecosystem Navigation Quick Dock */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/inventory"
            className="p-6 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted mb-4">
              <span className="text-amber">ECOSYSTEM 01</span>
              <span>20 PIECES</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-amber transition-colors">
                Machined Inventory
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Inspect live chamber occupancy, bay allocation, and RFID telemetry across all garments.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[9px] text-amber flex items-center gap-1">
              OPEN INVENTORY →
            </div>
          </Link>

          <Link
            href="/archive"
            className="p-6 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted mb-4">
              <span className="text-amber">ECOSYSTEM 02</span>
              <span>72H PROTOCOL</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-amber transition-colors">
                Wear Timeline Archive
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Chronological ledger of previously dispensed outfits verified against the non-repeat buffer.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[9px] text-amber flex items-center gap-1">
              OPEN ARCHIVE →
            </div>
          </Link>

          <Link
            href="/lab"
            className="p-6 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted mb-4">
              <span className="text-amber">ECOSYSTEM 03</span>
              <span>VTO LAB</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-amber transition-colors">
                Sartorial &amp; VTO Lab
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                4-slot modular canvas builder with simulated 2-second biometric laser silhouette scan.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[9px] text-amber flex items-center gap-1">
              OPEN STYLE LAB →
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
