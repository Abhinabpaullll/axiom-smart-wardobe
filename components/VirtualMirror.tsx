"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Zap,
  Bookmark,
  Columns2,
  X,
  Check,
  ScanLine,
  Loader2,
} from "lucide-react";
import BiometricScanOverlay from "./BiometricScanOverlay";
import type { Outfit } from "@/lib/engine";

type Phase = "idle" | "uploaded" | "scanning" | "ready" | "generating" | "result";

const FORMALITY_OPTIONS = ["casual", "smart-casual", "formal"] as const;
const LOOKBOOK_KEY = "axiom-lookbook";
const SCAN_DURATION = 2000;

interface LookbookEntry {
  id: string;
  outfit: Outfit;
  savedAt: string;
}

export default function VirtualMirror() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [photo, setPhoto] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [formality, setFormality] = useState<string>("smart-casual");
  const [sideBySide, setSideBySide] = useState(false);
  const [lookbookCount, setLookbookCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOOKBOOK_KEY);
      const count = raw ? (JSON.parse(raw) as unknown[]).length : 0;
      setLookbookCount(count);
    } catch { /* silent */ }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target?.result as string);
      setPhase("uploaded");
      setOutfit(null);
      setSideBySide(false);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const startScan = useCallback(() => {
    setPhase("scanning");
    setTimeout(() => setPhase("ready"), SCAN_DURATION);
  }, []);

  const generateVTO = useCallback(async () => {
    setPhase("generating");
    const [res] = await Promise.all([
      fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formality, history: [] }),
      }),
      new Promise((r) => setTimeout(r, 900)),
    ]);
    if (res.ok) {
      const data = await res.json();
      setOutfit(data.outfit);
      setPhase("result");
    } else {
      setPhase("ready");
    }
  }, [formality]);

  const saveToLookbook = useCallback(() => {
    if (!outfit) return;
    try {
      const raw = localStorage.getItem(LOOKBOOK_KEY);
      const entries: LookbookEntry[] = raw ? JSON.parse(raw) : [];
      entries.push({
        id: `look-${Date.now()}`,
        outfit,
        savedAt: new Date().toISOString(),
      });
      const updated = entries.slice(-20);
      localStorage.setItem(LOOKBOOK_KEY, JSON.stringify(updated));
      setLookbookCount(updated.length);
      setSaved(true);
    } catch { /* silent */ }
  }, [outfit]);

  const resetMirror = useCallback(() => {
    setPhase("idle");
    setPhoto(null);
    setOutfit(null);
    setSideBySide(false);
    setSaved(false);
  }, []);

  const statusText: Record<Phase, string> = {
    idle: "Awaiting Upload",
    uploaded: "Photo Captured",
    scanning: "Biometric Sync Active",
    ready: "Sync Complete — Ready",
    generating: "Generating VTO",
    result: "VTO Complete",
  };

  return (
    <section id="mirror" className="relative py-24 sm:py-32">
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
              Personalize
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            Virtual Mirror
          </h2>
          <p className="text-sm text-text-secondary max-w-lg" style={{ lineHeight: 1.7 }}>
            Upload your photo and experience AI-powered virtual try-on.
            See recommended outfits mapped directly onto your silhouette.
          </p>
        </motion.div>

        {/* Glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Corner accents */}
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
            {/* Panel header */}
            <div
              className="flex items-center justify-between pb-6 mb-8"
              style={{ borderBottom: "1px solid rgba(72, 72, 72, 0.4)" }}
            >
              <div className="flex items-center gap-2.5">
                <Camera size={14} strokeWidth={1.5} className="text-amber" />
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                  Virtual Try-On Engine
                </span>
              </div>
              {lookbookCount > 0 && (
                <div className="flex items-center gap-2">
                  <Bookmark size={12} strokeWidth={1.5} className="text-text-muted" />
                  <span className="text-[10px] font-medium tabular-nums text-text-muted">
                    {lookbookCount} Saved
                  </span>
                </div>
              )}
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* ── Left: Photo area ── */}
              <div className="relative">
                {phase === "idle" ? (
                  <div
                    id="vto-dropzone"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-300 aspect-[3/4] max-h-[520px] ${
                      dragOver ? "bg-amber-glow" : "bg-surface-high/30 hover:bg-surface-high/50"
                    }`}
                    style={{
                      border: dragOver
                        ? "2px dashed var(--amber)"
                        : "2px dashed rgba(72, 72, 72, 0.5)",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                    <motion.div
                      animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                      className="w-16 h-16 flex items-center justify-center"
                      style={{ border: "1px solid rgba(212, 175, 55, 0.25)" }}
                    >
                      <Upload
                        size={28}
                        strokeWidth={1}
                        className={`transition-colors duration-200 ${
                          dragOver ? "text-amber" : "text-text-muted"
                        }`}
                      />
                    </motion.div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs tracking-[0.1em] uppercase text-text-secondary">
                        Drop your photo here
                      </span>
                      <span className="text-[9px] tracking-[0.08em] uppercase text-text-muted/50">
                        PNG · JPG · WEBP
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative aspect-[3/4] max-h-[520px] overflow-hidden"
                    style={{ border: "1px solid rgba(212, 175, 55, 0.15)" }}
                  >
                    {/* Photo content — single or side-by-side */}
                    <div className={`relative w-full h-full ${sideBySide ? "flex" : ""}`}>
                      {/* Original side (only when side-by-side) */}
                      {sideBySide && (
                        <div
                          className="relative w-1/2 h-full overflow-hidden"
                          style={{ borderRight: "1px solid var(--amber)" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo!}
                            alt="Original upload"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-3 left-3 text-[8px] tracking-[0.15em] uppercase text-amber bg-background/80 px-2 py-1">
                            Original
                          </span>
                        </div>
                      )}

                      {/* Main / VTO side */}
                      <div
                        className={`relative ${
                          sideBySide ? "w-1/2" : "w-full"
                        } h-full overflow-hidden`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo!}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* VTO color overlay zones */}
                        {phase === "result" && outfit && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="absolute inset-0"
                          >
                            {/* Top zone */}
                            <div
                              className="absolute top-0 left-0 right-0"
                              style={{
                                height: "42%",
                                background: `linear-gradient(180deg, ${outfit.top.color}b0, ${outfit.top.color}50)`,
                                mixBlendMode: "multiply",
                              }}
                            />
                            {/* Bottom zone */}
                            <div
                              className="absolute left-0 right-0"
                              style={{
                                top: "42%",
                                height: "38%",
                                background: `linear-gradient(180deg, ${outfit.bottom.color}90, ${outfit.bottom.color}40)`,
                                mixBlendMode: "multiply",
                              }}
                            />
                            {/* Shoes zone */}
                            <div
                              className="absolute bottom-0 left-0 right-0"
                              style={{
                                height: "20%",
                                background: `linear-gradient(180deg, ${outfit.shoes.color}70, ${outfit.shoes.color}30)`,
                                mixBlendMode: "multiply",
                              }}
                            />
                            {/* Scan-line texture */}
                            <div
                              className="absolute inset-0 opacity-[0.05] pointer-events-none"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,175,55,0.3) 2px, rgba(212,175,55,0.3) 3px)",
                              }}
                            />
                            {/* Label */}
                            <span className="absolute bottom-3 left-3 text-[8px] tracking-[0.15em] uppercase text-amber bg-background/80 px-2 py-1">
                              {sideBySide ? "AI Styled" : "Virtual Try-On"}
                            </span>

                            {/* Zone labels */}
                            <div className="absolute top-[18%] right-3 flex flex-col gap-1 items-end">
                              <span className="text-[7px] tracking-[0.12em] uppercase text-amber/70 bg-background/50 px-1.5 py-0.5">
                                {outfit.top.name}
                              </span>
                            </div>
                            <div className="absolute top-[55%] right-3 flex flex-col gap-1 items-end">
                              <span className="text-[7px] tracking-[0.12em] uppercase text-amber/70 bg-background/50 px-1.5 py-0.5">
                                {outfit.bottom.name}
                              </span>
                            </div>
                            <div className="absolute bottom-[5%] right-3 flex flex-col gap-1 items-end">
                              <span className="text-[7px] tracking-[0.12em] uppercase text-amber/70 bg-background/50 px-1.5 py-0.5">
                                {outfit.shoes.name}
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* Generating pulse overlay */}
                        {phase === "generating" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.15, 0.3, 0.15] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="absolute inset-0 bg-amber/10"
                          />
                        )}
                      </div>
                    </div>

                    {/* Biometric scan overlay */}
                    <BiometricScanOverlay isScanning={phase === "scanning"} />

                    {/* Close / new upload button */}
                    <button
                      id="vto-close-btn"
                      onClick={resetMirror}
                      className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-background/60 text-text-muted hover:text-amber transition-colors duration-200"
                      style={{ border: "1px solid var(--outline)" }}
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Right: Controls & Outfit Details ── */}
              <div className="flex flex-col gap-6">
                {/* Status */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-1.5 h-1.5 shrink-0 ${
                      phase === "result"
                        ? "bg-emerald-400"
                        : phase === "scanning" || phase === "generating"
                        ? "bg-amber animate-pulse"
                        : photo
                        ? "bg-amber"
                        : "bg-outline"
                    }`}
                  />
                  <span className="text-[10px] tracking-[0.15em] uppercase text-text-muted">
                    {statusText[phase]}
                  </span>
                </div>

                {/* Formality pills */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted">
                    Formality
                  </label>
                  <div className="flex gap-[2px]">
                    {FORMALITY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFormality(opt)}
                        className={`flex-1 py-2.5 text-[10px] tracking-[0.06em] uppercase transition-all duration-200 ${
                          formality === opt
                            ? "bg-amber text-background font-semibold"
                            : "bg-surface-high text-text-muted hover:text-text-primary hover:bg-surface-highest"
                        }`}
                        style={
                          formality !== opt
                            ? { border: "1px solid rgba(72, 72, 72, 0.5)" }
                            : undefined
                        }
                      >
                        {opt === "smart-casual" ? "S-Casual" : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <AnimatePresence mode="wait">
                  {phase === "uploaded" && (
                    <motion.button
                      key="scan-btn"
                      id="biometric-sync-btn"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onClick={startScan}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-amber text-background text-xs font-semibold tracking-[0.12em] uppercase hover:bg-amber-dim transition-all duration-200"
                    >
                      <ScanLine size={14} strokeWidth={1.5} />
                      Start Biometric Sync
                    </motion.button>
                  )}
                  {phase === "scanning" && (
                    <motion.div
                      key="scanning-status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 text-xs tracking-[0.12em] uppercase text-amber"
                      style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                    >
                      <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                      Syncing...
                    </motion.div>
                  )}
                  {phase === "ready" && (
                    <motion.button
                      key="generate-vto-btn"
                      id="generate-vto-btn"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onClick={generateVTO}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-amber text-background text-xs font-semibold tracking-[0.12em] uppercase hover:bg-amber-dim transition-all duration-200"
                    >
                      <Zap size={14} strokeWidth={1.5} />
                      Generate VTO
                    </motion.button>
                  )}
                  {phase === "generating" && (
                    <motion.div
                      key="generating-status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 text-xs tracking-[0.12em] uppercase text-amber"
                      style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                    >
                      <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                      Rendering...
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result controls: Side-by-Side + Save */}
                {phase === "result" && outfit && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Side-by-side toggle */}
                    <button
                      id="side-by-side-toggle"
                      onClick={() => setSideBySide(!sideBySide)}
                      className={`flex items-center justify-center gap-2 w-full py-3 text-xs tracking-[0.1em] uppercase transition-all duration-200 ${
                        sideBySide
                          ? "bg-surface-highest text-amber"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                      style={{ border: "1px solid var(--outline)" }}
                    >
                      <Columns2 size={14} strokeWidth={1.5} />
                      {sideBySide ? "Single View" : "Side-by-Side"}
                    </button>

                    {/* Save to Lookbook */}
                    <button
                      id="save-lookbook-btn"
                      onClick={saveToLookbook}
                      disabled={saved}
                      className={`flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-200 ${
                        saved
                          ? "bg-surface-high text-emerald-400 cursor-default"
                          : "bg-amber text-background hover:bg-amber-dim"
                      }`}
                    >
                      {saved ? (
                        <>
                          <Check size={14} strokeWidth={2} />
                          Saved to Lookbook
                        </>
                      ) : (
                        <>
                          <Bookmark size={14} strokeWidth={1.5} />
                          Save to Lookbook
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Compact outfit items */}
                {phase === "result" && outfit && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-col gap-2 pt-5"
                    style={{ borderTop: "1px solid rgba(72, 72, 72, 0.4)" }}
                  >
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted mb-1">
                      Selected Pieces
                    </span>
                    {(
                      [
                        { label: "Top", item: outfit.top },
                        { label: "Bottom", item: outfit.bottom },
                        { label: "Shoes", item: outfit.shoes },
                        { label: "Accessory", item: outfit.accessory },
                      ] as const
                    ).map(({ label, item }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex items-center gap-3 p-3 bg-surface-high/40 hover:bg-surface-high/70 transition-colors duration-200"
                        style={{ border: "1px solid rgba(72, 72, 72, 0.3)" }}
                      >
                        <div
                          className="w-6 h-6 shrink-0"
                          style={{
                            backgroundColor: item.color,
                            border: "1px solid rgba(212,175,55,0.2)",
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-medium text-text-primary truncate">
                            {item.name}
                          </span>
                          <span className="text-[9px] tracking-[0.1em] uppercase text-text-muted">
                            {label} · {item.material}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Empty state guidance */}
                {phase === "idle" && (
                  <div className="flex flex-col gap-3 pt-4 mt-auto">
                    <div
                      className="flex flex-col gap-3 p-5"
                      style={{ border: "1px solid rgba(72, 72, 72, 0.3)" }}
                    >
                      <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted">
                        How it works
                      </span>
                      {[
                        "Upload your photo",
                        "Run biometric sync",
                        "Generate AI outfit overlay",
                        "Compare & save to lookbook",
                      ].map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold tabular-nums text-amber w-4 text-right">
                            {i + 1}
                          </span>
                          <span className="text-[10px] tracking-[0.06em] uppercase text-text-muted">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
