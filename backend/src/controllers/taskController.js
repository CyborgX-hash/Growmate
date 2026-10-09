import prisma from "../services/dbService.js";

export async function getTasks(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const { status = "all" } = req.query;

    const garden = await prisma.garden.findFirst({ where: { guestId } });
    if (!garden) {
      return res.json({ success: true, data: [] });
    }

    const whereClause = { gardenId: garden.id };
    if (status === "pending") whereClause.isCompleted = false;
    if (status === "completed") whereClause.isCompleted = true;

    const tasks = await prisma.careTask.findMany({
      where: whereClause,
      include: {
        plant: {
          select: { id: true, name: true, species: true }
        }
      },
      orderBy: [
        { isCompleted: "asc" },
        { dueDate: "asc" }
      ]
    });

    return res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const guestId = req.headers["x-guest-id"] || "guest-default";
    const { plantId, title, taskType = "general", dueDate, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, error: "Task title and due date are required" });
    }

    let garden = await prisma.garden.findFirst({ where: { guestId } });
    if (!garden) {
      garden = await prisma.garden.create({ data: { guestId, name: "My Garden" } });
    }

    const task = await prisma.careTask.create({
      data: {
        gardenId: garden.id,
        plantId: plantId || null,
        title: title.trim(),
        taskType,
        dueDate: new Date(dueDate),
        notes: notes || null
      },
      include: {
        plant: true
      }
    });

    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function completeTask(req, res, next) {
  try {
    const { id } = req.params;
    const { isCompleted = true } = req.body;

    const existing = await prisma.careTask.findUnique({
      where: { id },
      include: { plant: true }
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    const updated = await prisma.careTask.update({
      where: { id },
      data: {
        isCompleted: Boolean(isCompleted),
        completedAt: isCompleted ? new Date() : null
      }
    });

    // If it was a watering task and marked complete, update plant's lastWateredAt and schedule next watering
    if (isCompleted && existing.plantId && existing.taskType === "watering" && existing.plant) {
      await prisma.plant.update({
        where: { id: existing.plantId },
        data: { lastWateredAt: new Date() }
      }).catch(() => {});

      // Schedule next recurring watering task
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (existing.plant.wateringFreqDays || 2));
      await prisma.careTask.create({
        data: {
          gardenId: existing.gardenId,
          plantId: existing.plantId,
          title: `Water ${existing.plant.name}`,
          taskType: "watering",
          dueDate: nextDate,
          notes: `Routine cycle (${existing.plant.wateringFreqDays} days)`
        }
      }).catch(() => {});
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.careTask.delete({ where: { id } });
    return res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
}
