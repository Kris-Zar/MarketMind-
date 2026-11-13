"""FastAPI dependency wiring for Phase 0 services and adapters."""

from functools import lru_cache

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.db.prototype_store import PrototypeStore
from app.integrations.ai.contracts import TextGenerationProvider
from app.integrations.ai.mock_provider import MockDemoTextGenerationProvider
from app.modules.brands.repository import BrandRepository
from app.modules.brands.service import BrandService
from app.modules.campaigns.repository import CampaignRepository
from app.modules.campaigns.service import CampaignService
from app.modules.content.repository import ContentRepository
from app.modules.content.service import ContentService
from app.modules.products.repository import ProductRepository
from app.modules.products.service import ProductService


@lru_cache
def get_prototype_store() -> PrototypeStore:
    """Return singleton Phase 0 store instance."""
    settings = get_settings()
    return PrototypeStore(settings.prototype_store_path)


def get_ai_provider(settings: Settings = Depends(get_settings)) -> TextGenerationProvider:
    """Return configured AI adapter (Phase 0 uses MockDemoTextGenerationProvider)."""
    _ = settings.ai_provider
    return MockDemoTextGenerationProvider()


def get_brand_service(
    store: PrototypeStore = Depends(get_prototype_store),
) -> BrandService:
    """Construct BrandService with its repository."""
    return BrandService(BrandRepository(store))


def get_product_service(
    store: PrototypeStore = Depends(get_prototype_store),
    brand_service: BrandService = Depends(get_brand_service),
) -> ProductService:
    """Construct ProductService with BrandService dependency."""
    return ProductService(ProductRepository(store), brand_service)


def get_campaign_service(
    store: PrototypeStore = Depends(get_prototype_store),
    brand_service: BrandService = Depends(get_brand_service),
    product_service: ProductService = Depends(get_product_service),
) -> CampaignService:
    """Construct CampaignService with Brand and Product services."""
    return CampaignService(CampaignRepository(store), brand_service, product_service)


def get_content_service(
    store: PrototypeStore = Depends(get_prototype_store),
    campaign_service: CampaignService = Depends(get_campaign_service),
    brand_service: BrandService = Depends(get_brand_service),
    product_service: ProductService = Depends(get_product_service),
    ai_provider: TextGenerationProvider = Depends(get_ai_provider),
) -> ContentService:
    """Construct ContentService with domain services and AI provider adapter."""
    return ContentService(
        repository=ContentRepository(store),
        campaign_service=campaign_service,
        brand_service=brand_service,
        product_service=product_service,
        ai_provider=ai_provider,
    )
