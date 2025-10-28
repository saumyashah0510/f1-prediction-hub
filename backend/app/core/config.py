from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "F1 Prediction Hub API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        # 👇 Explicitly tell Pydantic where your .env file is
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
