import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { formatDiagnosisResult } from "../src/utils/plantVillageClasses.js";
import { extractJsonFromText } from "../src/services/gemmaService.js";
import { getDeterministicFallbackPlan } from "../src/services/gardenPlannerService.js";
import { getDeterministicDailyMission } from "../src/services/missionService.js";

describe("GrowMate API & Utilities Suite", () => {

  describe("System Health & Root", () => {
    it("should return healthy status with AI model and DB details", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
      expect(res.body.app).toBe("GrowMate Backend API");
      expect(res.body.aiEndpoints.gemma.modelId).toContain("gemma-3-4b-it");
      expect(res.body.aiEndpoints.visionClassifier.supportedClasses).toBe(38);
    });

    it("should return root ping endpoint", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("GrowMate API");
      expect(res.body.theme).toBe("Touch Grass");
    });
  });

  describe("Garden Profile Management", () => {
    it("should retrieve the active garden profile", async () => {
      const res = await request(app).get("/api/garden");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBeDefined();
      expect(res.body.data.gardenType).toBeDefined();
    });

    it("should update garden settings", async () => {
      const res = await request(app)
        .put("/api/garden")
        .send({
          name: "Updated Balcony Sanctuary",
          sunlightHours: 7,
          gardenType: "balcony"
        });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated Balcony Sanctuary");
      expect(res.body.data.sunlightHours).toBe(7);
    });
  });

  describe("Plants Management", () => {
    let createdPlantId = null;

    it("should list existing plants", async () => {
      const res = await request(app).get("/api/plants");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should create a new plant with automated care task", async () => {
      const res = await request(app)
        .post("/api/plants")
        .send({
          name: "Test Rosemary",
          species: "Salvia rosmarinus",
          sunlightReq: "6-8 hours sun",
          wateringFreqDays: 4,
          notes: "Loves sandy, dry soil."
        });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Test Rosemary");
      expect(res.body.data.wateringFreqDays).toBe(4);
      createdPlantId = res.body.data.id;
    });

    it("should retrieve single plant details by ID", async () => {
      const res = await request(app).get(`/api/plants/${createdPlantId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdPlantId);
      expect(res.body.data.careTasks.length).toBeGreaterThan(0);
    });

    it("should delete plant by ID", async () => {
      const res = await request(app).delete(`/api/plants/${createdPlantId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Touch Grass Missions", () => {
    it("should retrieve or create today's persistent mission", async () => {
      const res = await request(app).get("/api/missions/today");
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBeDefined();
      expect(res.body.data.durationMinutes).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.steps)).toBe(true);
      expect(res.body.data.steps.length).toBeGreaterThan(1);
    });

    it("should mark a mission complete with optional note", async () => {
      const todayRes = await request(app).get("/api/missions/today");
      const missionId = todayRes.body.data.id;

      const completeRes = await request(app)
        .post(`/api/missions/${missionId}/complete`)
        .send({
          completionNote: "Stepped outside, inspected soil, and felt calm and connected with the plants!"
        });
      expect(completeRes.status).toBe(200);
      expect(completeRes.body.data.isCompleted).toBe(true);
    });

    it("should retrieve mission history", async () => {
      const res = await request(app).get("/api/missions/history");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("Care Tasks & Calendar", () => {
    let taskId = null;

    it("should list care tasks", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should schedule a new care task", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({
          title: "Fertilize balcony containers",
          taskType: "fertilizing",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          notes: "Dilute organic seaweed fertilizer 1:100"
        });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Fertilize balcony containers");
      taskId = res.body.data.id;
    });

    it("should mark care task complete", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .send({ isCompleted: true });
      expect(res.status).toBe(200);
      expect(res.body.data.isCompleted).toBe(true);
    });
  });

  describe("Garden Planning Fallback & Schema", () => {
    it("should produce a valid deterministic fallback plan when AI key is omitted", () => {
      const fallback = getDeterministicFallbackPlan({
        gardenType: "balcony",
        sunlightHours: 4,
        interests: "herbs, vegetables"
      });
      expect(fallback.recommendedPlants.length).toBeGreaterThan(0);
      expect(fallback.summary).toBeDefined();
      expect(fallback.firstWeekPlan.length).toBeGreaterThan(1);
    });

    it("should correctly extract JSON from code blocks or raw string", () => {
      const markdownJson = "Here is your plan:\n```json\n{\"summary\":\"Lush balcony\",\"recommendedPlants\":[]}\n```";
      const parsed = extractJsonFromText(markdownJson);
      expect(parsed).toEqual({ summary: "Lush balcony", recommendedPlants: [] });
    });
  });

  describe("PlantVision 38-Class Mapping & Disclaimers", () => {
    it("should correctly format healthy tomato leaf class", () => {
      const result = formatDiagnosisResult("Tomato___healthy", 0.96);
      expect(result.crop).toBe("Tomato");
      expect(result.isHealthy).toBe(true);
      expect(result.disclaimer).toContain("AI-assisted screening only");
      expect(result.confidenceScore).toBe(0.96);
    });

    it("should correctly format diseased class with cautious steps and no toxic chemicals", () => {
      const result = formatDiagnosisResult("Tomato___Early_blight", 0.91);
      expect(result.disease).toBe("Early Blight");
      expect(result.isHealthy).toBe(false);
      expect(result.cautiousNextSteps.length).toBeGreaterThan(0);
      expect(result.plainExplanation).toContain("Alternaria");
    });

    it("should handle unknown / unclassified leaf gracefully without hallucination", () => {
      const result = formatDiagnosisResult("Unknown_Foliage", 0.2);
      expect(result.isHealthy).toBe(false);
      expect(result.crop).toBe("Unknown Plant");
      expect(result.cautiousNextSteps.length).toBeGreaterThan(0);
    });
  });
});
