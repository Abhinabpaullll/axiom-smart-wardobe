"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Shirt,
  RectangleHorizontal,
  Footprints,
  Watch,
  X,
  Droplets,
  Layers,
  ChevronLeft,
  ChevronRight,
  MoveRight,
  Archive,
  Info,
} from "lucide-react";
import initialWardrobe from "@/data/wardrobe.json";
import type { WardrobeItem } from "@/lib/engine";

const CATEGORY_TABS = [
  { id: "all", label: "ALL GARMENTS", icon: Layers },
  { id: "top", label: "TOPS", icon: Shirt },
  { id: "bottom", label: "BOTTOMS", icon: RectangleHorizontal },
  { id: "shoes", label: "FOOTWEAR", icon: Footprints },
  { id: "accessory", label: "ACCESSORIES", icon: Watch },
] as const;

const STATUS_FILTERS = ["ALL", "CHAMBER 01", "IN WASH", "STORED"] as const;

export default function InventoryPage() {
  const [items, setItems] = useState<WardrobeItem[]>(initialWardrobe as WardrobeItem[]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedGarment, setSelectedGarment] = useState<WardrobeItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = activeTab === "all" || item.type === activeTab || item.category === activeTab;
      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchCat && matchStatus;
    });
  }, [items, activeTab, statusFilter]);

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHAMBER 01":
        return {
          bg: "bg-amber/10",
          border: "border-amber/40",
          text: "text-amber",
          label: "CHAMBER 01",
        };
      case "IN WASH":
        return {
          bg: "bg-blue-950/40",
          border: "border-blue-500/40",
          text: "text-blue-400",
          label: "IN WASH",
        };
      case "STORED":
        return {
          bg: "bg-neutral-800/60",
          border: "border-neutral-600/40",
          text: "text-neutral-400",
          label: "STORED",
        };
      default:
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          label: "READY",
        };
    }
  };

  const handleUpdateStatus = (id: string, newStatus: WardrobeItem["status"]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedGarment && selectedGarment.id === id) {
      setSelectedGarment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E7E5E4] pt-20 sm:pt-24 pb-24">
      {/* Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-amber" />
            <span className="font-mono text-[10px] font-medium tracking-[0.25em] uppercase text-amber">
              RFID GARMENT TELEMETRY
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-text-primary">
                Machined Inventory
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-xl leading-relaxed">
                Horizontal carousel with interactive drag physics. Every piece is tagged with an encrypted 13.56 MHz RFID transponder,
                monitored for thermal threshold, sanitize cycle status, and chamber bay slot.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.14em] uppercase text-text-muted">
              <div className="p-3 bg-surface-low border border-white/5 flex flex-col">
                <span>CHAMBER OCCUPANCY</span>
                <span className="text-text-primary font-semibold text-sm">
                  {items.filter((i) => i.status === "CHAMBER 01").length} / 20 SLOTS
                </span>
              </div>
              <div className="p-3 bg-surface-low border border-white/5 flex flex-col">
                <span>IN SANITIZE WASH</span>
                <span className="text-blue-400 font-semibold text-sm">
                  {items.filter((i) => i.status === "IN WASH").length} PIECES
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-surface-mid/80 backdrop-blur-xl border border-white/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count =
                tab.id === "all"
                  ? items.length
                  : items.filter((i) => i.type === tab.id || i.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                    isActive
                      ? "bg-amber text-background font-semibold"
                      : "bg-surface-low text-text-secondary hover:text-text-primary hover:bg-surface-highest"
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] ${isActive ? "text-black/70" : "text-text-muted"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filters & Carousel Scroll Buttons */}
          <div className="flex items-center justify-between lg:justify-end gap-3 font-mono text-xs">
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[10px] mr-2 uppercase tracking-[0.1em]">
                STATUS:
              </span>
              {STATUS_FILTERS.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase transition-colors ${
                    statusFilter === st
                      ? "border border-amber text-amber bg-amber/10"
                      : "border border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-3">
              <button
                onClick={() => scrollCarousel("left")}
                aria-label="Scroll left"
                className="p-1.5 bg-surface-low border border-white/10 hover:border-amber/40 hover:text-amber text-text-muted transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                aria-label="Scroll right"
                className="p-1.5 bg-surface-low border border-white/10 hover:border-amber/40 hover:text-amber text-text-muted transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL GARMENT CAROUSEL WITH DRAG="X" GESTURES */}
      <div className="w-full overflow-hidden px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase mb-3">
            <span className="flex items-center gap-2">
              <Radio size={12} className="text-amber animate-pulse" />
              DRAGGABLE RFID CAROUSEL · {filteredItems.length} TRANSPONDERS LOCATED
            </span>
            <span className="text-amber/70 flex items-center gap-1">
              SWIPE HORIZONTALLY <MoveRight size={12} />
            </span>
          </div>

          <motion.div
            ref={carouselRef}
            className="cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar py-4"
            style={{ scrollBehavior: "smooth" }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: -Math.max(0, (filteredItems.length - 3) * 320), right: 0 }}
              dragElastic={0.15}
              className="flex gap-6 w-max"
            >
              {filteredItems.map((item, index) => {
                const badge = getStatusBadge(item.status);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04, duration: 0.4 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedGarment(item)}
                    className="relative w-80 p-6 bg-[#121212]/90 backdrop-blur-xl border border-white/10 hover:border-amber/40 transition-colors shadow-2xl flex flex-col justify-between select-none group"
                  >
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-[1px] bg-amber/50" />
                    <div className="absolute top-0 left-0 w-[1px] h-3 bg-amber/50" />
                    <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-amber/50" />
                    <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-amber/50" />

                    {/* Top row: RFID badge & Status badge */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/5 font-mono text-[9px] tracking-[0.14em] uppercase">
                      <div className="flex items-center gap-1.5 text-amber">
                        <Radio size={12} className="animate-pulse" />
                        <span>{item.rfid}</span>
                      </div>

                      {/* Status badge: RFID: DETECTED, CHAMBER 01, IN WASH */}
                      <span
                        className={`px-2.5 py-1 border ${badge.border} ${badge.bg} ${badge.text} font-semibold text-[9px]`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Middle: Color Swatch + Name + Material */}
                    <div className="my-5 flex items-start gap-4">
                      <div
                        className="w-14 h-14 shrink-0 border border-amber/30 p-1 flex items-center justify-center bg-black/50 shadow-inner group-hover:border-amber transition-colors"
                      >
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="font-mono text-[9px] tracking-[0.15em] text-text-muted uppercase">
                          {item.chamberSlot} · {item.formality}
                        </div>
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-amber transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-1">
                          {item.material}
                        </p>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-surface-low border border-white/5 font-mono text-[9px] text-text-muted mb-4">
                      <div>
                        <span>THERMAL RANGE:</span>
                        <div className="text-text-primary font-semibold">
                          {item.weatherRange[0]}°C – {item.weatherRange[1]}°C
                        </div>
                      </div>
                      <div>
                        <span>ROTATION COUNT:</span>
                        <div className="text-text-primary font-semibold">
                          {item.wearCount} CYCLES
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action strip */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-text-muted">
                      <span className="text-amber flex items-center gap-1 group-hover:underline">
                        <Info size={11} /> INSPECT RFID PROFILE
                      </span>
                      <span className="uppercase text-[8px] tracking-[0.1em]">
                        {item.season}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* INTERACTIVE GARMENT INSPECTION MODAL / DRAWER */}
      <AnimatePresence>
        {selectedGarment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedGarment(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-amber/30 p-6 sm:p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-[2px] bg-amber" />
              <div className="absolute top-0 left-0 w-[2px] h-6 bg-amber" />
              <div className="absolute top-0 right-0 w-6 h-[2px] bg-amber" />
              <div className="absolute top-0 right-0 w-[2px] h-6 bg-amber" />
              <div className="absolute bottom-0 left-0 w-6 h-[2px] bg-amber" />
              <div className="absolute bottom-0 left-0 w-[2px] h-6 bg-amber" />
              <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-amber" />
              <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-amber" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedGarment(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-amber border border-white/10 hover:border-amber/40 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-amber">
                  <Radio size={14} className="animate-pulse" />
                  <span>TRANSPONDER INSPECTION · UID: {selectedGarment.rfid}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary tracking-tight">
                  {selectedGarment.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
                  <span>SLOT: {selectedGarment.chamberSlot}</span>
                  <span>·</span>
                  <span>CATEGORY: {selectedGarment.type}</span>
                  <span>·</span>
                  <span className="text-amber">FORMALITY: {selectedGarment.formality}</span>
                </div>
              </div>

              {/* Detail Specifications Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="p-4 bg-surface-low border border-white/5 flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">
                    MATERIAL COMPOSITION
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {selectedGarment.material}
                  </span>
                  <span className="font-mono text-[9px] text-amber">
                    THERMAL CALIBRATION: {selectedGarment.weatherRange[0]}°C – {selectedGarment.weatherRange[1]}°C
                  </span>
                </div>

                <div className="p-4 bg-surface-low border border-white/5 flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted">
                    CARE &amp; SANITIZE PROTOCOL
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {selectedGarment.careProtocol}
                  </span>
                  <span className="font-mono text-[9px] text-text-muted">
                    ROTATION: {selectedGarment.wearCount} WEAR CYCLES LOGGED
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedGarment.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-surface-mid border border-white/10 font-mono text-[10px] tracking-[0.1em] uppercase text-text-secondary"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Status Update Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted">
                  DISPATCH CONTROL:
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedGarment.id, "CHAMBER 01")}
                    className={`px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                      selectedGarment.status === "CHAMBER 01"
                        ? "bg-amber text-background font-bold"
                        : "bg-surface-low border border-white/10 hover:border-amber/40 text-text-secondary"
                    }`}
                  >
                    CHAMBER 01
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedGarment.id, "IN WASH")}
                    className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                      selectedGarment.status === "IN WASH"
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-surface-low border border-white/10 hover:border-blue-500/40 text-text-secondary"
                    }`}
                  >
                    <Droplets size={13} />
                    IN WASH
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedGarment.id, "STORED")}
                    className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                      selectedGarment.status === "STORED"
                        ? "bg-neutral-700 text-white font-bold"
                        : "bg-surface-low border border-white/10 hover:border-neutral-500 text-text-secondary"
                    }`}
                  >
                    <Archive size={13} />
                    STORED
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
