"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

export default function AxiomFooter() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 py-16 text-text-muted select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5 items-start">
          {/* Brand Identity & System Statement */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center bg-surface-mid border border-amber/30">
                <Cpu size={14} className="text-amber" />
              </div>
              <span className="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-[#F5F5F7]">
                AXIOM SMART WARDROBE
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm font-sans">
              Precision-engineered physical wardrobe systems integrated with computational styling algorithms and RFID transponder telemetry.
            </p>
            <div className="font-mono text-[8.5px] tracking-[0.18em] uppercase text-text-muted">
              PROJECT REF: 11456649540610009134
            </div>
          </div>

          {/* Ecosystem Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3 font-mono text-[9px] tracking-[0.2em] uppercase">
            <span className="text-[#F5F5F7] font-semibold">ECOSYSTEM</span>
            <Link href="/dashboard" className="hover:text-amber transition-colors">
              COMMAND CONSOLE
            </Link>
            <Link href="/inventory" className="hover:text-amber transition-colors">
              MACHINED INVENTORY
            </Link>
            <Link href="/archive" className="hover:text-amber transition-colors">
              ROTATION ARCHIVE
            </Link>
            <Link href="/lab" className="hover:text-amber transition-colors">
              VTO STYLE LAB
            </Link>
          </div>

          {/* Technical System Status */}
          <div className="md:col-span-3 flex flex-col gap-3 font-mono text-[9px] tracking-[0.2em] uppercase">
            <span className="text-[#F5F5F7] font-semibold">SYSTEM TELEMETRY</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#F5F5F7]">CHAMBER: ONLINE</span>
            </div>
            <span>FREQUENCY: 13.56 MHz</span>
            <span>CHASSIS: 7075-T6 TITANIUM</span>
            <span>RUNTIME: NEXT.JS EDGE READY</span>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[8.5px] tracking-[0.18em] uppercase">
          <div>
            © 2026 AXIOM SYSTEMS · ALL SPECIFICATIONS REGISTERED
          </div>
          <div className="flex items-center gap-4 text-text-muted/60">
            <span>PRECISION × HARDWARE × FASHION × AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
