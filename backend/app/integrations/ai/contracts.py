"""Capability-level contracts for AI text, banner, and video concept generation providers."""

from typing import List, Optional, Protocol

from pydantic import BaseModel, Field


class BrandContextInput(BaseModel):
    """Sanitized Brand Kit context passed to the AI provider adapter."""

    name: str
    category: str
    description: str
    voice: str
    primary_color: str
    secondary_color: str
    tagline: str = ""


class ProductContextInput(BaseModel):
    """Sanitized Product context passed to the AI provider adapter."""

    name: str
    description: str
    price: Optional[str] = None
    benefits: List[str] = Field(default_factory=list)
    offer: Optional[str] = None
    audience: Optional[str] = None


class ContentGenerationRequest(BaseModel):
    """Validated request contract for Individual Content or Do My Campaign."""

    mode: str  # "individual_content" | "do_my_campaign"
    brand: BrandContextInput
    product: Optional[ProductContextInput] = None
    campaign_name: str
    objective: str
    audience: str
    channel: str
    tone: str
    key_message: str
    requested_format: str = "social_post"  # "social_post" | "promo_banner" | "video_concept" | "ad_copy"
    variation_seed: int = 0


class VideoScene(BaseModel):
    """Structured frame / scene for a video concept storyboard."""

    scene_number: int
    duration_seconds: int
    scene_title: str
    visual_description: str
    on_screen_text: str
    voiceover: str


class GeneratedAssetDraft(BaseModel):
    """Structured draft asset validated before storage or UI rendering."""

    asset_type: str  # "social_post" | "promo_banner" | "video_concept" | "ad_copy"
    channel: str
    title: str
    headline: str
    caption: str
    cta: str
    hashtags: List[str]
    sequence_step: str
    template_id: str
    is_demo: bool = True
    provider_label: str
    aspect_ratio: str = "1:1"  # "1:1" | "16:9" | "9:16"
    banner_theme: str = "modern_indigo"
    video_scenes: List[VideoScene] = Field(default_factory=list)


class ContentGenerationResult(BaseModel):
    """Normalized provider response returned by any AI adapter."""

    provider_name: str
    provider_label: str
    is_demo_output: bool
    brief_summary: str
    assets: List[GeneratedAssetDraft]


class TextGenerationProvider(Protocol):
    """Application-level interface isolating feature services from AI vendor SDKs."""

    def generate_individual_content(
        self, request: ContentGenerationRequest
    ) -> ContentGenerationResult:
        """Generate variants for a single requested content format."""
        ...

    def generate_campaign_package(
        self, request: ContentGenerationRequest
    ) -> ContentGenerationResult:
        """Generate a coordinated multi-asset draft campaign package."""
        ...
