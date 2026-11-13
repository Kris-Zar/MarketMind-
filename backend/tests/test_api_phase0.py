"""Tests verifying the complete Phase 0 prototype API and honesty guarantees."""

from tests.conftest import SyncASGIClient


def test_health_and_prototype_meta_report_phase0_boundaries(client: SyncASGIClient) -> None:
    health = client.get("/api/v1/health")
    assert health.status_code == 200
    assert health.json()["ai_provider"] == "mock_demo"

    meta = client.get("/api/v1/prototype/meta")
    assert meta.status_code == 200
    payload = meta.json()
    assert payload["live_publishing_enabled"] is False
    assert payload["live_analytics_enabled"] is False
    assert payload["live_trends_enabled"] is False


def test_seeded_demo_records_are_explicitly_marked(client: SyncASGIClient) -> None:
    brands = client.get("/api/v1/brands").json()
    products = client.get("/api/v1/products").json()
    campaigns = client.get("/api/v1/campaigns").json()

    assert len(brands) >= 1
    assert all(brand["is_demo"] is True for brand in brands)
    assert len(products) >= 1
    assert all(product["is_demo"] is True for product in products)
    assert len(campaigns) >= 1
    assert all(campaign["is_demo"] is True for campaign in campaigns)


def test_brand_creation_rejects_unsafe_logo_urls_and_invalid_hex(
    client: SyncASGIClient,
) -> None:
    invalid_hex = client.post(
        "/api/v1/brands",
        json={
            "name": "NorthStar Goods",
            "category": "Homeware",
            "description": "Handcrafted ceramic home essentials.",
            "voice": "Calm and practical",
            "primary_color": "not-a-color",
            "secondary_color": "#1F2A44",
        },
    )
    assert invalid_hex.status_code == 422

    unsafe_logo = client.post(
        "/api/v1/brands",
        json={
            "name": "NorthStar Goods",
            "category": "Homeware",
            "description": "Handcrafted ceramic home essentials.",
            "voice": "Calm and practical",
            "primary_color": "#635BFF",
            "secondary_color": "#1F2A44",
            "logo_url": "javascript:alert(1)",
        },
    )
    assert unsafe_logo.status_code == 422


