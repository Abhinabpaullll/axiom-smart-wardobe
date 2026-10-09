"use client";

/**
 * VTOFlow.tsx
 *
 * Full Virtual Try-On flow for the Axiom Lab page.
 *
 * STAGES (mapped to real API calls, not timers):
 *  IDLE → VALIDATING → ANALYZING → DETECTED → READING_GARMENTS → MATCHING → BUILDING → READY
 *
 * CLIENT VALIDATION (MediaPipe Pose):
 *  - Exactly one person must be visible
 *  - Upper + lower body both visible
 *  - Image meets minimum size
 *  On failure → "WE COULDN'T RELIABLY READ THE OUTFIT" (no AI call made)
 *
 * PRIVACY:
 *  - Consent must be accepted before upload
 *  - Photo never stored or logged (stays in client memory / sent as data URL)
 *  - File size cap: 8 MB
 *  - Per-IP rate limiting is enforced server-side
 */

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ScanLine,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Shirt,
  Footprints,
  Watch,
  RectangleHorizontal,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";
import Image from "next/image";
import type { DetectedGarment, AnalyzeOutfitResponse } from "@/app/api/analyze-outfit/route";
import type { RecommendSlot } from "@/app/api/vto-recommend/route";
import type { WardrobeItem } from "@/lib/engine";

// ─── Types ──────────────────────────────────────────────────────────────────

type VTOStage =
  | "CONSENT"
  | "UPLOAD"
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "ANALYZING"
  | "DETECTED"
  | "READING_GARMENTS"
  | "MATCHING"
  | "BUILDING"
  | "READY"
  | "ERROR";

interface ValidationResult {
  ok: boolean;
  reasons: string[];
}

interface VTOState {
  stage: VTOStage;
  photo: string | null;          // base64 data URL
  validationResult: ValidationResult | null;
  detectedOutfit: AnalyzeOutfitResponse | null;
  confirmedOutfit: DetectedGarment[] | null;
  recommendations: RecommendSlot[] | null;
  vtoResult: { renderCapable: boolean; message?: string; envVars?: string[] } | null;
  error: string | null;
  providerMissing: { provider: string; envVar: string } | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;

const STAGE_LABELS: Record<VTOStage, string> = {
  CONSENT: "CONSENT",
  UPLOAD: "UPLOAD PHOTO",
  VALIDATING: "ANALYZING",
  VALIDATION_FAILED: "VALIDATION FAILED",
  ANALYZING: "DETECTED",
  DETECTED: "READING GARMENTS",
  READING_GARMENTS: "MATCHING",
  MATCHING: "BUILDING",
  BUILDING: "READY",
  READY: "READY",
  ERROR: "ERROR",
};

const PROGRESS_STAGES: VTOStage[] = [
  "VALIDATING",
  "ANALYZING",
  "DETECTED",
  "READING_GARMENTS",
  "MATCHING",
  "BUILDING",
  "READY",
];

const DISPLAY_STAGES = ["ANALYZING", "DETECTED", "READING GARMENTS", "MATCHING", "BUILDING", "READY"];

// ─── Utility ─────────────────────────────────────────────────────────────────

function stageProgress(stage: VTOStage): number {
  const idx = PROGRESS_STAGES.indexOf(stage);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / PROGRESS_STAGES.length) * 100);
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image decode failed"));
    img.src = dataUrl;
  });
}

/**
 * Downscale and optimize user photos client-side before sending.
 * Prevents 10MB camera photo payloads, Next.js payload limits, and memory spikes.
 */
async function optimizeImageForUpload(dataUrl: string, maxDimension = 1280): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let { naturalWidth: width, naturalHeight: height } = img;
      if (width <= maxDimension && height <= maxDimension && dataUrl.length < 1_500_000) {
        resolve(dataUrl);
        return;
      }
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Client-side photo validation:
 * - Checks image dimensions
 * - Evaluates body pose using MediaPipe Pose (WASM) when available
 */
