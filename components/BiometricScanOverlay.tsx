"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BiometricScanOverlayProps {
  isScanning: boolean;
}

const readouts = [
  { text: "ANALYZING BODY GEOMETRY", delay: 0.2 },
  { text: "MAPPING SURFACE TOPOLOGY", delay: 0.7 },
  { text: "CALIBRATING FIT MATRIX", delay: 1.2 },
  { text: "BIOMETRIC SYNC COMPLETE", delay: 1.7 },
] as const;

export default function BiometricScanOverlay({ isScanning }: BiometricScanOverlayProps) {
  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          key="biometric-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-20 overflow-hidden biometric-border-pulse"
          style={{ border: "1px solid var(--amber)" }}
        >
          {/* Dark tint */}
          <div className="absolute inset-0 bg-background/30" />

          {/* Primary horizontal sweep — top to bottom */}
          <div
            className="absolute left-0 w-full biometric-line-h"
            style={{ height: "2px", backgroundColor: "var(--amber)", boxShadow: "0 0 12px 3px rgba(212,175,55,0.5)" }}
          />

          {/* Secondary horizontal sweep — bottom to top, staggered */}
          <div
            className="absolute left-0 w-full biometric-line-h2"
            style={{ height: "1px", backgroundColor: "var(--amber)", opacity: 0.5 }}
          />

          {/* Vertical sweep — left to right */}
          <div
            className="absolute top-0 biometric-line-v"
            style={{ width: "2px", height: "100%", backgroundColor: "var(--amber)", boxShadow: "0 0 10px 2px rgba(212,175,55,0.4)" }}
          />

          {/* Grid pattern fade-in */}
          <div
            className="absolute inset-0 biometric-grid"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.25) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Corner reticles */}
          {[
            "top-3 left-3",
            "top-3 right-3 rotate-90",
            "bottom-3 left-3 -rotate-90",
            "bottom-3 right-3 rotate-180",
          ].map((pos) => (
            <div key={pos} className={`absolute ${pos}`}>
              <div className="w-5 h-[1px] bg-amber" />
              <div className="w-[1px] h-5 bg-amber" />
            </div>
          ))}

          {/* Center crosshair */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="relative w-10 h-10">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-amber/40" />
              <div className="absolute left-1/2 top-0 h-full w-[1px] bg-amber/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-amber" />
            </div>
          </motion.div>

          {/* Data readout — bottom left */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            {readouts.map((r) => (
              <motion.span
                key={r.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: r.delay, duration: 0.3 }}
                className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-amber font-medium"
                style={{ textShadow: "0 0 8px rgba(212,175,55,0.4)" }}
              >
                {r.text}
              </motion.span>
            ))}
          </div>

          {/* Telemetry — top right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 flex flex-col items-end gap-0.5"
          >
            <span className="text-[8px] tracking-[0.15em] uppercase text-amber/60 tabular-nums">
              13.56 MHz ACTIVE
            </span>
            <span className="text-[8px] tracking-[0.15em] uppercase text-amber/40 tabular-nums">
              128 TAGS · SCANNING
            </span>
          </motion.div>

          {/* Progress bar — bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface-high">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              className="h-full bg-amber"
              style={{ boxShadow: "0 0 8px 1px rgba(212,175,55,0.6)" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
