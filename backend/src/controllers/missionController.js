import prisma from "../services/dbService.js";
import { generateDailyMission } from "../services/missionService.js";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getTodayMission(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const dateStr = req.query.date || getTodayDateString();

    let garden = await prisma.garden.findFirst({
      where: { guestId },
      include: { plants: true }
    });

    if (!garden) {
      garden = await prisma.garden.create({
        data: { guestId, name: "My Balcony Oasis" },
        include: { plants: true }
      });
    }

    // Check if mission already exists for today & this garden
    let mission = await prisma.mission.findUnique({
      where: {
        gardenId_missionDate: {
          gardenId: garden.id,
          missionDate: dateStr
        }
      }
    });

    if (!mission) {
      // Generate new mission for today
      const generated = await generateDailyMission(garden, dateStr, garden.plants);

      mission = await prisma.mission.create({
        data: {
          gardenId: garden.id,
          missionDate: dateStr,
          title: generated.title,
          explanation: generated.explanation,
          durationMinutes: generated.durationMinutes,
          materialsRequired: JSON.stringify(generated.materialsRequired),
          steps: JSON.stringify(generated.steps),
          plantId: generated.plantFocus ? garden.plants.find(p => p.name.toLowerCase().includes(generated.plantFocus.toLowerCase()))?.id : null,
          isFallback: generated.isFallback || false,
          modelAttribution: generated.modelAttribution || "Google Gemma 3 4B IT"
        }
      });
    }

    return res.json({
      success: true,
      data: {
        id: mission.id,
        missionDate: mission.missionDate,
        title: mission.title,
        explanation: mission.explanation,
        durationMinutes: mission.durationMinutes,
        materialsRequired: JSON.parse(mission.materialsRequired || "[]"),
        steps: JSON.parse(mission.steps || "[]"),
        isCompleted: mission.isCompleted,
        completedAt: mission.completedAt,
        completionNote: mission.completionNote,
        completionPhoto: mission.completionPhoto,
        isFallback: mission.isFallback,
        modelAttribution: mission.modelAttribution
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function completeMission(req, res, next) {
  try {
    const { id } = req.params;
    const { completionNote, completionPhoto } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id } });
    if (!mission) {
      return res.status(404).json({ success: false, error: "Mission not found" });
    }

    const updated = await prisma.mission.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        completionNote: completionNote || null,
        completionPhoto: completionPhoto || null
      }
    });

    return res.json({
      success: true,
      message: "Touch Grass mission marked completed! Great job stepping outside.",
      data: {
        id: updated.id,
        isCompleted: updated.isCompleted,
        completedAt: updated.completedAt,
        completionNote: updated.completionNote
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMissionHistory(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const garden = await prisma.garden.findFirst({ where: { guestId } });

    if (!garden) {
      return res.json({ success: true, data: [] });
    }

    const missions = await prisma.mission.findMany({
      where: { gardenId: garden.id },
      orderBy: { missionDate: "desc" },
      take: 30
    });

    const formatted = missions.map(m => ({
      id: m.id,
      missionDate: m.missionDate,
      title: m.title,
      explanation: m.explanation,
      durationMinutes: m.durationMinutes,
      materialsRequired: JSON.parse(m.materialsRequired || "[]"),
      steps: JSON.parse(m.steps || "[]"),
      isCompleted: m.isCompleted,
      completedAt: m.completedAt,
      completionNote: m.completionNote,
      isFallback: m.isFallback,
      modelAttribution: m.modelAttribution
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
}
