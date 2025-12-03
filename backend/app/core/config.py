from pydantic_settings import BaseSettings
from typing import Optional, List
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "F1 Prediction Hub API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    # ✅ Allow specific origins + use regex pattern for Vercel previews
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://f1-prediction-hub-one.vercel.app",
    ]
    
    # ✅ Allow all Vercel preview deployments (they change with each deployment)
    ALLOW_ALL_VERCEL_ORIGINS: bool = True
    
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()