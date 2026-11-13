"""Thin HTTP endpoints for Campaign Setup and Brief Review."""

from typing import List

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_campaign_service, get_content_service
from app.modules.campaigns.schemas import CampaignCreate, CampaignResponse, CampaignUpdate
from app.modules.campaigns.service import CampaignService
from app.modules.content.schemas import GenerateCampaignContentRequest
from app.modules.content.service import ContentService

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=List[CampaignResponse])
def list_campaigns_endpoint(
    service: CampaignService = Depends(get_campaign_service),
) -> List[CampaignResponse]:
    """List all campaign drafts in the prototype workspace."""
    return service.list_campaigns()


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign_endpoint(
    campaign_id: str,
    service: CampaignService = Depends(get_campaign_service),
) -> CampaignResponse:
    """Retrieve a single campaign brief."""
    return service.get_campaign_by_id(campaign_id)


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign_endpoint(
    payload: CampaignCreate,
    service: CampaignService = Depends(get_campaign_service),
    content_service: ContentService = Depends(get_content_service),
) -> CampaignResponse:
    """Create a campaign brief draft and auto-generate the initial content package."""
    campaign = service.create_campaign_draft(payload)
    try:
        # Pre-generate initial drafts so the studio is immediately ready for review
        content_service.generate_for_campaign(
            campaign.id,
            GenerateCampaignContentRequest(mode=campaign.mode),
        )
    except Exception:
        # Do not block campaign creation if generation fails
        pass
    return campaign


@router.patch("/{campaign_id}", response_model=CampaignResponse)
def update_campaign_endpoint(
    campaign_id: str,
    payload: CampaignUpdate,
    service: CampaignService = Depends(get_campaign_service),
) -> CampaignResponse:
    """Update an existing campaign brief or approve its review status."""
    return service.update_campaign_draft(campaign_id, payload)
