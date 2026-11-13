"""Dynamic generative AI provider for Phase 0.

Produces rich, contextually grounded drafts across multiple marketing formats:
1. Social Media Posts
2. Branded Promotional Banners (Square 1:1, Story 9:16, Landscape 16:9)
3. 4-Scene Video Ad Storyboard Concepts ("video images" with visual prompts and voiceovers)
4. Direct Response Ad Copy
"""

import re
from typing import List

from app.integrations.ai.contracts import (
    ContentGenerationRequest,
    ContentGenerationResult,
    GeneratedAssetDraft,
    VideoScene,
)

OBJECTIVE_HOOKS = {
    "product_launch": ("Introducing", "Meet the New Standard in", "Now Available:"),
    "awareness": ("Discover Why Everyone is Talking About", "Say Goodbye to Bad Mornings with", "The Secret to"),
    "engagement": ("What's Your Morning Routine with", "Coffee Lovers: Would You Choose", "The Ultimate Debate:"),
    "traffic": ("Experience the Difference of", "Explore the Official Release of", "Tap to Tour the"),
    "sales_promotion": ("Limited Release: Save on", "Special Offer Inside:", "Unlock 15% Off Your First"),
    "lead_generation": ("Get Early Access to", "Join the Private Tasting of", "Reserve Your Exclusive"),
}

FORMAT_LABELS = {
    "social_post": "Social Media Post",
    "promo_banner": "Promotional Banner",
    "video_concept": "15s Video Ad Storyboard",
    "ad_copy": "Direct Response Ad Copy",
    "carousel_concept": "Carousel Slide Concept",
}


def build_brand_hashtags(brand_name: str, channel: str, product_name: str | None) -> List[str]:
    """Build clean alphanumeric hashtags grounded in brand and product names."""
    clean_brand = re.sub(r"[^A-Za-z0-9]", "", brand_name) or "MarketMind"
    tags = [f"#{clean_brand}"]
    if product_name:
        first_word = re.sub(r"[^A-Za-z0-9]", "", product_name.split()[0])
        if first_word:
            tags.append(f"#{first_word}")
    clean_channel = re.sub(r"[^A-Za-z0-9]", "", channel.split()[0])
    if clean_channel:
        tags.append(f"#{clean_channel}Marketing")
    return tags[:4]


def resolve_cta(objective: str, offer: str | None) -> str:
    """Select an actionable CTA aligned with objective and optional offer."""
    if offer and objective in {"sales_promotion", "product_launch"}:
        return "Claim Limited Offer"
    if objective == "product_launch":
        return "Explore the Launch"
    if objective == "traffic":
        return "Visit Official Store"
    if objective == "lead_generation":
        return "Get Early Access"
    if objective == "engagement":
        return "Tell Us in Comments"
    return "Discover More"


def build_video_storyboard_scenes(
    brand_name: str,
    subject: str,
    audience: str,
    tone: str,
    key_message: str,
    offer: str | None,
    benefits: List[str],
) -> List[VideoScene]:
    """Construct an engaging 4-scene video ad concept storyboard."""
    top_benefit = benefits[0] if benefits else "exceptional handcrafted quality"
    second_benefit = benefits[1] if len(benefits) > 1 else "clean, effortless enjoyment"
    offer_note = offer if offer else f"Crafted by {brand_name}"

    return [
        VideoScene(
            scene_number=1,
            duration_seconds=3,
            scene_title="Scene 1 — The Hook (0–3s)",
            visual_description=(
                f"Close-up high-contrast cinematic shot of {subject}. Warm natural lighting illuminates "
                f"the rich texture while steam/condensation rolls down. Fast-paced camera push-in."
            ),
            on_screen_text=f"Tired of Compromising on {subject}?",
            voiceover=(
                f"What if your daily {subject} took less than thirty seconds and tasted like a master café pour?"
            ),
        ),
        VideoScene(
            scene_number=2,
            duration_seconds=4,
            scene_title="Scene 2 — The Problem & Feature (3–7s)",
            visual_description=(
                f"Split screen or macro transition showing the craft process. Clear text overlays highlight "
                f"{top_benefit}. The camera glides around {subject} as a busy professional smiles at their desk."
            ),
            on_screen_text=f"{top_benefit.upper()}",
            voiceover=(
                f"{brand_name} engineered {subject} specifically for {audience}. With {top_benefit}, "
                f"you never have to wait in line again."
            ),
        ),
        VideoScene(
            scene_number=3,
            duration_seconds=4,
            scene_title="Scene 3 — The Transformation (7–11s)",
            visual_description=(
                f"Dynamic slow-motion pour or reveal. Golden-hour lighting fills the frame. Customer takes a "
                f"refreshing sip, visibly relaxed. On-screen badge animates with: '{second_benefit}'."
            ),
            on_screen_text=f"{second_benefit.title()}",
            voiceover=(
                f"No artificial ingredients, no bitter aftertaste. Just pure, clean craft in a {tone.lower()} rhythm."
            ),
        ),
        VideoScene(
            scene_number=4,
            duration_seconds=4,
            scene_title="Scene 4 — Call to Action (11–15s)",
            visual_description=(
                f"Branded end card in {brand_name} colors. Hero bottle/product centered with animated limited-offer badge. "
                f"Pulsing 'Tap to Shop' CTA button appears below the logo."
            ),
            on_screen_text=f"{offer_note.upper()} · TAP LINK IN BIO",
            voiceover=(
                f"Experience {subject} today. {offer_note}. Click the link to claim yours before this batch sells out."
            ),
        ),
    ]


