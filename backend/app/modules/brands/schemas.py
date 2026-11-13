"""Pydantic schemas for Brand Kit operations."""

from typing import Optional

from pydantic import BaseModel, Field, field_validator

HEX_COLOR_PATTERN = r"^#[0-9A-Fa-f]{6}$"


def validate_safe_logo_url(value: Optional[str]) -> Optional[str]:
    """Allow safe image data URLs or http(s) URLs only; reject script schemes."""
    if value is None or value == "":
        return None
    trimmed = value.strip()
    if trimmed.startswith(("data:image/png;base64,", "data:image/jpeg;base64,", "data:image/webp;base64,", "data:image/svg+xml")):
        return trimmed
    if trimmed.startswith(("https://", "http://")):
        return trimmed
    raise ValueError("Logo URL must be a valid image data URL or http(s) image link.")


class BrandCreate(BaseModel):
    """Input schema for creating a Phase 0 Brand Kit."""

    name: str = Field(min_length=2, max_length=80)
    category: str = Field(min_length=2, max_length=80)
    description: str = Field(min_length=5, max_length=500)
    voice: str = Field(min_length=2, max_length=120)
    primary_color: str = Field(pattern=HEX_COLOR_PATTERN)
    secondary_color: str = Field(pattern=HEX_COLOR_PATTERN)
    tagline: str = Field(default="", max_length=140)
    logo_url: Optional[str] = Field(default=None, max_length=400_000)
    logo_label: str = Field(default="User-supplied Brand Logo", max_length=80)

    @field_validator("logo_url")
    @classmethod
    def check_logo_url(cls, value: Optional[str]) -> Optional[str]:
        return validate_safe_logo_url(value)


class BrandUpdate(BaseModel):
    """Input schema for updating an existing Brand Kit."""

    name: Optional[str] = Field(default=None, min_length=2, max_length=80)
    category: Optional[str] = Field(default=None, min_length=2, max_length=80)
    description: Optional[str] = Field(default=None, min_length=5, max_length=500)
    voice: Optional[str] = Field(default=None, min_length=2, max_length=120)
    primary_color: Optional[str] = Field(default=None, pattern=HEX_COLOR_PATTERN)
    secondary_color: Optional[str] = Field(default=None, pattern=HEX_COLOR_PATTERN)
    tagline: Optional[str] = Field(default=None, max_length=140)
    logo_url: Optional[str] = Field(default=None, max_length=400_000)
    logo_label: Optional[str] = Field(default=None, max_length=80)

    @field_validator("logo_url")
    @classmethod
    def check_logo_url(cls, value: Optional[str]) -> Optional[str]:
        return validate_safe_logo_url(value)


class BrandResponse(BaseModel):
    """Serialized Brand Kit representation returned by API endpoints."""

    id: str
    name: str
    category: str
    description: str
    voice: str
    primary_color: str
    secondary_color: str
    tagline: str
    logo_url: Optional[str] = None
    logo_label: str
    is_demo: bool
    data_origin: str
    updated_at: str
