# 🚀 GrowMate Deployment Guide
## Vercel, Render & MySQL

This guide walks through deploying GrowMate to **Vercel** (Frontend) and **Render** (Backend API + MySQL).

---

## 1. Deploying the Backend on Render

1. **Create a new Web Service on Render**:
   - Connect your GitHub repository.
   - Set **Root Directory**: `backend`
   - Set **Environment**: `Node`
   - Set **Build Command**: `npm install && npx prisma generate`
   - Set **Start Command**: `npm start`

2. **Configure Render Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default for Render)
   - `DATABASE_URL`: Your hosted MySQL connection string:
     `mysql://username:password@host:3306/growmate_db`
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-growmate.vercel.app`)
   - `HUGGINGFACE_API_KEY`: Your Hugging Face user access token
   - `GEMMA_MODEL_ID`: `google/gemma-3-4b-it`
   - `VISION_MODEL_ID`: `kimcomehome/plantvillage-vit-leaf-disease`

3. **Run Initial Database Migration**:
   In Render's Shell tab for your service:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

---

## 2. Deploying the Frontend on Vercel

1. **Import the repository into Vercel**:
   - Set **Root Directory**: `frontend`
   - Set **Framework Preset**: `Vite`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `dist`

2. **Configure Vercel Environment Variables**:
   - `VITE_API_URL`: Your deployed Render backend URL + `/api` (e.g., `https://your-growmate-api.onrender.com/api`)

3. Click **Deploy**.

---

## 3. (Optional) Deploying the Python Vision Microservice

If you prefer dedicated local PyTorch inference for PlantVillage ViT rather than Hugging Face inference endpoints:
- Create a new Render Web Service with **Root Directory**: `python-vision-service`.
- Render will automatically detect the `Dockerfile`.
- Set `PYTHON_VISION_SERVICE_URL` in the Express backend environment variables.
