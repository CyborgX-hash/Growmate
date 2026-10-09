/**
 * Gemma 3 4B IT Service Layer
 * Model: google/gemma-3-4b-it
 * Handles prompt formatting, remote inference calls, timeouts, bounded retries, and JSON extraction.
 */

const GEMMA_MODEL_ID = process.env.GEMMA_MODEL_ID || "google/gemma-3-4b-it";
const GEMMA_API_URL = process.env.GEMMA_API_URL || `https://api-inference.huggingface.co/models/${GEMMA_MODEL_ID}`;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS || "20000", 10);

/**
 * Clean and parse JSON from model output string
 */
export function extractJsonFromText(text) {
  if (!text || typeof text !== "string") return null;

  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch (_) {
    // Continue to regex extraction
  }

  // Extract from markdown ```json ... ``` blocks
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch (_) {}
  }

  // Extract first { ... } or [ ... ]
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {}
  }

  return null;
}

/**
 * Execute inference request to Gemma 3 4B IT endpoint with timeout & bounded retry
 */
export async function callGemmaInference(prompt, systemInstruction = "", maxRetries = 2) {
  if (!HUGGINGFACE_API_KEY) {
    const err = new Error("MISSING_API_KEY: Hugging Face API key is not configured for Gemma 3 4B IT inference.");
    err.code = "MISSING_API_KEY";
    throw err;
  }

  const combinedPrompt = systemInstruction 
    ? `<start_of_turn>user\n${systemInstruction}\n\n${prompt}<end_of_turn>\n<start_of_turn>model\n`
    : `<start_of_turn>user\n${prompt}<end_of_turn>\n<start_of_turn>model\n`;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(GEMMA_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: combinedPrompt,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.3,
            top_p: 0.9,
            return_full_text: false
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 503) {
        // Model loading on Hugging Face
        const data = await response.json().catch(() => ({}));
        const estimatedTime = data.estimated_time || 15;
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, Math.min(estimatedTime * 1000, 4000)));
          continue;
        }
        throw new Error(`Model is currently loading on provider endpoint (estimated ${estimatedTime}s).`);
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Inference endpoint returned HTTP ${response.status}: ${errorBody.slice(0, 200)}`);
      }

      const data = await response.json();
      let generatedText = "";

      if (Array.isArray(data) && data[0]?.generated_text) {
        generatedText = data[0].generated_text;
      } else if (typeof data === "object" && data.generated_text) {
        generatedText = data.generated_text;
      } else if (typeof data === "string") {
        generatedText = data;
      } else {
        generatedText = JSON.stringify(data);
      }

      return generatedText;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      if (err.name === "AbortError") {
        lastError = new Error(`Inference request timed out after ${TIMEOUT_MS}ms.`);
        lastError.code = "TIMEOUT";
      }
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
