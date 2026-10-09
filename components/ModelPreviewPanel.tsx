"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, AlertTriangle, RefreshCw, Grid3x3 } from "lucide-react";
import type { Outfit } from "@/lib/engine";

interface ModelPreviewPanelProps {
  outfit: Outfit;
  /** Called each time the outfit changes to re-fetch preview */
  outfitKey: number;
}

interface PreviewState {
  status: "idle" | "loading" | "configured" | "not-configured" | "error";
  preview?: string;
  envVar?: string;
  provider?: string;
  error?: string;
}

/**
 * Converts a WardrobeItem into a GarmentRecord for the API.
 * Since wardrobe.json has no image URLs, image is omitted.
 */
function outfitToGarments(outfit: Outfit) {
  return [
    { id: outfit.top.id, name: outfit.top.name, color: outfit.top.color, category: "top" },
    { id: outfit.bottom.id, name: outfit.bottom.name, color: outfit.bottom.color, category: "bottom" },
    { id: outfit.shoes.id, name: outfit.shoes.name, color: outfit.shoes.color, category: "shoes" },
    { id: outfit.accessory.id, name: outfit.accessory.name, color: outfit.accessory.color, category: "accessory" },
  ];
}

/**
 * OutfitBoard — flat-lay display of the real garment color swatches.
 * Shown whenever model preview is not configured or as permanent backdrop.
 */
function OutfitBoard({ outfit }: { outfit: Outfit }) {
  const slots = [
    { label: "TOP", item: outfit.top },
    { label: "BOTTOM", item: outfit.bottom },
    { label: "FOOTWEAR", item: outfit.shoes },
    { label: "ACCESSORY", item: outfit.accessory },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 font-mono text-[10px] tracking-[0.2em] uppercase text-amber">
        <Grid3x3 size={12} />
        <span>OUTFIT BOARD</span>
      </div>

      {/* 2×2 flat-lay grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {slots.map(({ label, item }) => (
          <div
            key={item.id}
            className="relative flex flex-col border border-white/8 overflow-hidden bg-surface-low group"
          >
            {/* Color swatch — full height */}
            <div
              className="flex-1 min-h-[80px] relative"
              style={{ backgroundColor: item.color }}
            >
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
                  backgroundSize: "8px 8px",
                }}
              />
            </div>

            {/* Item info */}
            <div className="px-2.5 py-2 bg-[#0E0E0E]/90 border-t border-white/5">
              <div className="font-mono text-[8px] text-amber uppercase tracking-[0.12em] mb-0.5">
                {label}
              </div>
              <div className="font-semibold text-[11px] text-text-primary leading-tight line-clamp-1">
                {item.name}
              </div>
              <div className="font-mono text-[9px] text-text-muted line-clamp-1 mt-0.5">
                {item.material}
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-3 h-[1px] bg-amber/50" />
            <div className="absolute top-0 right-0 w-[1px] h-3 bg-amber/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelPreviewPanel({ outfit, outfitKey }: ModelPreviewPanelProps) {
  const [state, setState] = useState<PreviewState>({ status: "idle" });

  const fetchPreview = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/model-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garments: outfitToGarments(outfit) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({ status: "error", error: data.error || "Preview request failed." });
        return;
      }

      if (!data.configured) {
        setState({
          status: "not-configured",
          provider: data.provider,
          envVar: data.envVar,
        });
        return;
      }

      setState({ status: "configured", preview: data.preview });
    } catch {
      setState({ status: "error", error: "Network error. Could not reach preview service." });
    }
  }, [outfit]);

  // Fetch on every new outfit
  useEffect(() => {
    if (outfitKey > 0) fetchPreview();
  }, [outfitKey, fetchPreview]);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#0C0C0C] border border-white/10 overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-[1px] bg-amber z-20" />
      <div className="absolute top-0 left-0 w-[1px] h-5 bg-amber z-20" />
      <div className="absolute bottom-0 right-0 w-5 h-[1px] bg-amber z-20" />
      <div className="absolute bottom-0 right-0 w-[1px] h-5 bg-amber z-20" />

      <div className="p-5 flex flex-col h-full gap-4">
        {/* Panel header */}
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="flex items-center gap-2 text-amber font-semibold">
            <Eye size={13} />
            AI MODEL PREVIEW
          </span>
          {(state.status === "configured" || state.status === "not-configured") && (
            <button
              onClick={fetchPreview}
              className="text-text-muted hover:text-amber transition-colors"
              title="Refresh preview"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {/* IDLE / no outfit generated yet */}
            {state.status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-white/10 p-6"
              >
                <Eye size={24} className="text-amber/40" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.15em]">
                  Generate an outfit to see the model preview
                </span>
              </motion.div>
            )}

            {/* LOADING */}
            {state.status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4"
              >
                {/* Outfit board shown as loading backdrop */}
                <div className="w-full opacity-40 pointer-events-none">
                  <OutfitBoard outfit={outfit} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-[10px] text-amber uppercase tracking-[0.2em]">
                    RENDERING PREVIEW…
                  </span>
                </div>
              </motion.div>
            )}

            {/* CONFIGURED — show AI editorial description + outfit board */}
            {state.status === "configured" && (
              <motion.div
                key="configured"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col gap-4"
              >
                <OutfitBoard outfit={outfit} />
                <div className="p-4 bg-surface-mid border border-amber/20 relative">
                  <div className="absolute -top-2.5 left-4 px-2 bg-[#0C0C0C] font-mono text-[9px] text-amber uppercase tracking-[0.15em]">
                    EDITORIAL DIRECTION
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    "{state.preview}"
                  </p>
                </div>
              </motion.div>
            )}

            {/* NOT CONFIGURED — honest fallback */}
            {state.status === "not-configured" && (
              <motion.div
                key="not-configured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-4"
              >
                <OutfitBoard outfit={outfit} />
                <div className="p-3 bg-amber/5 border border-amber/25 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-amber uppercase tracking-[0.15em]">
                    <AlertTriangle size={12} />
                    MODEL PREVIEW NOT CONFIGURED
                  </div>
                  <p className="font-mono text-[9px] text-text-muted leading-relaxed">
                    Provider: <span className="text-text-secondary">{state.provider}</span>
                  </p>
                  <p className="font-mono text-[9px] text-text-muted">
                    Set env var:{" "}
                    <code className="text-amber bg-surface-low px-1 py-0.5 text-[9px]">
                      {state.envVar}
                    </code>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ERROR */}
            {state.status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-4"
              >
                <OutfitBoard outfit={outfit} />
                <div className="p-3 bg-red-950/30 border border-red-500/30">
                  <p className="font-mono text-[9px] text-red-400">{state.error}</p>
                  <button
                    onClick={fetchPreview}
                    className="mt-2 font-mono text-[9px] text-amber hover:underline uppercase tracking-[0.12em]"
                  >
                    RETRY
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
