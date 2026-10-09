"""
PlantVillage ViT Leaf Disease Inference Microservice
Model: kimcomehome/plantvillage-vit-leaf-disease
Framework: FastAPI + Hugging Face Transformers
"""

import io
import os
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vision-service")

app = FastAPI(
    title="GrowMate PlantVision ViT Microservice",
    description="Dedicated leaf disease classifier using PlantVillage ViT",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = None
MODEL_NAME = os.getenv("MODEL_NAME", "kimcomehome/plantvillage-vit-leaf-disease")

@app.on_event("startup")
def load_model():
    global classifier
    try:
        from transformers import pipeline
        logger.info(f"Loading ViT classification pipeline for model: {MODEL_NAME}...")
        classifier = pipeline("image-classification", model=MODEL_NAME)
        logger.info("✅ PlantVillage ViT model loaded successfully!")
    except Exception as e:
        logger.warning(f"Warning: Could not pre-load model locally ({e}). Will load on-demand or use remote API.")

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "GrowMate PlantVision ViT",
        "model": MODEL_NAME,
        "modelLoaded": classifier is not None
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    global classifier
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Image required.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB).")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Corrupt or unreadable image: {str(e)}")

    if classifier is None:
        try:
            from transformers import pipeline
            classifier = pipeline("image-classification", model=MODEL_NAME)
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Model engine unavailable: {str(e)}")

    try:
        results = classifier(image)
        if not results:
            raise HTTPException(status_code=500, detail="Classifier returned empty result.")
        
        top = results[0]
        return {
            "label": top["label"],
            "confidence": float(top["score"]),
            "allPredictions": results[:3]
        }
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
