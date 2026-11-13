"""Business logic for AI Content Generation, Asset Editing, and Real Export."""

import json
import re
from typing import List, Optional
from uuid import uuid4

from app.common.errors import NotFoundError
from app.integrations.ai.contracts import (
    BrandContextInput,
    ContentGenerationRequest,
    ProductContextInput,
    TextGenerationProvider,
)
from app.modules.brands.schemas import BrandResponse
from app.modules.brands.service import BrandService, utc_now_iso
from app.modules.campaigns.schemas import CampaignResponse, CampaignUpdate
from app.modules.campaigns.service import CampaignService
from app.modules.content.repository import ContentRepository
from app.modules.content.schemas import (
    CampaignExportBundle,
    ContentAssetResponse,
    ContentAssetUpdate,
    GenerateCampaignContentRequest,
    GenerationBatchResponse,
    RegenerateAssetRequest,
)
from app.modules.products.schemas import ProductResponse
from app.modules.products.service import ProductService


def slugify_filename(value: str) -> str:
    """Convert campaign name into a safe lowercase filename slug."""
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return cleaned or "marketmind-campaign"


def build_generation_context(
    brand: BrandResponse,
    product: Optional[ProductResponse],
    campaign: CampaignResponse,
    mode: str,
    requested_format: str,
    variation_seed: int,
) -> ContentGenerationRequest:
    """Assemble isolated Brand, Product, and Campaign context for the AI provider."""
    product_input = (
        ProductContextInput(
            name=product.name,
            description=product.description,
            price=product.price,
            benefits=product.benefits,
            offer=product.offer,
            audience=product.audience,
        )
        if product
        else None
    )
    return ContentGenerationRequest(
        mode=mode,
        brand=BrandContextInput(
            name=brand.name,
            category=brand.category,
            description=brand.description,
            voice=brand.voice,
            primary_color=brand.primary_color,
            secondary_color=brand.secondary_color,
            tagline=brand.tagline,
        ),
        product=product_input,
        campaign_name=campaign.name,
        objective=campaign.objective,
        audience=campaign.audience,
        channel=campaign.channel,
        tone=campaign.tone,
        key_message=campaign.key_message,
        requested_format=requested_format,
        variation_seed=variation_seed,
    )


def format_export_markdown(
    campaign: CampaignResponse,
    brand: BrandResponse,
    product: Optional[ProductResponse],
    assets: List[ContentAssetResponse],
    exported_at: str,
) -> str:
    """Build a human-readable Markdown campaign brief and copy export."""
    lines = [
        f"# {campaign.name}",
        "",
        f"- **Exported:** {exported_at}",
        f"- **Phase 0 Notice:** Demo/Prototype draft output (not published externally)",
        f"- **Mode:** {'Do My Campaign' if campaign.mode == 'do_my_campaign' else 'Individual Content'}",
        f"- **Brand:** {brand.name} ({brand.category})",
        f"- **Brand Colors:** {brand.primary_color} / {brand.secondary_color}",
        f"- **Product:** {product.name if product else 'General Brand Campaign'}",
        f"- **Objective:** {campaign.objective}",
        f"- **Target Audience:** {campaign.audience}",
        f"- **Primary Channel:** {campaign.channel}",
        f"- **Tone:** {campaign.tone}",
        f"- **Key Message:** {campaign.key_message}",
        "",
        "## Campaign Brief Summary",
        campaign.brief_summary,
        "",
        "## Draft Assets",
    ]
    if not assets:
        lines.append("_No draft assets generated yet._")
    for idx, asset in enumerate(assets, start=1):
        lines.extend(
            [
                "",
                f"### {idx}. {asset.title}",
                f"- **Channel:** {asset.channel}",
                f"- **Format:** {asset.asset_type}",
                f"- **Sequence:** {asset.sequence_step}",
                f"- **Status:** {asset.status}",
                f"- **Origin:** {asset.provider_label}",
                f"- **Headline:** {asset.headline}",
                f"- **Caption:** {asset.caption}",
                f"- **CTA:** {asset.cta}",
                f"- **Hashtags:** {' '.join(asset.hashtags)}",
            ]
        )
        if asset.video_scenes:
            lines.append("- **15s Video Concept Storyboard:**")
            for scene in asset.video_scenes:
                lines.append(
                    f"  - **{scene.scene_title} ({scene.duration_seconds}s):** "
                    f"Visual: {scene.visual_description} | On-Screen: '{scene.on_screen_text}' | Voiceover: '{scene.voiceover}'"
                )
    return "\n".join(lines) + "\n"


