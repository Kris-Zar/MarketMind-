"""Business logic for Product Profile management."""

from typing import List, Optional
from uuid import uuid4

from app.common.errors import NotFoundError
from app.db.demo_seed import COLD_BREW_IMAGE_PRIMARY
from app.modules.brands.service import BrandService, utc_now_iso
from app.modules.products.repository import ProductRepository
from app.modules.products.schemas import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    sanitize_product_images,
)


class ProductService:
    """Coordinates product profile creation, retrieval, and brand validation."""

    def __init__(self, repository: ProductRepository, brand_service: BrandService) -> None:
        self._repository = repository
        self._brand_service = brand_service

    def list_products(self, brand_id: Optional[str] = None) -> List[ProductResponse]:
        """List all products or those belonging to a specific Brand Kit."""
        return [ProductResponse(**item) for item in self._repository.list_products(brand_id)]

    def get_product_by_id(self, product_id: str) -> ProductResponse:
        """Retrieve a product profile or raise NotFoundError."""
        record = self._repository.get_product_by_id(product_id)
        if not record:
            raise NotFoundError("Product", product_id)
        return ProductResponse(**record)

    def create_product(self, payload: ProductCreate) -> ProductResponse:
        """Create a product profile associated with an existing Brand Kit."""
        self._brand_service.get_brand_by_id(payload.brand_id)
        images = sanitize_product_images(payload.images)
        if not images:
            images = [
                {
                    "id": f"img-sample-{uuid4().hex[:6]}",
                    "label": "Sample Product Visual (Fallback)",
                    "url": COLD_BREW_IMAGE_PRIMARY,
                    "is_sample": True,
                }
            ]
        cleaned_benefits = [item.strip() for item in payload.benefits if item.strip()]
        record = {
            "id": f"prod-{uuid4().hex[:10]}",
            "brand_id": payload.brand_id,
            "name": payload.name.strip(),
            "description": payload.description.strip(),
            "images": images,
            "price": payload.price.strip() if payload.price else None,
            "benefits": cleaned_benefits,
            "offer": payload.offer.strip() if payload.offer else None,
            "audience": payload.audience.strip() if payload.audience else None,
            "is_demo": False,
            "data_origin": "user_prototype",
            "updated_at": utc_now_iso(),
        }
        saved = self._repository.save_product(record)
        return ProductResponse(**saved)

    def update_product(self, product_id: str, payload: ProductUpdate) -> ProductResponse:
        """Update an existing product profile."""
        existing = self._repository.get_product_by_id(product_id)
        if not existing:
            raise NotFoundError("Product", product_id)
        patch = payload.model_dump(exclude_unset=True)
        if "brand_id" in patch and patch["brand_id"]:
            self._brand_service.get_brand_by_id(patch["brand_id"])
        if "images" in patch and payload.images is not None:
            patch["images"] = sanitize_product_images(payload.images)
        if "benefits" in patch and patch["benefits"] is not None:
            patch["benefits"] = [item.strip() for item in patch["benefits"] if item.strip()]
        patch["updated_at"] = utc_now_iso()
        updated = self._repository.update_product(product_id, patch)
        return ProductResponse(**updated)
