# 🌿 GrowMate: The AI Gardening Companion Designed to Get Your Hands Dirty
### Hacktoberfest 2026 — Week 1: Touch Grass Submission

---

## 1. Introduction & The Problem

In a world filled with endless notifications, algorithmic feeds, and screen fatigue, modern technology frequently isolates us from the natural world. 

Yet, millions of urban dwellers and beginner gardeners attempt balcony and home gardening each year. When problems arise — like yellowing leaves or choosing plants for a balcony that receives only 4 hours of morning sun — beginner gardeners are forced to spend hours scrolling through generic SEO articles and ad-heavy forums, right back on their screens.

We built **GrowMate** with a counter-intuitive principle: **AI should be designed to be closed.**

---

## 2. What GrowMate Does

GrowMate turns horticultural intelligence into real-world outdoor action:

1. **Gemma 3 4B IT Garden Planner**: Calibrates container varieties, soil ratios, and first-week outdoor setup timelines strictly to the user's available space, sun exposure, and experience level.
2. **PlantVillage ViT Health Scanner**: Uses a 38-class Vision Transformer (`kimcomehome/plantvillage-vit-leaf-disease`) to screen leaf photographs for 14 fruit and vegetable crops.
3. **Touch Grass Mode (Signature Feature)**: Generates a persistent daily 10-minute outdoor gardening mission (e.g. *Soil Hydration Depth Audit*, *Under-Leaf Stoma Inspection*, *Morning Light Mapping*). It explicitly prompts the gardener to **put down their phone**, step outside, feel the soil, complete the activity, and return later to record their progress note.
4. **Offline-Friendly Resilience & Physical Checklists**: Caches plans and daily missions in local storage and provides a printable paper checklist so gardeners can step onto their balcony without worrying about Wi-Fi signals.

---

## 3. Architecture & Open-Weight Model Choices

GrowMate is powered by an open-source, production-ready stack:

- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons + React Router.
- **Backend API**: Node.js + Express + Prisma ORM (MySQL / SQLite) + Multer.
- **Language Model**: **Google Gemma 3 4B IT** (`google/gemma-3-4b-it`) accessed via hosted Hugging Face Inference API / OpenAI-compatible endpoint with bounded retries and strict JSON schema validation.
- **Vision Model**: **PlantVillage ViT** (`kimcomehome/plantvillage-vit-leaf-disease`) fine-tuned on 38 disease and healthy states across Apple, Blueberry, Cherry, Corn, Grape, Citrus, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.

```
[ React Client / PWA ] <---> [ Express API Gateway ]
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                    ▼                    ▼
     [ Gemma 3 4B IT ]    [ PlantVillage ViT ]    [ MySQL / SQLite ]
      (Planner & Task)     (Leaf Vision Model)       (Prisma DB)
```

---

## 4. Ethical AI Guardrails & Privacy

- **Screening, Not Confirmed Diagnosis**: AI vision predictions are explicitly labeled as preliminary screenings rather than laboratory diagnoses.
- **No Chemical Pesticide Overuse**: The system recommends physical cultural methods (pruning infected foliage, increasing canopy airflow, bottom watering) and organic amendments.
- **Zero Image Retention**: Image buffers are processed strictly in-memory during inference and never stored permanently on disks.

---

## 5. Real-World Outdoor Testing

> *Note for Live Evaluators:* Conducted outdoor trial with container Sweet Genovese Basil and Sweet 100 Cherry Tomato on a 2x1m sunny balcony. The daily *Soil Hydration Audit* successfully caught surface dryness while subsoil remained appropriately damp, preventing an overwatering cycle.

---

## 6. Links & Resources

- **GitHub Repository**: [https://github.com/your-username/growmate](https://github.com/your-username/growmate)
- **Live Frontend**: [https://growmate-app.vercel.app](https://growmate-app.vercel.app)
- **Live API Endpoint**: [https://growmate-api.onrender.com/api/health](https://growmate-api.onrender.com/api/health)
- **Model Attribution**: [Google Gemma 3 4B IT](https://huggingface.co/google/gemma-3-4b-it) & [PlantVillage ViT](https://huggingface.co/kimcomehome/plantvillage-vit-leaf-disease).
