import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Video,
  Sparkles,
  Camera,
  Mic,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { BrandKit, ContentAsset, ProductProfile, VideoScene } from "../../shared/types";

interface TemplateProps {
  asset: ContentAsset;
  brand?: BrandKit;
  product?: ProductProfile;
  className?: string;
  onUpdateRatio?: (ratio: string) => void;
  onUpdateTheme?: (theme: string) => void;
}

const THEME_GRADIENTS: Record<string, { bg: string; text: string; accent: string; badge: string }> = {
  modern_indigo: {
    bg: "linear-gradient(135deg, #635BFF 0%, #1F2A44 100%)",
    text: "#FFFFFF",
    accent: "#8B5CF6",
    badge: "rgba(255,255,255,0.18)",
  },
  sunset_warm: {
    bg: "linear-gradient(135deg, #EA580C 0%, #C026D3 100%)",
    text: "#FFFFFF",
    accent: "#FDE047",
    badge: "rgba(255,255,255,0.22)",
  },
  minimal_dark: {
    bg: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    text: "#FFFFFF",
    accent: "#38BDF8",
    badge: "rgba(255,255,255,0.12)",
  },
  fresh_emerald: {
    bg: "linear-gradient(135deg, #059669 0%, #0284C7 100%)",
    text: "#FFFFFF",
    accent: "#A7F3D0",
    badge: "rgba(255,255,255,0.2)",
  },
};

/**
 * Template 1: Hero Product Card
 * A branded vertical social post layout incorporating brand colors, logo, product visual,
 * entered headline, caption, and CTA.
 */
export const HeroProductCard: React.FC<TemplateProps> = ({ asset, brand, product, className = "" }) => {
  const primaryColor = brand?.primary_color || "#635BFF";
  const secondaryColor = brand?.secondary_color || "#1F2A44";
  const brandName = brand?.name || "MarketMind Brand";
  const productImage = product?.images?.[0]?.url;

  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius-lg, 12px)",
        border: "1px solid var(--color-border, #E5E7EB)",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      {/* Visual Canvas */}
      <div
        style={{
          position: "relative",
          height: "220px",
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Brand header pill */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          {brand?.logo_url ? (
            <img
              src={brand.logo_url}
              alt=""
              style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: primaryColor,
              }}
            />
          )}
          <span>{brandName}</span>
        </div>

        {/* Central product visual */}
        {productImage ? (
          <div
            style={{
              maxHeight: "150px",
              maxWidth: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35))",
            }}
          >
            <img
              src={productImage}
              alt={product?.name || "Product visual"}
              style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", opacity: 0.9 }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>{product?.name || brandName}</div>
            <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.8 }}>
              {brand?.tagline || "Brand Craft & Quality"}
            </div>
          </div>
        )}

        {/* Format badge */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            fontSize: "10px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
          }}
        >
          {asset.channel}
        </div>
      </div>

      {/* Copy Body */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h4
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "var(--color-text, #172033)",
          }}
        >
          {asset.headline}
        </h4>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#475569",
            lineHeight: 1.45,
          }}
        >
          {asset.caption}
        </p>

        {/* CTA Button */}
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              display: "inline-block",
              width: "100%",
              textAlign: "center",
              padding: "10px 16px",
              borderRadius: "var(--radius-md, 8px)",
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            }}
          >
            {asset.cta}
          </div>
        </div>

        {/* Hashtags */}
        {asset.hashtags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
            {asset.hashtags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "11px",
                  color: primaryColor,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Template 2: Customizable Promotional Banner (BannerVisual)
 * Supports aspect ratios (1:1, 9:16, 16:9) and visual themes.
 */
export const BannerVisual: React.FC<TemplateProps> = ({
  asset,
  brand,
  product,
  className = "",
}) => {
  const ratio = asset.aspect_ratio || "1:1";
  const themeKey = asset.banner_theme || "modern_indigo";
  const theme = THEME_GRADIENTS[themeKey] || THEME_GRADIENTS.modern_indigo;

  const primaryColor = brand?.primary_color || "#635BFF";
  const brandName = brand?.name || "MarketMind AI";
  const productImage = product?.images?.[0]?.url;

  // Aspect ratio styling
  let containerWidth = "100%";
  let containerMax = "440px";
  let minHeight = "360px";

  if (ratio === "9:16") {
    containerMax = "320px";
    minHeight = "480px";
  } else if (ratio === "16:9") {
    containerMax = "520px";
    minHeight = "280px";
  }

  return (
    <div
      className={className}
      style={{
        width: containerWidth,
        maxWidth: containerMax,
        margin: "0 auto",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.08)",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        flexDirection: ratio === "16:9" ? "row" : "column",
        justifyContent: "space-between",
        padding: "24px",
        minHeight,
        position: "relative",
      }}
    >
      {/* Decorative Circles */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: theme.badge,
            backdropFilter: "blur(8px)",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {brand?.logo_url ? (
            <img
              src={brand.logo_url}
              alt=""
              style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: primaryColor,
              }}
            />
          )}
          <span>{brandName.toUpperCase()}</span>
        </div>

        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "3px 8px",
            borderRadius: "4px",
          }}
        >
          {ratio} Banner
        </span>
      </div>

      {/* Central Content */}
      <div
        style={{
          display: "flex",
          flexDirection: ratio === "16:9" ? "row" : "column",
          alignItems: "center",
          gap: "18px",
          margin: "18px 0",
          zIndex: 1,
        }}
      >
        {productImage && (
          <div
            style={{
              maxHeight: ratio === "9:16" ? "140px" : "110px",
              maxWidth: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.3))",
            }}
          >
            <img
              src={productImage}
              alt="Product"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        <div style={{ textAlign: ratio === "16:9" ? "left" : "center", flex: 1 }}>
          {product?.name && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.accent,
                marginBottom: "4px",
              }}
            >
              {product.name}
            </div>
          )}

          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: ratio === "9:16" ? "20px" : "18px",
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {asset.headline}
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              lineHeight: 1.4,
              opacity: 0.9,
              maxWidth: "340px",
            }}
          >
            {asset.caption}
          </p>
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            color: "#111827",
            fontSize: "13px",
            fontWeight: 800,
            boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            textAlign: "center",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Sparkles size={14} color={primaryColor} />
          <span>{asset.cta}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * PromoSplitBanner (kept for backwards compatibility)
 */
