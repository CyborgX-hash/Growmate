import prisma from "../services/dbService.js";
import { classifyPlantLeaf } from "../services/plantVisionService.js";

export async function diagnoseLeafImage(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const plantId = req.body.plantId || null;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No leaf image uploaded. Please upload a JPEG, PNG, or WebP image."
      });
    }

    const garden = await prisma.garden.findFirst({ where: { guestId } });
    const scanMode = req.body.scanMode || "leaf_health";
    const manualCropHint = req.body.crop || req.body.plantName || null;

    let cropHint = manualCropHint;
    if (plantId) {
      const plant = await prisma.plant.findUnique({ where: { id: plantId } });
      if (plant) {
        cropHint = `${plant.name} ${plant.species || ""}`;
      }
    }

    // Run PlantVision / Flower inference
    const result = await classifyPlantLeaf(req.file.buffer, req.file.mimetype, cropHint, scanMode);

    // Save diagnosis record
    const diagnosis = await prisma.diagnosis.create({
      data: {
        gardenId: garden ? garden.id : null,
        plantId: plantId || null,
        imageUrl: null, // We do not store raw binary images permanently for privacy & storage efficiency
        predictedClass: result.predictedClass,
        confidenceScore: result.confidenceScore,
        plainExplanation: result.plainExplanation,
        cautiousNextSteps: JSON.stringify(result.cautiousNextSteps),
        supportedClassesCount: result.supportedClassesCount || 38,
        isSimulatedFallback: result.isSimulatedFallback || false,
        rawInferenceData: result.rawInferenceData || null
      }
    });

    // If plant exists, update status if severe disease detected
    if (plantId && !result.isHealthy) {
      await prisma.plant.update({
        where: { id: plantId },
        data: { status: "needs_care" }
      }).catch(() => {});
    }

    return res.json({
      success: true,
      data: {
        id: diagnosis.id,
        predictedClass: result.predictedClass,
        crop: result.crop,
        category: result.category || (scanMode === "flower_identify" ? "flower" : "foliage"),
        disease: result.disease,
        isHealthy: result.isHealthy,
        confidenceScore: result.confidenceScore,
        plainExplanation: result.plainExplanation,
        cautiousNextSteps: result.cautiousNextSteps,
        supportedClassesCount: result.supportedClassesCount,
        disclaimer: result.disclaimer,
        modelAttribution: result.modelAttribution,
        isSimulatedFallback: result.isSimulatedFallback || false,
        fallbackNotice: result.fallbackNotice || null,
        scanMode,
        createdAt: diagnosis.createdAt
      }
    });
  } catch (err) {
    if (err.code === "MISSING_CREDENTIALS") {
      return res.status(503).json({
        success: false,
        error: "Inference endpoint unavailable: Hugging Face API key is not configured or Python vision service is offline.",
        missingCredentials: true,
        setupGuide: "Set HUGGINGFACE_API_KEY in your backend .env file or start python-vision-service on port 8000."
      });
    }
    if (err.code === "TIMEOUT") {
      return res.status(504).json({
        success: false,
        error: "PlantVillage ViT model inference timed out. The provider endpoint may be cold-starting. Please retry in 10-20 seconds."
      });
    }
    next(err);
  }
}

export async function getDiagnosisHistory(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const garden = await prisma.garden.findFirst({ where: { guestId } });

    if (!garden) {
      return res.json({ success: true, data: [] });
    }

    const diagnoses = await prisma.diagnosis.findMany({
      where: { gardenId: garden.id },
      include: {
        plant: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const formatted = diagnoses.map(d => ({
      id: d.id,
      plantId: d.plantId,
      plantName: d.plant?.name || "General Leaf Scan",
      predictedClass: d.predictedClass,
      confidenceScore: d.confidenceScore,
      plainExplanation: d.plainExplanation,
      cautiousNextSteps: JSON.parse(d.cautiousNextSteps || "[]"),
      isSimulatedFallback: d.isSimulatedFallback,
      createdAt: d.createdAt
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
}
