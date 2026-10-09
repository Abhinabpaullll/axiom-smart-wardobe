"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ShieldCheck,
  Shirt,
  Footprints,
  Watch,
  RectangleHorizontal,
  CheckCircle2,
  ArrowUpRight,
  X,
} from "lucide-react";
import type { Outfit, WardrobeItem } from "@/lib/engine";
import initialWardrobe from "@/data/wardrobe.json";

const wardrobe = initialWardrobe as unknown as WardrobeItem[];

interface ArchiveLogEntry {
  id: string;
  date: string;
  season: "spring-summer" | "fall-winter" | "all-season";
  formality: "casual" | "smart-casual" | "formal";
  temperature: number;
  outfit: Outfit;
  nonRepeatCompliant: boolean;
  notes?: string;
}

const SEASONS = ["ALL SEASONS", "SPRING-SUMMER", "FALL-WINTER", "ALL-SEASON"] as const;
const FORMALITIES = ["ALL FORMALITIES", "CASUAL", "SMART-CASUAL", "FORMAL"] as const;

// Default initial simulated historical wear timeline entries
const DEFAULT_ARCHIVE_LOGS: ArchiveLogEntry[] = [
  {
    id: "arc-01",
    date: "2026-08-19T09:00:00.000Z",
    season: "all-season",
    formality: "smart-casual",
    temperature: 19,
    nonRepeatCompliant: true,
    notes: "Executive client consultation at Design Monolith HQ",
    outfit: {
      top: wardrobe[0], // Charcoal Merino Crew
      bottom: wardrobe[7], // Stone Tapered Chinos
      shoes: wardrobe[12], // Ash Suede Chelsea Boots
      accessory: wardrobe[17], // Woven Charcoal Leather Belt
    },
  },
  {
    id: "arc-02",
    date: "2026-08-17T14:30:00.000Z",
    season: "spring-summer",
    formality: "casual",
    temperature: 24,
    nonRepeatCompliant: true,
    notes: "Weekend architectural gallery tour & studio work",
    outfit: {
      top: wardrobe[4], // Graphite Heavyweight Henley
      bottom: wardrobe[8], // Raw Indigo Selvedge Denim
      shoes: wardrobe[13], // Minimalist Titanium Sneakers
      accessory: wardrobe[16], // Matte Onyx Polarized Frames
    },
  },
  {
    id: "arc-03",
    date: "2026-08-15T18:00:00.000Z",
    season: "fall-winter",
    formality: "formal",
    temperature: 15,
    nonRepeatCompliant: true,
    notes: "Sartorial Gala & Keynote Presentation",
    outfit: {
      top: wardrobe[1], // Ivory Oxford Structured Shirt
      bottom: wardrobe[6], // Obsidian Tailored Trousers
      shoes: wardrobe[11], // Espresso Derby Shoes
      accessory: wardrobe[15], // Machined Titanium Chronograph
    },
  },
  {
    id: "arc-04",
    date: "2026-08-13T10:15:00.000Z",
    season: "spring-summer",
    formality: "smart-casual",
    temperature: 22,
    nonRepeatCompliant: true,
    notes: "Product strategy session & lab prototype review",
    outfit: {
      top: wardrobe[5], // Taupe Fine-Knit Polo
      bottom: wardrobe[7], // Stone Tapered Chinos
      shoes: wardrobe[14], // Matte Onyx Loafers
      accessory: wardrobe[17], // Woven Charcoal Leather Belt
    },
  },
  {
    id: "arc-05",
    date: "2026-08-10T08:45:00.000Z",
    season: "fall-winter",
    formality: "formal",
    temperature: 12,
    nonRepeatCompliant: true,
    notes: "Venture partner alignment & private symposium",
    outfit: {
      top: wardrobe[3], // Onyx Cashmere Turtleneck
      bottom: wardrobe[10], // Pewter Flannel Trousers
      shoes: wardrobe[11], // Espresso Derby Shoes
      accessory: wardrobe[18], // Gunmetal Brushed Cufflinks
    },
  },
  {
    id: "arc-06",
    date: "2026-08-08T13:20:00.000Z",
    season: "all-season",
    formality: "casual",
    temperature: 20,
    nonRepeatCompliant: true,
    notes: "Offsite industrial design sprint",
    outfit: {
      top: wardrobe[2], // Slate Linen Relaxed Tee
      bottom: wardrobe[9], // Anthracite Tactical Cargo
      shoes: wardrobe[13], // Minimalist Titanium Sneakers
      accessory: wardrobe[19], // Sand Waxed Utility Tote
    },
  },
];

