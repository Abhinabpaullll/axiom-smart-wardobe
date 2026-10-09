import { NextResponse } from "next/server";
import { isGeminiConfigured, getVisionModel, dataUrlToPart } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Node.js runtime required for Gemini SDK
export const runtime = "nodejs";

/** Maximum body: 8 MB (photo + garment thumbnails) */
const MAX_BODY_BYTES = 8 * 1024 * 1024;

export interface DetectedGarment {
  region: string;                  // e.g. "upper body"
  category: string;                // "top" | "bottom" | "shoes" | "accessory"
  color: string;                   // descriptive, e.g. "navy blue"
  pattern: string;                 // "solid" | "striped" | "plaid" | …
  style: string;                   // e.g. "fitted crewneck t-shirt"
  fit?: string;                    // "slim" | "relaxed" | "oversized" — omit if unclear
  sleeve_length?: string;          // "short" | "long" | "none" — tops only
  uncertain?: boolean;             // true if partially visible/guessed
}

export interface AnalyzeOutfitResponse {
  readability: "clear" | "partial" | "poor";
  personCount: number;
  garments: DetectedGarment[];
}

const SCHEMA_INSTRUCTION = `
Return ONLY a valid JSON object matching this schema exactly (no markdown, no prose):
{
  "readability": "clear" | "partial" | "poor",
  "personCount": <number>,
  "garments": [
    {
      "region": "<string>",
      "category": "<string>",
      "color": "<string>",
      "pattern": "<string>",
      "style": "<string>",
      "fit": "<string — omit if uncertain>",
      "sleeve_length": "<string — omit if not applicable>",
      "uncertain": <true | false — omit if false>
    }
  ]
}
Rules:
- Omit any field you cannot reliably determine.
- Do NOT include numeric confidence values.
- Do NOT invent garments not visible in the image.
- personCount reflects exactly how many people are visible.
- readability = "clear" if one person fully visible from head to upper-thigh minimum, "partial" if body is cut off or lighting is poor, "poor" if garments cannot be distinguished.
`;

export async function POST(request: Request) {
  // --- Rate limit: 8 req/min per IP (vision calls are expensive) ---
  const ip = getClientIp(request);
  const rl = checkRateLimit(`analyze-outfit:${ip}`, 8, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before submitting another photo." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  // --- Body size guard ---
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Photo too large. Maximum allowed size is 8 MB." },
      { status: 413 }
    );
  }

  let photoDataUrl: string;
  try {
    const body = await request.json();
    photoDataUrl = body.photo;
    if (typeof photoDataUrl !== "string" || !photoDataUrl.startsWith("data:image/")) {
      throw new Error();
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request: photo (data URL) required." },
      { status: 400 }
    );
  }

  // --- Provider guard ---
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message: "ANALYZE OUTFIT NOT CONFIGURED",
        provider: "Google Gemini",
        envVar: "GEMINI_API_KEY",
      },
      { status: 200 }
    );
  }

  const prompt = `You are an expert fashion analyst AI.
Analyze the clothing worn by the person in this photo.
${SCHEMA_INSTRUCTION}`;

  try {
    const model = getVisionModel();
    const imagePart = dataUrlToPart(photoDataUrl);
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();

    // Extract JSON (responseMimeType=application/json usually gives clean JSON)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in model response");

    const parsed: AnalyzeOutfitResponse = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.readability || typeof parsed.personCount !== "number") {
      throw new Error("Response missing required fields");
    }

    return NextResponse.json({ configured: true, ...parsed });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Outfit analysis failed.", detail: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "POST only. Send { photo: '<data-URL>' }" },
    { status: 405 }
  );
}
