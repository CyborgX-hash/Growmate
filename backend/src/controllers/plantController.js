import prisma from "../services/dbService.js";

export async function getPlants(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const garden = await prisma.garden.findFirst({ where: { guestId } });

    if (!garden) {
      return res.json({ success: true, data: [] });
    }

    const plants = await prisma.plant.findMany({
      where: { gardenId: garden.id },
      include: {
        careTasks: {
          where: { isCompleted: false },
          orderBy: { dueDate: "asc" }
        },
        diagnoses: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ success: true, data: plants });
  } catch (err) {
    next(err);
  }
}

export async function getPlantById(req, res, next) {
  try {
    const { id } = req.params;
    const plant = await prisma.plant.findUnique({
      where: { id },
      include: {
        careTasks: {
          orderBy: { dueDate: "asc" }
        },
        diagnoses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!plant) {
      return res.status(404).json({ success: false, error: "Plant not found" });
    }

    return res.json({ success: true, data: plant });
  } catch (err) {
    next(err);
  }
}

export async function createPlant(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const {
      name,
      species,
      variety,
      sunlightReq,
      wateringFreqDays = 2,
      notes,
      imageUrl,
      status = "healthy"
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, error: "Plant name is required" });
    }

    let garden = await prisma.garden.findFirst({ where: { guestId } });
    if (!garden) {
      garden = await prisma.garden.create({
        data: { guestId, name: "My Garden" }
      });
    }

    const plant = await prisma.plant.create({
      data: {
        gardenId: garden.id,
        name: name.trim(),
        species: species ? species.trim() : null,
        variety: variety ? variety.trim() : null,
        sunlightReq: sunlightReq || "4-6 hours direct sunlight",
        wateringFreqDays: Number(wateringFreqDays) || 2,
        notes: notes || null,
        imageUrl: imageUrl || null,
        status,
        lastWateredAt: new Date()
      }
    });

    // Auto-schedule first care tasks
    const nextWaterDate = new Date();
    nextWaterDate.setDate(nextWaterDate.getDate() + (Number(wateringFreqDays) || 2));

    await prisma.careTask.create({
      data: {
        gardenId: garden.id,
        plantId: plant.id,
        title: `Water ${plant.name}`,
        taskType: "watering",
        dueDate: nextWaterDate,
        notes: `Regular watering cycle (${wateringFreqDays} day interval)`
      }
    });

    const nextCheckDate = new Date();
    nextCheckDate.setDate(nextCheckDate.getDate() + 7);
    await prisma.careTask.create({
      data: {
        gardenId: garden.id,
        plantId: plant.id,
        title: `Inspect ${plant.name} foliage and growth`,
        taskType: "pest_check",
        dueDate: nextCheckDate,
        notes: "Check underside of leaves for hydration and healthy color."
      }
    });

    return res.status(201).json({ success: true, data: plant });
  } catch (err) {
    next(err);
  }
}

export async function updatePlant(req, res, next) {
  try {
    const { id } = req.params;
    const { name, species, variety, sunlightReq, wateringFreqDays, notes, status, lastWateredAt } = req.body;

    const updated = await prisma.plant.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(species !== undefined && { species }),
        ...(variety !== undefined && { variety }),
        ...(sunlightReq !== undefined && { sunlightReq }),
        ...(wateringFreqDays !== undefined && { wateringFreqDays: Number(wateringFreqDays) }),
        ...(notes !== undefined && { notes }),
        ...(status !== undefined && { status }),
        ...(lastWateredAt !== undefined && { lastWateredAt: new Date(lastWateredAt) })
      }
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deletePlant(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.plant.delete({
      where: { id }
    });

    return res.json({ success: true, message: "Plant deleted successfully" });
  } catch (err) {
    next(err);
  }
}
