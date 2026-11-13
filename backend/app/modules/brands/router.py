"""Thin HTTP endpoints for Brand Kit operations."""

from typing import List

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_brand_service
from app.modules.brands.schemas import BrandCreate, BrandResponse, BrandUpdate
from app.modules.brands.service import BrandService

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("", response_model=List[BrandResponse])
def list_brands_endpoint(
    service: BrandService = Depends(get_brand_service),
) -> List[BrandResponse]:
    """List all Brand Kits available in the Phase 0 workspace."""
    return service.list_brands()


@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand_endpoint(
    brand_id: str,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    """Retrieve a single Brand Kit by ID."""
    return service.get_brand_by_id(brand_id)


@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand_endpoint(
    payload: BrandCreate,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    """Create a new Brand Kit."""
    return service.create_brand(payload)


@router.patch("/{brand_id}", response_model=BrandResponse)
def update_brand_endpoint(
    brand_id: str,
    payload: BrandUpdate,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    """Update an existing Brand Kit."""
    return service.update_brand(brand_id, payload)
