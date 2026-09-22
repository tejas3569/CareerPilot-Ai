from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union, Any
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "CareerPilot AI"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./careerpilot.db"
    
    # JWT & Auth
    JWT_SECRET: str = "super_secret_jwt_key_careerpilot_ai_change_in_production_987654321"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # AI Providers
    LLM_PROVIDER: str = "gemini"  # "gemini" | "openai" | "demo"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "text-embedding-004"
    DEMO_MODE: bool = True
    
    # Storage
    UPLOAD_DIR: str = "./uploads"
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
