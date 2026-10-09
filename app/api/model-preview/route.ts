import { NextResponse } from "next/server";
import { isGeminiConfigured, getTextModel } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import type { WardrobeItem } from "@/lib/engine";

// Node.js runtime — Gemini SDK requires Node.js APIs
export const runtime = "nodejs";

/** Maximum request body size: 1 MB */
const MAX_BODY_BYTES = 1_024 * 1_024;

export interface GarmentRecord {
  id: string;
  name: string;
  color: string;
  category: string;
  image?: string; // data-URL or absolute URL; may be absent
}

export async function POST(request: Request) {
  // --- Rate limit: 20 req/min per IP ---
  const ip = getClientIp(request);
  const rl = checkRateLimit(`model-preview:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before requesting another preview." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  // --- Body size guard ---
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 });
  }

  let garments: GarmentRecord[];
  try {
    const body = await request.json();
    garments = body.garments;
    if (!Array.isArray(garments) || garments.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request: garments array required." }, { status: 400 });
  }

  // --- If provider not configured, return honest state ---
  if (!isGeminiConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "MODEL PREVIEW NOT CONFIGURED",
      provider: "Google Gemini",
      envVar: "GEMINI_API_KEY",
      garments,
    });
  }

  // --- AI model preview generation ---
  // The actual try-on model (imagen-3 or specialized VTO) requires a different
  // endpoint. Here we use Gemini to generate a vivid scene description of the
  // outfit worn on an editorial model — the description is rendered client-side
  // as a styled text card. When a dedicated image-generation provider is
  // configured (e.g. Imagen on Vertex AI), swap this for an image call.

  const garmentList = garments
    .map((g) => `• ${g.category.toUpperCase()}: ${g.name} (${g.color})`)
    .join("\n");

  const prompt = `You are an editorial fashion director for a luxury menswear brand.
Based ONLY on these exact wardrobe pieces (do not invent other garments):
${garmentList}

Write a single short editorial model preview in 2–3 sentences (max 60 words total).
Describe how these exact pieces look together on a model in an editorial setting.
Use vivid but restrained language. Never mention specific measurements or percentages.
Return a raw JSON object: { "preview": "<your description>" }`;

  try {
    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse — model is configured for text, so extract JSON manually
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Malformed model response");
    const parsed: { preview: string } = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      configured: true,
      preview: parsed.preview,
      garments,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Model preview generation failed.", detail: msg },
      { status: 500 }
    );
  }
}

// Prevent accidental GET with a clear message
export async function GET() {
  return NextResponse.json(
    { error: "POST only. Send { garments: [{ id, name, color, category, image? }] }" },
    { status: 405 }
  );
}
