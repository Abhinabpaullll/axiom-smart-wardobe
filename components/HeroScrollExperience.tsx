"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLenis } from "@/components/SmoothScrollProvider";
import wardrobeData from "@/data/wardrobe.json";

/* ─────────────────────────────────────────────────────────────
   REAL DATA — garment names from wardrobe.json
   ───────────────────────────────────────────────────────────── */
const GARMENT_ITEMS = wardrobeData.slice(0, 6).map((g) => ({
  id: g.id,
  name: g.name,
  slot: g.chamberSlot,
  color: g.color,
}));

const TOTAL_GARMENTS = wardrobeData.length;

const SCROLL_OFFSET: ["start start", "end end"] = ["start start", "end end"];

export default function HeroScrollExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  const lenis = useLenis();

  /* ═══════════════════════════════════════════════════════════
     SINGLE SCROLL PROGRESS  0 → 1  over 450svh
     ═══════════════════════════════════════════════════════════ */
  const { scrollYProgress: p } = useScroll({
    target: heroRef,
    offset: SCROLL_OFFSET,
  });

  /* ═══════════════════════════════════════════════════════════
     TIMELINE
     0.00–0.08  Closed. Headline visible. Cabinet subtly moves.
     0.08–0.30  Push-in. Headline parallax. Grid parallax.
     0.30–0.55  Doors separate. Interior lights up.
     0.55–0.70  RFID scan line crosses interior.
     0.70–0.85  Garment labels lift out.
     0.85–1.00  Hand off into next section.
     ═══════════════════════════════════════════════════════════ */

  // CABINET SCALE — initial push-in then slow continued
  const cabinetScale = useTransform(
    p,
    [0, 0.08, 0.30, 1.0],
    rm ? [1, 1, 1, 1] : [1, 1.0, 1.05, 1.12]
  );

  // DOORS — slide apart during 0.30–0.55 (static open for reduced motion)
  const leftDoorX = useTransform(
    p,
    [0.30, 0.55],
    rm ? ["-105%", "-105%"] : ["0%", "-105%"]
  );
  const rightDoorX = useTransform(
    p,
    [0.30, 0.55],
    rm ? ["105%", "105%"] : ["0%", "105%"]
  );

  // CENTER SEAM — glows at start, fades as doors open
  const seamOpacity = useTransform(
    p,
    [0.0, 0.08, 0.35],
    rm ? [0, 0, 0] : [0.6, 0.9, 0]
  );

  // INTERIOR LIGHT — brightens as doors open
  const interiorOpacity = useTransform(
    p,
    [0.25, 0.55],
    rm ? [1, 1] : [0.15, 1]
  );
  const interiorBrightness = useTransform(
    p,
    [0.25, 0.55],
    rm ? [1.1, 1.1] : [0.3, 1.1]
  );

  // HEADLINE — parallax drift and fade
  const headlineY = useTransform(
    p,
    [0, 0.08, 0.35, 0.60],
    rm ? [0, 0, 0, 0] : [0, 0, -30, -60]
  );
  const headlineOpacity = useTransform(
    p,
    [0, 0.40, 0.65],
    rm ? [1, 1, 0] : [1, 1, 0]
  );

  // CTA / STATUS — fade early
  const ctaOpacity = useTransform(
    p,
    [0, 0.15, 0.40],
    rm ? [1, 1, 0] : [1, 1, 0]
  );

  // SCROLL INDICATOR
  const scrollIndOpacity = useTransform(p, [0, 0.06], rm ? [0, 0] : [1, 0]);

  // GRID PARALLAX
  const gridY = useTransform(
    p,
    [0, 0.30],
    rm ? [0, 0] : [0, -20]
  );

  // RFID SCAN LINE — 0.55–0.70
  const scanTop = useTransform(p, [0.55, 0.70], ["4%", "92%"]);
  const scanOpacity = useTransform(
    p,
    [0.53, 0.57, 0.68, 0.72],
    rm ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );

  // GARMENT LABELS — 0.70–0.85
  const garmentOpacity = useTransform(
    p,
    [0.70, 0.80],
    rm ? [1, 1] : [0, 1]
  );
  const garmentY = useTransform(
    p,
    [0.70, 0.80],
    rm ? [0, 0] : [24, 0]
  );

  // HANDOFF — scene remains fully visible into next section (no black frame)
  const handoffOpacity = useTransform(
    p,
    [0.88, 1.0],
    [1, 1]
  );

  // INTERIOR FILTER — brightness as string for CSS
  const interiorFilter = useTransform(interiorBrightness, (v) => `brightness(${v})`);
  // INTERIOR GLOW — multiplied opacity
  const interiorGlowOpacity = useTransform(interiorOpacity, (v) => v * 0.35);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-[#080808]"
      style={{ height: "450svh" }}
    >
      {/* ══════════════════════════════════════════════════
          STICKY SCENE — pinned for full 450svh duration
         ══════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 w-full overflow-clip"
        style={{ height: "100svh" }}
      >
        <motion.div
          style={{ opacity: handoffOpacity }}
          className="relative w-full h-full"
        >
          {/* Background architectural grid */}
          <motion.div
            aria-hidden
            style={{ y: gridY }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(212,175,55,0.045) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(212,175,55,0.045) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </motion.div>

          {/* Ambient radial glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 72% at 62% 55%, rgba(212,175,55,0.06) 0%, transparent 68%)",
            }}
          />

          {/* ── CONTENT LAYOUT ── */}
          <div
            className="relative w-full h-full flex flex-col"
            style={{ paddingTop: "60px" }}
          >
            <div className="flex-1 flex items-center w-full">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

                  {/* ════════════════════════════════════
                      LEFT COL: HEADLINE + CTAs
                     ════════════════════════════════════ */}
                  <motion.div
                    style={
                      {
                        y: headlineY,
                        "--headline-opacity": headlineOpacity,
                        opacity: "var(--headline-opacity)",
                      } as any
                    }
                    className="lg:col-span-5 flex flex-col gap-5 z-20 order-2 lg:order-1"
                  >
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden
                        style={{ width: 32, height: 1, background: "#D4AF37" }}
                      />
                      <span
                        className="font-mono uppercase"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.22em",
                          color: "#D4AF37",
                        }}
                      >
                        AXIOM / SMART WARDROBE
                      </span>
                    </div>

                    {/* H1 */}
                    <h1
                      className="text-[#F5F5F7] font-semibold"
                      style={{
                        fontSize: "clamp(2.4rem, 5vw, 4rem)",
                        letterSpacing: "-0.04em",
                        lineHeight: 0.96,
                      }}
                    >
                      YOUR WARDROBE.
                      <br />
                      <span style={{ color: "#D4AF37" }}>WITH INTELLIGENCE.</span>
                    </h1>

                    {/* Body */}
                    <p
                      className="text-[#A1A1AA] leading-relaxed max-w-sm"
                      style={{ fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)" }}
                    >
                      Axiom connects a physical wardrobe with a digital intelligence
                      layer — understanding inventory, context, and personal style.
                    </p>

                    {/* CTAs */}
                    <motion.div
                      style={
                        {
                          "--cta-opacity": ctaOpacity,
                          opacity: "var(--cta-opacity)",
                        } as any
                      }
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
                    >
                      <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center justify-center gap-2.5 bg-black border text-[#F5F5F7] font-mono uppercase transition-all duration-200 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)]"
                        style={{
                          padding: "14px 24px",
                          fontSize: "11px",
                          letterSpacing: "0.18em",
                          borderColor: "rgba(212,175,55,0.55)",
                        }}
                      >
                        <span>ENTER THE CHAMBER</span>
                        <span
                          className="text-[#D4AF37] group-hover:translate-x-1 transition-transform duration-200"
                          aria-hidden
                        >
                          →
                        </span>
                        <div
                          aria-hidden
                          className="absolute top-0 right-0"
                          style={{ width: 6, height: 6, background: "#D4AF37" }}
                        />
                        <div
                          aria-hidden
                          className="absolute bottom-0 left-0"
                          style={{ width: 6, height: 6, background: "#D4AF37" }}
                        />
                      </Link>

                      <button
                        onClick={() => {
                          const target = document.getElementById("about");
                          if (target && lenis) {
                            lenis.scrollTo(target, { offset: 0 });
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 border font-mono uppercase transition-colors hover:border-[rgba(212,175,55,0.4)] hover:text-[#E7E5E4]"
                        style={{
                          padding: "14px 20px",
                          fontSize: "11px",
                          letterSpacing: "0.16em",
                          color: "#6E6D6D",
                          borderColor: "rgba(255,255,255,0.1)",
                        }}
                      >
                        <span>EXPLORE</span>
                        <ChevronDown size={13} style={{ color: "#D4AF37" }} />
                      </button>
                    </motion.div>

                    {/* Status — real data only */}
                    <motion.div
                      style={
                        {
                          "--status-opacity": ctaOpacity,
                          opacity: "var(--status-opacity)",
                        } as any
                      }
                      className="flex flex-wrap items-center gap-4 font-mono uppercase"
                    >
                      <div
                        className="flex items-center gap-2"
                        style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#6E6D6D" }}
                      >
                        <span
                          aria-hidden
                          className="rounded-full animate-pulse"
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            background: "#D4AF37",
                          }}
                        />
                        <span>SYSTEM READY</span>
                      </div>
                      <span aria-hidden style={{ color: "#6E6D6D", fontSize: "11px" }}>·</span>
                      <span
                        style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#6E6D6D" }}
                      >
                        {TOTAL_GARMENTS} GARMENTS INDEXED
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* ════════════════════════════════════
                      RIGHT COL: WARDROBE CABINET
                     ════════════════════════════════════ */}
                  <motion.div
                    style={{ scale: cabinetScale }}
                    className="lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2"
                  >
                    {/* ── CABINET FRAME ── */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        width: "100%",
                        maxWidth: "min(440px, 88vw)",
                        aspectRatio: "3 / 4",
                        background: "#0A0A0A",
                        border: "1px solid rgba(212,175,55,0.22)",
                      }}
                    >
                      {/* Aerospace corner brackets */}
                      {(["tl","tr","bl","br"] as const).map((corner) => (
                        <div
                          key={corner}
                          aria-hidden
                          className="absolute"
                          style={{
                            top:    corner.startsWith("t") ? 0 : "auto",
                            bottom: corner.startsWith("b") ? 0 : "auto",
                            left:   corner.endsWith("l")  ? 0 : "auto",
                            right:  corner.endsWith("r")  ? 0 : "auto",
                            width: 20,
                            height: 20,
                            zIndex: 40,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top:    corner.startsWith("t") ? 0 : "auto",
                              bottom: corner.startsWith("b") ? 0 : "auto",
                              left:   corner.endsWith("l")  ? 0 : "auto",
                              right:  corner.endsWith("r")  ? 0 : "auto",
                              width: 20,
                              height: 2,
                              background: "#D4AF37",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top:    corner.startsWith("t") ? 0 : "auto",
                              bottom: corner.startsWith("b") ? 0 : "auto",
                              left:   corner.endsWith("l")  ? 0 : "auto",
                              right:  corner.endsWith("r")  ? 0 : "auto",
                              width: 2,
                              height: 20,
                              background: "#D4AF37",
                            }}
                          />
                        </div>
                      ))}

                      {/* ── LAYER 1: INTERIOR IMAGE (back) ── */}
                      <motion.div
                        className="absolute inset-0"
                        style={
                          {
                            "--interior-opacity": interiorOpacity,
                            opacity: "var(--interior-opacity)",
                            filter: interiorFilter,
                            zIndex: 5,
                          } as any
                        }
                      >
                        <Image
                          src="/hero.png"
                          alt="Axiom Smart Wardrobe — lit interior with garments"
                          fill
                          priority
                          sizes="(max-width: 768px) 88vw, 440px"
                          className="object-cover"
                          style={{ objectPosition: "center 40%" }}
                        />
                      </motion.div>

                      {/* Interior warm glow overlay */}
                      <motion.div
                        aria-hidden
                        style={
                          {
                            "--interior-glow": interiorGlowOpacity,
                            opacity: "var(--interior-glow)",
                            zIndex: 6,
                          } as any
                        }
                        className="absolute inset-0 pointer-events-none"
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.06) 55%, transparent 80%)",
                          }}
                        />
                      </motion.div>

                      {/* ── LAYER 2: DOOR PANELS (front) ── */}

                      {/* LEFT DOOR — brushed titanium */}
                      <motion.div
                        aria-hidden
                        style={{
                          x: leftDoorX,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "52%",
                          height: "100%",
                          zIndex: 20,
                        }}
                      >
                        {/* Door body */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(168deg, #2A2A2A 0%, #1A1A1A 25%, #161616 50%, #131313 75%, #0F0F0F 100%)",
                          }}
                        />
                        {/* Brushed texture — horizontal hairlines */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)",
                          }}
                        />
                        {/* Subtle vertical highlight — mimics edge bevel */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "8%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.07) 100%)",
                          }}
                        />
                        {/* Gold seam edge (right side) */}
                        <div
                          style={{
                            position: "absolute",
                            top: "2%",
                            right: 0,
                            width: 1,
                            height: "96%",
                            background:
                              "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.65) 20%, rgba(212,175,55,0.5) 80%, transparent 100%)",
                            boxShadow: "0 0 6px 1px rgba(212,175,55,0.3)",
                          }}
                        />
                        {/* Handle — right side, centered vertically */}
                        <div
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 48,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg, rgba(212,175,55,0.7) 0%, rgba(180,150,30,0.5) 50%, rgba(212,175,55,0.7) 100%)",
                            boxShadow:
                              "0 0 8px 1px rgba(212,175,55,0.25), inset 0 0 2px rgba(255,255,255,0.1)",
                          }}
                        />
                        {/* Door label */}
                        <div
                          className="font-mono uppercase"
                          style={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                            fontSize: "11px",
                            letterSpacing: "0.18em",
                            color: "rgba(212,175,55,0.35)",
                          }}
                        >
                          L
                        </div>
                      </motion.div>

                      {/* RIGHT DOOR — brushed titanium */}
                      <motion.div
                        aria-hidden
                        style={{
                          x: rightDoorX,
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "52%",
                          height: "100%",
                          zIndex: 20,
                        }}
                      >
                        {/* Door body */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(192deg, #2A2A2A 0%, #1A1A1A 25%, #161616 50%, #131313 75%, #0F0F0F 100%)",
                          }}
                        />
                        {/* Brushed texture */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 4px)",
                          }}
                        />
                        {/* Edge bevel left */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "8%",
                            height: "100%",
                            background:
                              "linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.07) 100%)",
                          }}
                        />
                        {/* Gold seam edge (left side) */}
                        <div
                          style={{
                            position: "absolute",
                            top: "2%",
                            left: 0,
                            width: 1,
                            height: "96%",
                            background:
                              "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.65) 20%, rgba(212,175,55,0.5) 80%, transparent 100%)",
                            boxShadow: "0 0 6px 1px rgba(212,175,55,0.3)",
                          }}
                        />
                        {/* Handle — left side */}
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 48,
                            borderRadius: 2,
                            background:
                              "linear-gradient(180deg, rgba(212,175,55,0.7) 0%, rgba(180,150,30,0.5) 50%, rgba(212,175,55,0.7) 100%)",
                            boxShadow:
                              "0 0 8px 1px rgba(212,175,55,0.25), inset 0 0 2px rgba(255,255,255,0.1)",
                          }}
                        />
                        {/* Door label */}
                        <div
                          className="font-mono uppercase"
                          style={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            fontSize: "11px",
                            letterSpacing: "0.18em",
                            color: "rgba(212,175,55,0.35)",
                          }}
                        >
                          R
                        </div>
                      </motion.div>

                      {/* CENTER SEAM GLOW — visible when doors closed */}
                      <motion.div
                        aria-hidden
                        style={
                          {
                            "--seam-opacity": seamOpacity,
                            opacity: "var(--seam-opacity)",
                            zIndex: 25,
                          } as any
                        }
                        className="absolute inset-y-0 pointer-events-none"
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 2,
                            zIndex: 25,
                            background:
                              "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.9) 25%, rgba(212,175,55,0.65) 75%, transparent 100%)",
                            boxShadow: "0 0 14px 2px rgba(212,175,55,0.5)",
                          }}
                        />
                      </motion.div>

                      {/* ══ RFID SCAN LINE (0.55–0.70) ══ */}
                      <motion.div
                        aria-hidden
                        style={
                          {
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: scanTop,
                            height: 2,
                            zIndex: 30,
                            "--scan-opacity": scanOpacity,
                            opacity: "var(--scan-opacity)",
                            pointerEvents: "none",
                          } as any
                        }
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 18%, rgba(212,175,55,1) 50%, rgba(212,175,55,0.35) 82%, transparent 100%)",
                            boxShadow:
                              "0 0 18px 2px rgba(212,175,55,0.7), 0 0 5px 1px rgba(212,175,55,1)",
                          }}
                        />
                        <div
                          className="absolute font-mono uppercase"
                          style={{
                            right: 8,
                            top: 4,
                            fontSize: "11px",
                            letterSpacing: "0.18em",
                            color: "#D4AF37",
                            background: "rgba(0,0,0,0.85)",
                            padding: "2px 8px",
                            border: "1px solid rgba(212,175,55,0.45)",
                          }}
                        >
                          RFID ACTIVE
                        </div>
                      </motion.div>

                      {/* ══ GARMENT LABELS (0.70–0.85) ══ */}
                      <motion.div
                        style={
                          {
                            position: "absolute",
                            left: 10,
                            right: 10,
                            bottom: 16,
                            zIndex: 32,
                            "--garment-opacity": garmentOpacity,
                            opacity: "var(--garment-opacity)",
                            y: garmentY,
                          } as any
                        }
                      >
                        <div
                          style={{
                            background: "rgba(6,6,6,0.88)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(212,175,55,0.28)",
                            padding: "10px 12px",
                          }}
                        >
                          {/* Header */}
                          <div
                            className="flex items-center justify-between font-mono uppercase"
                            style={{
                              fontSize: "11px",
                              letterSpacing: "0.16em",
                              color: "#D4AF37",
                              marginBottom: 8,
                              paddingBottom: 6,
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <span>CHAMBER INVENTORY</span>
                            <span style={{ color: "#6E6D6D" }}>
                              {TOTAL_GARMENTS} ITEMS
                            </span>
                          </div>

                          {/* Garment names */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 3,
                            }}
                          >
                            {GARMENT_ITEMS.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "4px 6px",
                                  background: "rgba(255,255,255,0.02)",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                }}
                              >
                                <div
                                  aria-hidden
                                  style={{
                                    width: 8,
                                    height: 8,
                                    flexShrink: 0,
                                    background: item.color,
                                    border: "1px solid rgba(212,175,55,0.25)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "#E7E5E4",
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div
                            className="flex items-center justify-between font-mono uppercase"
                            style={{
                              fontSize: "11px",
                              letterSpacing: "0.14em",
                              color: "#6E6D6D",
                              marginTop: 6,
                              paddingTop: 6,
                              borderTop: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <span>AWAITING INVENTORY</span>
                            <span style={{ color: "#D4AF37" }}>SYSTEM READY</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Bottom frame footer — no invented labels */}
                      <div
                        aria-hidden
                        className="absolute bottom-0 left-0 right-0 font-mono uppercase flex items-center justify-between"
                        style={{
                          zIndex: 15,
                          padding: "5px 10px",
                          background: "rgba(0,0,0,0.8)",
                          backdropFilter: "blur(8px)",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          fontSize: "11px",
                          letterSpacing: "0.16em",
                          color: "#6E6D6D",
                        }}
                      >
                        <span>AXIOM</span>
                        <span style={{ color: "#D4AF37" }}>SYSTEM READY</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </div>

          {/* ── SCROLL INDICATOR ── */}
          <motion.div
            style={
              {
                "--scroll-ind-opacity": scrollIndOpacity,
                opacity: "var(--scroll-ind-opacity)",
              } as any
            }
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
            aria-hidden
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "rgba(110,109,109,0.65)",
              }}
            >
              SCROLL TO OPEN
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronDown size={12} style={{ color: "#D4AF37" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* end sticky */}
    </section>
  );
}
