import { NextResponse } from "next/server";
import { generateOutfit } from "@/lib/engine";
import type { WardrobeItem } from "@/lib/engine";
import wardrobeData from "@/data/wardrobe.json";

export const runtime = "edge";

const MOCK_WEATHER = 18; // °C — hardcoded sensor reading

/**
 * GET /api/recommend
 * Selects an outfit based on the hardcoded 18°C weather variable.
 * Accepts optional query params:
 *   - formality: "casual" | "smart-casual" | "formal" (default: "smart-casual")
 *   - history: comma-separated item IDs to exclude (last 3 worn)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formality = searchParams.get("formality") || "smart-casual";
  const historyRaw = searchParams.get("history") || "";
  const history = historyRaw ? historyRaw.split(",").map((s) => s.trim()) : [];

  const wardrobe = wardrobeData as WardrobeItem[];
  const outfit = generateOutfit(wardrobe, formality, MOCK_WEATHER, history);

  if (!outfit) {
    return NextResponse.json(
      {
        error: "No valid outfit found. Try a different formality or clear history.",
        weather: MOCK_WEATHER,
        timestamp: Date.now(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    outfit,
    weather: MOCK_WEATHER,
    formality,
    excludedIds: history,
    timestamp: Date.now(),
  });
}
