"use client";

import Link from "next/link";
import { ArrowRight, Radio, Shirt, RectangleHorizontal, Footprints, Watch } from "lucide-react";
import wardrobeData from "@/data/wardrobe.json";

export default function DigitalInventorySection() {
  const tops = wardrobeData.filter((i) => i.type === "top");
  const bottoms = wardrobeData.filter((i) => i.type === "bottom");
  const shoes = wardrobeData.filter((i) => i.type === "shoes");
  const accessories = wardrobeData.filter((i) => i.type === "accessory");

  const BAYS = [
    { name: "BAY A", label: "TOPS", count: tops.length, icon: Shirt, items: tops.slice(0, 3) },
    { name: "BAY B", label: "BOTTOMS", count: bottoms.length, icon: RectangleHorizontal, items: bottoms.slice(0, 3) },
    { name: "BAY C", label: "FOOTWEAR", count: shoes.length, icon: Footprints, items: shoes.slice(0, 3) },
    { name: "BAY D", label: "ACCESSORIES", count: accessories.length, icon: Watch, items: accessories.slice(0, 3) },
  ];

  return (
    <section id="system" className="relative py-28 sm:py-36 bg-[#080808] border-t border-white/5">
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
              SECTION 02 / THE DIGITAL INVENTORY
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2
                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#F5F5F7] tracking-tight leading-[1.04]"
                style={{ letterSpacing: "-0.035em" }}
              >
                ANALOG TEXTILES.
                <br />
                <span className="text-amber">DIGITAL INDICES.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl mt-4 font-sans">
                Each physical garment is bonded with an encrypted transponder. As items are placed into the chamber,
                they are immediately indexed into four discrete sartorial bays—recording material composition, thermal range,
                and wear history.
              </p>
            </div>

            {/* CTA to /inventory */}
            <Link
              href="/inventory"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-black border border-amber/50 hover:border-amber text-[#F5F5F7] hover:text-amber font-mono text-xs tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber/10 shrink-0 self-start lg:self-end"
            >
              <span>VIEW INVENTORY</span>
              <ArrowRight size={13} className="text-amber group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Architectural Bay Columns Displaying Live Wardrobe Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BAYS.map((bay) => {
            const Icon = bay.icon;
            return (
              <div
                key={bay.name}
                className="p-6 bg-surface-low border border-white/10 hover:border-amber/40 transition-colors flex flex-col justify-between group"
              >
                {/* Bay Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-[9px] uppercase tracking-[0.16em]">
                  <span className="text-amber font-semibold flex items-center gap-1.5">
                    <Icon size={12} />
                    {bay.name}
                  </span>
                  <span className="text-text-muted">{bay.count} ASSETS</span>
                </div>

                {/* Subtitle */}
                <div className="my-4">
                  <h3 className="text-sm font-semibold tracking-tight text-[#F5F5F7] uppercase font-mono">
                    {bay.label}
                  </h3>
                  <span className="text-[10px] text-text-muted font-mono tracking-[0.1em] uppercase">
                    RFID SYNCHRONIZED
                  </span>
                </div>

                {/* Micro Item Preview Stack */}
                <div className="space-y-2 mb-6">
                  {bay.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-surface-mid/80 border border-white/5 flex items-center gap-2.5"
                    >
                      <div
                        className="w-3.5 h-3.5 shrink-0 border border-white/10"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-[#F5F5F7] truncate">
                          {item.name}
                        </div>
                        <div className="font-mono text-[8px] text-text-muted truncate">
                          {item.chamberSlot} · {item.rfid}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Bottom Strip */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-text-muted">
                  <span className="text-amber">INSPECTION READY</span>
                  <span>{bay.items[0]?.formality}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inventory Summary Diagnostic Line */}
        <div className="mt-8 p-4 bg-[#121212] border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
          <div className="flex items-center gap-3 text-text-primary">
            <Radio size={12} className="text-amber animate-pulse" />
            <span>20 PHYSICAL ASSETS CURRENTLY MAPPED TO DATABASE</span>
          </div>
          <div className="flex items-center gap-6">
            <span>6 TOPS</span>
            <span>5 BOTTOMS</span>
            <span>4 FOOTWEAR</span>
            <span>5 ACCESSORIES</span>
          </div>
        </div>
      </div>
    </section>
  );
}
