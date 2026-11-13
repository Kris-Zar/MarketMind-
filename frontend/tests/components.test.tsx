import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusBadge } from "../src/shared/components/StatusBadge";
import { Button } from "../src/shared/components/Button";
import { MetricCard } from "../src/shared/components/MetricCard";
import { AppShell } from "../src/shared/components/AppShell";
import {
  HeroProductCard,
  BannerVisual,
  VideoStoryboardVisual,
  buildDownloadableSvgBanner,
  buildDownloadableVideoStoryboardMarkdown,
} from "../src/features/studio/CreativeTemplates";
import type { ContentAsset, BrandKit, ProductProfile } from "../src/shared/types";

describe("Frontend Shared UI Primitives", () => {
  it("renders StatusBadge with label and custom variant", () => {
    render(<StatusBadge label="Demo Record" variant="demo" />);
    expect(screen.getByText("Demo Record")).toBeInTheDocument();
  });

  it("renders Button and responds to click events", async () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Create Campaign
      </Button>
    );
    const button = screen.getByRole("button", { name: /create campaign/i });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders MetricCard and marks demo data honestly", () => {
    render(
      <MetricCard
        title="Saved Drafts"
        value="12"
        trend="4 this week"
        isDemo={true}
      />
    );
    expect(screen.getByText("Saved Drafts")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Demo Data")).toBeInTheDocument();
  });

  it("AppShell switches navigation item on click", async () => {
    const handleNavigate = vi.fn();
    const handleReset = vi.fn();

    render(
      <AppShell currentView="dashboard" onNavigate={handleNavigate} onResetDemo={handleReset}>
        <div>Main Dashboard Content</div>
      </AppShell>
    );

    expect(screen.getByText("Main Dashboard Content")).toBeInTheDocument();
    const brandKitNav = screen.getByRole("button", { name: /brand kit/i });
    await userEvent.click(brandKitNav);
    expect(handleNavigate).toHaveBeenCalledWith("brands");
  });
});

