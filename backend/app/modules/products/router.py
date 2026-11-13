"""Thin HTTP endpoints for Product Profile operations."""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_product_service
from app.modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate
from app.modules.products.service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductResponse])
def list_products_endpoint(
    brand_id: Optional[str] = Query(default=None),
    service: ProductService = Depends(get_product_service),
) -> List[ProductResponse]:
    """List products, optionally filtered by Brand Kit ID."""
    return service.list_products(brand_id=brand_id)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_endpoint(
    product_id: str,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    """Retrieve a single product profile."""
    return service.get_product_by_id(product_id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(
    payload: ProductCreate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    """Create a new product profile."""
    return service.create_product(payload)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(
    product_id: str,
    payload: ProductUpdate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    """Update an existing product profile."""
    return service.update_product(product_id, payload)
