"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Zap,
  RotateCcw,
  ChevronDown,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";
import RFIDOverlay from "@/components/RFIDOverlay";
import WardrobeGrid from "@/components/WardrobeGrid";
import ModelPreviewPanel from "@/components/ModelPreviewPanel";
import type { Outfit, RecommendationResult } from "@/lib/engine";

const FORMALITY_OPTIONS = ["casual", "smart-casual", "formal"] as const;
const HISTORY_KEY = "axiom-wear-history";
const SCAN_DURATION = 1000; // 1s laser scan animation

export interface HistoryEntry {
  ids: string[];
  date: string;
  outfit?: Outfit;
  formality?: string;
  temperature?: number;
}

export function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const entries: HistoryEntry[] = JSON.parse(raw);
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return entries
      .filter((e) => new Date(e.date).getTime() > threeDaysAgo)
      .flatMap((e) => e.ids);
  } catch {
    return [];
  }
}

export function saveToHistory(outfit: Outfit, formality: string, temperature: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const entries: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    entries.unshift({
      ids: [outfit.top.id, outfit.bottom.id, outfit.shoes.id, outfit.accessory.id],
      date: new Date().toISOString(),
      outfit,
      formality,
      temperature,
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 30)));
  } catch {
    // silent
  }
}

export default function CommandCenter() {
  const [formality, setFormality] = useState<string>("smart-casual");
  const [temperature, setTemperature] = useState<number>(18);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [outfitKey, setOutfitKey] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [loggedToday, setLoggedToday] = useState(false);
  const [recentCount, setRecentCount] = useState(0);

  const updateHistoryCount = useCallback(() => {
    setRecentCount(getHistory().length);
  }, []);

  useEffect(() => { updateHistoryCount(); }, [updateHistoryCount]);

  const generate = useCallback(async () => {
    setError(null);
    setIsScanning(true);
    setLoggedToday(false);
    const history = getHistory();

    const t0 = performance.now();
    try {
      const fetchPromise = fetch(
        `/api/recommend?temperature=${temperature}&formality=${formality}&history=${history.join(",")}`
      );
      const timerPromise = new Promise((r) => setTimeout(r, SCAN_DURATION));

      const [res] = await Promise.all([fetchPromise, timerPromise]);
      const t1 = performance.now();
      setIsScanning(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Chamber synthesis failed. Please reset history or adjust temperature.");
        return;
      }

      const data: RecommendationResult = await res.json();
      setOutfit(data.outfit);
      setOutfitKey((k) => k + 1);
      setHasGenerated(true);
      setLatency(data.executionTimeMs || Number((t1 - t0 - SCAN_DURATION).toFixed(1)));
    } catch (err: unknown) {
      setIsScanning(false);
      const msg = err instanceof Error ? err.message : "Chamber synthesis failed. Network or server error.";
      setError(msg);
    }
  }, [formality, temperature]);

  const handleLogWear = useCallback(() => {
    if (!outfit) return;
    saveToHistory(outfit, formality, temperature);
    setLoggedToday(true);
    updateHistoryCount();
  }, [outfit, formality, temperature, updateHistoryCount]);

  const clearHistory = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(HISTORY_KEY);
    }
    setOutfit(null);
    setHasGenerated(false);
    setError(null);
    setLoggedToday(false);
    updateHistoryCount();
  }, [updateHistoryCount]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [dropdownOpen]);

  return (
    <section id="command-center-section" className="relative py-16 sm:py-24">
      {/* 1s Vertical Laser Scan Overlay */}
      <RFIDOverlay isScanning={isScanning} />

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-3 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              CHAMBER COMMAND CONSOLE
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight"
          >
            Outfit Synthesis Engine
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
            Direct interface to the 13.56 MHz RFID sensor array. Calculates weather density,
            enforces the 72-hour non-repeat buffer, and dispenses a harmonized 4-piece look in under 50 milliseconds.
          </p>
        </motion.div>

        {/* Machined Glass Console */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-8 h-[1px] bg-amber z-20" />
          <div className="absolute -top-px -left-px w-[1px] h-8 bg-amber z-20" />
          <div className="absolute -bottom-px -right-px w-8 h-[1px] bg-amber z-20" />
          <div className="absolute -bottom-px -right-px w-[1px] h-8 bg-amber z-20" />

          <div className="relative p-6 sm:p-10 bg-[#121212]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Console Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-amber rounded-none animate-pulse" />
                <span className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-text-primary">
                  AXIOM ENGINE · STATUS: ONLINE
                </span>
              </div>

              {/* Live Telemetry Chips */}
              <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-[0.12em] text-text-muted">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-low border border-white/5">
                  <Thermometer size={12} className="text-amber" />
                  <span className="text-text-primary font-semibold">{temperature}°C</span>
                  <span className="text-text-muted/60">AMBIENT</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-low border border-white/5">
                  <Radio size={12} className="text-amber" />
                  <span>20 RFID TAGS</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-low border border-white/5">
                  <ShieldCheck size={12} className="text-amber" />
                  <span>NON-REPEAT: 3D ({recentCount} LOCKED)</span>
                </div>
              </div>
            </div>

            {/* Interactive Controls Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-8">
              {/* Formality Selector */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <label className="font-mono text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                  PROTOCOL / FORMALITY
                </label>
                <div className="relative">
                  <button
                    id="formality-selector"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface-high text-xs font-mono tracking-[0.1em] uppercase text-text-primary border border-white/10 hover:border-amber/40 transition-colors"
                  >
                    <span>[{formality}]</span>
                    <ChevronDown
                      size={14}
                      className={`text-amber transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 w-full mt-1 z-50 bg-[#161616] border border-amber/30 shadow-2xl overflow-hidden"
                      >
                        {FORMALITY_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setFormality(opt);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 font-mono text-xs tracking-[0.12em] uppercase transition-colors ${
                              formality === opt
                                ? "bg-amber text-background font-semibold"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface-highest"
                            }`}
                          >
                            [{opt}]
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Ambient Chamber Temperature Adjustment */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-text-muted uppercase">
                  <span>CLIMATE THERMAL REG</span>
                  <span className="text-amber">{temperature}°C</span>
                </div>
                <div className="flex items-center gap-3 h-[46px] px-4 bg-surface-high border border-white/10">
                  <Thermometer size={14} className="text-amber shrink-0" />
                  <input
                    type="range"
                    min={4}
                    max={34}
                    step={1}
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full accent-amber cursor-pointer"
                  />
                  <span className="font-mono text-xs text-text-primary shrink-0 w-8 text-right">
                    {temperature}°C
                  </span>
                </div>
              </div>

              {/* Action Buttons: Generate & Reset */}
              <div className="md:col-span-4 flex gap-3">
                <button
                  id="generate-btn"
                  onClick={generate}
                  disabled={isScanning}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-amber text-background font-mono text-xs font-bold tracking-[0.16em] uppercase transition-all duration-200 hover:bg-amber-dim disabled:opacity-50 shadow-lg shadow-amber/10"
                >
                  {isScanning ? (
                    <ScanLine size={15} className="animate-spin" />
                  ) : (
                    <Zap size={15} />
                  )}
                  {isScanning ? "SCANNING..." : "GENERATE"}
                </button>

                {hasGenerated && (
                  <button
                    id="clear-btn"
                    onClick={clearHistory}
                    title="Clear 3-day history log"
                    className="flex items-center justify-center px-4 py-3.5 border border-white/10 text-text-muted hover:text-amber hover:border-amber/40 transition-colors"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 mb-6 bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs">
                {error}
              </div>
            )}

            {/* Generated Outfit Output Section */}
            {outfit ? (
              <div className="flex flex-col gap-6 pt-4">
                {/* Result header & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-low border border-white/5 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-text-primary font-semibold">
                      OUTFIT MATRIX RESOLVED
                    </span>
                    {latency !== null && (
                      <span className="text-amber">
                        (LATENCY: {latency}ms)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogWear}
                      disabled={loggedToday}
                      className={`flex items-center gap-2 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.1em] transition-all ${
                        loggedToday
                          ? "bg-green-950/60 border border-green-500 text-green-400"
                          : "bg-surface-mid border border-amber/40 text-amber hover:bg-amber hover:text-black"
                      }`}
                    >
                      {loggedToday ? (
                        <>
                          <CheckCircle2 size={13} />
                          LOGGED TO ARCHIVE
                        </>
                      ) : (
                        <>
                          <Clock size={13} />
                          LOG AS WORN TODAY
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Two-column: AI MODEL PREVIEW (left) + RECOMMENDED LOOK (right) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  {/* Left — AI MODEL PREVIEW */}
                  <div className="min-h-[420px]">
                    <ModelPreviewPanel outfit={outfit} outfitKey={outfitKey} />
                  </div>

                  {/* Right — RECOMMENDED LOOK */}
                  <div className="flex flex-col gap-3">
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-amber inline-block" />
                      RECOMMENDED LOOK
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Top */}
                      <div className="p-4 bg-surface-mid border border-white/8 flex flex-col gap-2 hover:border-amber/30 transition-colors">
                        <div className="font-mono text-[9px] text-amber uppercase tracking-[0.15em]">TOP</div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 border border-white/10" style={{ backgroundColor: outfit.top.color }} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text-primary truncate">{outfit.top.name}</div>
                            <div className="font-mono text-[9px] text-text-muted truncate">{outfit.top.formality}</div>
                          </div>
                        </div>
                      </div>
                      {/* Bottom */}
                      <div className="p-4 bg-surface-mid border border-white/8 flex flex-col gap-2 hover:border-amber/30 transition-colors">
                        <div className="font-mono text-[9px] text-amber uppercase tracking-[0.15em]">BOTTOM</div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 border border-white/10" style={{ backgroundColor: outfit.bottom.color }} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text-primary truncate">{outfit.bottom.name}</div>
                            <div className="font-mono text-[9px] text-text-muted truncate">{outfit.bottom.formality}</div>
                          </div>
                        </div>
                      </div>
                      {/* Footwear */}
                      <div className="p-4 bg-surface-mid border border-white/8 flex flex-col gap-2 hover:border-amber/30 transition-colors">
                        <div className="font-mono text-[9px] text-amber uppercase tracking-[0.15em]">FOOTWEAR</div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 border border-white/10" style={{ backgroundColor: outfit.shoes.color }} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text-primary truncate">{outfit.shoes.name}</div>
                            <div className="font-mono text-[9px] text-text-muted truncate">{outfit.shoes.formality}</div>
                          </div>
                        </div>
                      </div>
                      {/* Accessory */}
                      <div className="p-4 bg-surface-mid border border-white/8 flex flex-col gap-2 hover:border-amber/30 transition-colors">
                        <div className="font-mono text-[9px] text-amber uppercase tracking-[0.15em]">ACCESSORY</div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 border border-white/10" style={{ backgroundColor: outfit.accessory.color }} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text-primary truncate">{outfit.accessory.name}</div>
                            <div className="font-mono text-[9px] text-text-muted truncate">{outfit.accessory.formality}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Full detail grid below */}
                    <WardrobeGrid outfit={outfit} outfitKey={outfitKey} />
                  </div>
                </div>
              </div>
            ) : (
              !error &&
              !hasGenerated && (
                <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 bg-surface-low/30">
                  <div className="p-4 bg-surface-mid border border-white/10 mb-3">
                    <ScanLine size={24} className="text-amber/60" />
                  </div>
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-primary mb-1">
                    CHAMBER STANDBY · READY FOR SYNTHESIS
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted text-center max-w-sm">
                    Press GENERATE to initiate the 1-second 13.56 MHz RFID laser scan across all 20 garments.
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