describe("Creative Templates & Export", () => {
  const sampleBrand: BrandKit = {
    id: "brand-1",
    name: "LumaBrew Roasters",
    category: "Coffee",
    description: "Cold brew craft",
    voice: "Warm",
    primary_color: "#635BFF",
    secondary_color: "#1F2A44",
    tagline: "Morning ritual",
    logo_label: "Sample Logo",
    is_demo: true,
    data_origin: "demo",
    updated_at: "2026-11-12T10:00:00Z",
  };

  const sampleProduct: ProductProfile = {
    id: "prod-1",
    brand_id: "brand-1",
    name: "Aurora Cold Brew",
    description: "Smooth concentrate",
    images: [],
    benefits: ["Zero sugar", "18-hour slow steep"],
    is_demo: true,
    data_origin: "demo",
    updated_at: "2026-11-12T10:00:00Z",
  };

  const sampleAsset: ContentAsset = {
    id: "asset-1",
    campaign_id: "camp-1",
    mode: "do_my_campaign",
    asset_type: "social_post",
    channel: "Instagram Feed",
    title: "Launch Hero",
    headline: "Pour Smooth Cold Brew in 30 Seconds",
    caption: "Skip the café line with LumaBrew.",
    cta: "Shop Concentrate",
    hashtags: ["#LumaBrew", "#ColdBrew"],
    sequence_step: "Step 1",
    template_id: "hero_product_card",
    is_editable_text: true,
    is_demo: true,
    provider_label: "Demo AI",
    status: "draft",
    aspect_ratio: "1:1",
    banner_theme: "modern_indigo",
    updated_at: "2026-11-12T10:00:00Z",
  };

  const sampleVideoAsset: ContentAsset = {
    id: "asset-video-1",
    campaign_id: "camp-1",
    mode: "do_my_campaign",
    asset_type: "video_concept",
    channel: "Instagram Reels (15s)",
    title: "15s Video Concept Storyboard",
    headline: "How Aurora Upgraded My Morning",
    caption: "Short-form video concept with hook and CTA.",
    cta: "Claim 15% Off",
    hashtags: ["#LumaBrew", "#ShortFormVideo"],
    sequence_step: "Step 3",
    template_id: "video_storyboard",
    is_editable_text: true,
    is_demo: true,
    provider_label: "Demo AI",
    status: "draft",
    aspect_ratio: "9:16",
    banner_theme: "modern_indigo",
    video_scenes: [
      {
        scene_number: 1,
        duration_seconds: 3,
        scene_title: "Scene 1 — The Hook (0–3s)",
        visual_description: "Cinematic close-up of cold brew pouring over ice.",
        on_screen_text: "Tired of Lukewarm Morning Coffee?",
        voiceover: "What if café-smooth cold brew took 30 seconds at home?",
      },
      {
        scene_number: 2,
        duration_seconds: 4,
        scene_title: "Scene 2 — The Feature (3–7s)",
        visual_description: "Macro bottle shot showing 18-hour cold brew steep.",
        on_screen_text: "18-HOUR SLOW STEEP",
        voiceover: "Steeped slowly for maximum richness without bitterness.",
      },
    ],
    updated_at: "2026-11-12T10:00:00Z",
  };

  it("renders HeroProductCard with entered brand and headline", () => {
    render(<HeroProductCard asset={sampleAsset} brand={sampleBrand} product={sampleProduct} />);
    expect(screen.getByText("Pour Smooth Cold Brew in 30 Seconds")).toBeInTheDocument();
    expect(screen.getByText("Skip the café line with LumaBrew.")).toBeInTheDocument();
    expect(screen.getByText("Shop Concentrate")).toBeInTheDocument();
    expect(screen.getByText("LumaBrew Roasters")).toBeInTheDocument();
  });

  it("renders BannerVisual with aspect ratio and theme styling", () => {
    render(<BannerVisual asset={sampleAsset} brand={sampleBrand} product={sampleProduct} />);
    expect(screen.getByText("1:1 Banner")).toBeInTheDocument();
    expect(screen.getByText("Pour Smooth Cold Brew in 30 Seconds")).toBeInTheDocument();
    expect(screen.getByText("Shop Concentrate")).toBeInTheDocument();
  });

  it("renders VideoStoryboardVisual with video scenes and player controls", () => {
    render(<VideoStoryboardVisual asset={sampleVideoAsset} brand={sampleBrand} product={sampleProduct} />);
    expect(screen.getByText("15s Video Concept")).toBeInTheDocument();
    expect(screen.getByText("Scene 1 — The Hook (0–3s)")).toBeInTheDocument();
    expect(screen.getByText("Tired of Lukewarm Morning Coffee?")).toBeInTheDocument();
    expect(screen.getByText(/What if café-smooth cold brew/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Frame 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Frame 2" })).toBeInTheDocument();
  });

  it("generates genuine SVG banner markup containing brand and copy values", () => {
    const svg = buildDownloadableSvgBanner(sampleAsset, sampleBrand, sampleProduct);
    expect(svg).toContain("<svg");
    expect(svg).toContain("LUMABREW ROASTERS");
    expect(svg).toContain("Pour Smooth Cold Brew in 30 Seconds");
    expect(svg).toContain("Shop Concentrate");
    expect(svg).toContain("#635BFF");
  });

  it("generates markdown video production script with timestamps and scenes", () => {
    const md = buildDownloadableVideoStoryboardMarkdown(sampleVideoAsset, sampleBrand, sampleProduct);
    expect(md).toContain("# 15-Second Video Production Script");
    expect(md).toContain("Scene 1 — The Hook (0–3s)");
    expect(md).toContain("Tired of Lukewarm Morning Coffee?");
    expect(md).toContain("18-HOUR SLOW STEEP");
  });
});
