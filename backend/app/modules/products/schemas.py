"""Pydantic schemas for Product Profile operations."""

from typing import List, Optional

from pydantic import BaseModel, Field

from app.modules.brands.schemas import validate_safe_logo_url


class ProductImageItem(BaseModel):
    """Product image reference (sample SVG or uploaded data URL)."""

    id: str = Field(min_length=1, max_length=60)
    label: str = Field(min_length=1, max_length=100)
    url: str = Field(min_length=1, max_length=400_000)
    is_sample: bool = True


class ProductCreate(BaseModel):
    """Input schema for creating a Product Profile."""

    brand_id: str = Field(min_length=1, max_length=80)
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5, max_length=600)
    images: List[ProductImageItem] = Field(default_factory=list, max_length=3)
    price: Optional[str] = Field(default=None, max_length=40)
    benefits: List[str] = Field(default_factory=list, max_length=8)
    offer: Optional[str] = Field(default=None, max_length=140)
    audience: Optional[str] = Field(default=None, max_length=200)


class ProductUpdate(BaseModel):
    """Input schema for updating a Product Profile."""

    brand_id: Optional[str] = Field(default=None, min_length=1, max_length=80)
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    description: Optional[str] = Field(default=None, min_length=5, max_length=600)
    images: Optional[List[ProductImageItem]] = Field(default=None, max_length=3)
    price: Optional[str] = Field(default=None, max_length=40)
    benefits: Optional[List[str]] = Field(default=None, max_length=8)
    offer: Optional[str] = Field(default=None, max_length=140)
    audience: Optional[str] = Field(default=None, max_length=200)


class ProductResponse(BaseModel):
    """Serialized Product Profile returned by API endpoints."""

    id: str
    brand_id: str
    name: str
    description: str
    images: List[ProductImageItem]
    price: Optional[str] = None
    benefits: List[str]
    offer: Optional[str] = None
    audience: Optional[str] = None
    is_demo: bool
    data_origin: str
    updated_at: str


def sanitize_product_images(images: List[ProductImageItem]) -> List[dict]:
    """Validate each product image URL before storing."""
    cleaned: List[dict] = []
    for image in images:
        safe_url = validate_safe_logo_url(image.url)
        if safe_url:
            cleaned.append(
                {
                    "id": image.id.strip(),
                    "label": image.label.strip(),
                    "url": safe_url,
                    "is_sample": image.is_sample,
                }
            )
    return cleaned
