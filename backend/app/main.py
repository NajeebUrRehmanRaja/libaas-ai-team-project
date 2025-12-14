from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.auth.routes import router as auth_router
from app.wardrobe.routes import router as wardrobe_router
from app.ai.clip_insights import load_clip_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Server startup and shutdown."""
    print("Starting LibaasAI Backend...")
    print("CLIP model will be loaded lazily when first needed.")
    print("Fashion-CLIP model will be loaded lazily for wardrobe categorization.")
    print("Kolors Virtual Try-On will be loaded when generating looks.")
    print("Server startup complete!")
    print("API docs available at: http://127.0.0.1:8000/docs")
    yield
    print("Shutting down...")

app = FastAPI(
    title="LibaasAI Backend",
    description="AI-powered wardrobe assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(wardrobe_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to LibaasAI API",
        "docs": "/docs",
        "health": "ok"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "libaas-ai-backend"}

