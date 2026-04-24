"use client";

import { AnimatePresence, motion } from "framer-motion";
import OutfitCard from "./OutfitCard";
import type { Outfit } from "@/lib/engine";

interface WardrobeGridProps {
  outfit: Outfit | null;
  outfitKey: number;
}

export default function WardrobeGrid({ outfit, outfitKey }: WardrobeGridProps) {
  if (!outfit) return null;

  const slots = [outfit.top, outfit.bottom, outfit.shoes, outfit.accessory];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={outfitKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
      >
        {slots.map((item, i) => (
          <OutfitCard key={item.id} item={item} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
