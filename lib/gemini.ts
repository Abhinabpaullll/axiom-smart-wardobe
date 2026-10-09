/**
 * lib/gemini.ts
 *
 * Server-side abstraction for the Google Generative AI SDK.
 * Keys NEVER leave the server. All callers must run in a Node.js
 * route handler (no `runtime = "edge"`).
 *
 * Required env var: GEMINI_API_KEY
 */

import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

export const GEMINI_CONFIGURED = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set. Add it to your .env.local file.");
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Model used for multimodal (vision) and reasoning tasks.
 * gemini-3.5-flash is active and verified for multimodal image analysis.
 */
const VISION_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

/**
 * Returns a GenerativeModel configured for JSON output.
 */
export function getVisionModel(modelName = VISION_MODEL) {
  return getClient().getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json" },
  });
}

/**
 * Returns a GenerativeModel for text-only tasks.
 */
export function getTextModel(modelName = VISION_MODEL) {
  return getClient().getGenerativeModel({
    model: modelName,
  });
}

/**
 * Converts a base64 data-URL to a Gemini inline Part.
 * Strips the `data:<mime>;base64,` prefix.
 */
export function dataUrlToPart(dataUrl: string): Part {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL format.");
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
}
