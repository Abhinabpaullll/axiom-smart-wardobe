"use client";

import { motion } from "framer-motion";
import { Shirt, Footprints, Watch, RectangleHorizontal } from "lucide-react";
import type { WardrobeItem } from "@/lib/engine";

const typeIcons = {
  top: Shirt,
  bottom: RectangleHorizontal,
  shoes: Footprints,
  accessory: Watch,
} as const;

const typeLabels = {
  top: "TOP",
  bottom: "BOTTOM",
  shoes: "SHOES",
  accessory: "ACCESSORY",
} as const;

interface OutfitCardProps {
  item: WardrobeItem;
  index: number;
}

export default function OutfitCard({ item, index }: OutfitCardProps) {
  const Icon = typeIcons[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="glass-panel p-8 flex flex-col gap-5 group hover:border-amber/30 transition-colors duration-300"
    >
      {/* Header: type label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted">
          {typeLabels[item.type]}
        </span>
        <Icon
          size={18}
          strokeWidth={1.5}
          className="text-text-muted group-hover:text-amber transition-colors duration-300"
        />
      </div>

      {/* Color swatch + Name */}
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 shrink-0 mt-0.5"
          style={{ backgroundColor: item.color, border: "1px solid rgba(212,175,55,0.2)" }}
        />
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="text-base font-medium tracking-tight text-text-primary leading-tight">
            {item.name}
          </h3>
          <p className="text-xs text-text-secondary">{item.material}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] tracking-[0.08em] uppercase text-text-muted bg-surface-high px-2.5 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
