from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):

    APP_NAME: str = "F1 Prediction Hub API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/f1_db"
    
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    API_V1_PREFIX: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()