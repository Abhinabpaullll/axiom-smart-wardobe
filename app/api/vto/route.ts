import { NextResponse } from "next/server";
import { isGeminiConfigured, getVisionModel, dataUrlToPart } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Node.js runtime — Gemini SDK requires Node.js APIs
export const runtime = "nodejs";

/** Maximum body: 10 MB (user photo + garment images) */
const MAX_BODY_BYTES = 10 * 1024 * 1024;

/**
 * IMPORTANT — VTO Rendering Scope
 *
 * Gemini 2.0 Flash is a multimodal UNDERSTANDING model, NOT a dedicated
 * image-generation / virtual try-on model. It cannot reliably composite
 * clothing onto a person photo.
 *
 * Dedicated virtual try-on models that CAN render garments on a person:
 *   - Google Imagen 3 with "virtual try-on" mode (Vertex AI, allowlisted preview)
 *   - Fashn.ai API (fashn.ai)
 *   - Kling AI Virtual Try-On (via replicate)
 *
 * Until one of those is configured, this route returns a NOT_CONFIGURED
 * state with an honest description, so the UI can show the correct fallback.
 *
 * If you configure one of the above, set the provider-specific env var
 * (e.g. FASHN_API_KEY) and swap the placeholder block below.
 */

export interface VTORequest {
  /** User photo as base64 data URL */
  photo: string;
  /** Garment images as base64 data URLs (indexed by slot) */
  garmentImages: Record<string, string>;
  /** Metadata about selected garments */
  garments: Array<{ id: string; name: string; category: string; color: string }>;
  /** Which slots to apply (tops/bottoms only for most providers) */
  slotsToApply: string[];
}

export async function POST(request: Request) {
  // --- Rate limit: 5 req/min per IP ---
  const ip = getClientIp(request);
  const rl = checkRateLimit(`vto:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  // --- Body size guard ---
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request too large. Maximum is 10 MB." },
      { status: 413 }
    );
  }

  let body: VTORequest;
  try {
    body = await request.json();
    if (!body.photo || !body.garments?.length) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "Invalid request: photo and garments required." },
      { status: 400 }
    );
  }

  // --- Provider check ---
  if (!isGeminiConfigured()) {
    return NextResponse.json({
      configured: false,
      renderCapable: false,
      message: "VTO NOT CONFIGURED",
      provider: "Google Gemini / Fashn.ai / Kling AI",
      envVar: "GEMINI_API_KEY (analysis only) | FASHN_API_KEY (full render)",
      note: "Dedicated virtual try-on rendering (garment compositing on person photo) requires a specialized provider such as Fashn.ai or Kling AI. Gemini handles outfit understanding only.",
    });
  }

  // --- Check if a dedicated VTO render provider is configured ---
  const hasVTORenderProvider =
    Boolean(process.env.FASHN_API_KEY) || Boolean(process.env.KLING_API_KEY);

  if (!hasVTORenderProvider) {
    // Gemini is configured but no render provider — return honest state
    return NextResponse.json({
      configured: true,
      renderCapable: false,
      message: "VTO RENDER PROVIDER NOT CONFIGURED",
      provider: "Fashn.ai or Kling AI",
      envVars: ["FASHN_API_KEY", "KLING_API_KEY"],
      note: "Gemini 2.0 Flash handles outfit analysis only. For full garment compositing on your photo, configure FASHN_API_KEY (fashn.ai) or KLING_API_KEY (Kling AI virtual try-on).",
    });
  }

  // ---------------------------------------------------------------
  // Placeholder: swap the block below for your chosen VTO provider.
  // The prompt constraints below MUST be sent to any provider:
  //
  //   "ONLY use the supplied garments, do not invent clothing,
  //    change only the specified garments,
  //    preserve the person's identity, body, pose, and background."
  //
  // Slots that can typically be rendered by try-on models: TOP, BOTTOM.
  // Shoes and accessories are generally NOT reliably composited.
  // ---------------------------------------------------------------

  return NextResponse.json({
    configured: true,
    renderCapable: false,
    message: "VTO render provider placeholder — implement provider integration here.",
    slotsRenderable: ["top", "bottom"],
    slotsNotRenderable: ["shoes", "accessory"],
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "POST only. Send { photo, garmentImages, garments, slotsToApply }" },
    { status: 405 }
  );
}
