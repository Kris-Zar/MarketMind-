"""FastAPI application entrypoint (construction and wiring only)."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.common.errors import register_exception_handlers
from app.core.config import get_settings


def create_app() -> FastAPI:
    """Construct and configure the MarketMind AI FastAPI application."""
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="MarketMind AI — Phase 0 Guide-Ready Prototype API",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_exception_handlers(app)
    app.include_router(api_v1_router, prefix=settings.api_prefix)
    return app


app = create_app()
