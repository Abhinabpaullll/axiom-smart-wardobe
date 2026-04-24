"use client";

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HardwareTech from "@/components/HardwareTech";
import CommandCenter from "@/components/CommandCenter";
import VirtualMirror from "@/components/VirtualMirror";
import SpecsSection from "@/components/SpecsSection";
import { Cpu } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navigation />

      <main>
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Hardware Tech */}
        <HardwareTech />

        {/* Section 3: Command Center (Dashboard) */}
        <CommandCenter />

        {/* Section 4: Virtual Mirror */}
        <VirtualMirror />

        {/* Section 5: Specs */}
        <SpecsSection />
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-surface-low">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Cpu size={14} strokeWidth={1.5} className="text-amber/50" />
            <span className="text-[9px] tracking-[0.15em] uppercase text-text-muted/50">
              Axiom Systems v1.0
            </span>
          </div>
          <span className="text-[9px] tracking-[0.15em] uppercase text-text-muted/50">
            20 Garments · RFID Active · Aerospace Aluminum
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-text-muted/30">
            © 2026 Axiom
          </span>
        </div>
      </footer>
    </>
  );
}