def test_phase0_end_to_end_journey_both_modes_edit_regenerate_export(
    client: SyncASGIClient,
) -> None:
    # 1. Create Brand Kit
    brand_res = client.post(
        "/api/v1/brands",
        json={
            "name": "Solstice Botanics",
            "category": "Skincare",
            "description": "Gentle plant-based daily moisturizers.",
            "voice": "Calm, Honest & Warm",
            "primary_color": "#635BFF",
            "secondary_color": "#1F2A44",
            "tagline": "Simple skin rituals.",
        },
    )
    assert brand_res.status_code == 201
    brand = brand_res.json()
    assert brand["is_demo"] is False

    # 2. Create Product Profile linked to Brand Kit
    product_res = client.post(
        "/api/v1/products",
        json={
            "brand_id": brand["id"],
            "name": "Barrier Calm Cream",
            "description": "Fragrance-free oat and ceramide daily moisturizer.",
            "price": "$24.00",
            "benefits": ["Fragrance-free formula", "24-hour hydration"],
            "offer": "Free travel mini with first order",
            "audience": "Sensitive skin shoppers",
        },
    )
    assert product_res.status_code == 201
    product = product_res.json()
    assert product["brand_id"] == brand["id"]
    assert len(product["images"]) == 1

    # 3. Create Campaign Brief
    campaign_res = client.post(
        "/api/v1/campaigns",
        json={
            "name": "Calm Skin Fall Launch",
            "brand_id": brand["id"],
            "product_id": product["id"],
            "objective": "product_launch",
            "audience": "Sensitive skin shoppers aged 22-40",
            "channel": "Instagram",
            "tone": "Warm & Honest",
            "key_message": "Protect your skin barrier without heavy fragrance.",
            "mode": "individual_content",
        },
    )
    assert campaign_res.status_code == 201
    campaign = campaign_res.json()
    assert "Solstice Botanics" in campaign["brief_summary"]

    # 4. Generate Individual Content (2 variants for single chosen format)
    indiv_res = client.post(
        f"/api/v1/content/campaigns/{campaign['id']}/generate",
        json={"mode": "individual_content", "requested_format": "promo_banner"},
    )
    assert indiv_res.status_code == 200
    indiv_data = indiv_res.json()
    assert indiv_data["is_demo_output"] is True
    assert indiv_data["mode"] == "individual_content"
    assert len(indiv_data["assets"]) == 2
    assert all(asset["asset_type"] == "promo_banner" for asset in indiv_data["assets"])

    # 5. Switch to Do My Campaign (coordinated 3-asset package)
    pkg_res = client.post(
        f"/api/v1/content/campaigns/{campaign['id']}/generate",
        json={"mode": "do_my_campaign", "requested_format": "social_post"},
    )
    assert pkg_res.status_code == 200
    pkg_data = pkg_res.json()
    assert pkg_data["mode"] == "do_my_campaign"
    assert len(pkg_data["assets"]) == 3
    first_asset = pkg_data["assets"][0]
    second_asset = pkg_data["assets"][1]

    # 6. Edit visible text on first asset
    edit_res = client.patch(
        f"/api/v1/content/assets/{first_asset['id']}",
        json={
            "headline": "Gentle Hydration Every Morning",
            "cta": "Shop Barrier Calm Cream",
            "status": "approved",
        },
    )
    assert edit_res.status_code == 200
    assert edit_res.json()["headline"] == "Gentle Hydration Every Morning"
    assert edit_res.json()["status"] == "approved"

    # 7. Regenerate second asset without overwriting first asset
    regen_res = client.post(
        f"/api/v1/content/assets/{second_asset['id']}/regenerate",
        json={"variation_seed": 2},
    )
    assert regen_res.status_code == 200
    assert regen_res.json()["id"] == second_asset["id"]

    assets_after = client.get(f"/api/v1/content/campaigns/{campaign['id']}/assets").json()
    first_after = next(item for item in assets_after if item["id"] == first_asset["id"])
    assert first_after["headline"] == "Gentle Hydration Every Morning"

    # 8. Export real Markdown + JSON bundle
    export_res = client.get(f"/api/v1/content/campaigns/{campaign['id']}/export")
    assert export_res.status_code == 200
    export_bundle = export_res.json()
    assert "Gentle Hydration Every Morning" in export_bundle["markdown_content"]
    assert "Barrier Calm Cream" in export_bundle["json_content"]


def test_video_concept_and_banner_generation_with_scenes_and_ratios(
    client: SyncASGIClient,
) -> None:
    # Use seeded demo campaign
    campaigns = client.get("/api/v1/campaigns").json()
    camp_id = campaigns[0]["id"]

    # Generate video_concept format
    video_res = client.post(
        f"/api/v1/content/campaigns/{camp_id}/generate",
        json={"mode": "individual_content", "requested_format": "video_concept"},
    )
    assert video_res.status_code == 200
    video_data = video_res.json()
    assert len(video_data["assets"]) == 2
    first_video = video_data["assets"][0]
    assert first_video["asset_type"] == "video_concept"
    assert first_video["template_id"] == "video_storyboard"
    assert len(first_video["video_scenes"]) == 4
    scene_1 = first_video["video_scenes"][0]
    assert scene_1["scene_number"] == 1
    assert scene_1["duration_seconds"] > 0
    assert len(scene_1["visual_description"]) > 10
    assert len(scene_1["voiceover"]) > 10

    # Verify export includes video storyboard
    export_res = client.get(f"/api/v1/content/campaigns/{camp_id}/export")
    assert export_res.status_code == 200
    assert "15s Video Concept Storyboard" in export_res.json()["markdown_content"]

