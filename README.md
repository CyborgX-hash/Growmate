# 🌱 GrowMate — AI Gardening Companion & Touch Grass Mode
> **Hacktoberfest 2026 | Week 1: Touch Grass**  
> An open-weight AI horticultural companion designed to turn digital recommendations into real-world outdoor action.

---

## 🌿 1. Product Vision & Motivation

Most modern applications optimize for **screen time**. **GrowMate** is designed for the opposite: **outdoor time**.

Balcony and beginner gardeners often face decision paralysis: *What should I grow with only 4 hours of morning sun? Is this yellow spot on my tomato leaf fungal blight or just dry soil?*

GrowMate solves this using open-weight AI:
1. **Google Gemma 3 4B IT**: Generates calibrated container garden plans and persistent daily outdoor missions.
2. **PlantVillage ViT**: Screens uploaded leaf images for 38 crop conditions across 14 fruit and vegetable varieties.
3. **Touch Grass Mode (Signature Feature)**: Guides users to read their daily 10-minute horticultural mission, **leave their phone inside**, step into the fresh air, inspect or water plants, and return to record real-world progress.
4. **Offline-Friendly Resilience**: Cached plans, daily missions, and printable care checklists that work offline on your balcony.

---

## 🏗️ 2. Architecture & Tech Stack

```
                                  ┌───────────────────────────┐
                                  │   GrowMate React Frontend │
                                  │ (Vite + Tailwind + Router)│
                                  └─────────────┬─────────────┘
                                                │ REST API / CORS
                                                ▼
                                  ┌───────────────────────────┐
                                  │    Express API Gateway    │
                                  │  (Node.js + Prisma ORM)   │
                                  └──────┬──────────────┬─────┘
                                         │              │
                   ┌─────────────────────┴──────┐       │
                   ▼                            ▼       ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
    │   Google Gemma 3 4B IT    │   │     PlantVillage ViT     │   │      MySQL / SQLite      │
    │  (Garden Planner & Daily  │   │  (Leaf Disease Vision    │   │  (Prisma Models: Garden, │
    │    Outdoor Missions)      │   │     38-Class Screening)  │   │  Plant, Task, Mission)   │
    └───────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons.
- **Backend**: Node.js, Express.js, Prisma ORM, Multer, Zod Schema Validation, Rate Limiting.
- **Database**: MySQL (production-ready) / SQLite (zero-config local dev & tests).
- **AI Models**:
  - `google/gemma-3-4b-it` (Structured JSON horticultural planning & daily missions)
  - `kimcomehome/plantvillage-vit-leaf-disease` (38-class leaf health screening)
  - Optional standalone Python FastAPI microservice for local ViT inference.

---

## 🚀 3. Quick Start & Local Setup

### Prerequisites
- Node.js v18+ (tested on Node v22)
- npm v9+
- (Optional) Python 3.10+ if running the local vision microservice.

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/your-username/growmate.git
   cd growmate
   npm run install:all
   ```

2. **Configure environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Initialize the local database & seed data:**
   ```bash
   cd backend
   npx prisma db push
   npm run prisma:seed
   cd ..
   ```

4. **Run both Backend and Frontend:**
   - **Terminal 1 (Backend API on http://localhost:5001):**
     ```bash
     npm run dev:backend
     ```
   - **Terminal 2 (Frontend UI on http://localhost:5173):**
     ```bash
     npm run dev:frontend
     ```

5. Open your browser to `http://localhost:5173` to explore GrowMate!

---

## 🧪 4. Running Tests

Run the full backend integration and unit test suite:
```bash
npm run test:backend
```

Run the frontend production build verification:
```bash
npm run build:frontend
```

---

## 🔑 5. Environment Variables (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend Express port | `5001` |
| `DATABASE_URL` | Database connection string | `file:./dev.db` (or `mysql://user:pass@host:3306/growmate_db`) |
| `FRONTEND_URL` | Frontend client origin for CORS | `http://localhost:5173` |
| `HUGGINGFACE_API_KEY` | Hugging Face token for Gemma & ViT inference | `hf_...` *(Leave blank for deterministic fallbacks)* |
| `GEMMA_MODEL_ID` | Gemma 3 4B IT model ID | `google/gemma-3-4b-it` |
| `VISION_MODEL_ID` | PlantVillage ViT model ID | `kimcomehome/plantvillage-vit-leaf-disease` |
| `PYTHON_VISION_SERVICE_URL`| Optional local FastAPI microservice | `http://localhost:8000/predict` |
| `AI_TIMEOUT_MS` | Max AI inference timeout before fallback | `20000` |

---

## 🌿 6. What Works Offline vs Online

| Feature | Online | Offline | Notes |
| :--- | :---: | :---: | :--- |
| **Touch Grass Missions** | ✅ | ✅ | Today's persistent mission and checklist cache locally. |
| **Care Calendar & Checklist** | ✅ | ✅ | Full offline support + printable physical paper checklists. |
| **Plant Sanctuary Management** | ✅ | ✅ | Saved in database / synced via local storage. |
| **Gemma 3 4B IT Planner** | ✅ | ⚠️ | Remote inference online; deterministic fallback offline. |
| **PlantVillage ViT Classifier** | ✅ | ⚠️ | Remote inference online; local boundary & guide offline. |

---

## 🛡️ 7. Ethical Guardrails & Safety Notice

1. **Screening, Not Confirmed Diagnosis**: Plant leaf photographs alone cannot replace laboratory tissue culture or physical extension consultation. Results are clearly designated as screening estimates.
2. **No Toxic Chemical Prescriptions**: All next steps emphasize physical sanitation (deadheading, airflow thinning, bottom watering) and organic amendments.
3. **Data Privacy**: No permanent image storage. Image buffers are screened in-memory and discarded immediately.

---

## 📄 8. License & Attribution

- Released under the [MIT License](LICENSE).
- Model Attribution: [Google Gemma 3 4B IT](https://huggingface.co/google/gemma-3-4b-it) & [PlantVillage ViT](https://huggingface.co/kimcomehome/plantvillage-vit-leaf-disease).
- Built with ❤️ for **Hacktoberfest 2026: Touch Grass**.
