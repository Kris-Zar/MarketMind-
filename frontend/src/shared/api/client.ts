import type {
  BrandCreatePayload,
  BrandKit,
  CampaignBrief,
  CampaignCreatePayload,
  CampaignExportBundle,
  ContentAsset,
  ContentAssetUpdatePayload,
  GenerationBatchResponse,
  ProductCreatePayload,
  ProductProfile,
  PrototypeMeta,
  VideoScene,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Fallback in-memory store for client-side resilience
const initialTimestamp = new Date().toISOString();

const FALLBACK_BRANDS: BrandKit[] = [
  {
    id: "brand-demo-lumabrew",
    name: "LumaBrew Roasters",
    category: "Specialty Coffee & Beverages",
    description: "Ethically sourced, small-batch artisanal coffees and craft cold-brew concentrates.",
    voice: "Warm, Knowledgeable & Craft-Focused",
    primary_color: "#635BFF",
    secondary_color: "#1F2A44",
    tagline: "Slow-steeped craft for modern rituals.",
    logo_url: null,
    logo_label: "LumaBrew Badge",
    is_demo: true,
    data_origin: "demo",
    updated_at: initialTimestamp,
  },
  {
    id: "brand-demo-velofit",
    name: "VeloFit Studio",
    category: "Fitness & Athletic Equipment",
    description: "Minimalist studio and home-gym accessories engineered for balance and durability.",
    voice: "Energetic, Disciplined & Approachable",
    primary_color: "#0F766E",
    secondary_color: "#8B5CF6",
    tagline: "Precision gear for mindful movement.",
    logo_url: null,
    logo_label: "VeloFit Monogram",
    is_demo: true,
    data_origin: "demo",
    updated_at: initialTimestamp,
  },
];

const FALLBACK_PRODUCTS: ProductProfile[] = [
  {
    id: "prod-demo-coldbrew",
    brand_id: "brand-demo-lumabrew",
    name: "Aurora Cold Brew Concentrate",
    description: "18-hour slow-steeped single-origin cold brew concentrate bottled in amber glass.",
    images: [{ id: "img-1", label: "Cold Brew Bottle", url: "", is_sample: true }],
    price: "$18.50",
    benefits: ["18-hour slow steep", "Zero sugar or preservatives", "12 servings per bottle"],
    offer: "15% off first 2-pack order",
    audience: "Remote professionals and iced-coffee enthusiasts",
    is_demo: true,
    data_origin: "demo",
    updated_at: initialTimestamp,
  },
  {
    id: "prod-demo-mat",
    brand_id: "brand-demo-velofit",
    name: "AeroGrip Studio Mat",
    description: "High-traction 6mm studio mat built for steady balance across workouts.",
    images: [{ id: "img-2", label: "Studio Mat", url: "", is_sample: true }],
    price: "$54.00",
    benefits: ["Non-slip natural rubber base", "6mm joint cushioning", "Wipes clean in seconds"],
    offer: "Complimentary carry strap",
    audience: "Home fitness and yoga enthusiasts",
    is_demo: true,
    data_origin: "demo",
    updated_at: initialTimestamp,
  },
];

const FALLBACK_CAMPAIGNS: CampaignBrief[] = [
  {
    id: "camp-demo-autumn",
    name: "Morning Pour Launch (Sample)",
    brand_id: "brand-demo-lumabrew",
    product_id: "prod-demo-coldbrew",
    objective: "product_launch",
    audience: "Remote professionals looking for café-quality iced coffee at home",
    channel: "Instagram",
    tone: "Warm & Craft-Focused",
    key_message: "Pour café-smooth cold brew in 30 seconds before your first call.",
    mode: "do_my_campaign",
    status: "needs_review",
    brief_summary:
      "Coordinated product launch package introducing Aurora Cold Brew Concentrate to remote workers via Instagram feed, banner, and video storyboard.",
    is_demo: true,
    data_origin: "demo",
    updated_at: initialTimestamp,
  },
];

function buildFallbackVideoScenes(subject: string, brandName: string, benefit: string, offer: string): VideoScene[] {
  return [
    {
      scene_number: 1,
      duration_seconds: 3,
      scene_title: "Scene 1 — The Hook (0–3s)",
      visual_description: `Cinematic macro shot of ice tumbling into a glass, followed by ${subject} pouring in slow motion under warm natural light.`,
      on_screen_text: `Tired of Settling on ${subject}?`,
      voiceover: `What if your daily ${subject} took thirty seconds and tasted like a master café pour?`,
    },
    {
      scene_number: 2,
      duration_seconds: 4,
      scene_title: "Scene 2 — The Problem & Feature (3–7s)",
      visual_description: `Split-screen comparison: morning rush vs smooth pour at desk. Text highlights ${benefit}.`,
      on_screen_text: `${benefit.toUpperCase()}`,
      voiceover: `${brandName} crafted this specifically for your morning ritual. With ${benefit}, no waiting required.`,
    },
    {
      scene_number: 3,
      duration_seconds: 4,
      scene_title: "Scene 3 — Social Proof & Delight (7–11s)",
      visual_description: "Satisfying first sip with natural morning light. Animated 5-star customer review badge.",
      on_screen_text: "1,200+ Verified 5-Star Morning Rituals",
      voiceover: "Clean, rich energy without artificial flavors or bitterness. Experience the craft difference.",
    },
    {
      scene_number: 4,
      duration_seconds: 4,
      scene_title: "Scene 4 — Call to Action (11–15s)",
      visual_description: `Branded end card in ${brandName} colors with hero bottle and pulsing discount badge.`,
      on_screen_text: `${(offer || "CLAIM LIMITED OFFER").toUpperCase()} · TAP LINK IN BIO`,
      voiceover: `Claim yours today. ${offer || "Tap the link below"} before this batch sells out.`,
    },
  ];
}

const FALLBACK_ASSETS: Record<string, ContentAsset[]> = {
  "camp-demo-autumn": [
    {
      id: "asset-demo-1",
      campaign_id: "camp-demo-autumn",
      mode: "do_my_campaign",
      asset_type: "social_post",
      channel: "Instagram Feed",
      title: "1. Launch Hero Post",
      headline: "Café-Smooth Cold Brew in 30 Seconds",
      caption:
        "Skip the morning café queue. LumaBrew's Aurora Cold Brew Concentrate is steeped for 18 hours for a clean, rich pour over ice—right at your desk.",
      cta: "Explore Starter Bundle",
      hashtags: ["#LumaBrew", "#ColdBrewAtHome", "#MorningRitual"],
      sequence_step: "Day 1 — Awareness Hook",
      template_id: "hero_product_card",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "1:1",
      banner_theme: "modern_indigo",
      video_scenes: [],
      updated_at: initialTimestamp,
    },
    {
      id: "asset-demo-2",
      campaign_id: "camp-demo-autumn",
      mode: "do_my_campaign",
      asset_type: "promo_banner",
      channel: "Instagram Display & Promo Banner",
      title: "2. Starter Offer Banner",
      headline: "15% Off Your First 2-Bottle Pour",
      caption:
        "Twelve iced servings per bottle with zero added sugar. Start your week with effortless iced coffee crafted with single-origin beans.",
      cta: "Claim 15% Starter Offer",
      hashtags: ["#IcedCoffee", "#SpecialtyCoffee", "#LumaBrew"],
      sequence_step: "Day 3 — Value & Offer",
      template_id: "promo_split_banner",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "1:1",
      banner_theme: "sunset_warm",
      video_scenes: [],
      updated_at: initialTimestamp,
    },
    {
      id: "asset-demo-3",
      campaign_id: "camp-demo-autumn",
      mode: "do_my_campaign",
      asset_type: "video_concept",
      channel: "Instagram Reels / Video (15s)",
      title: "3. 15s Video Ad Storyboard & Scenes",
      headline: "The 15-Second Morning Transformation",
      caption:
        "Complete 4-frame video ad storyboard with camera visual prompts, voiceover, duration timing, and on-screen graphics tailored for remote workers.",
      cta: "Watch Storyboard Concept",
      hashtags: ["#LumaBrew", "#VideoAdConcept", "#CraftCoffee"],
      sequence_step: "Day 5 — Conversion Video Ad",
      template_id: "video_storyboard",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "9:16",
      banner_theme: "modern_indigo",
      video_scenes: buildFallbackVideoScenes(
        "Aurora Cold Brew",
        "LumaBrew Roasters",
        "18-hour slow steep",
        "15% off first order"
      ),
      updated_at: initialTimestamp,
    },
  ],
};

let localBrands = [...FALLBACK_BRANDS];
let localProducts = [...FALLBACK_PRODUCTS];
let localCampaigns = [...FALLBACK_CAMPAIGNS];
let localAssets = { ...FALLBACK_ASSETS };

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        message = errData.error.message;
      } else if (errData?.detail) {
        message = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  return response.json();
}

