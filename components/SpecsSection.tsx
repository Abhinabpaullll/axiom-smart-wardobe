"use client";

import { motion } from "framer-motion";

const SPECS = [
  { label: "Chassis", value: "Aerospace-Grade 7075 Aluminum" },
  { label: "Surface", value: "Sandblasted Titanium Anodize" },
  { label: "Glass", value: "Sapphire Crystal — AR Coated" },
  { label: "Display", value: "4K Micro-LED · 120Hz" },
  { label: "Connectivity", value: "Wi-Fi 7 · Bluetooth 5.4 · Thread" },
  { label: "RFID", value: "Dual UHF · 128-Tag Simultaneous" },
  { label: "Climate", value: "Active Humidity · Cedar-Lined" },
  { label: "Power", value: "120/240V · 45W Idle" },
  { label: "Dimensions", value: "2100 × 900 × 600 mm" },
  { label: "Weight", value: "78 kg (unloaded)" },
  { label: "OS", value: "Axiom v1.0 · OTA Updates" },
  { label: "Warranty", value: "5-Year Precision Guarantee" },
] as const;

export default function SpecsSection() {
  return (
    <section id="specs" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-surface-low" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              Technical
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            Specifications
          </h2>
        </motion.div>

        {/* Specs table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-3xl"
        >
          {SPECS.map((spec, i) => (
            <div
              key={spec.label}
              className="group grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] items-baseline py-4 transition-colors duration-200 hover:bg-surface-mid/50"
              style={{
                borderBottom:
                  i < SPECS.length - 1
                    ? "1px solid rgba(72, 72, 72, 0.4)"
                    : "none",
              }}
            >
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-text-muted group-hover:text-amber transition-colors duration-200">
                {spec.label}
              </span>
              <span className="text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                {spec.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
