"""Isolated Phase 0 demo seed fixtures.

All seeded entities are explicitly marked with `is_demo: True` and `data_origin: "demo"`
so demonstration data can never be confused with live production records.
"""

from urllib.parse import quote


def build_svg_data_url(svg_markup: str) -> str:
    """Encode an inline SVG graphic into a safe data URL for offline prototype previews."""
    return f"data:image/svg+xml;utf8,{quote(svg_markup.strip())}"


LUMABREW_LOGO_URL = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="24" fill="#635BFF"/>
      <circle cx="60" cy="60" r="34" fill="#FFFFFF" fill-opacity="0.16"/>
      <path d="M40 46h32v24a16 16 0 0 1-32 0V46z" fill="#FFFFFF"/>
      <path d="M72 52h8a8 8 0 0 1 0 16h-8" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      <path d="M49 34c0-5 5-5 5-10M61 34c0-5 5-5 5-10" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    </svg>
    """
)

VELOFIT_LOGO_URL = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="24" fill="#0F766E"/>
      <path d="M28 42l22 42 18-32 24 32" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="88" cy="36" r="8" fill="#8B5CF6"/>
    </svg>
    """
)

COLD_BREW_IMAGE_PRIMARY = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="cb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EEF2FF"/>
          <stop offset="100%" stop-color="#DDD6FE"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="20" fill="url(#cb)"/>
      <rect x="155" y="54" width="90" height="186" rx="18" fill="#1F2A44"/>
      <rect x="172" y="34" width="56" height="24" rx="6" fill="#635BFF"/>
      <rect x="165" y="102" width="70" height="86" rx="10" fill="#FFFFFF"/>
      <text x="200" y="142" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#172033">AURORA</text>
      <text x="200" y="160" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#667085">COLD BREW</text>
    </svg>
    """
)

COLD_BREW_IMAGE_SERVING = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" rx="20" fill="#F8FAFC"/>
      <circle cx="200" cy="150" r="96" fill="#EFEEFF"/>
      <path d="M150 92h100l-14 130H164L150 92z" fill="#635BFF" fill-opacity="0.9"/>
      <rect x="166" y="120" width="24" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.75"/>
      <rect x="196" y="134" width="24" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.6"/>
      <rect x="195" y="56" width="10" height="120" rx="4" fill="#1F2A44"/>
    </svg>
    """
)

