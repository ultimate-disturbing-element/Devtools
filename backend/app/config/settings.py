"""Application settings and configuration."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings."""
    
    # App Info
    app_name: str = "Developer Tools Platform"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    
    # CORS Settings
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # AI Services
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    
    # File Upload Limits
    max_upload_size: int = 50 * 1024 * 1024  # 50MB
    allowed_image_extensions: List[str] = [".png", ".jpg", ".jpeg", ".webp", ".gif"]
    allowed_video_extensions: List[str] = [".mp4", ".avi", ".mov", ".webm"]
    allowed_pdf_extensions: List[str] = [".pdf"]
    
    # External APIs
    ip_lookup_api_url: str = "http://ip-api.com/json"
    
    # Temporary File Storage
    temp_dir: str = "/tmp/devtools"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
