"use client";

import { motion } from "framer-motion";
import { Shirt, Footprints, Watch, RectangleHorizontal, Radio, Thermometer } from "lucide-react";
import type { WardrobeItem } from "@/lib/engine";

const typeIcons = {
  top: Shirt,
  bottom: RectangleHorizontal,
  shoes: Footprints,
  accessory: Watch,
} as const;

const typeLabels = {
  top: "TOP PIECE",
  bottom: "LOWER PIECE",
  shoes: "FOOTWEAR",
  accessory: "ACCESSORY",
} as const;

interface OutfitCardProps {
  item: WardrobeItem;
  index: number;
}

export default function OutfitCard({ item, index }: OutfitCardProps) {
  const Icon = typeIcons[item.type] || Shirt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="relative p-6 bg-surface-mid/80 backdrop-blur-xl border border-white/10 hover:border-amber/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
      style={{
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }}
    >
      {/* Corner notch accents */}
      <div className="absolute top-0 left-0 w-3 h-[1px] bg-amber/60" />
      <div className="absolute top-0 left-0 w-[1px] h-3 bg-amber/60" />
      <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-amber/60" />
      <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-amber/60" />

      {/* Top row: Type label, slot & RFID UID */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-[9px] tracking-[0.16em] uppercase text-text-muted">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-amber group-hover:scale-110 transition-transform duration-200" />
          <span className="text-amber font-semibold">{typeLabels[item.type]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-surface-highest border border-white/10 text-[8px] text-text-secondary">
            {item.chamberSlot || `BAY-0${index + 1}`}
          </span>
        </div>
      </div>

      {/* Main info row: Color swatch + Name + Material */}
      <div className="my-4 flex items-start gap-4">
        <div
          className="relative w-12 h-12 shrink-0 border border-amber/30 p-1 flex items-center justify-center bg-black/40 shadow-inner group-hover:border-amber transition-colors"
        >
          <div
            className="w-full h-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber" />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-tight text-text-primary group-hover:text-amber transition-colors line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs text-text-secondary line-clamp-1 font-mono text-[10px]">
            {item.material}
          </p>
          <div className="flex items-center gap-2 font-mono text-[9px] text-text-muted mt-1">
            <span className="flex items-center gap-1">
              <Radio size={10} className="text-amber" />
              {item.rfid || "RFID: SYNCD"}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Thermometer size={10} />
              {item.weatherRange ? `${item.weatherRange[0]}-${item.weatherRange[1]}°C` : "18°C"}
            </span>
          </div>
        </div>
      </div>

      {/* Tags and status strip */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px]">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-surface-low border border-white/5 text-text-muted uppercase text-[8px] tracking-[0.08em]"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="text-amber font-mono text-[9px] tracking-[0.1em] uppercase">
          {item.status || "READY"}
        </div>
      </div>
    </motion.div>
  );
}
