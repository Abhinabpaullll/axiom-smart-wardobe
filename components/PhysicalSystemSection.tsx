"use client";

import { Radio, Sliders, Box } from "lucide-react";

export default function PhysicalSystemSection() {
  return (
    <section id="about" className="relative pt-0 pb-24 sm:pb-32 bg-[#080808]">
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
              SECTION 01 / THE PHYSICAL SYSTEM
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.04]"
                style={{ letterSpacing: "-0.035em" }}
              >
                THE WARDROBE BECOMES
                <br />
                <span className="text-amber">THE INTERFACE.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 font-mono text-[10px] tracking-[0.16em] uppercase text-text-muted">
              CHAMBER APERTURE: ACTIVE · 7075-T6 CHASSIS · HERMETIC ISOLATION
            </div>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Technical Narrative & Engineering Details (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl font-sans">
              Traditional closets are passive storage furniture designed for analog garments. Axiom is an
              industrial-grade sartorial chamber machined from aerospace 7075 titanium alloy. It continuously monitors
              fabric density, ambient climate thresholds, and laundering cycles—transforming physical clothing into a
              computable matrix.
            </p>

            {/* 3 Industrial Engineering Subsystems (Data Truth: No Fabricated Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Subsystem 01 */}
              <div className="p-5 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[8.5px] uppercase text-text-muted mb-4">
                  <span className="text-amber">SYS_01</span>
                  <Radio size={12} className="text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7] tracking-tight mb-2">
                    RFID Transponder Array
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                    Multi-antenna 13.56 MHz high-frequency field instantaneously detects transponders across all 4 chamber bays without line-of-sight requirements.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[8px] uppercase tracking-[0.15em] text-text-muted">
                  PASSIVE NFC TRANSPONDERS
                </div>
              </div>

              {/* Subsystem 02 */}
              <div className="p-5 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[8.5px] uppercase text-text-muted mb-4">
                  <span className="text-amber">SYS_02</span>
                  <Sliders size={12} className="text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7] tracking-tight mb-2">
                    Dual Synchronous Doors
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                    Dual motorized sapphire-coated glass panels glide horizontally on magnetic levitation tracks, creating a dust-free pneumatic enclosure.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[8px] uppercase tracking-[0.15em] text-text-muted">
                  0.4S DISPENSE SEQUENCE
                </div>
              </div>

              {/* Subsystem 03 */}
              <div className="p-5 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[8.5px] uppercase text-text-muted mb-4">
                  <span className="text-amber">SYS_03</span>
                  <Box size={12} className="text-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7] tracking-tight mb-2">
                    Climate Sanitization
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                    Cedar-lined inner chambers integrated with UV-C decontaminating diodes and ultrasonic steam refresh garments after every wear cycle.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[8px] uppercase tracking-[0.15em] text-text-muted">
                  UV-C DEODORIZING ARRAY
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Wireframe (Col 8-12) */}
          <div className="lg:col-span-5 relative p-6 sm:p-8 bg-[#121212]/90 border border-amber/30 backdrop-blur-xl shadow-2xl">
            {/* Corner Machined Accents */}
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-amber" />
            <div className="absolute top-0 left-0 w-[1px] h-4 bg-amber" />
            <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-amber" />
            <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-amber" />

            <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/10 font-mono text-[8.5px] tracking-[0.2em] uppercase text-text-muted">
              <span className="text-amber font-semibold">SCHEMATIC: AXM-01</span>
              <span>SCALE: 1:1 INDUSTRIAL</span>
            </div>

            {/* Blueprint Grid Diagram */}
            <div className="space-y-4 font-mono text-[10px] text-text-secondary">
              <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">STRUCTURAL FRAME:</span>
                <span className="text-[#F5F5F7]">AEROSPACE 7075-T6 TITANIUM</span>
              </div>
              <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">SURFACE TREATMENT:</span>
                <span className="text-[#F5F5F7]">BEAD-BLASTED MATTE ANODIZE</span>
              </div>
              <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">OPTICAL PANEL:</span>
                <span className="text-[#F5F5F7]">SAPPHIRE CRYSTAL AR COATING</span>
              </div>
              <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">CAPACITY ARCHITECTURE:</span>
                <span className="text-amber font-semibold">4 ISOLATED SARTORIAL BAYS</span>
              </div>
              <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between">
                <span className="text-text-muted">COMMUNICATION:</span>
                <span className="text-[#F5F5F7]">13.56 MHz RFID / REST API</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[8px] tracking-[0.16em] uppercase text-text-muted">
              <span>PROJECT REF: 11456649540610009134</span>
              <span className="text-amber">DESIGN REGISTERED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
