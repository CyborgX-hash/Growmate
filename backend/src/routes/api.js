import { Router } from "express";
import multer from "multer";

import { getGarden, saveGarden } from "../controllers/gardenController.js";
import { getPlants, getPlantById, createPlant, updatePlant, deletePlant } from "../controllers/plantController.js";
import { createGardenPlan, getLatestPlan, adoptPlanPlants } from "../controllers/plannerController.js";
import { diagnoseLeafImage, getDiagnosisHistory } from "../controllers/diagnosisController.js";
import { getTodayMission, completeMission, getMissionHistory } from "../controllers/missionController.js";
import { getTasks, createTask, completeTask, deleteTask } from "../controllers/taskController.js";
import { getHealthStatus } from "../controllers/healthController.js";
import { standardLimiter, aiLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Multer in-memory storage for secure image buffer processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("UNSUPPORTED_FILE_TYPE: Only JPEG, PNG, or WebP images are supported."));
    }
  }
});

// Apply standard rate limiter to all API routes
router.use(standardLimiter);

// System Health
router.get("/health", getHealthStatus);

// Garden Profile
router.get("/garden", getGarden);
router.post("/garden", saveGarden);
router.put("/garden", saveGarden);

// Plants
router.get("/plants", getPlants);
router.post("/plants", createPlant);
router.get("/plants/:id", getPlantById);
router.put("/plants/:id", updatePlant);
router.patch("/plants/:id", updatePlant);
router.delete("/plants/:id", deletePlant);

// Garden Planning (Gemma 3 4B IT)
router.post("/garden/plan", aiLimiter, createGardenPlan);
router.get("/garden/plan/latest", getLatestPlan);
router.post("/garden/plan/adopt", adoptPlanPlants);

// Plant Health Leaf Scanner (PlantVillage ViT)
router.post("/plants/diagnose", aiLimiter, upload.single("image"), diagnoseLeafImage);
router.post("/plants/:id/diagnose", aiLimiter, (req, res, next) => {
  req.body.plantId = req.params.id;
  next();
}, upload.single("image"), diagnoseLeafImage);
router.get("/diagnoses", getDiagnosisHistory);

// Touch Grass Missions (Daily persistent Gemma 3 4B IT / fallback)
router.get("/missions/today", getTodayMission);
router.post("/missions/:id/complete", completeMission);
router.get("/missions/history", getMissionHistory);

// Care Tasks & Calendar
router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.patch("/tasks/:id/complete", completeTask);
router.put("/tasks/:id/complete", completeTask);
router.delete("/tasks/:id", deleteTask);

export default router;
