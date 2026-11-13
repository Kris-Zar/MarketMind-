"""Pydantic schemas for Campaign Setup and Brief Review."""

from typing import Literal, Optional

from pydantic import BaseModel, Field

CampaignMode = Literal["individual_content", "do_my_campaign"]
CampaignObjective = Literal[
    "awareness",
    "engagement",
    "traffic",
    "product_launch",
    "lead_generation",
    "sales_promotion",
]
CampaignStatus = Literal["draft", "needs_review", "approved"]


class CampaignCreate(BaseModel):
    """Input schema for creating a campaign brief."""

    name: str = Field(min_length=2, max_length=120)
    brand_id: str = Field(min_length=1, max_length=80)
    product_id: Optional[str] = Field(default=None, max_length=80)
    objective: CampaignObjective
    audience: str = Field(min_length=3, max_length=240)
    channel: str = Field(min_length=2, max_length=60)
    tone: str = Field(min_length=2, max_length=80)
    key_message: str = Field(min_length=5, max_length=400)
    mode: CampaignMode = "do_my_campaign"


class CampaignUpdate(BaseModel):
    """Input schema for editing a campaign brief or status."""

    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    product_id: Optional[str] = Field(default=None, max_length=80)
    objective: Optional[CampaignObjective] = None
    audience: Optional[str] = Field(default=None, min_length=3, max_length=240)
    channel: Optional[str] = Field(default=None, min_length=2, max_length=60)
    tone: Optional[str] = Field(default=None, min_length=2, max_length=80)
    key_message: Optional[str] = Field(default=None, min_length=5, max_length=400)
    mode: Optional[CampaignMode] = None
    status: Optional[CampaignStatus] = None
    brief_summary: Optional[str] = Field(default=None, max_length=600)


class CampaignResponse(BaseModel):
    """Serialized Campaign Brief returned by API endpoints."""

    id: str
    name: str
    brand_id: str
    product_id: Optional[str] = None
    objective: str
    audience: str
    channel: str
    tone: str
    key_message: str
    mode: CampaignMode
    status: str
    brief_summary: str
    is_demo: bool
    data_origin: str
    updated_at: str