function generateLocalDrafts(
  campaign: CampaignBrief,
  mode: string,
  requestedFormat: string = "social_post"
): ContentAsset[] {
  const brand = localBrands.find((b) => b.id === campaign.brand_id) || localBrands[0];
  const product = localProducts.find((p) => p.id === campaign.product_id);
  const subject = product ? product.name : brand.name;
  const benefit = product?.benefits?.[0] || "pure craft quality";
  const offer = product?.offer || "Limited Launch Offer";
  const now = new Date().toISOString();

  if (mode === "individual_content") {
    if (requestedFormat === "video_concept") {
      return [
        {
          id: `asset-local-${Date.now()}-1`,
          campaign_id: campaign.id,
          mode: "individual_content",
          asset_type: "video_concept",
          channel: `${campaign.channel} Reels (15s)`,
          title: "15s Video Ad Storyboard (Hook Focus)",
          headline: `How ${subject} Transformed My Daily Routine`,
          caption: `4-scene video ad concept with camera prompts, voiceover, and ${brand.name} branding.`,
          cta: "Watch Concept",
          hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#ShortFormVideo"],
          sequence_step: "Hook Variation",
          template_id: "video_storyboard",
          is_editable_text: true,
          is_demo: true,
          provider_label: "Demo AI Adapter (Simulated)",
          status: "draft",
          aspect_ratio: "9:16",
          banner_theme: "modern_indigo",
          video_scenes: buildFallbackVideoScenes(subject, brand.name, benefit, offer),
          updated_at: now,
        },
        {
          id: `asset-local-${Date.now()}-2`,
          campaign_id: campaign.id,
          mode: "individual_content",
          asset_type: "video_concept",
          channel: `${campaign.channel} Short Video (15s)`,
          title: "High-Energy Problem/Solution Video",
          headline: `Stop Settling for Ordinary ${subject}`,
          caption: `Fast-paced problem/solution video storyboard highlighting ${benefit}.`,
          cta: "Claim Limited Offer",
          hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#ProductFeature"],
          sequence_step: "Energy Variation",
          template_id: "video_storyboard",
          is_editable_text: true,
          is_demo: true,
          provider_label: "Demo AI Adapter (Simulated)",
          status: "draft",
          aspect_ratio: "9:16",
          banner_theme: "sunset_warm",
          video_scenes: buildFallbackVideoScenes(subject, brand.name, benefit, offer),
          updated_at: now,
        },
      ];
    }

    if (requestedFormat === "promo_banner") {
      return [
        {
          id: `asset-local-${Date.now()}-1`,
          campaign_id: campaign.id,
          mode: "individual_content",
          asset_type: "promo_banner",
          channel: `${campaign.channel} Square Banner (1:1)`,
          title: "1:1 Product Hero Split Banner",
          headline: `${subject} — Crafted for ${campaign.audience.split(" ")[0]}`,
          caption: `${campaign.key_message} ${offer}.`,
          cta: offer,
          hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#SpecialOffer"],
          sequence_step: "Feed Banner",
          template_id: "promo_split_banner",
          is_editable_text: true,
          is_demo: true,
          provider_label: "Demo AI Adapter (Simulated)",
          status: "draft",
          aspect_ratio: "1:1",
          banner_theme: "modern_indigo",
          video_scenes: [],
          updated_at: now,
        },
        {
          id: `asset-local-${Date.now()}-2`,
          campaign_id: campaign.id,
          mode: "individual_content",
          asset_type: "promo_banner",
          channel: `${campaign.channel} Story Banner (9:16)`,
          title: "9:16 Full-Bleed Story Banner",
          headline: `Unlock Premium Quality with ${subject}`,
          caption: `Experience ${benefit} with ${brand.name}.`,
          cta: "Shop Now",
          hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#StorySale"],
          sequence_step: "Story Banner",
          template_id: "promo_split_banner",
          is_editable_text: true,
          is_demo: true,
          provider_label: "Demo AI Adapter (Simulated)",
          status: "draft",
          aspect_ratio: "9:16",
          banner_theme: "sunset_warm",
          video_scenes: [],
          updated_at: now,
        },
      ];
    }

    return [
      {
        id: `asset-local-${Date.now()}-1`,
        campaign_id: campaign.id,
        mode: "individual_content",
        asset_type: "social_post",
        channel: `${campaign.channel} Feed`,
        title: "Benefit-Led Hero Post",
        headline: `Meet ${subject}: Your Daily Upgrade`,
        caption: `Skip the hassle. ${brand.name}'s ${subject} delivers ${benefit}. ${campaign.key_message}`,
        cta: "Explore Now",
        hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#DailyUpgrade"],
        sequence_step: "Primary Post",
        template_id: "hero_product_card",
        is_editable_text: true,
        is_demo: true,
        provider_label: "Demo AI Adapter (Simulated)",
        status: "draft",
        aspect_ratio: "1:1",
        banner_theme: "modern_indigo",
        video_scenes: [],
        updated_at: now,
      },
      {
        id: `asset-local-${Date.now()}-2`,
        campaign_id: campaign.id,
        mode: "individual_content",
        asset_type: "social_post",
        channel: `${campaign.channel} Feed`,
        title: "Storytelling Curiosity Angle",
        headline: `Why We Reimagined ${subject}`,
        caption: `Ordinary options lack craft. ${brand.tagline}: ${campaign.key_message} ${offer}`,
        cta: "Read Story",
        hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#BrandCraft"],
        sequence_step: "Story Post",
        template_id: "hero_product_card",
        is_editable_text: true,
        is_demo: true,
        provider_label: "Demo AI Adapter (Simulated)",
        status: "draft",
        aspect_ratio: "1:1",
        banner_theme: "minimal_dark",
        video_scenes: [],
        updated_at: now,
      },
    ];
  }

  // Do My Campaign (Coordinated 3-Asset Package: Post, Banner, Video Storyboard)
  return [
    {
      id: `asset-local-${Date.now()}-1`,
      campaign_id: campaign.id,
      mode: "do_my_campaign",
      asset_type: "social_post",
      channel: `${campaign.channel} Feed`,
      title: "1. Hero Launch Post",
      headline: `Introducing ${subject} by ${brand.name}`,
      caption: `${campaign.key_message} Crafted for ${campaign.audience}. Highlight: ${benefit}. ${offer}.`,
      cta: "Explore Launch",
      hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#LaunchDay"],
      sequence_step: "Step 1 — Awareness Hook",
      template_id: "hero_product_card",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "1:1",
      banner_theme: "modern_indigo",
      video_scenes: [],
      updated_at: now,
    },
    {
      id: `asset-local-${Date.now()}-2`,
      campaign_id: campaign.id,
      mode: "do_my_campaign",
      asset_type: "promo_banner",
      channel: `${campaign.channel} Story & Banner`,
      title: "2. Branded Promo Banner",
      headline: `${subject} — Special Release Offer`,
      caption: `Enjoy ${offer}. Experience ${benefit} crafted by ${brand.name}.`,
      cta: offer,
      hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#SpecialOffer"],
      sequence_step: "Step 2 — Value & Social Proof",
      template_id: "promo_split_banner",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "1:1",
      banner_theme: "sunset_warm",
      video_scenes: [],
      updated_at: now,
    },
    {
      id: `asset-local-${Date.now()}-3`,
      campaign_id: campaign.id,
      mode: "do_my_campaign",
      asset_type: "video_concept",
      channel: `${campaign.channel} Reels / Short Video (15s)`,
      title: "3. 15s Video Ad Storyboard & Scenes",
      headline: `The 15-Second Story of ${subject}`,
      caption: `Complete 4-frame video ad storyboard with camera visual prompts, voiceover, duration timing, and on-screen graphics tailored for ${campaign.audience}.`,
      cta: "Watch Video Concept",
      hashtags: [`#${brand.name.replace(/\s+/g, "")}`, "#VideoAdConcept"],
      sequence_step: "Step 3 — Conversion Video Ad",
      template_id: "video_storyboard",
      is_editable_text: true,
      is_demo: true,
      provider_label: "Demo AI Adapter (Simulated)",
      status: "draft",
      aspect_ratio: "9:16",
      banner_theme: "modern_indigo",
      video_scenes: buildFallbackVideoScenes(subject, brand.name, benefit, offer),
      updated_at: now,
    },
  ];
}

