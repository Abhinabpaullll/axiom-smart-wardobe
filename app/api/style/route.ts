import { NextResponse } from "next/server";
import { generateOutfit } from "@/lib/engine";
import type { WardrobeItem } from "@/lib/engine";
import wardrobeData from "@/data/wardrobe.json";

export const runtime = "edge";

const MOCK_WEATHER = 18; // °C — simulated sensor reading

function recommend(formality: string, history: string[]) {
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
    timestamp: Date.now(),
  });
}

/** GET /api/style?formality=smart-casual&history=top-01,bot-02 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formality = searchParams.get("formality") || "smart-casual";
  const historyRaw = searchParams.get("history") || "";
  const history = historyRaw ? historyRaw.split(",").map((s) => s.trim()) : [];
  return recommend(formality, history);
}

/** POST /api/style { formality, history } */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formality = "smart-casual", history = [] } = body as {
      formality: string;
      history: string[];
    };
    return recommend(formality, history);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
