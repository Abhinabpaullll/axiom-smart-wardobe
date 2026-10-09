import { NextResponse } from "next/server";
import { generateOutfit } from "@/lib/engine";
import type { WardrobeItem } from "@/lib/engine";
import wardrobeData from "@/data/wardrobe.json";

export const runtime = "edge";

/**
 * GET /api/recommend
 * 
 * Optimized recommendation endpoint for Axiom Smart Wardrobe.
 * Evaluates ambient chamber temperature (default: 18°C), formality, and enforces
 * the 3-day non-repeat protocol across RFID-tracked garments.
 * 
 * Query Params:
 *   - temperature: number (°C, default 18)
 *   - formality: "casual" | "smart-casual" | "formal" (default "smart-casual")
 *   - history: comma-separated list of recently worn item IDs
 * 
 * Response: <50ms execution with 4-piece outfit object and telemetry.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tempParam = searchParams.get("temperature") || searchParams.get("temp");
  const temperature = tempParam ? parseFloat(tempParam) : 18;
  const formality = searchParams.get("formality") || "smart-casual";
  const historyRaw = searchParams.get("history") || "";
  const history = historyRaw ? historyRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const wardrobe = wardrobeData as WardrobeItem[];
  const result = generateOutfit(wardrobe, formality, temperature, history);

  if (!result) {
    return NextResponse.json(
      {
        error: "Chamber configuration could not find matching garments for current parameters.",
        temperature,
        formality,
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...result,
    projectRef: "11456649540610009134",
    rfidActiveCount: wardrobe.filter((w) => w.status === "CHAMBER 01").length,
    totalWardrobeCount: wardrobe.length,
    timestamp: new Date().toISOString(),
  });
}
