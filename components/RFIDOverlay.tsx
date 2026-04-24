"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";

interface RFIDOverlayProps {
  isScanning: boolean;
}

export default function RFIDOverlay({ isScanning }: RFIDOverlayProps) {
  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          key="rfid-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(14, 14, 14, 0.92)" }}
        >
          {/* Scan container */}
          <div className="relative w-full max-w-md mx-auto px-8">
            {/* Scan field border */}
            <div
              className="relative overflow-hidden py-20 flex flex-col items-center gap-6"
              style={{ border: "1px solid rgba(212, 175, 55, 0.25)" }}
            >
              {/* Sweeping amber scan line */}
              <div
                className="absolute left-0 w-full h-[2px] rfid-line"
                style={{ backgroundColor: "var(--amber)", top: "0%" }}
              />

              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <Radio size={32} strokeWidth={1.5} className="text-amber" />
              </motion.div>

              {/* Label */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-amber">
                  RFID SCAN ACTIVE
                </span>
                <span className="text-[10px] tracking-[0.12em] uppercase text-text-muted">
                  Reading garment transponders
                </span>
              </div>

              {/* Animated dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-amber"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
