"""Pydantic schemas for Content Generation, Editing, and Export."""

from typing import List, Literal, Optional

from pydantic import BaseModel, Field

from app.integrations.ai.contracts import VideoScene

ContentFormat = Literal["social_post", "promo_banner", "video_concept", "ad_copy", "carousel_concept"]
AssetStatus = Literal["draft", "approved"]


class GenerateCampaignContentRequest(BaseModel):
    """Input schema for generating Individual Content or Do My Campaign drafts."""

    mode: Optional[Literal["individual_content", "do_my_campaign"]] = None
    requested_format: ContentFormat = "social_post"
    variation_seed: int = Field(default=0, ge=0, le=100)


class RegenerateAssetRequest(BaseModel):
    """Input schema for regenerating a single asset variant."""

    variation_seed: int = Field(default=1, ge=0, le=100)


class ContentAssetUpdate(BaseModel):
    """Input schema for editing visible copy fields on a draft asset."""

    headline: Optional[str] = Field(default=None, min_length=2, max_length=160)
    caption: Optional[str] = Field(default=None, min_length=4, max_length=1000)
    cta: Optional[str] = Field(default=None, min_length=2, max_length=80)
    hashtags: Optional[List[str]] = Field(default=None, max_length=8)
    aspect_ratio: Optional[str] = None
    banner_theme: Optional[str] = None
    status: Optional[AssetStatus] = None


class ContentAssetResponse(BaseModel):
    """Serialized draft asset returned to the frontend studio."""

    id: str
    campaign_id: str
    mode: str
    asset_type: str
    channel: str
    title: str
    headline: str
    caption: str
    cta: str
    hashtags: List[str]
    sequence_step: str
    template_id: str
    is_editable_text: bool
    is_demo: bool
    provider_label: str
    status: str
    updated_at: str
    aspect_ratio: str = "1:1"
    banner_theme: str = "modern_indigo"
    video_scenes: List[VideoScene] = Field(default_factory=list)


class GenerationBatchResponse(BaseModel):
    """Normalized generation response including provider provenance."""

    campaign_id: str
    mode: str
    provider_name: str
    provider_label: str
    is_demo_output: bool
    brief_summary: str
    assets: List[ContentAssetResponse]


class CampaignExportBundle(BaseModel):
    """Real downloadable export package generated from saved campaign records."""

    campaign_id: str
    filename_base: str
    markdown_content: str
    json_content: str
    exported_at: str
