import prisma from "../services/dbService.js";
import { generateGardenPlan } from "../services/gardenPlannerService.js";

export async function createGardenPlan(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const customParams = req.body || {};

    let garden = await prisma.garden.findFirst({ where: { guestId } });
    if (!garden) {
      garden = await prisma.garden.create({
        data: {
          guestId,
          name: customParams.name || "My Garden",
          gardenType: customParams.gardenType || "balcony",
          spaceSize: customParams.spaceSize || "Small Balcony",
          sunlightHours: customParams.sunlightHours ? Number(customParams.sunlightHours) : 4,
          soilType: customParams.soilType || "Potting Mix",
          experienceLevel: customParams.experienceLevel || "beginner",
          interests: customParams.interests || "herbs,vegetables",
          climate: customParams.climate || "Temperate"
        }
      });
    }

    const gardenInput = {
      name: customParams.name || garden.name,
      gardenType: customParams.gardenType || garden.gardenType,
      spaceSize: customParams.spaceSize || garden.spaceSize,
      sunlightHours: customParams.sunlightHours !== undefined ? Number(customParams.sunlightHours) : garden.sunlightHours,
      soilType: customParams.soilType || garden.soilType,
      experienceLevel: customParams.experienceLevel || garden.experienceLevel,
      interests: customParams.interests || garden.interests,
      climate: customParams.climate || garden.climate
    };

    const planResult = await generateGardenPlan(gardenInput);

    // Save to database
    const savedPlan = await prisma.gardenPlan.create({
      data: {
        gardenId: garden.id,
        rawPrompt: JSON.stringify(gardenInput),
        planJson: JSON.stringify(planResult.plan),
        isFallback: planResult.isFallback,
        modelAttribution: planResult.modelAttribution
      }
    });

    return res.json({
      success: true,
      data: {
        id: savedPlan.id,
        plan: planResult.plan,
        isFallback: planResult.isFallback,
        fallbackReason: planResult.fallbackReason || null,
        modelAttribution: planResult.modelAttribution,
        createdAt: savedPlan.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getLatestPlan(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const garden = await prisma.garden.findFirst({ where: { guestId } });

    if (!garden) {
      return res.json({ success: true, data: null });
    }

    const plan = await prisma.gardenPlan.findFirst({
      where: { gardenId: garden.id },
      orderBy: { createdAt: "desc" }
    });

    if (!plan) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        id: plan.id,
        plan: JSON.parse(plan.planJson),
        isFallback: plan.isFallback,
        modelAttribution: plan.modelAttribution,
        createdAt: plan.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Convenience endpoint to import recommended plants from a generated plan into the user's garden
 */
export async function adoptPlanPlants(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const { plants } = req.body;

    if (!Array.isArray(plants) || plants.length === 0) {
      return res.status(400).json({ success: false, error: "No plant list provided to adopt" });
    }

    const garden = await prisma.garden.findFirst({ where: { guestId } });
    if (!garden) {
      return res.status(404).json({ success: false, error: "Garden not found" });
    }

    const created = [];
    for (const p of plants) {
      const plant = await prisma.plant.create({
        data: {
          gardenId: garden.id,
          name: p.name,
          species: p.species || null,
          sunlightReq: p.sunlightReq || null,
          wateringFreqDays: 2,
          notes: `${p.whySuitable || ''} | Tip: ${p.careTip || ''}`.trim(),
          status: "healthy",
          lastWateredAt: new Date()
        }
      });

      // Add starter task
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 2);
      await prisma.careTask.create({
        data: {
          gardenId: garden.id,
          plantId: plant.id,
          title: `Initial check & water ${plant.name}`,
          taskType: "watering",
          dueDate
        }
      });

      created.push(plant);
    }

    return res.json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}
