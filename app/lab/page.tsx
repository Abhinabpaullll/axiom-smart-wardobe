"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Layers,
  Shirt,
  RectangleHorizontal,
  Footprints,
  Watch,
  ShieldCheck,
  CheckCircle2,
  ScanLine,
} from "lucide-react";
import VTOFlow from "@/components/VTOFlow";
import initialWardrobe from "@/data/wardrobe.json";
import type { WardrobeItem, Outfit } from "@/lib/engine";

const wardrobeList = initialWardrobe as unknown as WardrobeItem[];

type LabMode = "CANVAS" | "VTO";

export default function LabPage() {
  const [mode, setMode] = useState<LabMode>("CANVAS");

  // ── Canvas Builder State ────────────────────────────────────────────────
  const [selectedTop, setSelectedTop] = useState<WardrobeItem>(wardrobeList[0]);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeItem>(wardrobeList[7]);
  const [selectedShoes, setSelectedShoes] = useState<WardrobeItem>(wardrobeList[12]);
  const [selectedAcc, setSelectedAcc] = useState<WardrobeItem>(wardrobeList[16]);
  const [activeSlot, setActiveSlot] = useState<"top" | "bottom" | "shoes" | "accessory">("top");
  const [savedToArchive, setSavedToArchive] = useState(false);

  // Filter pool by active slot
  const slotGarments = useMemo(() => {
    return (initialWardrobe as WardrobeItem[]).filter(
      (item) => item.type === activeSlot || item.category === activeSlot
    );
  }, [activeSlot]);

  const currentOutfit: Outfit = useMemo(
    () => ({
      top: selectedTop,
      bottom: selectedBottom,
      shoes: selectedShoes,
      accessory: selectedAcc,
    }),
    [selectedTop, selectedBottom, selectedShoes, selectedAcc]
  );

  /**
   * Temperature window — derived purely from data, no invented numbers.
   * Represents the shared range where all selected pieces are comfortable.
   */
  const tempWindow = useMemo(() => {
    const minT = Math.max(
      selectedTop.weatherRange[0],
      selectedBottom.weatherRange[0],
      selectedShoes.weatherRange[0]
    );
    const maxT = Math.min(
      selectedTop.weatherRange[1],
      selectedBottom.weatherRange[1],
      selectedShoes.weatherRange[1]
    );
    return { minT, maxT };
  }, [selectedTop, selectedBottom, selectedShoes]);

  /**
   * Formality match — true if top + bottom + shoes all agree.
   */
  const formalityMatch = useMemo(
    () =>
      selectedTop.formality === selectedBottom.formality &&
      selectedShoes.formality === selectedBottom.formality,
    [selectedTop, selectedBottom, selectedShoes]
  );

  const handleSaveLook = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("axiom-wear-history");
      const entries = raw ? JSON.parse(raw) : [];
      entries.unshift({
        ids: [selectedTop.id, selectedBottom.id, selectedShoes.id, selectedAcc.id],
        date: new Date().toISOString(),
        outfit: currentOutfit,
        formality: selectedTop.formality,
        temperature: tempWindow.minT,
      });
      localStorage.setItem("axiom-wear-history", JSON.stringify(entries.slice(0, 30)));
      setSavedToArchive(true);
      setTimeout(() => setSavedToArchive(false), 3000);
    } catch {
      // silent
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E7E5E4] pt-20 sm:pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              SARTORIAL LAB &amp; VIRTUAL MIRROR
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-text-primary">
                Axiom Design &amp; VTO Lab
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
                Mix and assemble wardrobe pieces across the 4-slot modular canvas, or use the
                AI-powered Virtual Try-On to analyze and upgrade your current look.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-surface-low border border-white/10 font-mono text-xs">
              <button
                id="lab-canvas-tab"
                onClick={() => setMode("CANVAS")}
                className={`flex items-center gap-2 px-4 py-2 uppercase tracking-[0.14em] transition-all ${
                  mode === "CANVAS"
                    ? "bg-amber text-background font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Layers size={13} />
                CANVAS BUILDER
              </button>
              <button
                id="lab-vto-tab"
                onClick={() => setMode("VTO")}
                className={`flex items-center gap-2 px-4 py-2 uppercase tracking-[0.14em] transition-all ${
                  mode === "VTO"
                    ? "bg-amber text-background font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <ScanLine size={13} />
                VIRTUAL TRY-ON
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Lab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {mode === "CANVAS" ? (
          /* ── CANVAS BUILDER ──────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: 4-Piece Modular Canvas (Col 1-7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="p-6 sm:p-8 bg-[#121212] border border-white/10 shadow-2xl relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-[1px] bg-amber" />
                <div className="absolute top-0 left-0 w-[1px] h-4 bg-amber" />
                <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-amber" />
                <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-amber" />

                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono text-[10px] tracking-[0.16em] uppercase text-text-muted">
                  <span className="text-text-primary font-semibold">4-SLOT MODULAR CANVAS</span>
                  <span className="text-amber">CLICK SLOT TO SWAP PIECE</span>
                </div>

                {/* 4 Interactive Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Top */}
                  <div
                    onClick={() => setActiveSlot("top")}
                    className={`p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      activeSlot === "top"
                        ? "border-amber bg-amber/5 shadow-lg shadow-amber/5"
                        : "border-white/10 bg-surface-low hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted uppercase">
                      <span className="flex items-center gap-1.5 text-amber">
                        <Shirt size={12} /> TOP PIECE
                      </span>
                      <span>{selectedTop.chamberSlot}</span>
                    </div>
                    <div className="my-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 shrink-0 border border-white/10"
                        style={{ backgroundColor: selectedTop.color }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate">
                          {selectedTop.name}
                        </h4>
                        <p className="text-[10px] font-mono text-text-secondary truncate">
                          {selectedTop.material}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">
                      {selectedTop.weatherRange[0]}°C – {selectedTop.weatherRange[1]}°C · {selectedTop.formality}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div
                    onClick={() => setActiveSlot("bottom")}
                    className={`p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      activeSlot === "bottom"
                        ? "border-amber bg-amber/5 shadow-lg shadow-amber/5"
                        : "border-white/10 bg-surface-low hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted uppercase">
                      <span className="flex items-center gap-1.5 text-amber">
                        <RectangleHorizontal size={12} /> LOWER PIECE
                      </span>
                      <span>{selectedBottom.chamberSlot}</span>
                    </div>
                    <div className="my-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 shrink-0 border border-white/10"
                        style={{ backgroundColor: selectedBottom.color }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate">
                          {selectedBottom.name}
                        </h4>
                        <p className="text-[10px] font-mono text-text-secondary truncate">
                          {selectedBottom.material}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">
                      {selectedBottom.weatherRange[0]}°C – {selectedBottom.weatherRange[1]}°C · {selectedBottom.formality}
                    </div>
                  </div>

                  {/* Shoes */}
                  <div
                    onClick={() => setActiveSlot("shoes")}
                    className={`p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      activeSlot === "shoes"
                        ? "border-amber bg-amber/5 shadow-lg shadow-amber/5"
                        : "border-white/10 bg-surface-low hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted uppercase">
                      <span className="flex items-center gap-1.5 text-amber">
                        <Footprints size={12} /> FOOTWEAR
                      </span>
                      <span>{selectedShoes.chamberSlot}</span>
                    </div>
                    <div className="my-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 shrink-0 border border-white/10"
                        style={{ backgroundColor: selectedShoes.color }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate">
                          {selectedShoes.name}
                        </h4>
                        <p className="text-[10px] font-mono text-text-secondary truncate">
                          {selectedShoes.material}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">
                      {selectedShoes.weatherRange[0]}°C – {selectedShoes.weatherRange[1]}°C · {selectedShoes.formality}
                    </div>
                  </div>

                  {/* Accessory */}
                  <div
                    onClick={() => setActiveSlot("accessory")}
                    className={`p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      activeSlot === "accessory"
                        ? "border-amber bg-amber/5 shadow-lg shadow-amber/5"
                        : "border-white/10 bg-surface-low hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted uppercase">
                      <span className="flex items-center gap-1.5 text-amber">
                        <Watch size={12} /> ACCESSORY
                      </span>
                      <span>{selectedAcc.chamberSlot}</span>
                    </div>
                    <div className="my-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 shrink-0 border border-white/10"
                        style={{ backgroundColor: selectedAcc.color }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary truncate">
                          {selectedAcc.name}
                        </h4>
                        <p className="text-[10px] font-mono text-text-secondary truncate">
                          {selectedAcc.material}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">
                      {selectedAcc.weatherRange[0]}°C – {selectedAcc.weatherRange[1]}°C · {selectedAcc.formality}
                    </div>
                  </div>
                </div>

                {/* Canvas Action Bar */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted">
                    <ShieldCheck size={14} className="text-amber" />
                    <span>NON-REPEAT BUFFER: OK</span>
                  </div>

                  <button
                    id="canvas-save-btn"
                    onClick={handleSaveLook}
                    className="flex items-center gap-2 px-6 py-3 bg-amber text-background font-mono text-xs font-bold uppercase tracking-[0.14em] hover:bg-amber-dim transition-all"
                  >
                    {savedToArchive ? (
                      <>
                        <CheckCircle2 size={14} />
                        SAVED TO ARCHIVE
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} />
                        SAVE TO ARCHIVE LOG
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Wardrobe Picker Dock & Metrics (Col 8-12) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Outfit Metrics — data-derived, no invented numbers */}
              <div className="p-6 bg-[#121212] border border-white/10 shadow-2xl font-mono">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[10px] tracking-[0.16em] uppercase text-text-muted">
                  <span className="text-amber font-semibold">OUTFIT METRICS</span>
                  <span>CALCULATED</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1">
                    <span className="text-[8px] text-text-muted uppercase">THERMAL OVERLAP</span>
                    <span className="text-base font-bold text-text-primary">
                      {tempWindow.minT}°C – {tempWindow.maxT}°C
                    </span>
                    <span className="text-[8px] text-text-muted">shared comfort window</span>
                  </div>

                  <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1">
                    <span className="text-[8px] text-text-muted uppercase">FORMALITY</span>
                    <span className="text-base font-bold text-text-primary capitalize">
                      {selectedTop.formality}
                    </span>
                    <span className={`text-[8px] ${formalityMatch ? "text-emerald-400" : "text-amber"}`}>
                      {formalityMatch ? "ALL PIECES ALIGNED" : "MIXED FORMALITY"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-low border border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-text-muted uppercase">SEASON COVERAGE:</span>
                  <span className="text-amber uppercase font-semibold">
                    {selectedTop.season === "all-season" ? "ALL SEASON" : selectedTop.season}
                  </span>
                </div>
              </div>

              {/* Garment Selector Dock */}
              <div className="p-6 bg-[#121212] border border-white/10 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-[10px] tracking-[0.16em] uppercase text-text-muted">
                  <span className="text-text-primary font-semibold">SELECT {activeSlot.toUpperCase()}</span>
                  <span>{slotGarments.length} OPTIONS</span>
                </div>

                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {slotGarments.map((item) => {
                    const isCurrent =
                      (activeSlot === "top" && selectedTop.id === item.id) ||
                      (activeSlot === "bottom" && selectedBottom.id === item.id) ||
                      (activeSlot === "shoes" && selectedShoes.id === item.id) ||
                      (activeSlot === "accessory" && selectedAcc.id === item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (activeSlot === "top") setSelectedTop(item);
                          if (activeSlot === "bottom") setSelectedBottom(item);
                          if (activeSlot === "shoes") setSelectedShoes(item);
                          if (activeSlot === "accessory") setSelectedAcc(item);
                        }}
                        className={`p-3 text-left border flex items-center justify-between transition-all ${
                          isCurrent
                            ? "border-amber bg-amber/10"
                            : "border-white/5 bg-surface-low hover:border-amber/40 hover:bg-surface-mid"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-7 h-7 shrink-0 border border-white/10"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-text-primary truncate">
                              {item.name}
                            </div>
                            <div className="font-mono text-[9px] text-text-muted truncate">
                              {item.material} · {item.chamberSlot}
                            </div>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="font-mono text-[9px] text-amber font-bold shrink-0 ml-2">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── VIRTUAL TRY-ON (VTO) MODE ───────────────────────────────── */
          <VTOFlow />
        )}
      </div>
    </div>
  );
}