export const apiClient = {
  // System / Prototype
  async getMeta(): Promise<PrototypeMeta> {
    try {
      return await request<PrototypeMeta>("/prototype/meta");
    } catch {
      return {
        active_phase: "Phase 0 — Guide-Ready Prototype",
        ai_provider_mode: "mock_demo",
        live_publishing_enabled: false,
        live_analytics_enabled: false,
        live_trends_enabled: false,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async resetDemo(): Promise<{ status: string }> {
    try {
      return await request<{ status: string }>("/prototype/reset-demo", { method: "POST" });
    } catch {
      localBrands = [...FALLBACK_BRANDS];
      localProducts = [...FALLBACK_PRODUCTS];
      localCampaigns = [...FALLBACK_CAMPAIGNS];
      localAssets = { ...FALLBACK_ASSETS };
      return { status: "reset_successful" };
    }
  },

  // Brands
  async listBrands(): Promise<BrandKit[]> {
    try {
      return await request<BrandKit[]>("/brands");
    } catch {
      return localBrands;
    }
  },

  async getBrand(id: string): Promise<BrandKit> {
    try {
      return await request<BrandKit>(`/brands/${id}`);
    } catch {
      const b = localBrands.find((brand) => brand.id === id);
      if (!b) throw new Error(`Brand ${id} not found`);
      return b;
    }
  },

  async createBrand(payload: BrandCreatePayload): Promise<BrandKit> {
    try {
      return await request<BrandKit>("/brands", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const newBrand: BrandKit = {
        id: `brand-local-${Date.now()}`,
        name: payload.name.trim(),
        category: payload.category.trim(),
        description: payload.description.trim(),
        voice: payload.voice.trim(),
        primary_color: payload.primary_color,
        secondary_color: payload.secondary_color,
        tagline: payload.tagline?.trim() || "",
        logo_url: payload.logo_url || null,
        logo_label: payload.logo_label || `${payload.name} Logo`,
        is_demo: false,
        data_origin: "user_prototype",
        updated_at: new Date().toISOString(),
      };
      localBrands.unshift(newBrand);
      return newBrand;
    }
  },

  // Products
  async listProducts(brandId?: string): Promise<ProductProfile[]> {
    try {
      const query = brandId ? `?brand_id=${encodeURIComponent(brandId)}` : "";
      return await request<ProductProfile[]>(`/products${query}`);
    } catch {
      if (brandId) {
        return localProducts.filter((p) => p.brand_id === brandId);
      }
      return localProducts;
    }
  },

  async getProduct(id: string): Promise<ProductProfile> {
    try {
      return await request<ProductProfile>(`/products/${id}`);
    } catch {
      const p = localProducts.find((prod) => prod.id === id);
      if (!p) throw new Error(`Product ${id} not found`);
      return p;
    }
  },

  async createProduct(payload: ProductCreatePayload): Promise<ProductProfile> {
    try {
      return await request<ProductProfile>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const newProduct: ProductProfile = {
        id: `prod-local-${Date.now()}`,
        brand_id: payload.brand_id,
        name: payload.name.trim(),
        description: payload.description.trim(),
        images: payload.images && payload.images.length > 0
          ? payload.images
          : [{ id: `img-${Date.now()}`, label: "Product Visual", url: "", is_sample: true }],
        price: payload.price?.trim() || null,
        benefits: payload.benefits || [],
        offer: payload.offer?.trim() || null,
        audience: payload.audience?.trim() || null,
        is_demo: false,
        data_origin: "user_prototype",
        updated_at: new Date().toISOString(),
      };
      localProducts.unshift(newProduct);
      return newProduct;
    }
  },

  // Campaigns
  async listCampaigns(): Promise<CampaignBrief[]> {
    try {
      return await request<CampaignBrief[]>("/campaigns");
    } catch {
      return localCampaigns;
    }
  },

  async getCampaign(id: string): Promise<CampaignBrief> {
    try {
      return await request<CampaignBrief>(`/campaigns/${id}`);
    } catch {
      const c = localCampaigns.find((camp) => camp.id === id);
      if (!c) throw new Error(`Campaign ${id} not found`);
      return c;
    }
  },

  async createCampaign(payload: CampaignCreatePayload): Promise<CampaignBrief> {
    try {
      return await request<CampaignBrief>("/campaigns", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      const newCamp: CampaignBrief = {
        id: `camp-local-${Date.now()}`,
        name: payload.name.trim(),
        brand_id: payload.brand_id,
        product_id: payload.product_id || null,
        objective: payload.objective,
        audience: payload.audience.trim(),
        channel: payload.channel.trim(),
        tone: payload.tone.trim(),
        key_message: payload.key_message.trim(),
        mode: payload.mode,
        status: "needs_review",
        brief_summary: `Campaign brief for ${payload.name} targeting ${payload.audience} on ${payload.channel}.`,
        is_demo: false,
        data_origin: "user_prototype",
        updated_at: new Date().toISOString(),
      };
      localCampaigns.unshift(newCamp);

      // Auto-generate initial drafts so the studio is immediately ready
      const initialDrafts = generateLocalDrafts(newCamp, payload.mode);
      localAssets[newCamp.id] = initialDrafts;

      return newCamp;
    }
  },

  // Content Generation & Assets
  async listAssets(campaignId: string): Promise<ContentAsset[]> {
    try {
      return await request<ContentAsset[]>(`/content/campaigns/${campaignId}/assets`);
    } catch {
      if (!localAssets[campaignId]) {
        const camp = localCampaigns.find((c) => c.id === campaignId);
        if (camp) {
          localAssets[campaignId] = generateLocalDrafts(camp, camp.mode);
        } else {
          localAssets[campaignId] = [];
        }
      }
      return localAssets[campaignId];
    }
  },

  async generateContent(
    campaignId: string,
    params: { mode?: string; requested_format?: string; variation_seed?: number } = {}
  ): Promise<GenerationBatchResponse> {
    try {
      return await request<GenerationBatchResponse>(`/content/campaigns/${campaignId}/generate`, {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch {
      const camp = localCampaigns.find((c) => c.id === campaignId) || localCampaigns[0];
      const mode = (params.mode as any) || camp?.mode || "do_my_campaign";
      const generated = generateLocalDrafts(camp, mode, params.requested_format || "social_post");
      localAssets[campaignId] = generated;
      return {
        campaign_id: campaignId,
        mode,
        provider_name: "smart_generative_engine",
        provider_label: "Smart Creative Generator (Client Engine)",
        is_demo_output: true,
        brief_summary: `Generated dynamic content package for ${camp.name}`,
        assets: generated,
      };
    }
  },

  async updateAsset(
    assetId: string,
    patch: ContentAssetUpdatePayload
  ): Promise<ContentAsset> {
    try {
      return await request<ContentAsset>(`/content/assets/${assetId}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    } catch {
      for (const campId in localAssets) {
        const index = localAssets[campId].findIndex((a) => a.id === assetId);
        if (index !== -1) {
          const updated = {
            ...localAssets[campId][index],
            ...patch,
            updated_at: new Date().toISOString(),
          };
          localAssets[campId][index] = updated;
          return updated;
        }
      }
      throw new Error(`Asset ${assetId} not found`);
    }
  },

  async regenerateAsset(
    assetId: string,
    variationSeed: number
  ): Promise<ContentAsset> {
    try {
      return await request<ContentAsset>(`/content/assets/${assetId}/regenerate`, {
        method: "POST",
        body: JSON.stringify({ variation_seed: variationSeed }),
      });
    } catch {
      for (const campId in localAssets) {
        const item = localAssets[campId].find((a) => a.id === assetId);
        if (item) {
          const camp = localCampaigns.find((c) => c.id === campId) || localCampaigns[0];
          const newDrafts = generateLocalDrafts(camp, "individual_content", item.asset_type);
          const chosen = newDrafts[0];
          const updated: ContentAsset = {
            ...item,
            headline: chosen.headline,
            caption: chosen.caption,
            cta: chosen.cta,
            hashtags: chosen.hashtags,
            aspect_ratio: chosen.aspect_ratio,
            banner_theme: chosen.banner_theme,
            video_scenes: chosen.video_scenes,
            status: "draft",
            updated_at: new Date().toISOString(),
          };
          const idx = localAssets[campId].findIndex((a) => a.id === assetId);
          localAssets[campId][idx] = updated;
          return updated;
        }
      }
      throw new Error(`Asset ${assetId} not found`);
    }
  },

  async exportBundle(campaignId: string): Promise<CampaignExportBundle> {
    try {
      return await request<CampaignExportBundle>(`/content/campaigns/${campaignId}/export`);
    } catch {
      const camp = localCampaigns.find((c) => c.id === campaignId) || localCampaigns[0];
      const brand = localBrands.find((b) => b.id === camp?.brand_id) || localBrands[0];
      const product = localProducts.find((p) => p.id === camp?.product_id);
      const assets = localAssets[campaignId] || [];
      const exportedAt = new Date().toISOString();

      const lines = [
        `# ${camp.name}`,
        "",
        `- **Exported:** ${exportedAt}`,
        `- **Mode:** ${camp.mode === "do_my_campaign" ? "Do My Campaign" : "Individual Content"}`,
        `- **Brand:** ${brand.name} (${brand.category})`,
        `- **Product:** ${product ? product.name : "General Brand Campaign"}`,
        `- **Objective:** ${camp.objective}`,
        `- **Audience:** ${camp.audience}`,
        `- **Channel:** ${camp.channel}`,
        `- **Key Message:** ${camp.key_message}`,
        "",
        "## Draft Assets",
      ];
      assets.forEach((a, i) => {
        lines.push(
          `### ${i + 1}. ${a.title}`,
          `- **Channel:** ${a.channel}`,
          `- **Headline:** ${a.headline}`,
          `- **Caption:** ${a.caption}`,
          `- **CTA:** ${a.cta}`,
          `- **Hashtags:** ${a.hashtags.join(" ")}`
        );
        if (a.video_scenes && a.video_scenes.length > 0) {
          lines.push("- **15s Video Storyboard Scenes:**");
          a.video_scenes.forEach((s) => {
            lines.push(
              `  - **${s.scene_title} (${s.duration_seconds}s):** Visual: ${s.visual_description} | On-Screen: '${s.on_screen_text}' | Voiceover: '${s.voiceover}'`
            );
          });
        }
        lines.push("");
      });

      return {
        campaign_id: campaignId,
        filename_base: `${camp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-phase0-export`,
        markdown_content: lines.join("\n"),
        json_content: JSON.stringify({ campaign: camp, brand, product, assets }, null, 2),
        exported_at: exportedAt,
      };
    }
  },
};