class ContentService:
    """Orchestrates campaign content generation, editing, regeneration, and export."""

    def __init__(
        self,
        repository: ContentRepository,
        campaign_service: CampaignService,
        brand_service: BrandService,
        product_service: ProductService,
        ai_provider: TextGenerationProvider,
    ) -> None:
        self._repository = repository
        self._campaign_service = campaign_service
        self._brand_service = brand_service
        self._product_service = product_service
        self._ai_provider = ai_provider

    def list_campaign_assets(self, campaign_id: str) -> List[ContentAssetResponse]:
        """List stored draft assets for an existing campaign."""
        self._campaign_service.get_campaign_by_id(campaign_id)
        return [
            ContentAssetResponse(**item)
            for item in self._repository.list_assets_by_campaign(campaign_id)
        ]

    def generate_for_campaign(
        self,
        campaign_id: str,
        payload: GenerateCampaignContentRequest,
    ) -> GenerationBatchResponse:
        """Generate Individual Content variants or a Do My Campaign package."""
        campaign = self._campaign_service.get_campaign_by_id(campaign_id)
        brand = self._brand_service.get_brand_by_id(campaign.brand_id)
        product = (
            self._product_service.get_product_by_id(campaign.product_id)
            if campaign.product_id
            else None
        )
        effective_mode = payload.mode or campaign.mode
        request = build_generation_context(
            brand=brand,
            product=product,
            campaign=campaign,
            mode=effective_mode,
            requested_format=payload.requested_format,
            variation_seed=payload.variation_seed,
        )
        if effective_mode == "individual_content":
            result = self._ai_provider.generate_individual_content(request)
        else:
            result = self._ai_provider.generate_campaign_package(request)

        now = utc_now_iso()
        stored_records = [
            {
                "id": f"asset-{uuid4().hex[:10]}",
                "campaign_id": campaign.id,
                "mode": effective_mode,
                "asset_type": draft.asset_type,
                "channel": draft.channel,
                "title": draft.title,
                "headline": draft.headline,
                "caption": draft.caption,
                "cta": draft.cta,
                "hashtags": draft.hashtags,
                "sequence_step": draft.sequence_step,
                "template_id": draft.template_id,
                "is_editable_text": True,
                "is_demo": draft.is_demo,
                "provider_label": draft.provider_label,
                "status": "draft",
                "aspect_ratio": draft.aspect_ratio,
                "banner_theme": draft.banner_theme,
                "video_scenes": [s.model_dump() for s in draft.video_scenes],
                "updated_at": now,
            }
            for draft in result.assets
        ]
        self._repository.replace_campaign_assets(campaign.id, stored_records)
        self._campaign_service.update_campaign_draft(
            campaign.id,
            CampaignUpdate(
                mode=effective_mode,
                status="needs_review",
                brief_summary=result.brief_summary,
            ),
        )

        return GenerationBatchResponse(
            campaign_id=campaign.id,
            mode=effective_mode,
            provider_name=result.provider_name,
            provider_label=result.provider_label,
            is_demo_output=result.is_demo_output,
            brief_summary=result.brief_summary,
            assets=[ContentAssetResponse(**item) for item in stored_records],
        )

    def update_asset_copy(
        self, asset_id: str, payload: ContentAssetUpdate
    ) -> ContentAssetResponse:
        """Persist user edits to a generated draft asset."""
        existing = self._repository.get_asset_by_id(asset_id)
        if not existing:
            raise NotFoundError("Content Asset", asset_id)
        patch = payload.model_dump(exclude_unset=True)
        if "hashtags" in patch and patch["hashtags"] is not None:
            patch["hashtags"] = [tag.strip() for tag in patch["hashtags"] if tag.strip()]
        patch["updated_at"] = utc_now_iso()
        updated = self._repository.update_asset(asset_id, patch)
        return ContentAssetResponse(**updated)

    def regenerate_asset_variant(
        self, asset_id: str, payload: RegenerateAssetRequest
    ) -> ContentAssetResponse:
        """Regenerate one asset's copy without overwriting sibling campaign assets."""
        existing = self._repository.get_asset_by_id(asset_id)
        if not existing:
            raise NotFoundError("Content Asset", asset_id)
        campaign = self._campaign_service.get_campaign_by_id(existing["campaign_id"])
        brand = self._brand_service.get_brand_by_id(campaign.brand_id)
        product = (
            self._product_service.get_product_by_id(campaign.product_id)
            if campaign.product_id
            else None
        )
        request = build_generation_context(
            brand=brand,
            product=product,
            campaign=campaign,
            mode="individual_content",
            requested_format=existing["asset_type"],
            variation_seed=payload.variation_seed,
        )
        result = self._ai_provider.generate_individual_content(request)
        candidate = result.assets[0]
        updated = self._repository.update_asset(
            asset_id,
            {
                "headline": candidate.headline,
                "caption": candidate.caption,
                "cta": candidate.cta,
                "hashtags": candidate.hashtags,
                "aspect_ratio": candidate.aspect_ratio,
                "banner_theme": candidate.banner_theme,
                "video_scenes": [s.model_dump() for s in candidate.video_scenes],
                "status": "draft",
                "provider_label": result.provider_label,
                "updated_at": utc_now_iso(),
            },
        )
        return ContentAssetResponse(**updated)

    def export_campaign_bundle(self, campaign_id: str) -> CampaignExportBundle:
        """Create a real downloadable Markdown and JSON bundle for a campaign."""
        campaign = self._campaign_service.get_campaign_by_id(campaign_id)
        brand = self._brand_service.get_brand_by_id(campaign.brand_id)
        product = (
            self._product_service.get_product_by_id(campaign.product_id)
            if campaign.product_id
            else None
        )
        assets = self.list_campaign_assets(campaign_id)
        exported_at = utc_now_iso()
        markdown_content = format_export_markdown(
            campaign=campaign,
            brand=brand,
            product=product,
            assets=assets,
            exported_at=exported_at,
        )
        json_payload = {
            "prototype_notice": "Phase 0 Guide-Ready Prototype Export — Demo/Draft Content",
            "exported_at": exported_at,
            "brand": brand.model_dump(),
            "product": product.model_dump() if product else None,
            "campaign": campaign.model_dump(),
            "assets": [asset.model_dump() for asset in assets],
        }
        return CampaignExportBundle(
            campaign_id=campaign.id,
            filename_base=f"{slugify_filename(campaign.name)}-phase0-export",
            markdown_content=markdown_content,
            json_content=json.dumps(json_payload, indent=2),
            exported_at=exported_at,
        )
