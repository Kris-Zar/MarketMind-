"""Validated application configuration for MarketMind AI."""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed runtime settings for Phase 0 prototype."""

    model_config = SettingsConfigDict(
        env_prefix="MARKETMIND_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "MarketMind AI"
    app_version: str = "0.1.0-phase0"
    active_phase: str = "Phase 0 — Guide-Ready Prototype"
    env: str = "prototype"
    api_prefix: str = "/api/v1"
    cors_origins_raw: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        alias="MARKETMIND_CORS_ORIGINS",
    )
    prototype_store_path: Path = Path("backend/data/prototype_store.json")
    ai_provider: str = "mock_demo"

    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-separated CORS origins into a clean list."""
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()