TUMBLER_IMAGE_PRIMARY = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" rx="20" fill="#F1F5F9"/>
      <path d="M160 80h80l-10 150h-60L160 80z" fill="#172033"/>
      <rect x="155" y="68" width="90" height="16" rx="6" fill="#635BFF"/>
      <rect x="168" y="128" width="64" height="44" rx="8" fill="#FFFFFF" fill-opacity="0.18"/>
    </svg>
    """
)

YOGA_MAT_IMAGE_PRIMARY = build_svg_data_url(
    """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" rx="20" fill="#ECFDF5"/>
      <rect x="90" y="122" width="220" height="60" rx="30" fill="#0F766E"/>
      <circle cx="120" cy="152" r="24" fill="#14B8A6"/>
      <circle cx="120" cy="152" r="10" fill="#0F766E"/>
    </svg>
    """
)


def build_initial_demo_store() -> dict:
    """Return initial clearly labelled demo records for Phase 0."""
    timestamp = "2026-11-12T10:00:00Z"
    return {
        "brands": [
            {
                "id": "brand-demo-lumabrew",
                "name": "LumaBrew Roasters",
                "category": "Specialty Coffee & Beverages",
                "description": (
                    "Small-batch cold brew and everyday coffee gear crafted for busy "
                    "remote professionals and home baristas."
                ),
                "voice": "Warm, Modern & Craft-Focused",
                "primary_color": "#635BFF",
                "secondary_color": "#1F2A44",
                "tagline": "Crafted mornings, without the rush.",
                "logo_url": LUMABREW_LOGO_URL,
                "logo_label": "Sample SVG Logo — LumaBrew",
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            },
            {
                "id": "brand-demo-velofit",
                "name": "VeloFit Studio",
                "category": "Activewear & Wellness",
                "description": (
                    "Minimalist movement essentials designed for home workouts, "
                    "commutes, and everyday recovery."
                ),
                "voice": "Energetic, Clear & Encouraging",
                "primary_color": "#0F766E",
                "secondary_color": "#8B5CF6",
                "tagline": "Move freely every day.",
                "logo_url": VELOFIT_LOGO_URL,
                "logo_label": "Sample SVG Logo — VeloFit",
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            },
        ],
        "products": [
            {
                "id": "prod-demo-coldbrew",
                "brand_id": "brand-demo-lumabrew",
                "name": "Aurora Cold Brew Concentrate",
                "description": (
                    "Slow-steeped 18-hour arabica concentrate that pours café-smooth "
                    "iced coffee in under 30 seconds."
                ),
                "images": [
                    {
                        "id": "img-coldbrew-1",
                        "label": "Sample Bottle Visual",
                        "url": COLD_BREW_IMAGE_PRIMARY,
                        "is_sample": True,
                    },
                    {
                        "id": "img-coldbrew-2",
                        "label": "Sample Iced Glass Visual",
                        "url": COLD_BREW_IMAGE_SERVING,
                        "is_sample": True,
                    },
                ],
                "price": "$18.00",
                "benefits": [
                    "Smooth 18-hour cold extraction",
                    "Zero added sugar or preservatives",
                    "Makes 12 iced servings per bottle",
                ],
                "offer": "15% off first 2-bottle starter bundle",
                "audience": "Remote professionals and iced-coffee fans aged 24–40",
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            },
            {
                "id": "prod-demo-tumbler",
                "brand_id": "brand-demo-lumabrew",
                "name": "Summit Ceramic Travel Tumbler",
                "description": (
                    "Insulated stainless tumbler lined with true-taste ceramic so iced "
                    "or hot coffee never picks up metallic notes."
                ),
                "images": [
                    {
                        "id": "img-tumbler-1",
                        "label": "Sample Tumbler Visual",
                        "url": TUMBLER_IMAGE_PRIMARY,
                        "is_sample": True,
                    }
                ],
                "price": "$28.00",
                "benefits": [
                    "True-taste ceramic interior coating",
                    "Keeps drinks cold up to 14 hours",
                    "Leak-resistant commuter lid",
                ],
                "offer": "Free woven carry sleeve with starter order",
                "audience": "Daily commuters and studio creatives",
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            },
            {
                "id": "prod-demo-mat",
                "brand_id": "brand-demo-velofit",
                "name": "AeroGrip Studio Mat",
                "description": (
                    "High-traction 6mm studio mat built for steady balance across "
                    "strength, mobility, and yoga sessions."
                ),
                "images": [
                    {
                        "id": "img-mat-1",
                        "label": "Sample Studio Mat Visual",
                        "url": YOGA_MAT_IMAGE_PRIMARY,
                        "is_sample": True,
                    }
                ],
                "price": "$54.00",
                "benefits": [
                    "Non-slip natural rubber base",
                    "6mm supportive joint cushioning",
                    "Wipes clean in seconds",
                ],
                "offer": "Complimentary cotton carry strap",
                "audience": "Home fitness beginners and studio regulars",
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            },
        ],
        "campaigns": [
            {
                "id": "camp-demo-autumn",
                "name": "Morning Pour Launch (Sample)",
                "brand_id": "brand-demo-lumabrew",
                "product_id": "prod-demo-coldbrew",
                "objective": "product_launch",
                "audience": "Remote professionals looking for café-quality iced coffee at home",
                "channel": "Instagram",
                "tone": "Warm & Craft-Focused",
                "key_message": "Pour café-smooth cold brew in 30 seconds before your first call.",
                "mode": "do_my_campaign",
                "status": "needs_review",
                "brief_summary": (
                    "Coordinated product launch package introducing Aurora Cold Brew Concentrate "
                    "to remote workers via Instagram feed, story/banner, and reminder follow-up."
                ),
                "is_demo": True,
                "data_origin": "demo",
                "updated_at": timestamp,
            }
        ],
        "assets": [
            {
                "id": "asset-demo-1",
                "campaign_id": "camp-demo-autumn",
                "mode": "do_my_campaign",
                "asset_type": "social_post",
                "channel": "Instagram Feed",
                "title": "Launch Hero Post",
                "headline": "Café-Smooth Cold Brew in 30 Seconds",
                "caption": (
                    "Skip the morning café queue. LumaBrew's Aurora Cold Brew Concentrate is "
                    "steeped for 18 hours for a clean, rich pour over ice—right at your desk."
                ),
                "cta": "Explore Starter Bundle",
                "hashtags": ["#LumaBrew", "#ColdBrewAtHome", "#MorningRitual"],
                "sequence_step": "Day 1 — Awareness Hook",
                "template_id": "hero_product_card",
                "is_editable_text": True,
                "is_demo": True,
                "provider_label": "Demo Seed Asset",
                "status": "draft",
                "aspect_ratio": "1:1",
                "banner_theme": "modern_indigo",
                "video_scenes": [],
                "updated_at": timestamp,
            },
            {
                "id": "asset-demo-2",
                "campaign_id": "camp-demo-autumn",
                "mode": "do_my_campaign",
                "asset_type": "promo_banner",
                "channel": "Instagram Story / Promo Banner",
                "title": "Starter Offer Banner",
                "headline": "15% Off Your First 2-Bottle Pour",
                "caption": (
                    "Twelve iced servings per bottle with zero added sugar. Start your week "
                    "with effortless iced coffee."
                ),
                "cta": "Claim 15% Starter Offer",
                "hashtags": ["#IcedCoffee", "#SpecialtyCoffee"],
                "sequence_step": "Day 3 — Value & Offer",
                "template_id": "promo_split_banner",
                "is_editable_text": True,
                "is_demo": True,
                "provider_label": "Demo Seed Asset",
                "status": "draft",
                "aspect_ratio": "1:1",
                "banner_theme": "sunset_warm",
                "video_scenes": [],
                "updated_at": timestamp,
            },
            {
                "id": "asset-demo-3",
                "campaign_id": "camp-demo-autumn",
                "mode": "do_my_campaign",
                "asset_type": "video_concept",
                "channel": "Instagram Reels / Video (15s)",
                "title": "15s Video Ad Storyboard & Scenes",
                "headline": "The 15-Second Morning Transformation",
                "caption": (
                    "Complete 4-frame video ad storyboard with camera visual prompts, voiceover, "
                    "duration timing, and on-screen graphics tailored for remote workers."
                ),
                "cta": "Watch Storyboard Concept",
                "hashtags": ["#LumaBrew", "#VideoAdConcept", "#CraftCoffee"],
                "sequence_step": "Day 5 — Conversion Video Ad",
                "template_id": "video_storyboard",
                "is_editable_text": True,
                "is_demo": True,
                "provider_label": "Demo Seed Asset",
                "status": "draft",
                "aspect_ratio": "9:16",
                "banner_theme": "modern_indigo",
                "video_scenes": [
                    {
                        "scene_number": 1,
                        "duration_seconds": 3,
                        "scene_title": "Scene 1 — The Hook (0–3s)",
                        "visual_description": (
                            "Macro cinematic close-up of ice clinking into a glass, followed by rich dark Aurora "
                            "cold brew pouring in slow motion. Condensation beads on glass in warm morning light."
                        ),
                        "on_screen_text": "Tired of Lukewarm Morning Rush?",
                        "voiceover": "What if café-smooth cold brew took thirty seconds and zero waiting in line?",
                    },
                    {
                        "scene_number": 2,
                        "duration_seconds": 4,
                        "scene_title": "Scene 2 — The Feature (3–7s)",
                        "visual_description": (
                            "Split-screen comparison: left side shows crowded noisy line; right side shows "
                            "remote desk worker effortlessly pouring Aurora concentrate over ice with a smile."
                        ),
                        "on_screen_text": "18-HOUR SLOW STEEP · 12 GLASSES PER BOTTLE",
                        "voiceover": "Aurora Cold Brew is slow-steeped for 18 hours. No bitterness, no artificial syrups. Just clean energy.",
                    },
                    {
                        "scene_number": 3,
                        "duration_seconds": 4,
                        "scene_title": "Scene 3 — Social Proof (7–11s)",
                        "visual_description": (
                            "Customer takes a refreshing first sip at sunrise desk. On-screen verified badge animates: "
                            "'4.9/5 from 1,200+ Morning Rituals'."
                        ),
                        "on_screen_text": "Over 1,200+ 5-Star Morning Rituals",
                        "voiceover": "Twelve velvety servings per bottle. Pour, stir, and conquer your first meeting.",
                    },
                    {
                        "scene_number": 4,
                        "duration_seconds": 4,
                        "scene_title": "Scene 4 — Call to Action (11–15s)",
                        "visual_description": (
                            "Branded LumaBrew end card with Aurora bottle and ice glass. Pulsing 'Get 15% Off Starter Kit' "
                            "button and tap-in-bio prompt."
                        ),
                        "on_screen_text": "GET 15% OFF STARTER PACK · TAP LINK IN BIO",
                        "voiceover": "Upgrade your morning pour today. Use code MORNING15 at checkout before this batch sells out.",
                    },
                ],
                "updated_at": timestamp,
            },
        ],
    }
