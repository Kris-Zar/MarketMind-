"""Versioned v1 API router registration and prototype metadata endpoint."""

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.core.dependencies import get_prototype_store
from app.db.prototype_store import PrototypeStore
from app.modules.brands.router import router as brands_router
from app.modules.campaigns.router import router as campaigns_router
from app.modules.content.router import router as content_router
from app.modules.products.router import router as products_router

api_v1_router = APIRouter()
api_v1_router.include_router(brands_router)
api_v1_router.include_router(products_router)
api_v1_router.include_router(campaigns_router)
api_v1_router.include_router(content_router)


@api_v1_router.get("/health", tags=["system"])
def health_check_endpoint(settings: Settings = Depends(get_settings)) -> dict:
    """Return service health and active prototype phase."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "active_phase": settings.active_phase,
        "ai_provider": settings.ai_provider,
    }


@api_v1_router.get("/prototype/meta", tags=["system"])
def prototype_metadata_endpoint(settings: Settings = Depends(get_settings)) -> dict:
    """Expose explicit Phase 0 capability boundaries so UI stays honest."""
    return {
        "active_phase": settings.active_phase,
        "ai_provider_mode": "mock_demo",
        "ai_provider_label": "Demo AI Adapter (Simulated — Phase 0)",
        "persistence_mode": "Local JSON Prototype Store (Phase 0)",
        "live_publishing_enabled": False,
        "live_analytics_enabled": False,
        "live_trends_enabled": False,
    }


@api_v1_router.post("/prototype/reset-demo", tags=["system"])
def reset_demo_store_endpoint(
    store: PrototypeStore = Depends(get_prototype_store),
) -> dict:
    """Restore seeded Phase 0 demo records cleanly."""
    data = store.reset_to_demo()
    return {
        "status": "reset",
        "brands_count": len(data.get("brands", [])),
        "products_count": len(data.get("products", [])),
        "campaigns_count": len(data.get("campaigns", [])),
    }
