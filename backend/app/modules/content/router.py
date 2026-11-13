"""Thin HTTP endpoints for Content Generation, Editing, and Export."""

from typing import List

from fastapi import APIRouter, Depends

from app.core.dependencies import get_content_service
from app.modules.content.schemas import (
    CampaignExportBundle,
    ContentAssetResponse,
    ContentAssetUpdate,
    GenerateCampaignContentRequest,
    GenerationBatchResponse,
    RegenerateAssetRequest,
)
from app.modules.content.service import ContentService

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/campaigns/{campaign_id}/assets", response_model=List[ContentAssetResponse])
def list_campaign_assets_endpoint(
    campaign_id: str,
    service: ContentService = Depends(get_content_service),
) -> List[ContentAssetResponse]:
    """List saved draft assets for a campaign."""
    return service.list_campaign_assets(campaign_id)


@router.post("/campaigns/{campaign_id}/generate", response_model=GenerationBatchResponse)
def generate_campaign_content_endpoint(
    campaign_id: str,
    payload: GenerateCampaignContentRequest,
    service: ContentService = Depends(get_content_service),
) -> GenerationBatchResponse:
    """Generate Individual Content or Do My Campaign draft assets."""
    return service.generate_for_campaign(campaign_id, payload)


@router.patch("/assets/{asset_id}", response_model=ContentAssetResponse)
def update_asset_copy_endpoint(
    asset_id: str,
    payload: ContentAssetUpdate,
    service: ContentService = Depends(get_content_service),
) -> ContentAssetResponse:
    """Save edits to a draft asset's headline, caption, CTA, hashtags, or status."""
    return service.update_asset_copy(asset_id, payload)


@router.post("/assets/{asset_id}/regenerate", response_model=ContentAssetResponse)
def regenerate_asset_endpoint(
    asset_id: str,
    payload: RegenerateAssetRequest,
    service: ContentService = Depends(get_content_service),
) -> ContentAssetResponse:
    """Regenerate one draft asset variant without altering sibling assets."""
    return service.regenerate_asset_variant(asset_id, payload)


@router.get("/campaigns/{campaign_id}/export", response_model=CampaignExportBundle)
def export_campaign_bundle_endpoint(
    campaign_id: str,
    service: ContentService = Depends(get_content_service),
) -> CampaignExportBundle:
    """Generate a real downloadable Markdown and JSON bundle for a campaign."""
    return service.export_campaign_bundle(campaign_id)
