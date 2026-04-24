"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Zap,
  RotateCcw,
  ChevronDown,
  ScanLine,
  Monitor,
} from "lucide-react";
import RFIDOverlay from "@/components/RFIDOverlay";
import WardrobeGrid from "@/components/WardrobeGrid";
import type { Outfit } from "@/lib/engine";

const FORMALITY_OPTIONS = ["casual", "smart-casual", "formal"] as const;
const HISTORY_KEY = "axiom-wear-history";
const SCAN_DURATION = 1200;

interface HistoryEntry {
  ids: string[];
  date: string;
}

function getHistory(): string[] {
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

function saveToHistory(outfit: Outfit) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const entries: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    entries.push({
      ids: [outfit.top.id, outfit.bottom.id, outfit.shoes.id, outfit.accessory.id],
      date: new Date().toISOString(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(-10)));
  } catch {
    // silent
  }
}

export default function CommandCenter() {
  const [formality, setFormality] = useState<string>("smart-casual");
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [outfitKey, setOutfitKey] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    setError(null);
    setIsScanning(true);
    const history = getHistory();
    const fetchPromise = fetch("/api/style", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formality, history }),
    });
    const timerPromise = new Promise((r) => setTimeout(r, SCAN_DURATION));
    const [res] = await Promise.all([fetchPromise, timerPromise]);
    setIsScanning(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Generation failed");
      return;
    }
    const data = await res.json();
    setOutfit(data.outfit);
    setOutfitKey((k) => k + 1);
    setHasGenerated(true);
    saveToHistory(data.outfit);
  }, [formality]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setOutfit(null);
    setHasGenerated(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [dropdownOpen]);

  return (
    <section id="command" className="relative py-24 sm:py-32">
      <RFIDOverlay isScanning={isScanning} />

      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              Interactive
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            The Command Center
          </h2>
          <p className="text-sm text-text-secondary max-w-lg" style={{ lineHeight: 1.7 }}>
            Experience the Axiom styling engine. Select a formality level,
            generate an outfit, and watch the RFID array resolve your look in real-time.
          </p>
        </motion.div>

        {/* Glass panel container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Outer frame accents */}
          <div className="absolute -top-px -left-px w-8 h-[1px] bg-amber" />
          <div className="absolute -top-px -left-px w-[1px] h-8 bg-amber" />
          <div className="absolute -bottom-px -right-px w-8 h-[1px] bg-amber" />
          <div className="absolute -bottom-px -right-px w-[1px] h-8 bg-amber" />

          <div
            className="relative p-6 sm:p-10 lg:p-12"
            style={{
              background: "rgba(25, 26, 26, 0.6)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
            }}
          >
            {/* Panel header bar */}
            <div
              className="flex items-center justify-between pb-6 mb-8"
              style={{ borderBottom: "1px solid rgba(72, 72, 72, 0.4)" }}
            >
              <div className="flex items-center gap-2.5">
                <Monitor size={14} strokeWidth={1.5} className="text-amber" />
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                  Axiom Dashboard · Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={12} strokeWidth={1.5} className="text-text-muted" />
                <span className="text-[10px] font-medium tabular-nums text-text-muted">
                  18°C
                </span>
                <span className="text-[9px] tracking-[0.1em] uppercase text-text-muted/40 ml-0.5">
                  MOCK
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:gap-8 mb-10">
              {/* Formality selector */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                  Formality
                </label>
                <div className="relative">
                  <button
                    id="formality-selector"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="w-full sm:w-56 flex items-center justify-between px-4 py-3 bg-surface-high text-sm text-text-primary transition-colors duration-200 hover:bg-surface-highest"
                    style={{ border: "1px solid var(--outline)" }}
                  >
                    <span className="tracking-[0.06em] uppercase text-xs">
                      {formality}
                    </span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`text-text-muted transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 w-full mt-1 z-40 bg-surface-highest"
                      style={{ border: "1px solid var(--outline)" }}
                    >
                      {FORMALITY_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setFormality(opt);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs tracking-[0.06em] uppercase transition-colors duration-150 ${
                            formality === opt
                              ? "text-amber bg-surface-bright"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-high"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  id="generate-btn"
                  onClick={generate}
                  disabled={isScanning}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 bg-amber text-background text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 hover:bg-amber-dim disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <ScanLine size={14} strokeWidth={1.5} className="animate-pulse" />
                  ) : (
                    <Zap size={14} strokeWidth={1.5} />
                  )}
                  {isScanning ? "Scanning" : "Generate"}
                </button>
                {hasGenerated && (
                  <button
                    id="clear-btn"
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-4 py-3 text-xs tracking-[0.08em] uppercase text-text-muted transition-colors duration-200 hover:text-amber"
                    style={{ border: "1px solid var(--outline)" }}
                  >
                    <RotateCcw size={12} strokeWidth={1.5} />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-5 py-3 bg-surface-high text-error text-xs tracking-wide mb-8"
                style={{ borderLeft: "2px solid var(--error)" }}
              >
                {error}
              </div>
            )}

            {/* Outfit Grid */}
            {outfit ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-amber" />
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                    Today&apos;s Outfit
                  </span>
                </div>
                <WardrobeGrid outfit={outfit} outfitKey={outfitKey} />
              </div>
            ) : (
              !error &&
              !hasGenerated && (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{ border: "1px solid var(--outline)" }}
                  >
                    <ScanLine size={22} strokeWidth={1} className="text-text-muted" />
                  </div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-text-muted text-center max-w-xs">
                    Select formality &amp; generate your outfit
                  </p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
