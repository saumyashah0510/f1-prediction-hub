from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "F1 Prediction Hub API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    # ✅ Update with your actual Vercel URL
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.vercel.app",  # Allows all Vercel preview deployments
        "https://f1-prediction-hub-one.vercel.app/",  # Your production Vercel URL
        # Add your custom domain if you have one:
        # "https://yourdomain.com"
    ]
    
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()