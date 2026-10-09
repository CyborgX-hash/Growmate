import prisma from "../services/dbService.js";

export async function getGarden(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";

    let garden = await prisma.garden.findFirst({
      where: { guestId },
      include: {
        plants: {
          orderBy: { createdAt: "desc" }
        },
        careTasks: {
          where: { isCompleted: false },
          orderBy: { dueDate: "asc" },
          take: 10
        },
        plans: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    if (!garden) {
      // Create initial starter garden
      garden = await prisma.garden.create({
        data: {
          guestId,
          name: "My Balcony Oasis",
          gardenType: "balcony",
          spaceSize: "Small Balcony (approx. 2x1m)",
          sunlightHours: 5,
          soilType: "Organic Potting Mix with Perlite",
          experienceLevel: "beginner",
          interests: "herbs,vegetables",
          climate: "Temperate"
        },
        include: {
          plants: true,
          careTasks: true,
          plans: true
        }
      });
    }

    return res.json({ success: true, data: garden });
  } catch (err) {
    next(err);
  }
}

export async function saveGarden(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const {
      name,
      location,
      gardenType,
      spaceSize,
      sunlightHours,
      soilType,
      experienceLevel,
      interests,
      climate
    } = req.body;

    const existing = await prisma.garden.findFirst({
      where: { guestId }
    });

    let garden;
    if (existing) {
      garden = await prisma.garden.update({
        where: { id: existing.id },
        data: {
          name: name ?? existing.name,
          location: location ?? existing.location,
          gardenType: gardenType ?? existing.gardenType,
          spaceSize: spaceSize ?? existing.spaceSize,
          sunlightHours: sunlightHours !== undefined ? Number(sunlightHours) : existing.sunlightHours,
          soilType: soilType ?? existing.soilType,
          experienceLevel: experienceLevel ?? existing.experienceLevel,
          interests: typeof interests === "object" ? JSON.stringify(interests) : (interests ?? existing.interests),
          climate: climate ?? existing.climate
        }
      });
    } else {
      garden = await prisma.garden.create({
        data: {
          guestId,
          name: name || "My Garden",
          location: location || null,
          gardenType: gardenType || "balcony",
          spaceSize: spaceSize || "Small Balcony (approx. 2x1m)",
          sunlightHours: sunlightHours !== undefined ? Number(sunlightHours) : 4,
          soilType: soilType || "Potting Mix",
          experienceLevel: experienceLevel || "beginner",
          interests: typeof interests === "object" ? JSON.stringify(interests) : (interests || "herbs,vegetables"),
          climate: climate || "Temperate"
        }
      });
    }

    return res.json({ success: true, data: garden });
  } catch (err) {
    next(err);
  }
}