export const PromoSplitBanner: React.FC<TemplateProps> = (props) => {
  return <BannerVisual {...props} />;
};

/**
 * Minimal Quote Card
 */
export const MinimalQuoteCard: React.FC<TemplateProps> = ({ asset, brand, className = "" }) => {
  const primaryColor = brand?.primary_color || "#635BFF";

  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius-lg, 12px)",
        border: "1px solid var(--color-border, #E5E7EB)",
        borderLeft: `5px solid ${primaryColor}`,
        backgroundColor: "#FFFFFF",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      <div style={{ fontSize: "12px", fontWeight: 700, color: primaryColor, textTransform: "uppercase" }}>
        {asset.channel} · Direct Message
      </div>

      <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-text, #172033)", lineHeight: 1.35 }}>
        {asset.headline}
      </div>

      <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", lineHeight: 1.5, fontStyle: "italic" }}>
        “{asset.caption}”
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}>
          — {brand?.name || "MarketMind"}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          {asset.cta} →
        </span>
      </div>
    </div>
  );
};

/**
 * Template 3: Interactive Video Storyboard Visual ("Video Images" Player)
 * Complete 4-frame video ad concept player for short-form video (15s Reel/TikTok).
 */
export const VideoStoryboardVisual: React.FC<TemplateProps> = ({
  asset,
  brand,
  product,
  className = "",
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes: VideoScene[] =
    asset.video_scenes && asset.video_scenes.length > 0
      ? asset.video_scenes
      : [
          {
            scene_number: 1,
            duration_seconds: 3,
            scene_title: "Scene 1 — The Hook (0–3s)",
            visual_description: `Cinematic macro shot of ${product?.name || brand?.name || "the product"} in slow motion.`,
            on_screen_text: `Tired of Ordinary ${product?.name || brand?.name}?`,
            voiceover: "What if you could upgrade your routine in thirty seconds?",
          },
          {
            scene_number: 2,
            duration_seconds: 4,
            scene_title: "Scene 2 — The Feature (3–7s)",
            visual_description: "Split-screen comparing before vs after. Camera pushes in on craftsmanship.",
            on_screen_text: "100% CRAFT QUALITY",
            voiceover: "Engineered specifically for your daily lifestyle with zero compromise.",
          },
          {
            scene_number: 3,
            duration_seconds: 4,
            scene_title: "Scene 3 — Social Proof (7–11s)",
            visual_description: "Customer enjoyment reaction with verified 5-star customer badge overlay.",
            on_screen_text: "Over 1,200+ 5-Star Reviews",
            voiceover: "Thousands of customers have made the switch this month alone.",
          },
          {
            scene_number: 4,
            duration_seconds: 4,
            scene_title: "Scene 4 — Call to Action (11–15s)",
            visual_description: `Branded end card in ${brand?.name || "MarketMind"} colors with limited offer badge.`,
            on_screen_text: "CLAIM YOUR EXCLUSIVE OFFER · TAP LINK",
            voiceover: "Click the link below to experience the difference today.",
          },
        ];

  // Auto-play interval
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, scenes.length]);

  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const primaryColor = brand?.primary_color || "#635BFF";

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Smartphone Frame Container */}
      <div
        style={{
          width: "100%",
          borderRadius: "24px",
          border: "8px solid #1E293B",
          backgroundColor: "#0F172A",
          overflow: "hidden",
          boxShadow: "0 18px 35px rgba(0,0,0,0.25)",
          color: "#FFFFFF",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          aspectRatio: "9 / 14",
          minHeight: "440px",
        }}
      >
        {/* Phone Notch / Status Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.03em",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Video size={13} color="#F43F5E" />
            <span>15s Video Concept</span>
          </div>

          <div
            style={{
              padding: "2px 8px",
              borderRadius: "9999px",
              backgroundColor: isPlaying ? "#10B981" : "rgba(255,255,255,0.2)",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {isPlaying ? "PLAYING" : "PAUSED"}
          </div>
        </div>

        {/* Storyboard Scene Visual Area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            background:
              activeSceneIndex === 0
                ? "linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #0F172A 100%)"
                : activeSceneIndex === 1
                ? "linear-gradient(180deg, #111827 0%, #1F2937 50%, #374151 100%)"
                : activeSceneIndex === 2
                ? "linear-gradient(180deg, #0F766E 0%, #115E59 60%, #042F2E 100%)"
                : "linear-gradient(180deg, #4C1D95 0%, #5B21B6 60%, #1E1B4B 100%)",
            overflow: "hidden",
          }}
        >
          {/* Top Scene Pill */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                backgroundColor: "rgba(0,0,0,0.45)",
                padding: "3px 10px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {currentScene.scene_title}
            </span>

            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
              Frame {activeSceneIndex + 1} of {scenes.length}
            </span>
          </div>

          {/* Central Animated Visual Mockup */}
          <div style={{ textAlign: "center", margin: "14px 0" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 12px auto",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed rgba(255,255,255,0.3)",
              }}
            >
              {product?.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt=""
                  style={{ width: "50px", height: "50px", objectFit: "contain" }}
                />
              ) : (
                <Camera size={30} color={primaryColor} />
              )}
            </div>

            {/* Simulated On-Screen Bold Text Overlay */}
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
                padding: "8px 14px",
                borderRadius: "8px",
                display: "inline-block",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.03em",
                color: "#FDE047",
                border: "1px solid rgba(253, 224, 71, 0.4)",
                maxWidth: "90%",
              }}
            >
              {currentScene.on_screen_text}
            </div>
          </div>

          {/* Bottom Visual Prompt & Voiceover Preview */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "11px", color: "#93C5FD" }}>
              <Camera size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ lineHeight: 1.35 }}>{currentScene.visual_description}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "11px", color: "#FDE047" }}>
              <Mic size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ lineHeight: 1.35, fontStyle: "italic" }}>“{currentScene.voiceover}”</span>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "#0B0F19",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: primaryColor,
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
              title={isPlaying ? "Pause Video Playback" : "Play Video Storyboard"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>

            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              00:0{activeSceneIndex * 4} / 00:15
            </span>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setActiveSceneIndex((prev) => (prev > 0 ? prev - 1 : scenes.length - 1))}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setActiveSceneIndex((prev) => (prev + 1) % scenes.length)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Selection Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
        {scenes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveSceneIndex(idx);
              setIsPlaying(false);
            }}
            style={{
              padding: "6px 4px",
              borderRadius: "6px",
              border: activeSceneIndex === idx ? `2px solid ${primaryColor}` : "1px solid var(--color-border, #E5E7EB)",
              backgroundColor: activeSceneIndex === idx ? "var(--color-primary-soft, #EFEEFF)" : "#FFFFFF",
              color: activeSceneIndex === idx ? primaryColor : "#475569",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Frame {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Build a downloadable SVG string incorporating entered brand colors, names, and copy
 * Supports 1:1, 9:16, 16:9 aspect ratios.
 */
export function buildDownloadableSvgBanner(
  asset: ContentAsset,
  brand?: BrandKit,
  product?: ProductProfile
): string {
  const primary = brand?.primary_color || "#635BFF";
  const secondary = brand?.secondary_color || "#1F2A44";
  const brandName = brand?.name || "MarketMind AI";
  const headline = asset.headline.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cta = asset.cta.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const productName = (product?.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const ratio = asset.aspect_ratio || "1:1";

  let width = 1080;
  let height = 1080;

  if (ratio === "9:16") {
    width = 1080;
    height = 1920;
  } else if (ratio === "16:9") {
    width = 1920;
    height = 1080;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${secondary}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="24" fill="url(#bg)"/>
  <circle cx="${width * 0.85}" cy="${height * 0.15}" r="${width * 0.2}" fill="#FFFFFF" fill-opacity="0.08"/>
  <circle cx="${width * 0.15}" cy="${height * 0.85}" r="${width * 0.15}" fill="#FFFFFF" fill-opacity="0.06"/>
  
  <!-- Brand Header -->
  <rect x="60" y="60" width="300" height="50" rx="25" fill="#000000" fill-opacity="0.35"/>
  <text x="210" y="93" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF" letter-spacing="2">${brandName.toUpperCase()}</text>

  <!-- Product Tag -->
  ${productName ? `<text x="60" y="200" font-family="Inter, sans-serif" font-size="28" font-weight="700" fill="#EFEEFF">${productName}</text>` : ""}

  <!-- Headline -->
  <text x="60" y="${height * 0.4}" font-family="Inter, sans-serif" font-size="48" font-weight="800" fill="#FFFFFF">${headline.slice(0, 36)}</text>
  ${headline.length > 36 ? `<text x="60" y="${height * 0.4 + 65}" font-family="Inter, sans-serif" font-size="42" font-weight="800" fill="#FFFFFF">${headline.slice(36, 75)}</text>` : ""}

  <!-- CTA Button -->
  <rect x="60" y="${height * 0.75}" width="360" height="80" rx="16" fill="#FFFFFF"/>
  <text x="240" y="${height * 0.75 + 50}" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" font-weight="800" fill="${primary}">${cta}</text>

  <!-- Format & Prototype Notice -->
  <text x="${width - 60}" y="${height - 40}" text-anchor="end" font-family="Inter, sans-serif" font-size="16" fill="#FFFFFF" fill-opacity="0.6">MarketMind AI · ${ratio} Banner Export</text>
</svg>`;
}

/**
 * Build a downloadable Markdown video production script for the 15s video concept
 */
export function buildDownloadableVideoStoryboardMarkdown(
  asset: ContentAsset,
  brand?: BrandKit,
  product?: ProductProfile
): string {
  const brandName = brand?.name || "MarketMind AI";
  const productName = product?.name || "Product";
  const scenes = asset.video_scenes || [];

  const lines = [
    `# 15-Second Video Production Script — ${asset.title}`,
    "",
    `- **Brand:** ${brandName}`,
    `- **Product:** ${productName}`,
    `- **Format:** 9:16 Short-Form Video (TikTok / Instagram Reels / YouTube Shorts)`,
    `- **Duration:** 15 Seconds Total`,
    `- **Objective / Hook:** ${asset.headline}`,
    `- **Call to Action:** ${asset.cta}`,
    "",
    "---",
    "",
    "## Scene-by-Scene Storyboard Breakdown",
    "",
  ];

  scenes.forEach((scene) => {
    lines.push(
      `### ${scene.scene_title} (${scene.duration_seconds} Seconds)`,
      `- **Visual & Camera Direction:** ${scene.visual_description}`,
      `- **On-Screen Text Overlay:** \`${scene.on_screen_text}\``,
      `- **Voiceover Audio Script:** "${scene.voiceover}"`,
      ""
    );
  });

  lines.push(
    "---",
    "",
    "### Production & Export Notes",
    "- **Music Track:** Upbeat, modern electronic/lo-fi rhythm matching brand tone.",
    "- **Export Resolution:** 1080 x 1920 (9:16 vertical).",
    "- **Generated by:** MarketMind AI Phase 0 Prototype."
  );

  return lines.join("\n");
}
