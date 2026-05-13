from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import generate, analyse

app = FastAPI(
    title="QCM Platform — ML Service",
    description="Microservice Python pour la génération de QCM et l'analyse ML des performances",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(analyse.router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "ml-service"}
