import { NextResponse } from "next/server";
import { isGeminiConfigured, getTextModel } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import wardrobeData from "@/data/wardrobe.json";
import type { WardrobeItem } from "@/lib/engine";
import type { DetectedGarment } from "@/app/api/analyze-outfit/route";

// Node.js runtime — Gemini SDK requires Node.js APIs
export const runtime = "nodejs";

export interface RecommendSlot {
  slot: "top" | "bottom" | "shoes" | "accessory";
  action: "KEEP" | "REPLACE" | "ADD";
  /** Item from wardrobe if REPLACE or ADD; undefined for KEEP */
  item?: WardrobeItem;
  reason: string;
}

export interface VTORecommendResponse {
  slots: RecommendSlot[];
}

export async function POST(request: Request) {
  // --- Rate limit: 10 req/min per IP ---
  const ip = getClientIp(request);
  const rl = checkRateLimit(`vto-recommend:${ip}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let currentOutfit: DetectedGarment[];
  let formality: string | undefined;
  let temperature: number | undefined;

  try {
    const body = await request.json();
    currentOutfit = body.currentOutfit;
    formality = body.formality || "smart-casual";
    temperature = typeof body.temperature === "number" ? body.temperature : 18;
    if (!Array.isArray(currentOutfit) || currentOutfit.length === 0) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "Invalid request: currentOutfit array required." },
      { status: 400 }
    );
  }

  // --- Provider guard ---
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message: "VTO RECOMMEND NOT CONFIGURED",
        provider: "Google Gemini",
        envVar: "GEMINI_API_KEY",
      },
      { status: 200 }
    );
  }

  const wardrobe = wardrobeData as WardrobeItem[];

  // Build a compact wardrobe catalogue for the model
  const catalogue = wardrobe
    .map(
      (item) =>
        `  { "id": "${item.id}", "name": "${item.name}", "category": "${item.category}", "color": "${item.color}", "formality": "${item.formality}", "season": "${item.season}" }`
    )
    .join(",\n");

  const detectedList = currentOutfit
    .map((g) => `• ${g.region}: ${g.style} (${g.color}, ${g.pattern})`)
    .join("\n");

  const prompt = `You are a luxury wardrobe AI for Axiom Smart Wardrobe.

The user is currently wearing:
${detectedList}

Their preference:
- Formality: ${formality}
- Temperature: ${temperature}°C

Your task: For each of these slots — top, bottom, shoes, accessory — decide:
- KEEP: the current garment is already appropriate
- REPLACE: swap with a specific item from the wardrobe catalogue
- ADD: the slot is missing; pick from the catalogue

IMPORTANT: You may ONLY recommend items from this exact wardrobe catalogue. Do not invent items.
Catalogue:
[
${catalogue}
]

Return ONLY a valid JSON object:
{
  "slots": [
    {
      "slot": "top" | "bottom" | "shoes" | "accessory",
      "action": "KEEP" | "REPLACE" | "ADD",
      "itemId": "<id from catalogue, or null if KEEP>",
      "reason": "<one sentence, no percentages>"
    }
  ]
}`;

  try {
    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in model response");

    const parsed: {
      slots: Array<{ slot: string; action: string; itemId: string | null; reason: string }>;
    } = JSON.parse(jsonMatch[0]);

    const wardrobeMap = new Map(wardrobe.map((w) => [w.id, w]));

    const slots: RecommendSlot[] = parsed.slots.map((s) => ({
      slot: s.slot as RecommendSlot["slot"],
      action: s.action as RecommendSlot["action"],
      item: s.itemId ? wardrobeMap.get(s.itemId) : undefined,
      reason: s.reason,
    }));

    return NextResponse.json({ configured: true, slots });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "VTO recommendation failed.", detail: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "POST only. Send { currentOutfit, formality?, temperature? }" },
    { status: 405 }
  );
}
