/**
 * PlantVision ViT Classifier Service
 * Model: kimcomehome/plantvillage-vit-leaf-disease
 * Supports Hugging Face Inference API and optional local Python FastAPI microservice.
 */

import { formatDiagnosisResult } from "../utils/plantVillageClasses.js";

const VISION_MODEL_ID = process.env.VISION_MODEL_ID || "kimcomehome/plantvillage-vit-leaf-disease";
const VISION_API_URL = process.env.VISION_API_URL || `https://api-inference.huggingface.co/models/${VISION_MODEL_ID}`;
const PYTHON_VISION_SERVICE_URL = process.env.PYTHON_VISION_SERVICE_URL || "";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS || "20000", 10);

/**
 * Perform inference on image buffer
 * @param {Buffer} imageBuffer - Raw image buffer (JPEG/PNG/WebP)
 * @param {string} mimeType - MIME type of uploaded file
 */
export async function classifyPlantLeaf(imageBuffer, mimeType = "image/jpeg") {
  if (!imageBuffer || imageBuffer.length === 0) {
    throw new Error("EMPTY_IMAGE: No image data provided for classification.");
  }

  // Maximum 10MB check
  if (imageBuffer.length > 10 * 1024 * 1024) {
    throw new Error("IMAGE_TOO_LARGE: Image exceeds maximum allowed size of 10MB.");
  }

  // Option 1: Dedicated Python microservice if configured
  if (PYTHON_VISION_SERVICE_URL) {
    try {
      return await callPythonVisionService(imageBuffer, mimeType);
    } catch (err) {
      console.warn("Python vision microservice call failed, attempting fallback endpoint:", err.message);
    }
  }

  // Option 2: Hugging Face Inference API
  if (HUGGINGFACE_API_KEY) {
    return await callHuggingFaceVisionAPI(imageBuffer, mimeType);
  }

  // If no credentials or endpoints configured, report boundary clearly
  const err = new Error(
    "MISSING_VISION_CREDENTIALS: No Hugging Face API key or local Python vision service configured. " +
    "Please set HUGGINGFACE_API_KEY in .env or run python-vision-service on port 8000."
  );
  err.code = "MISSING_CREDENTIALS";
  throw err;
}

/**
 * Call Hugging Face ViT endpoint with binary image buffer
 */
async function callHuggingFaceVisionAPI(imageBuffer, mimeType) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(VISION_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": mimeType
      },
      body: imageBuffer,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 503) {
      const info = await response.json().catch(() => ({}));
      throw new Error(`Vision model is currently warming up on provider (estimated ${info.estimated_time || 20}s). Please retry shortly.`);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Vision model endpoint returned HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const predictions = await response.json();

    if (!Array.isArray(predictions) || predictions.length === 0) {
      throw new Error("Vision endpoint returned empty or malformed prediction list.");
    }

    // Sort by highest score
    const topPrediction = predictions.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    const rawLabel = topPrediction.label || "Unknown";
    const score = topPrediction.score || 0;

    const formatted = formatDiagnosisResult(rawLabel, score);
    formatted.isSimulatedFallback = false;
    formatted.modelAttribution = VISION_MODEL_ID;
    formatted.rawInferenceData = JSON.stringify(predictions.slice(0, 3));

    return formatted;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      const timeoutErr = new Error(`Vision model request timed out after ${TIMEOUT_MS}ms.`);
      timeoutErr.code = "TIMEOUT";
      throw timeoutErr;
    }
    throw err;
  }
}

/**
 * Call local Python vision microservice
 */
async function callPythonVisionService(imageBuffer, mimeType) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(PYTHON_VISION_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": mimeType
      },
      body: imageBuffer,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Python vision service returned status ${response.status}`);
    }

    const result = await response.json();
    const formatted = formatDiagnosisResult(result.label, result.confidence);
    formatted.isSimulatedFallback = false;
    formatted.modelAttribution = `${VISION_MODEL_ID} (local)`;
    return formatted;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
