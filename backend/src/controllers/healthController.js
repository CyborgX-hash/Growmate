import prisma from "../services/dbService.js";
import { SUPPORTED_PLANTS_LIST } from "../utils/plantVillageClasses.js";

export async function getHealthStatus(req, res) {
  let dbStatus = "connected";
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    await prisma.garden.count();
    dbLatencyMs = Date.now() - start;
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  const gemmaConfigured = Boolean(process.env.HUGGINGFACE_API_KEY);
  const visionConfigured = Boolean(process.env.HUGGINGFACE_API_KEY || process.env.PYTHON_VISION_SERVICE_URL);

  return res.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    app: "GrowMate Backend API",
    version: "1.0.0",
    theme: "Hacktoberfest 2026 - Touch Grass",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      provider: process.env.DATABASE_URL?.startsWith("file:") ? "SQLite (Local Dev)" : "MySQL (Hosted)"
    },
    aiEndpoints: {
      gemma: {
        modelId: process.env.GEMMA_MODEL_ID || "google/gemma-3-4b-it",
        isConfigured: gemmaConfigured,
        fallbackAvailable: true
      },
      visionClassifier: {
        modelId: process.env.VISION_MODEL_ID || "kimcomehome/plantvillage-vit-leaf-disease",
        isConfigured: visionConfigured,
        supportedClasses: 38,
        supportedCrops: SUPPORTED_PLANTS_LIST
      }
    }
  });
}
