"use client";

import { motion } from "framer-motion";
import { Radio, Eye, Thermometer } from "lucide-react";

const FEATURES = [
  {
    icon: Radio,
    title: "RFID Array",
    subtitle: "128-Tag Matrix",
    description:
      "Dual-frequency RFID scanner identifies every garment in 1.8 seconds. Tracks wear history, laundering cycles, and real-time location within the unit.",
    specs: ["UHF 860-960 MHz", "128 simultaneous reads", "99.7% accuracy"],
  },
  {
    icon: Eye,
    title: "AR Optics",
    subtitle: "Spatial Preview",
    description:
      "Integrated optical array projects outfit combinations onto a sapphire crystal display panel. See your look before you touch a hanger.",
    specs: ["4K micro-LED", "120Hz refresh", "Gesture control"],
  },
  {
    icon: Thermometer,
    title: "Climate Control",
    subtitle: "Ambient Intelligence",
    description:
      "Weather-aware algorithms cross-reference local forecasts with garment thermal ratings. Cedar-lined climate zones protect delicate fabrics.",
    specs: ["±0.5°C precision", "40-60% humidity", "UV sterilization"],
  },
] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HardwareTech() {
  return (
    <section id="hardware" className="relative py-24 sm:py-32">
      {/* Section background shift */}
      <div className="absolute inset-0 bg-surface-low" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 mb-16 sm:mb-20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              Hardware
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            The Axiom Core
          </h2>
          <p className="text-sm text-text-secondary max-w-lg" style={{ lineHeight: 1.7 }}>
            Three precision-engineered subsystems working in concert.
            Each sensor feeds the central AI, creating a closed-loop
            styling intelligence.
          </p>
        </motion.div>

        {/* 3-Column Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group flex flex-col p-8 sm:p-10 bg-surface-mid transition-colors duration-300 hover:bg-surface-high"
                style={{ border: "1px solid rgba(72, 72, 72, 0.5)" }}
              >
                {/* Icon + Title */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-11 h-11 flex items-center justify-center"
                    style={{ border: "1px solid rgba(212, 175, 55, 0.25)" }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-text-muted group-hover:text-amber transition-colors duration-300"
                    />
                  </div>
                  <span className="text-[9px] tracking-[0.12em] uppercase text-text-muted/50 mt-1">
                    {feature.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold tracking-tight text-text-primary mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs text-text-secondary mb-8 flex-1"
                  style={{ lineHeight: 1.7 }}
                >
                  {feature.description}
                </p>

                {/* Spec list */}
                <div className="flex flex-col gap-2 pt-5" style={{ borderTop: "1px solid var(--outline)" }}>
                  {feature.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-amber shrink-0" />
                      <span className="text-[10px] tracking-[0.08em] uppercase text-text-muted">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
