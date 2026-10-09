import { NextResponse } from "next/server";
import { generateOutfit } from "@/lib/engine";
import type { WardrobeItem } from "@/lib/engine";
import wardrobeData from "@/data/wardrobe.json";

export const runtime = "edge";

const DEFAULT_WEATHER = 18;

function processRecommendation(formality: string, history: string[], temperature: number = DEFAULT_WEATHER) {
  const wardrobe = wardrobeData as WardrobeItem[];
  const result = generateOutfit(wardrobe, formality, temperature, history);

  if (!result) {
    return NextResponse.json(
      {
        error: "Chamber configuration could not generate an outfit matching these criteria.",
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
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formality = searchParams.get("formality") || "smart-casual";
  const tempParam = searchParams.get("temperature") || searchParams.get("temp");
  const temperature = tempParam ? parseFloat(tempParam) : DEFAULT_WEATHER;
  const historyRaw = searchParams.get("history") || "";
  const history = historyRaw ? historyRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return processRecommendation(formality, history, temperature);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      formality = "smart-casual",
      history = [],
      temperature = DEFAULT_WEATHER,
    } = body as {
      formality?: string;
      history?: string[];
      temperature?: number;
    };
    return processRecommendation(formality, history, temperature);
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload format." },
      { status: 400 }
    );
  }
}
