# 📡 GrowMate REST API Reference

Base Path: `/api`

### 1. System Health
- **`GET /api/health`**
  - Returns backend health status, database connectivity, and configured AI models.

### 2. Garden Profile
- **`GET /api/garden`**
  - Retrieves active garden settings, plant list, pending tasks, and recent plans.
- **`POST /api/garden`** or **`PUT /api/garden`**
  - Updates garden parameters (name, location, gardenType, spaceSize, sunlightHours, soilType, experienceLevel, interests, climate).

### 3. Plants Management
- **`GET /api/plants`**
  - Returns all plants with active care tasks and latest diagnoses.
- **`POST /api/plants`**
  - Adds a new plant and automatically schedules first watering and foliage inspection care tasks.
- **`GET /api/plants/:id`**
  - Returns single plant details with complete care task history.
- **`PATCH /api/plants/:id`** / **`PUT /api/plants/:id`**
  - Updates plant metadata, status, or last watered timestamp.
- **`DELETE /api/plants/:id`**
  - Deletes plant and cascades task removal.

### 4. Horticultural Planning (Gemma 3 4B IT)
- **`POST /api/garden/plan`**
  - Calls `google/gemma-3-4b-it` to generate structured plant recommendations, soil prep, and first-week timeline.
- **`GET /api/garden/plan/latest`**
  - Returns cached latest plan.
- **`POST /api/garden/plan/adopt`**
  - Bulk adopts recommended plants from a generated plan into the user's sanctuary.

### 5. Plant Leaf Health Screening (PlantVillage ViT)
- **`POST /api/plants/diagnose`**
  - Accepts `multipart/form-data` with leaf image binary (`image` field) and optional `plantId`.
  - Runs 38-class classification with `kimcomehome/plantvillage-vit-leaf-disease`.
- **`GET /api/diagnoses`**
  - Returns diagnostic history.

### 6. Touch Grass Mode (Missions)
- **`GET /api/missions/today`**
  - Retrieves persistent daily mission for the current date & garden.
- **`POST /api/missions/:id/complete`**
  - Marks mission complete with optional `completionNote` and `completionPhoto`.
- **`GET /api/missions/history`**
  - Returns past missions with completion records.

### 7. Care Tasks & Calendar
- **`GET /api/tasks?status=all|pending|completed`**
  - Lists scheduled tasks.
- **`POST /api/tasks`**
  - Creates custom care task with due date.
- **`PATCH /api/tasks/:id/complete`**
  - Toggles completion and auto-reschedules recurring watering cycles.
- **`DELETE /api/tasks/:id`**
  - Deletes task.
