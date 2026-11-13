export type CampaignMode = "individual_content" | "do_my_campaign";

export type CampaignObjective =
  | "awareness"
  | "engagement"
  | "traffic"
  | "product_launch"
  | "lead_generation"
  | "sales_promotion";

export type ContentFormat =
  | "social_post"
  | "promo_banner"
  | "video_concept"
  | "ad_copy"
  | "carousel_concept";

export type AssetStatus = "draft" | "needs_review" | "approved";

export interface BrandKit {
  id: string;
  name: string;
  category: string;
  description: string;
  voice: string;
  primary_color: string;
  secondary_color: string;
  tagline: string;
  logo_url?: string | null;
  logo_label: string;
  is_demo: boolean;
  data_origin: string;
  updated_at: string;
}

export interface BrandCreatePayload {
  name: string;
  category: string;
  description: string;
  voice: string;
  primary_color: string;
  secondary_color: string;
  tagline?: string;
  logo_url?: string | null;
  logo_label?: string;
}

export interface ProductImageItem {
  id: string;
  label: string;
  url: string;
  is_sample: boolean;
}

export interface ProductProfile {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  images: ProductImageItem[];
  price?: string | null;
  benefits: string[];
  offer?: string | null;
  audience?: string | null;
  is_demo: boolean;
  data_origin: string;
  updated_at: string;
}

export interface ProductCreatePayload {
  brand_id: string;
  name: string;
  description: string;
  images?: ProductImageItem[];
  price?: string | null;
  benefits?: string[];
  offer?: string | null;
  audience?: string | null;
}

export interface CampaignBrief {
  id: string;
  name: string;
  brand_id: string;
  product_id?: string | null;
  objective: CampaignObjective;
  audience: string;
  channel: string;
  tone: string;
  key_message: string;
  mode: CampaignMode;
  status: string;
  brief_summary: string;
  is_demo: boolean;
  data_origin: string;
  updated_at: string;
}

export interface CampaignCreatePayload {
  name: string;
  brand_id: string;
  product_id?: string | null;
  objective: CampaignObjective;
  audience: string;
  channel: string;
  tone: string;
  key_message: string;
  mode: CampaignMode;
}

export interface VideoScene {
  scene_number: number;
  duration_seconds: number;
  scene_title: string;
  visual_description: string;
  on_screen_text: string;
  voiceover: string;
}

export interface ContentAsset {
  id: string;
  campaign_id: string;
  mode: string;
  asset_type: ContentFormat;
  channel: string;
  title: string;
  headline: string;
  caption: string;
  cta: string;
  hashtags: string[];
  sequence_step: string;
  template_id: string;
  is_editable_text: boolean;
  is_demo: boolean;
  provider_label: string;
  status: AssetStatus;
  updated_at: string;
  aspect_ratio?: "1:1" | "9:16" | "16:9" | string;
  banner_theme?: "modern_indigo" | "sunset_warm" | "minimal_dark" | "fresh_emerald" | string;
  video_scenes?: VideoScene[];
}

export interface GenerationBatchResponse {
  campaign_id: string;
  mode: CampaignMode;
  provider_name: string;
  provider_label: string;
  is_demo_output: boolean;
  brief_summary: string;
  assets: ContentAsset[];
}

export interface CampaignExportBundle {
  campaign_id: string;
  filename_base: string;
  markdown_content: string;
  json_content: string;
  exported_at: string;
}

export interface PrototypeMeta {
  active_phase: string;
  ai_provider_mode: string;
  live_publishing_enabled: boolean;
  live_analytics_enabled: boolean;
  live_trends_enabled: boolean;
  timestamp: string;
}

export interface ContentAssetUpdatePayload {
  headline?: string;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  aspect_ratio?: string;
  banner_theme?: string;
  status?: AssetStatus;
}