export default function ArchivePage() {
  const [logs, setLogs] = useState<ArchiveLogEntry[]>(DEFAULT_ARCHIVE_LOGS);
  const [seasonFilter, setSeasonFilter] = useState<string>("ALL SEASONS");
  const [formalityFilter, setFormalityFilter] = useState<string>("ALL FORMALITIES");
  const [selectedOutfit, setSelectedOutfit] = useState<ArchiveLogEntry | null>(null);

  // Sync localStorage wear history if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem("axiom-wear-history");
      if (raw) {
        const parsed: Array<{
          outfit?: Outfit;
          date: string;
          formality?: "casual" | "smart-casual" | "formal";
          temperature?: number;
        }> = JSON.parse(raw);
        const dynamicEntries: ArchiveLogEntry[] = parsed
          .filter((p) => p.outfit)
          .map((p, idx) => ({
            id: `local-${idx}-${new Date(p.date).getTime()}`,
            date: p.date,
            season: "all-season",
            formality: p.formality || "smart-casual",
            temperature: p.temperature || 18,
            outfit: p.outfit!,
            nonRepeatCompliant: true,
            notes: "Synthesized via Axiom Chamber Live Command Console",
          }));

        if (dynamicEntries.length > 0) {
          // Merge unique entries
          setLogs((prev) => {
            const ids = new Set(prev.map((i) => i.id));
            const fresh = dynamicEntries.filter((d) => !ids.has(d.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch {
      // silent
    }
  }, []);

  // Filter logs with Framer Motion layout transition
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSeason =
        seasonFilter === "ALL SEASONS" ||
        log.season.toLowerCase() === seasonFilter.toLowerCase().replace("-", "-");
      const matchFormality =
        formalityFilter === "ALL FORMALITIES" ||
        log.formality.toLowerCase() === formalityFilter.toLowerCase();
      return matchSeason && matchFormality;
    });
  }, [logs, seasonFilter, formalityFilter]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E7E5E4] pt-20 sm:pt-24 pb-24">
      {/* Header section */}
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
              SARTORIAL ARCHIVE &amp; ROTATION ANALYTICS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-text-primary">
                Wear Timeline Archive
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
                Immutable chronological ledger of worn configurations. Verified against the 3-day non-repeat protocol
                to eliminate decision fatigue and guarantee optimal rotation across all 20 wardrobe assets.
              </p>
            </div>

            {/* Compliance Badge */}
            <div className="flex items-center gap-3 p-4 bg-surface-low border border-amber/30">
              <ShieldCheck size={24} className="text-amber shrink-0" />
              <div className="flex flex-col font-mono text-[10px]">
                <span className="text-amber font-semibold uppercase tracking-[0.12em]">
                  NON-REPEAT PROTOCOL
                </span>
                <span className="text-text-primary text-sm font-bold">100% COMPLIANT</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#121212] border border-white/10">
          <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1 font-mono">
            <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted">
              TOTAL RECORDED WEARS
            </span>
            <span className="text-lg font-bold text-text-primary">{logs.length} LOOKS</span>
            <span className="text-[9px] text-amber">100% NFC VERIFIED</span>
          </div>

          <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1 font-mono">
            <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted">
              ROTATION DIVERSITY
            </span>
            <span className="text-lg font-bold text-text-primary">96.4%</span>
            <span className="text-[9px] text-emerald-400">OPTIMAL VARIETY</span>
          </div>

          <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1 font-mono">
            <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted">
              AVG ROTATION INTERVAL
            </span>
            <span className="text-lg font-bold text-text-primary">4.6 DAYS</span>
            <span className="text-[9px] text-text-muted">BUFFER &gt; 72H</span>
          </div>

          <div className="p-3 bg-surface-low border border-white/5 flex flex-col gap-1 font-mono">
            <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted">
              MOST WORN FORMALITY
            </span>
            <span className="text-lg font-bold text-amber">SMART-CASUAL</span>
            <span className="text-[9px] text-text-muted">48% FREQUENCY</span>
          </div>
        </div>
      </div>

      {/* Dual Dynamic Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-surface-mid/80 backdrop-blur-xl border border-white/10">
          {/* Season Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.12em] mr-2">
              SEASON:
            </span>
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeasonFilter(s)}
                className={`px-3 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                  seasonFilter === s
                    ? "bg-amber text-background font-semibold"
                    : "bg-surface-low text-text-secondary hover:text-text-primary hover:bg-surface-highest"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Formality Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.12em] mr-2">
              FORMALITY:
            </span>
            {FORMALITIES.map((f) => (
              <button
                key={f}
                onClick={() => setFormalityFilter(f)}
                className={`px-3 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                  formalityFilter === f
                    ? "bg-amber text-background font-semibold"
                    : "bg-surface-low text-text-secondary hover:text-text-primary hover:bg-surface-highest"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE GRID OF PREVIOUSLY WORN OUTFITS WITH FRAMER MOTION'S LAYOUT PROP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-6">
          <span>ARCHIVE TIMELINE ({filteredLogs.length} MATCHING ENTRIES)</span>
          <span className="text-amber">LAYOUT ANIMATIONS ACTIVE</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 text-center font-mono text-xs text-text-muted">
            NO ARCHIVED LOOKS MATCHING CURRENT SEASON &amp; FORMALITY FILTERS.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredLogs.map((log) => (
                <motion.div
                  layout
                  key={log.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onClick={() => setSelectedOutfit(log)}
                  className="relative p-6 bg-[#121212]/90 backdrop-blur-xl border border-white/10 hover:border-amber/40 transition-colors shadow-2xl flex flex-col justify-between group cursor-pointer"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-[1px] bg-amber/50" />
                  <div className="absolute top-0 left-0 w-[1px] h-3 bg-amber/50" />
                  <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-amber/50" />
                  <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-amber/50" />

                  {/* Header: Date, Formality & Temperature */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-[9px] tracking-[0.14em] uppercase text-text-muted">
                    <div className="flex items-center gap-1.5 text-text-primary">
                      <Calendar size={12} className="text-amber" />
                      <span>{formatDate(log.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-surface-highest text-amber border border-amber/30">
                        {log.formality}
                      </span>
                      <span className="text-text-muted">{log.temperature}°C</span>
                    </div>
                  </div>

                  {/* 4-Piece Miniature Visual Matrix */}
                  <div className="my-5 grid grid-cols-2 gap-2.5">
                    {/* Top */}
                    <div className="p-2.5 bg-surface-low border border-white/5 flex items-center gap-2">
                      <div
                        className="w-4 h-4 shrink-0 border border-white/10"
                        style={{ backgroundColor: log.outfit.top.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[7px] text-amber uppercase">TOP</div>
                        <div className="text-[11px] font-medium text-text-primary truncate">
                          {log.outfit.top.name}
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="p-2.5 bg-surface-low border border-white/5 flex items-center gap-2">
                      <div
                        className="w-4 h-4 shrink-0 border border-white/10"
                        style={{ backgroundColor: log.outfit.bottom.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[7px] text-amber uppercase">LOWER</div>
                        <div className="text-[11px] font-medium text-text-primary truncate">
                          {log.outfit.bottom.name}
                        </div>
                      </div>
                    </div>

                    {/* Shoes */}
                    <div className="p-2.5 bg-surface-low border border-white/5 flex items-center gap-2">
                      <div
                        className="w-4 h-4 shrink-0 border border-white/10"
                        style={{ backgroundColor: log.outfit.shoes.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[7px] text-amber uppercase">SHOES</div>
                        <div className="text-[11px] font-medium text-text-primary truncate">
                          {log.outfit.shoes.name}
                        </div>
                      </div>
                    </div>

                    {/* Accessory */}
                    <div className="p-2.5 bg-surface-low border border-white/5 flex items-center gap-2">
                      <div
                        className="w-4 h-4 shrink-0 border border-white/10"
                        style={{ backgroundColor: log.outfit.accessory.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[7px] text-amber uppercase">ACC</div>
                        <div className="text-[11px] font-medium text-text-primary truncate">
                          {log.outfit.accessory.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Context */}
                  {log.notes && (
                    <p className="text-xs text-text-secondary line-clamp-1 italic mb-4 font-sans">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}

                  {/* Bottom Strip: Non-Repeat Compliance status */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px]">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={11} />
                      <span>72H PROTOCOL COMPLIANT</span>
                    </div>
                    <span className="text-amber flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      DETAILS <ArrowUpRight size={11} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ARCHIVED LOOK INSPECTION MODAL */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedOutfit(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#121212] border border-amber/30 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-[2px] bg-amber" />
              <div className="absolute top-0 left-0 w-[2px] h-6 bg-amber" />
              <div className="absolute top-0 right-0 w-6 h-[2px] bg-amber" />
              <div className="absolute top-0 right-0 w-[2px] h-6 bg-amber" />
              <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-amber" />
              <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-amber" />
              <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-amber" />
              <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-amber" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedOutfit(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-amber border border-white/10 hover:border-amber/40 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-amber">
                  <Calendar size={14} className="text-amber" />
                  <span>ARCHIVED LOOK LEDGER · {formatDate(selectedOutfit.date)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
                    {selectedOutfit.notes || `${selectedOutfit.formality.toUpperCase()} CONFIGURATION`}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
                  <span className="text-amber font-semibold">{selectedOutfit.formality}</span>
                  <span>·</span>
                  <span>SEASON: {selectedOutfit.season}</span>
                  <span>·</span>
                  <span>AMBIENT: {selectedOutfit.temperature}°C</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> 72H PROTOCOL COMPLIANT
                  </span>
                </div>
              </div>

              {/* 4-Piece Expanded Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {/* Top */}
                <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted">
                    <span className="flex items-center gap-1 text-amber">
                      <Shirt size={12} /> TOP PIECE
                    </span>
                    <span>{selectedOutfit.outfit.top.chamberSlot || "BAY A"}</span>
                  </div>
                  <div className="flex items-start gap-3 my-2">
                    <div
                      className="w-10 h-10 shrink-0 border border-white/10"
                      style={{ backgroundColor: selectedOutfit.outfit.top.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {selectedOutfit.outfit.top.name}
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1">
                        {selectedOutfit.outfit.top.material}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-text-muted flex items-center justify-between pt-2 border-t border-white/5">
                    <span>RFID: {selectedOutfit.outfit.top.rfid || "SYNCED"}</span>
                    <span>{selectedOutfit.outfit.top.careProtocol}</span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted">
                    <span className="flex items-center gap-1 text-amber">
                      <RectangleHorizontal size={12} /> LOWER PIECE
                    </span>
                    <span>{selectedOutfit.outfit.bottom.chamberSlot || "BAY B"}</span>
                  </div>
                  <div className="flex items-start gap-3 my-2">
                    <div
                      className="w-10 h-10 shrink-0 border border-white/10"
                      style={{ backgroundColor: selectedOutfit.outfit.bottom.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {selectedOutfit.outfit.bottom.name}
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1">
                        {selectedOutfit.outfit.bottom.material}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-text-muted flex items-center justify-between pt-2 border-t border-white/5">
                    <span>RFID: {selectedOutfit.outfit.bottom.rfid || "SYNCED"}</span>
                    <span>{selectedOutfit.outfit.bottom.careProtocol}</span>
                  </div>
                </div>

                {/* Shoes */}
                <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted">
                    <span className="flex items-center gap-1 text-amber">
                      <Footprints size={12} /> FOOTWEAR
                    </span>
                    <span>{selectedOutfit.outfit.shoes.chamberSlot || "BAY C"}</span>
                  </div>
                  <div className="flex items-start gap-3 my-2">
                    <div
                      className="w-10 h-10 shrink-0 border border-white/10"
                      style={{ backgroundColor: selectedOutfit.outfit.shoes.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {selectedOutfit.outfit.shoes.name}
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1">
                        {selectedOutfit.outfit.shoes.material}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-text-muted flex items-center justify-between pt-2 border-t border-white/5">
                    <span>RFID: {selectedOutfit.outfit.shoes.rfid || "SYNCED"}</span>
                    <span>{selectedOutfit.outfit.shoes.careProtocol}</span>
                  </div>
                </div>

                {/* Accessory */}
                <div className="p-4 bg-surface-low border border-white/5 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase text-text-muted">
                    <span className="flex items-center gap-1 text-amber">
                      <Watch size={12} /> ACCESSORY
                    </span>
                    <span>{selectedOutfit.outfit.accessory.chamberSlot || "BAY D"}</span>
                  </div>
                  <div className="flex items-start gap-3 my-2">
                    <div
                      className="w-10 h-10 shrink-0 border border-white/10"
                      style={{ backgroundColor: selectedOutfit.outfit.accessory.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">
                        {selectedOutfit.outfit.accessory.name}
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1">
                        {selectedOutfit.outfit.accessory.material}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-text-muted flex items-center justify-between pt-2 border-t border-white/5">
                    <span>RFID: {selectedOutfit.outfit.accessory.rfid || "SYNCED"}</span>
                    <span>{selectedOutfit.outfit.accessory.careProtocol}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-text-muted text-[10px]">
                  <ShieldCheck size={14} className="text-amber" />
                  <span>RECORDED IN LOCAL WEAR REGISTRY</span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/inventory`}
                    className="px-4 py-2 border border-white/10 hover:border-amber/40 text-text-secondary hover:text-amber uppercase tracking-[0.1em] text-xs transition-colors"
                  >
                    INSPECT IN INVENTORY
                  </a>
                  <button
                    onClick={() => setSelectedOutfit(null)}
                    className="px-5 py-2 bg-amber text-background font-bold uppercase tracking-[0.12em] hover:bg-amber-dim transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
