from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.endpoints import drivers,races,teams,standings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drivers.router, prefix="/api/v1/drivers", tags=["Drivers"])
app.include_router(teams.router, prefix="/api/v1/teams", tags=["Teams"])
app.include_router(races.router, prefix="/api/v1/races", tags=["Races"])
app.include_router(standings.router, prefix="/api/v1/standings", tags=["Standings"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to F1 Prediction Hub API",
        "version": settings.VERSION
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}