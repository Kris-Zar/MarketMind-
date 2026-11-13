"""Business logic for Brand Kit management."""

from datetime import datetime, timezone
from typing import List
from uuid import uuid4

from app.common.errors import NotFoundError
from app.db.demo_seed import LUMABREW_LOGO_URL
from app.modules.brands.repository import BrandRepository
from app.modules.brands.schemas import BrandCreate, BrandResponse, BrandUpdate


def utc_now_iso() -> str:
    """Return current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class BrandService:
    """Coordinates Brand Kit creation, retrieval, and updates."""

    def __init__(self, repository: BrandRepository) -> None:
        self._repository = repository

    def list_brands(self) -> List[BrandResponse]:
        """Return all saved and demo Brand Kits."""
        return [BrandResponse(**item) for item in self._repository.list_brands()]

    def get_brand_by_id(self, brand_id: str) -> BrandResponse:
        """Retrieve a Brand Kit or raise NotFoundError."""
        record = self._repository.get_brand_by_id(brand_id)
        if not record:
            raise NotFoundError("Brand Kit", brand_id)
        return BrandResponse(**record)

    def create_brand(self, payload: BrandCreate) -> BrandResponse:
        """Create a new user-entered Brand Kit."""
        logo_url = payload.logo_url or LUMABREW_LOGO_URL
        logo_label = (
            payload.logo_label
            if payload.logo_url
            else "Sample Placeholder Logo (No custom file uploaded)"
        )
        record = {
            "id": f"brand-{uuid4().hex[:10]}",
            "name": payload.name.strip(),
            "category": payload.category.strip(),
            "description": payload.description.strip(),
            "voice": payload.voice.strip(),
            "primary_color": payload.primary_color.upper(),
            "secondary_color": payload.secondary_color.upper(),
            "tagline": payload.tagline.strip(),
            "logo_url": logo_url,
            "logo_label": logo_label,
            "is_demo": False,
            "data_origin": "user_prototype",
            "updated_at": utc_now_iso(),
        }
        saved = self._repository.save_brand(record)
        return BrandResponse(**saved)

    def update_brand(self, brand_id: str, payload: BrandUpdate) -> BrandResponse:
        """Update an existing Brand Kit while preserving existing values for omitted fields."""
        existing = self._repository.get_brand_by_id(brand_id)
        if not existing:
            raise NotFoundError("Brand Kit", brand_id)
        patch = payload.model_dump(exclude_unset=True)
        if "primary_color" in patch and patch["primary_color"]:
            patch["primary_color"] = patch["primary_color"].upper()
        if "secondary_color" in patch and patch["secondary_color"]:
            patch["secondary_color"] = patch["secondary_color"].upper()
        patch["updated_at"] = utc_now_iso()
        updated = self._repository.update_brand(brand_id, patch)
        return BrandResponse(**updated)
