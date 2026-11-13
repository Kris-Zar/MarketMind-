"""Business logic for Campaign Planning and Brief Assembly."""

from typing import List, Optional
from uuid import uuid4

from app.common.errors import NotFoundError, ValidationAppError
from app.modules.brands.service import BrandService, utc_now_iso
from app.modules.campaigns.repository import CampaignRepository
from app.modules.campaigns.schemas import CampaignCreate, CampaignResponse, CampaignUpdate
from app.modules.products.service import ProductService

OBJECTIVE_LABELS = {
    "awareness": "Brand Awareness",
    "engagement": "Audience Engagement",
    "traffic": "Website Traffic",
    "product_launch": "Product Launch",
    "lead_generation": "Lead Generation",
    "sales_promotion": "Sales Promotion",
}


def compose_campaign_brief_summary(
    brand_name: str,
    product_name: Optional[str],
    objective: str,
    channel: str,
    audience: str,
    mode: str,
) -> str:
    """Create a concise, reviewable campaign brief summary grounded in user selections."""
    mode_label = "Do My Campaign package" if mode == "do_my_campaign" else "Individual Content item"
    objective_label = OBJECTIVE_LABELS.get(objective, objective.replace("_", " ").title())
    subject = f"{brand_name} · {product_name}" if product_name else brand_name
    return (
        f"{mode_label} focused on {objective_label} for {subject} on {channel}, "
        f"targeting {audience}."
    )


class CampaignService:
    """Coordinates campaign draft creation, validation, and brief review updates."""

    def __init__(
        self,
        repository: CampaignRepository,
        brand_service: BrandService,
        product_service: ProductService,
    ) -> None:
        self._repository = repository
        self._brand_service = brand_service
        self._product_service = product_service

    def list_campaigns(self) -> List[CampaignResponse]:
        """Return all campaigns in the prototype workspace."""
        return [CampaignResponse(**item) for item in self._repository.list_campaigns()]

    def get_campaign_by_id(self, campaign_id: str) -> CampaignResponse:
        """Retrieve a campaign brief or raise NotFoundError."""
        record = self._repository.get_campaign_by_id(campaign_id)
        if not record:
            raise NotFoundError("Campaign", campaign_id)
        return CampaignResponse(**record)

    def create_campaign_draft(self, payload: CampaignCreate) -> CampaignResponse:
        """Validate brand/product references and persist a reviewable campaign draft."""
        brand = self._brand_service.get_brand_by_id(payload.brand_id)
        product_name: Optional[str] = None
        if payload.product_id:
            product = self._product_service.get_product_by_id(payload.product_id)
            if product.brand_id != brand.id:
                raise ValidationAppError(
                    "Selected product must belong to the chosen Brand Kit."
                )
            product_name = product.name

        brief_summary = compose_campaign_brief_summary(
            brand_name=brand.name,
            product_name=product_name,
            objective=payload.objective,
            channel=payload.channel.strip(),
            audience=payload.audience.strip(),
            mode=payload.mode,
        )
        record = {
            "id": f"camp-{uuid4().hex[:10]}",
            "name": payload.name.strip(),
            "brand_id": brand.id,
            "product_id": payload.product_id,
            "objective": payload.objective,
            "audience": payload.audience.strip(),
            "channel": payload.channel.strip(),
            "tone": payload.tone.strip(),
            "key_message": payload.key_message.strip(),
            "mode": payload.mode,
            "status": "draft",
            "brief_summary": brief_summary,
            "is_demo": False,
            "data_origin": "user_prototype",
            "updated_at": utc_now_iso(),
        }
        saved = self._repository.save_campaign(record)
        return CampaignResponse(**saved)

    def update_campaign_draft(
        self, campaign_id: str, payload: CampaignUpdate
    ) -> CampaignResponse:
        """Update campaign details or status while keeping brand/product integrity."""
        existing = self.get_campaign_by_id(campaign_id)
        patch = payload.model_dump(exclude_unset=True)
        product_id = patch.get("product_id", existing.product_id)
        product_name: Optional[str] = None
        if product_id:
            product = self._product_service.get_product_by_id(product_id)
            if product.brand_id != existing.brand_id:
                raise ValidationAppError(
                    "Selected product must belong to the campaign Brand Kit."
                )
            product_name = product.name

        brand = self._brand_service.get_brand_by_id(existing.brand_id)
        if "brief_summary" not in patch:
            patch["brief_summary"] = compose_campaign_brief_summary(
                brand_name=brand.name,
                product_name=product_name,
                objective=patch.get("objective", existing.objective),
                channel=patch.get("channel", existing.channel),
                audience=patch.get("audience", existing.audience),
                mode=patch.get("mode", existing.mode),
            )
        patch["updated_at"] = utc_now_iso()
        updated = self._repository.update_campaign(campaign_id, patch)
        return CampaignResponse(**updated)