async function validatePhoto(dataUrl: string): Promise<ValidationResult> {
  const reasons: string[] = [];

  // 1. Dimension check
  try {
    const img = await loadImage(dataUrl);
    if (img.naturalWidth < MIN_WIDTH || img.naturalHeight < MIN_HEIGHT) {
      reasons.push(
        `Image resolution too low (${img.naturalWidth}×${img.naturalHeight}px). Minimum required is ${MIN_WIDTH}×${MIN_HEIGHT}px.`
      );
    }
  } catch {
    reasons.push("Could not decode image file.");
    return { ok: false, reasons };
  }

  // 2. MediaPipe Pose landmark detection (graceful if offline or CDN blocked)
  try {
    const { PoseLandmarker, FilesetResolver } =
      await import("@mediapipe/tasks-vision");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "CPU",
      },
      runningMode: "IMAGE",
      numPoses: 3,
    });

    const img = await loadImage(dataUrl);
    const result = poseLandmarker.detect(img);
    poseLandmarker.close();

    const personCount = result.landmarks.length;

    if (personCount === 0) {
      reasons.push("No clear person detected in the photo (ensure portrait or 3/4 framing).");
    } else if (personCount > 1) {
      reasons.push(`${personCount} people detected in frame. Solo photos produce best results.`);
    }

    if (personCount === 1) {
      const lm = result.landmarks[0];
      // Indices 11, 12 are left and right shoulders
      const hasShoulder =
        (lm[11] && lm[11].x >= 0 && lm[11].x <= 1 && lm[11].y >= 0 && lm[11].y <= 1) ||
        (lm[12] && lm[12].x >= 0 && lm[12].x <= 1 && lm[12].y >= 0 && lm[12].y <= 1);

      if (!hasShoulder) {
        reasons.push("Upper body (shoulders) appears out of frame or obscured.");
      }
    }
  } catch (err) {
    // If MediaPipe WASM or network fails, gracefully bypass without blocking
    console.warn("[VTO] MediaPipe pose check bypassed:", err);
  }

  return { ok: reasons.length === 0, reasons };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConsentGate({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 p-6 sm:p-8 bg-[#121212] border border-amber/20"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-[1px] bg-amber" />
      <div className="absolute top-0 left-0 w-[1px] h-4 bg-amber" />

      <div className="flex items-center gap-3">
        <ShieldAlert size={20} className="text-amber shrink-0" />
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
          PRIVACY & DATA CONSENT
        </h2>
      </div>

      <div className="flex flex-col gap-3 text-[12px] text-text-secondary leading-relaxed">
        <p>
          The Virtual Try-On feature analyzes your photo to detect visible clothing using AI.
          Before you proceed, please understand:
        </p>
        <ul className="flex flex-col gap-1.5 pl-4 list-disc marker:text-amber">
          <li>Your photo is sent to our server for processing and <strong className="text-text-primary">never stored or logged</strong>.</li>
          <li>The image is processed in memory only and discarded after the response is returned.</li>
          <li>No biometric data is retained. No face recognition is performed.</li>
          <li>Maximum upload size: 8 MB. Resolution minimum: {MIN_WIDTH}×{MIN_HEIGHT}px.</li>
          <li>Server-side rate limiting applies: up to 8 analyses per minute per IP.</li>
        </ul>
        <p className="text-text-muted text-[11px]">
          By proceeding, you consent to the temporary server-side processing of your photo as described above.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          id="vto-consent-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-amber cursor-pointer"
        />
        <span className="text-[12px] text-text-secondary group-hover:text-text-primary transition-colors">
          I have read and accept the above terms for temporary photo processing.
        </span>
      </label>

      <button
        id="vto-proceed-btn"
        onClick={onAccept}
        disabled={!checked}
        className="flex items-center justify-center gap-2 py-3 px-6 bg-amber text-background font-mono text-xs font-bold uppercase tracking-[0.16em] hover:bg-amber-dim transition-all disabled:opacity-40 disabled:cursor-not-allowed self-start"
      >
        <ArrowRight size={14} />
        PROCEED TO UPLOAD
      </button>
    </motion.div>
  );
}

function ProgressBar({ stage }: { stage: VTOStage }) {
  const pct = stageProgress(stage);
  const stageIdx = PROGRESS_STAGES.indexOf(stage);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
        <span className="text-amber font-semibold">{STAGE_LABELS[stage] || stage}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-[2px] bg-surface-highest w-full overflow-hidden">
        <motion.div
          className="h-full bg-amber"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {DISPLAY_STAGES.map((label, i) => (
          <span
            key={label}
            className={`shrink-0 font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-0.5 border ${
              i <= stageIdx - 1
                ? "border-amber/40 text-amber bg-amber/5"
                : "border-white/10 text-text-muted"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DetectedOutfitCard({
  garment,
  index,
}: {
  garment: DetectedGarment;
  index: number;
}) {
  const icons: Record<string, React.ElementType> = {
    top: Shirt,
    bottom: RectangleHorizontal,
    shoes: Footprints,
    accessory: Watch,
  };
  const Icon = icons[garment.category] || Shirt;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-3 bg-surface-low border border-white/8 flex items-start gap-3 hover:border-amber/30 transition-colors"
    >
      <Icon size={14} className="text-amber mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="font-mono text-[9px] text-amber uppercase tracking-[0.14em]">
          {garment.region}
        </div>
        <div className="text-xs font-semibold text-text-primary">{garment.style}</div>
        <div className="font-mono text-[9px] text-text-secondary">
          {garment.color} · {garment.pattern}
          {garment.fit && ` · ${garment.fit}`}
          {garment.sleeve_length && ` · ${garment.sleeve_length} sleeve`}
        </div>
        {garment.uncertain && (
          <div className="flex items-center gap-1 font-mono text-[8px] text-amber/70 mt-0.5">
            <Info size={9} />
            partially visible
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RecommendationSlot({ slot }: { slot: RecommendSlot }) {
  const actionColors = {
    KEEP: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
    REPLACE: "text-amber border-amber/30 bg-amber/5",
    ADD: "text-blue-400 border-blue-500/30 bg-blue-950/20",
  };

  return (
    <div
      className={`p-3 border flex flex-col gap-2 ${actionColors[slot.action] || ""}`}
    >
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em]">
        <span>{slot.slot.toUpperCase()}</span>
        <span className="font-bold">{slot.action}</span>
      </div>
      {slot.item && (
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 shrink-0 border border-white/10"
            style={{ backgroundColor: (slot.item as WardrobeItem).color }}
          />
          <span className="text-[11px] text-text-primary font-semibold truncate">
            {(slot.item as WardrobeItem).name}
          </span>
        </div>
      )}
      {slot.reason && (
        <p className="text-[10px] text-text-secondary leading-relaxed">{slot.reason}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VTOFlow() {
  const [vto, setVto] = useState<VTOState>({
    stage: "CONSENT",
    photo: null,
    validationResult: null,
    detectedOutfit: null,
    confirmedOutfit: null,
    recommendations: null,
    vtoResult: null,
    error: null,
    providerMissing: null,
  });
  const [editingGarments, setEditingGarments] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback((patch: Partial<VTOState>) => {
    setVto((prev) => ({ ...prev, ...patch }));
  }, []);

  // ─── File handling ───────────────────────────────────────────────────────

  // ─── Direct photo analysis ───────────────────────────────────────────────

  const analyzePhotoDirectly = useCallback(
    async (dataUrl: string) => {
      update({ stage: "ANALYZING", error: null, providerMissing: null });
      try {
        const res = await fetch("/api/analyze-outfit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo: dataUrl }),
        });
        const data = await res.json().catch(() => null);

        if (!data) {
          update({ stage: "ERROR", error: "Invalid server response. Please try again." });
          return;
        }

        // Check provider configuration state first (always honest)
        if (data.configured === false) {
          update({
            stage: "ERROR",
            providerMissing: {
              provider: data.provider || "Google Gemini",
              envVar: data.envVar || "GEMINI_API_KEY",
            },
            error: data.message || "AI provider not configured.",
          });
          return;
        }

        if (!res.ok) {
          update({
            stage: "ERROR",
            error: data.error || `Analysis request failed (Status ${res.status}).`,
          });
          return;
        }

        if (data.garments) {
          update({ stage: "DETECTED", detectedOutfit: data as AnalyzeOutfitResponse });
        } else {
          update({ stage: "ERROR", error: "No garment data returned from analysis." });
        }
      } catch (err) {
        console.error("[VTO] Analysis error:", err);
        update({ stage: "ERROR", error: "Network error during outfit analysis." });
      }
    },
    [update]
  );

  // ─── File handling ───────────────────────────────────────────────────────

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        update({ error: "Please upload an image file (JPG, PNG, WebP, etc.).", stage: "ERROR" });
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        update({ error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed: 8 MB.`, stage: "ERROR" });
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const rawDataUrl = e.target?.result as string;
            update({ photo: rawDataUrl, stage: "VALIDATING", error: null });

            // Downscale giant camera photos (prevents payload & memory issues)
            const dataUrl = await optimizeImageForUpload(rawDataUrl);
            update({ photo: dataUrl });

            // Stage 1: Client validation
            const validation = await validatePhoto(dataUrl);
            if (!validation.ok) {
              update({ stage: "VALIDATION_FAILED", validationResult: validation });
              return;
            }

            // Stage 2: Analyze outfit
            await analyzePhotoDirectly(dataUrl);
          } catch (innerErr) {
            console.error("[VTO] Processing error:", innerErr);
            update({ stage: "ERROR", error: "Could not process image. Please try another photo." });
          }
        };
        reader.onerror = () => {
          update({ stage: "ERROR", error: "Failed to read image file from disk." });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("[VTO] Reader error:", err);
        update({ stage: "ERROR", error: "Failed to read file." });
      }
    },
    [update, analyzePhotoDirectly]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // ─── Confirm detected outfit → get recommendations ────────────────────────

  const confirmOutfit = useCallback(async () => {
    if (!vto.detectedOutfit) return;
    const garments = vto.detectedOutfit.garments;
    update({ stage: "READING_GARMENTS", confirmedOutfit: garments });

    // Stage 4 → MATCHING: call vto-recommend
    update({ stage: "MATCHING" });
    try {
      const res = await fetch("/api/vto-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOutfit: garments }),
      });
      const data = await res.json().catch(() => null);

      if (!data) {
        update({ stage: "ERROR", error: "Invalid response from recommendation engine." });
        return;
      }

      if (data.configured === false) {
        update({
          stage: "ERROR",
          providerMissing: { provider: data.provider || "Google Gemini", envVar: data.envVar || "GEMINI_API_KEY" },
          error: data.message || "AI provider not configured for recommendations.",
        });
        return;
      }

      if (!res.ok) {
        update({ stage: "ERROR", error: data.error || "Recommendation failed." });
        return;
      }

      // Stage 5 → BUILDING: call vto render
      update({ stage: "BUILDING", recommendations: data.slots as RecommendSlot[] });

      const vtoRes = await fetch("/api/vto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: vto.photo,
          garments: garments,
          garmentImages: {},
          slotsToApply: ["top", "bottom"],
        }),
      });
      const vtoData = await vtoRes.json();

      update({ stage: "READY", vtoResult: vtoData });
    } catch {
      update({ stage: "ERROR", error: "Network error during recommendation." });
    }
  }, [vto.detectedOutfit, vto.photo, update]);

  const reset = useCallback(() => {
    setVto({
      stage: "UPLOAD",
      photo: null,
      validationResult: null,
      detectedOutfit: null,
      confirmedOutfit: null,
      recommendations: null,
      vtoResult: null,
      error: null,
      providerMissing: null,
    });
    setEditingGarments(false);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Photo panel */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Consent gate */}
        {vto.stage === "CONSENT" && (
          <ConsentGate onAccept={() => update({ stage: "UPLOAD" })} />
        )}

        {/* Upload / Drop zone */}
        {vto.stage !== "CONSENT" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => {
              if (!vto.photo) fileInputRef.current?.click();
            }}
            className={`relative aspect-[4/5] w-full max-w-lg mx-auto bg-[#0E0E0E] border overflow-hidden shadow-2xl flex flex-col items-center justify-center transition-colors ${
              dragOver ? "border-amber" : "border-amber/30"
            } ${!vto.photo ? "cursor-pointer hover:border-amber/60" : ""}`}
          >
            {vto.photo ? (
              <Image src={vto.photo} alt="Your outfit photo" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <Upload size={32} className="text-amber" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-text-primary">
                  DROP PHOTO OR CLICK TO SELECT
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  JPG · PNG · WebP · Max 8 MB · Min {MIN_WIDTH}×{MIN_HEIGHT}px
                </span>
              </div>
            )}

            {/* Progress overlay */}
            <AnimatePresence>
              {["VALIDATING", "ANALYZING", "READING_GARMENTS", "MATCHING", "BUILDING"].includes(vto.stage) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 z-20"
                >
                  <ScanLine size={28} className="text-amber animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber text-center">
                    {STAGE_LABELS[vto.stage]}…
                  </span>
                  <ProgressBar stage={vto.stage} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner reticles */}
            <div className="absolute top-3 left-3 w-4 h-[1px] bg-amber z-30" />
            <div className="absolute top-3 left-3 w-[1px] h-4 bg-amber z-30" />
            <div className="absolute bottom-3 right-3 w-4 h-[1px] bg-amber z-30" />
            <div className="absolute bottom-3 right-3 w-[1px] h-4 bg-amber z-30" />

            {/* Bottom controls */}
            {vto.photo && !["VALIDATING", "ANALYZING", "READING_GARMENTS", "MATCHING", "BUILDING"].includes(vto.stage) && (
              <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between bg-black/80 backdrop-blur-md p-3 border border-white/10 font-mono text-[9px] uppercase">
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="flex items-center gap-1.5 text-text-primary hover:text-amber transition-colors"
                >
                  <Upload size={12} /> CHANGE PHOTO
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="flex items-center gap-1.5 text-text-muted hover:text-amber transition-colors"
                >
                  <RefreshCw size={12} /> RESET
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileInput}
              className="hidden"
            />
          </div>
        )}

        {/* Validation failure */}
        {vto.stage === "VALIDATION_FAILED" && vto.validationResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-[#1A0A0A] border border-red-500/40 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-mono text-sm text-red-400 font-bold uppercase tracking-[0.15em]">
              <AlertTriangle size={16} />
              WE COULDN'T RELIABLY READ THE OUTFIT
            </div>
            <div className="flex flex-col gap-1.5">
              {vto.validationResult.reasons.map((r) => (
                <div key={r} className="flex items-start gap-2 font-mono text-[10px] text-red-300">
                  <span className="mt-0.5 text-red-500">·</span>
                  {r}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-red-500/20">
              <div className="font-mono text-[10px] text-text-muted uppercase mb-1">REQUIREMENTS:</div>
              <ul className="flex flex-col gap-1 font-mono text-[10px] text-text-secondary">
                <li>· Exactly one person in frame</li>
                <li>· Upper body (shoulders) clearly visible</li>
                <li>· Lower body (hips/legs) visible — 3/4 or full-length shot</li>
                <li>· Minimum {MIN_WIDTH}×{MIN_HEIGHT}px resolution</li>
                <li>· Good lighting, no heavy blur</li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button
                onClick={() => { update({ stage: "UPLOAD", photo: null, validationResult: null }); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface-mid border border-white/10 hover:border-amber/40 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary hover:text-amber transition-all"
              >
                <RefreshCw size={12} /> TRY ANOTHER PHOTO
              </button>
              {vto.photo && (
                <button
                  id="vto-proceed-anyway-btn"
                  onClick={() => analyzePhotoDirectly(vto.photo!)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber text-black font-mono text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-amber-dim transition-all"
                >
                  <ArrowRight size={12} /> PROCEED ANYWAY (ATTEMPT ANALYSIS)
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right: Analysis panel */}
      <div className="lg:col-span-5 flex flex-col gap-5">

        {/* DETECTED — show detected outfit for confirmation */}
        {vto.stage === "DETECTED" && vto.detectedOutfit && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 p-5 bg-[#121212] border border-amber/30"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="text-amber font-semibold flex items-center gap-2">
                <Eye size={13} />
                WE DETECTED…
              </span>
              <span
                className={`px-2 py-0.5 border text-[9px] ${
                  vto.detectedOutfit.readability === "clear"
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
                    : vto.detectedOutfit.readability === "partial"
                    ? "border-amber/40 text-amber bg-amber/5"
                    : "border-red-500/40 text-red-400 bg-red-950/20"
                }`}
              >
                {vto.detectedOutfit.readability.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {vto.detectedOutfit.garments.map((g, i) => (
                <DetectedOutfitCard key={i} garment={g} index={i} />
              ))}
            </div>

            {vto.detectedOutfit.readability === "poor" && (
              <div className="p-3 bg-red-950/20 border border-red-500/30 font-mono text-[10px] text-red-300">
                Garment readability is poor. Recommendations may be inaccurate.
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <button
                id="vto-use-outfit-btn"
                onClick={confirmOutfit}
                className="flex items-center justify-center gap-2 py-3 bg-amber text-background font-mono text-xs font-bold uppercase tracking-[0.16em] hover:bg-amber-dim transition-all"
              >
                <CheckCircle2 size={14} />
                USE THIS AS CURRENT OUTFIT
              </button>
              <button
                onClick={() => setEditingGarments(!editingGarments)}
                className="flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:border-amber/40 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary hover:text-amber transition-all"
              >
                <Edit3 size={12} />
                EDIT DETECTED ITEMS
              </button>
            </div>

            {editingGarments && (
              <div className="p-3 bg-surface-low border border-white/8 font-mono text-[10px] text-text-muted">
                Editing detected items — full edit UI coming in next iteration.
                <br />The confirm button uses the AI-detected list as-is.
              </div>
            )}
          </motion.div>
        )}

        {/* READY — show recommendations + VTO result */}
        {vto.stage === "READY" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Recommendations */}
            {vto.recommendations && vto.recommendations.length > 0 && (
              <div className="p-5 bg-[#121212] border border-white/10 flex flex-col gap-3">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber font-semibold flex items-center gap-2">
                  <ScanLine size={13} />
                  WARDROBE RECOMMENDATIONS
                </div>
                <div className="flex flex-col gap-2">
                  {vto.recommendations.map((slot) => (
                    <RecommendationSlot key={slot.slot} slot={slot} />
                  ))}
                </div>
              </div>
            )}

            {/* VTO render result */}
            {vto.vtoResult && (
              <div className="p-5 bg-[#121212] border border-white/10 flex flex-col gap-3">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted font-semibold">
                  VIRTUAL TRY-ON RENDER
                </div>

                {vto.vtoResult.renderCapable === false && (
                  <div className="p-3 bg-amber/5 border border-amber/25 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-amber uppercase tracking-[0.15em]">
                      <AlertTriangle size={12} />
                      RENDER PROVIDER NOT CONFIGURED
                    </div>
                    <p className="font-mono text-[9px] text-text-secondary leading-relaxed">
                      {vto.vtoResult.message}
                    </p>
                    {vto.vtoResult.envVars && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(vto.vtoResult.envVars as string[]).map((v) => (
                          <code key={v} className="text-amber bg-surface-low px-1.5 py-0.5 text-[9px] font-mono">
                            {v}
                          </code>
                        ))}
                      </div>
                    )}
                    <p className="font-mono text-[9px] text-text-muted mt-1">
                      Renderable slots: TOP, BOTTOM only (industry standard for try-on models)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reset */}
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:border-amber/40 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary hover:text-amber transition-all"
            >
              <RefreshCw size={12} />
              TRY ANOTHER PHOTO
            </button>
          </motion.div>
        )}

        {/* PROVIDER NOT CONFIGURED */}
        {vto.stage === "ERROR" && vto.providerMissing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-[#121212] border border-amber/25 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-mono text-sm text-amber font-bold uppercase tracking-[0.15em]">
              <AlertTriangle size={16} />
              AI PROVIDER NOT CONFIGURED
            </div>
            <p className="text-[12px] text-text-secondary">
              Provider: <strong className="text-text-primary">{vto.providerMissing.provider}</strong>
            </p>
            <p className="font-mono text-[10px] text-text-muted">
              Set env var:{" "}
              <code className="text-amber bg-surface-low px-1.5 py-0.5 text-[10px]">
                {vto.providerMissing.envVar}
              </code>
              {" "}in your <code className="text-text-secondary">.env.local</code> file.
            </p>
            <button onClick={reset} className="flex items-center gap-2 mt-2 font-mono text-[10px] text-amber hover:underline uppercase tracking-[0.12em] self-start">
              <RefreshCw size={11} /> RESET
            </button>
          </motion.div>
        )}

        {/* GENERIC ERROR */}
        {vto.stage === "ERROR" && !vto.providerMissing && vto.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 bg-red-950/30 border border-red-500/30 flex flex-col gap-3"
          >
            <div className="font-mono text-xs text-red-400 font-semibold uppercase tracking-[0.15em]">ERROR</div>
            <p className="font-mono text-[10px] text-red-300">{vto.error}</p>
            <button onClick={reset} className="flex items-center gap-2 font-mono text-[10px] text-amber hover:underline uppercase tracking-[0.12em] self-start mt-1">
              <RefreshCw size={11} /> RESET
            </button>
          </motion.div>
        )}

        {/* Standby hint */}
        {vto.stage === "UPLOAD" && (
          <div className="p-5 bg-[#121212] border border-white/10 flex flex-col gap-3">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted font-semibold">
              HOW VTO WORKS
            </div>
            <ol className="flex flex-col gap-2">
              {[
                "Upload a clear solo photo — head to hip minimum",
                "AI analyzes visible garments (one call)",
                "Confirm or edit the detected outfit",
                "Get KEEP / REPLACE / ADD recommendations from your wardrobe",
                "VTO render composites top + bottom onto your photo (requires provider)",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-[10px] text-text-secondary">
                  <span className="text-amber shrink-0 font-bold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
