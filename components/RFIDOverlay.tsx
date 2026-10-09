"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Radio, Cpu } from "lucide-react";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Central Monolith Laser Scanner Box */}
          <div className="relative w-full max-w-lg mx-4 p-8 sm:p-12 bg-[#0E0E0E] border border-amber/40 shadow-2xl overflow-hidden">
            {/* Corner Machined Accents */}
            <div className="absolute top-0 left-0 w-6 h-[2px] bg-amber" />
            <div className="absolute top-0 left-0 w-[2px] h-6 bg-amber" />
            <div className="absolute top-0 right-0 w-6 h-[2px] bg-amber" />
            <div className="absolute top-0 right-0 w-[2px] h-6 bg-amber" />
            <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-amber" />
            <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-amber" />
            <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-amber" />
            <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-amber" />

            {/* 1s Vertical #D4AF37 Laser-Scan SVG Animation */}
            <div className="relative h-64 w-full flex flex-col items-center justify-center overflow-hidden border border-white/5 bg-surface-low/60">
              {/* Dynamic SVG Laser beam sweep */}
              <motion.svg
                className="absolute inset-x-0 w-full h-12 z-20 pointer-events-none"
                initial={{ top: "-10%" }}
                animate={{ top: ["0%", "85%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.0,
                  ease: "linear",
                }}
                viewBox="0 0 400 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                    <stop offset="25%" stopColor="#D4AF37" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#FFF2B2" stopOpacity="1" />
                    <stop offset="75%" stopColor="#D4AF37" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>
                  <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Laser scan line with glow */}
                <line
                  x1="0"
                  y1="24"
                  x2="400"
                  y2="24"
                  stroke="url(#laserBeamGrad)"
                  strokeWidth="3"
                  filter="url(#laserGlow)"
                />
                
                {/* Horizontal fan haze */}
                <polygon
                  points="0,10 400,10 400,38 0,38"
                  fill="url(#laserBeamGrad)"
                  opacity="0.15"
                />

                {/* Precision center reticle ticks */}
                <circle cx="200" cy="24" r="5" stroke="#FFF2B2" strokeWidth="1.5" fill="#D4AF37" />
              </motion.svg>

              {/* Central scanning HUD */}
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="relative p-4 rounded-none bg-surface-mid border border-amber/30">
                  <Radio size={28} className="text-amber animate-pulse" />
                </div>

                <div className="text-center flex flex-col gap-1">
                  <span className="font-mono text-xs font-semibold tracking-[0.25em] uppercase text-amber">
                    13.56 MHz RFID SCANNING
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted">
                    SYNCHRONIZING 20 TRANSPONDERS · PROTOCOL 72H
                  </span>
                </div>
              </div>

              {/* Side measurement rulers */}
              <div className="absolute left-2 inset-y-4 flex flex-col justify-between font-mono text-[8px] text-text-muted/40 pointer-events-none">
                <span>000</span>
                <span>025</span>
                <span>050</span>
                <span>075</span>
                <span>100</span>
              </div>
              <div className="absolute right-2 inset-y-4 flex flex-col justify-between font-mono text-[8px] text-text-muted/40 pointer-events-none">
                <span>BAY A</span>
                <span>BAY B</span>
                <span>BAY C</span>
                <span>BAY D</span>
              </div>
            </div>

            {/* Bottom Telemetry Info */}
            <div className="mt-6 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] uppercase text-text-muted">
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-amber" />
                <span>CHAMBER: ENGAGED</span>
              </div>
              <div className="text-amber">LATENCY: &lt;50ms</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