class MockDemoTextGenerationProvider:
    """Dynamic generator producing rich, grounded copy, banners, and video concepts."""

    provider_name = "smart_generative_engine"
    provider_label = "Smart Creative Generator (Phase 0 Prototype)"

    def generate_individual_content(
        self, request: ContentGenerationRequest
    ) -> ContentGenerationResult:
        """Generate 2 diverse variants tailored to the selected format."""
        subject = request.product.name if request.product else request.brand.name
        cta = resolve_cta(request.objective, request.product.offer if request.product else None)
        hashtags = build_brand_hashtags(
            request.brand.name,
            request.channel,
            request.product.name if request.product else None,
        )
        benefits = request.product.benefits if request.product else []
        offer = request.product.offer if request.product else None

        format_type = request.requested_format

        if format_type == "video_concept":
            # Video Storyboard Option
            scenes_opt1 = build_video_storyboard_scenes(
                brand_name=request.brand.name,
                subject=subject,
                audience=request.audience,
                tone=request.tone,
                key_message=request.key_message,
                offer=offer,
                benefits=benefits,
            )
            scenes_opt2 = build_video_storyboard_scenes(
                brand_name=request.brand.name,
                subject=f"{subject} Experience",
                audience=request.audience,
                tone="Bold & Dynamic",
                key_message=request.key_message,
                offer="Complimentary Starter Kit",
                benefits=benefits,
            )

            assets = [
                GeneratedAssetDraft(
                    asset_type="video_concept",
                    channel=f"{request.channel} Video / Reel (15s)",
                    title="15s Video Ad Storyboard (Option 1)",
                    headline=f"How {subject} Transformed My Daily Routine",
                    caption=(
                        f"Complete 4-scene video ad concept for {request.channel}. "
                        f"Features hook, feature highlight ({benefits[0] if benefits else 'craft quality'}), "
                        f"and branded call-to-action."
                    ),
                    cta=cta,
                    hashtags=hashtags,
                    sequence_step="Full 15s Storyboard",
                    template_id="video_storyboard",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="9:16",
                    banner_theme="modern_indigo",
                    video_scenes=scenes_opt1,
                ),
                GeneratedAssetDraft(
                    asset_type="video_concept",
                    channel=f"{request.channel} Video / Short (15s)",
                    title="High-Energy Problem/Solution Video (Option 2)",
                    headline=f"Stop Settling for Mediocre {subject}",
                    caption=(
                        f"Punchy, high-retention video ad framework optimized for short-form video algorithms. "
                        f"Speaks directly to {request.audience} in an energetic tone."
                    ),
                    cta="Watch Full Demo",
                    hashtags=hashtags,
                    sequence_step="High-Energy Variation",
                    template_id="video_storyboard",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="9:16",
                    banner_theme="sunset_warm",
                    video_scenes=scenes_opt2,
                ),
            ]
        elif format_type == "promo_banner":
            assets = [
                GeneratedAssetDraft(
                    asset_type="promo_banner",
                    channel=f"{request.channel} Square Banner (1:1)",
                    title="1:1 Product Hero Split Banner",
                    headline=f"{subject} — Crafted for {request.audience.split(' ')[0]}",
                    caption=(
                        f"{request.key_message} {request.product.description if request.product else ''} "
                        f"{'Special offer: ' + offer if offer else ''}"
                    ),
                    cta=offer if offer else cta,
                    hashtags=hashtags[:2],
                    sequence_step="Square Feed Banner",
                    template_id="promo_split_banner",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="1:1",
                    banner_theme="modern_indigo",
                ),
                GeneratedAssetDraft(
                    asset_type="promo_banner",
                    channel=f"{request.channel} Story Banner (9:16)",
                    title="9:16 Full-Bleed Story Banner",
                    headline=f"Unlock Café Quality with {subject}",
                    caption=(
                        f"{benefits[0] if benefits else 'Handcrafted perfection.'} "
                        f"Designed with love by {request.brand.name}."
                    ),
                    cta=cta,
                    hashtags=hashtags[:2],
                    sequence_step="Vertical Story Banner",
                    template_id="promo_split_banner",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="9:16",
                    banner_theme="sunset_warm",
                ),
            ]
        else:
            # Social Media Post variants
            assets = [
                GeneratedAssetDraft(
                    asset_type="social_post",
                    channel=f"{request.channel} Feed",
                    title="Benefit-Led Hero Post (Option 1)",
                    headline=f"Meet {subject}: Your Daily Upgrade",
                    caption=(
                        f"Skip the morning hassle. {request.brand.name}'s {subject} delivers "
                        f"{benefits[0] if benefits else 'pure craft quality'} without the wait. "
                        f"{request.key_message} Built with care for {request.audience}."
                    ),
                    cta=cta,
                    hashtags=hashtags,
                    sequence_step="Primary Post",
                    template_id="hero_product_card",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="1:1",
                    banner_theme="modern_indigo",
                ),
                GeneratedAssetDraft(
                    asset_type="social_post",
                    channel=f"{request.channel} Carousel / Feed",
                    title="Storytelling Curiosity Angle (Option 2)",
                    headline=f"Why We Stopped Drinking Ordinary {subject}",
                    caption=(
                        f"Most options are mass-produced and stale. We wanted something better. "
                        f"{request.brand.tagline or request.brand.name}: {request.key_message} "
                        f"{'Take advantage of: ' + offer if offer else 'Available now.'}"
                    ),
                    cta="Read Our Story",
                    hashtags=hashtags,
                    sequence_step="Storytelling Angle",
                    template_id="hero_product_card",
                    is_demo=True,
                    provider_label=self.provider_label,
                    aspect_ratio="1:1",
                    banner_theme="minimal_dark",
                ),
            ]

        format_name = FORMAT_LABELS.get(format_type, "Content Package")
        return ContentGenerationResult(
            provider_name=self.provider_name,
            provider_label=self.provider_label,
            is_demo_output=True,
            brief_summary=f"Dynamic {format_name} drafts for '{request.campaign_name}' ({request.brand.name} · {subject}) on {request.channel}.",
            assets=assets,
        )

    def generate_campaign_package(
        self, request: ContentGenerationRequest
    ) -> ContentGenerationResult:
        """Generate a complete 3-asset coordinated package: Social Post, Banner, and Video Storyboard!"""
        subject = request.product.name if request.product else request.brand.name
        cta = resolve_cta(request.objective, request.product.offer if request.product else None)
        hashtags = build_brand_hashtags(
            request.brand.name,
            request.channel,
            request.product.name if request.product else None,
        )
        benefits = request.product.benefits if request.product else []
        offer = request.product.offer if request.product else None

        scenes = build_video_storyboard_scenes(
            brand_name=request.brand.name,
            subject=subject,
            audience=request.audience,
            tone=request.tone,
            key_message=request.key_message,
            offer=offer,
            benefits=benefits,
        )

        assets = [
            # Asset 1: Hero Social Post
            GeneratedAssetDraft(
                asset_type="social_post",
                channel=f"{request.channel} Feed",
                title="1. Hero Launch Post",
                headline=f"Introducing {subject} by {request.brand.name}",
                caption=(
                    f"{request.key_message} Crafted for {request.audience} in a {request.tone.lower()} style. "
                    f"{'Key highlight: ' + benefits[0] + '.' if benefits else ''} "
                    f"{'Special launch offer: ' + offer + '.' if offer else ''}"
                ),
                cta=cta,
                hashtags=hashtags,
                sequence_step="Step 1 — Awareness Hook",
                template_id="hero_product_card",
                is_demo=True,
                provider_label=self.provider_label,
                aspect_ratio="1:1",
                banner_theme="modern_indigo",
            ),
            # Asset 2: Branded Promotional Banner
            GeneratedAssetDraft(
                asset_type="promo_banner",
                channel=f"{request.channel} Story & Display Banner",
                title="2. Branded Promo Banner",
                headline=f"{subject} — Limited Release Offer",
                caption=(
                    f"{'Enjoy ' + offer + '.' if offer else 'Experience premium craft quality.'} "
                    f"{benefits[0] if benefits else request.brand.description}"
                ),
                cta=offer if offer else cta,
                hashtags=hashtags[:2],
                sequence_step="Step 2 — Value & Social Proof",
                template_id="promo_split_banner",
                is_demo=True,
                provider_label=self.provider_label,
                aspect_ratio="1:1",
                banner_theme="sunset_warm",
            ),
            # Asset 3: 15s Video Concept & Storyboard ("Video Images")
            GeneratedAssetDraft(
                asset_type="video_concept",
                channel=f"{request.channel} Reels / Short Video (15s)",
                title="3. 15s Video Ad Storyboard & Scenes",
                headline=f"The 15-Second Story of {subject}",
                caption=(
                    f"Complete 4-frame video ad storyboard with camera visual prompts, voiceover, "
                    f"duration timing, and on-screen graphics tailored for {request.audience}."
                ),
                cta="Watch Video Concept",
                hashtags=hashtags,
                sequence_step="Step 3 — Conversion Video Ad",
                template_id="video_storyboard",
                is_demo=True,
                provider_label=self.provider_label,
                aspect_ratio="9:16",
                banner_theme="modern_indigo",
                video_scenes=scenes,
            ),
        ]

        return ContentGenerationResult(
            provider_name=self.provider_name,
            provider_label=self.provider_label,
            is_demo_output=True,
            brief_summary=(
                f"Coordinated draft package for '{request.campaign_name}' ({request.brand.name} · {subject}) "
                f"including Social Post, Branded Banner, and 15s Video Concept Storyboard."
            ),
            assets=assets,
        )
