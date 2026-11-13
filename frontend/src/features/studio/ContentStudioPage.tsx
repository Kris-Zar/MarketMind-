import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  Save,
  Download,
  Check,
  FileText,
  Layers,
  Image as ImageIcon,
  Edit3,
  Video,
  Palette,
} from "lucide-react";
import type {
  BrandKit,
  CampaignBrief,
  CampaignMode,
  ContentAsset,
  ContentFormat,
  ProductProfile,
} from "../../shared/types";
import { apiClient } from "../../shared/api/client";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { FieldWrapper, Input, Select, Textarea } from "../../shared/components/FormControls";
import { StatusBadge } from "../../shared/components/StatusBadge";
import {
  HeroProductCard,
  BannerVisual,
  VideoStoryboardVisual,
  MinimalQuoteCard,
  buildDownloadableSvgBanner,
  buildDownloadableVideoStoryboardMarkdown,
} from "./CreativeTemplates";

interface ContentStudioPageProps {
  campaigns: CampaignBrief[];
  brands: BrandKit[];
  products: ProductProfile[];
  initialCampaignId?: string;
  onCampaignUpdated: () => void;
}

const FORMAT_TABS: { id: ContentFormat; label: string; icon: React.ReactNode }[] = [
  { id: "social_post", label: "Social Media Post", icon: <FileText size={14} /> },
  { id: "promo_banner", label: "Branded Banner", icon: <ImageIcon size={14} /> },
  { id: "video_concept", label: "15s Video Concept & Storyboard", icon: <Video size={14} /> },
  { id: "ad_copy", label: "Short Ad Copy", icon: <Edit3 size={14} /> },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square" },
  { id: "9:16", label: "9:16 Story / Reel" },
  { id: "16:9", label: "16:9 Landscape" },
];

const BANNER_THEMES = [
  { id: "modern_indigo", label: "Modern Indigo", color: "#635BFF" },
  { id: "sunset_warm", label: "Sunset Warm", color: "#EA580C" },
  { id: "minimal_dark", label: "Minimal Dark", color: "#0F172A" },
  { id: "fresh_emerald", label: "Fresh Emerald", color: "#059669" },
];

export const ContentStudioPage: React.FC<ContentStudioPageProps> = ({
  campaigns,
  brands,
  products,
  initialCampaignId,
  onCampaignUpdated,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    initialCampaignId || campaigns[0]?.id || ""
  );

  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const activeBrand = brands.find((b) => b.id === activeCampaign?.brand_id);
  const activeProduct = products.find((p) => p.id === activeCampaign?.product_id);

  // Studio Mode: inherits campaign mode or can toggle for demonstration
  const [activeMode, setActiveMode] = useState<CampaignMode>(
    activeCampaign?.mode || "do_my_campaign"
  );
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>("social_post");

  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [variationSeed, setVariationSeed] = useState(0);

  // In-place edit copy state
  const [editableHeadline, setEditableHeadline] = useState("");
  const [editableCaption, setEditableCaption] = useState("");
  const [editableCta, setEditableCta] = useState("");
  const [editableHashtags, setEditableHashtags] = useState("");
  const [editableAspectRatio, setEditableAspectRatio] = useState("1:1");
  const [editableBannerTheme, setEditableBannerTheme] = useState("modern_indigo");

  const [loading, setLoading] = useState(false);
  const [savingAsset, setSavingAsset] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing assets for selected campaign
  const loadAssets = async (campId: string) => {
    if (!campId) return;
    try {
      const data = await apiClient.listAssets(campId);
      setAssets(data);
      if (data.length > 0) {
        setSelectedAssetId(data[0].id);
        populateEditor(data[0]);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load campaign assets");
    }
  };

  const populateEditor = (asset: ContentAsset) => {
    setEditableHeadline(asset.headline);
    setEditableCaption(asset.caption);
    setEditableCta(asset.cta);
    setEditableHashtags(asset.hashtags?.join(" ") || "");
    setEditableAspectRatio(asset.aspect_ratio || "1:1");
    setEditableBannerTheme(asset.banner_theme || "modern_indigo");
  };

  useEffect(() => {
    if (activeCampaign) {
      setActiveMode(activeCampaign.mode);
      loadAssets(activeCampaign.id);
    }
  }, [selectedCampaignId]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleSelectAsset = (asset: ContentAsset) => {
    setSelectedAssetId(asset.id);
    populateEditor(asset);
  };

  // Generate / Regenerate Batch
  const handleGenerate = async (overrideFormat?: ContentFormat) => {
    if (!activeCampaign) return;
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const nextSeed = variationSeed + 1;
    setVariationSeed(nextSeed);

    const fmt = overrideFormat || selectedFormat;

    try {
      const result = await apiClient.generateContent(activeCampaign.id, {
        mode: activeMode,
        requested_format: fmt,
        variation_seed: nextSeed,
      });
      setAssets(result.assets);
      if (result.assets.length > 0) {
        setSelectedAssetId(result.assets[0].id);
        populateEditor(result.assets[0]);
      }
      setStatusMessage(`Generated ${result.assets.length} dynamic draft asset(s) ready for preview.`);
      onCampaignUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Save in-place copy edits
  const handleSaveCopyEdits = async () => {
    if (!selectedAsset) return;
    setSavingAsset(true);
    setErrorMessage(null);

    const tags = editableHashtags
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const updated = await apiClient.updateAsset(selectedAsset.id, {
        headline: editableHeadline,
        caption: editableCaption,
        cta: editableCta,
        hashtags: tags,
        aspect_ratio: editableAspectRatio,
        banner_theme: editableBannerTheme,
        status: "approved",
      });

      setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setStatusMessage("Edits saved and marked as approved!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save edits");
    } finally {
      setSavingAsset(false);
    }
  };

  // Regenerate single variant
  const handleRegenerateVariant = async () => {
    if (!selectedAsset) return;
    setRegenerating(true);
    setErrorMessage(null);

    try {
      const updated = await apiClient.regenerateAsset(selectedAsset.id, variationSeed + 2);
      setVariationSeed((v) => v + 1);
      setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      populateEditor(updated);
      setStatusMessage("Single asset variant regenerated dynamically!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  // Real Export Actions
  const handleDownloadMarkdown = async () => {
    if (!activeCampaign) return;
    try {
      const bundle = await apiClient.exportBundle(activeCampaign.id);
      const blob = new Blob([bundle.markdown_content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bundle.filename_base}.md`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage("Exported campaign Markdown brief successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Export failed");
    }
  };

  const handleDownloadJson = async () => {
    if (!activeCampaign) return;
    try {
      const bundle = await apiClient.exportBundle(activeCampaign.id);
      const blob = new Blob([bundle.json_content], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bundle.filename_base}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage("Exported campaign JSON package successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Export failed");
    }
  };

  const handleDownloadSvg = () => {
    if (!selectedAsset) return;
    const currentAssetWithEdits: ContentAsset = {
      ...selectedAsset,
      headline: editableHeadline,
      caption: editableCaption,
      cta: editableCta,
      aspect_ratio: editableAspectRatio,
      banner_theme: editableBannerTheme,
    };
    const svgStr = buildDownloadableSvgBanner(currentAssetWithEdits, activeBrand, activeProduct);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedAsset.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-visual.svg`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Exported visual banner as SVG successfully!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDownloadVideoScript = () => {
    if (!selectedAsset) return;
    const currentAssetWithEdits: ContentAsset = {
      ...selectedAsset,
      headline: editableHeadline,
      caption: editableCaption,
      cta: editableCta,
    };
    const scriptMd = buildDownloadableVideoStoryboardMarkdown(currentAssetWithEdits, activeBrand, activeProduct);
    const blob = new Blob([scriptMd], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedAsset.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-production-script.md`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Exported 15s Video Production Script successfully!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Live composite asset passed to template renderer
  const previewAsset: ContentAsset | undefined = selectedAsset
    ? {
        ...selectedAsset,
        headline: editableHeadline || selectedAsset.headline,
        caption: editableCaption || selectedAsset.caption,
        cta: editableCta || selectedAsset.cta,
        hashtags: editableHashtags.split(/\s+/).filter(Boolean),
        aspect_ratio: editableAspectRatio,
        banner_theme: editableBannerTheme,
      }
    : undefined;

  const isBanner = previewAsset?.asset_type === "promo_banner" || previewAsset?.template_id === "promo_split_banner";
  const isVideo = previewAsset?.asset_type === "video_concept" || previewAsset?.template_id === "video_storyboard";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header & Campaign Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
              Content & Creative Studio
            </h1>
            <StatusBadge label="Smart Generator Active" variant="approved" />
          </div>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "var(--color-text-muted, #667085)" }}>
            Generate, customize, and preview dynamic drafts, branded banners, and 15s video concept storyboards.
          </p>
        </div>

        {/* Campaign Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-muted, #667085)" }}>
            Active Campaign:
          </span>
          <Select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            style={{ minWidth: "220px", height: "38px" }}
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.channel})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <Card padding="sm" style={{ backgroundColor: "#F8FAFC" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveMode("do_my_campaign")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--radius-md, 8px)",
                fontSize: "13.5px",
                fontWeight: 600,
                backgroundColor: activeMode === "do_my_campaign" ? "#FFFFFF" : "transparent",
                color: activeMode === "do_my_campaign" ? "var(--color-primary, #635BFF)" : "#64748B",
                border: activeMode === "do_my_campaign" ? "1px solid var(--color-border, #E5E7EB)" : "1px solid transparent",
                boxShadow: activeMode === "do_my_campaign" ? "var(--shadow-sm)" : "none",
                cursor: "pointer",
              }}
            >
              <Layers size={16} /> Do My Campaign Package
            </button>

            <button
              onClick={() => setActiveMode("individual_content")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--radius-md, 8px)",
                fontSize: "13.5px",
                fontWeight: 600,
                backgroundColor: activeMode === "individual_content" ? "#FFFFFF" : "transparent",
                color: activeMode === "individual_content" ? "var(--color-primary, #635BFF)" : "#64748B",
                border: activeMode === "individual_content" ? "1px solid var(--color-border, #E5E7EB)" : "1px solid transparent",
                boxShadow: activeMode === "individual_content" ? "var(--shadow-sm)" : "none",
                cursor: "pointer",
              }}
            >
              <FileText size={16} /> Individual Content Item
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12.5px", color: "var(--color-text-muted, #667085)" }}>
              {activeMode === "do_my_campaign"
                ? "Generates coordinated 3-asset package: Post, Banner, and 15s Video Storyboard"
                : "Generates 2 diverse variants for chosen format"}
            </span>

            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={15} />}
              onClick={() => handleGenerate()}
              disabled={loading}
            >
              {loading ? "Generating..." : assets.length > 0 ? "Regenerate Batch" : "Generate Drafts"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Format Selector if in Individual Content Mode */}
      {activeMode === "individual_content" && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-muted, #667085)" }}>
            Select Format to Generate:
          </span>
          {FORMAT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedFormat(tab.id);
                handleGenerate(tab.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12.5px",
                fontWeight: 600,
                backgroundColor: selectedFormat === tab.id ? "var(--color-primary-soft, #EFEEFF)" : "#FFFFFF",
                color: selectedFormat === tab.id ? "var(--color-primary, #635BFF)" : "#64748B",
                border: selectedFormat === tab.id ? "1px solid var(--color-primary, #635BFF)" : "1px solid var(--color-border, #E5E7EB)",
                cursor: "pointer",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Status & Error Feedback */}
      {statusMessage && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", backgroundColor: "#F0FDF4", color: "#15803D", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #BBF7D0" }}>
          <Check size={16} /> {statusMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", backgroundColor: "#FEF2F2", color: "#B91C1C", fontSize: "13px", border: "1px solid #FECACA" }}>
          {errorMessage}
        </div>
      )}

      {/* Main Studio Split: Left Editor + Right Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px" }} className="studio-grid-split">
        {/* Left Column: Asset Selection & Live Copy Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Asset Tabs */}
          <Card padding="sm">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", letterSpacing: "0.04em" }}>
                {activeMode === "do_my_campaign" ? "Coordinated Campaign Package" : "Generated Variants"}
              </div>
              <span style={{ fontSize: "11px", color: "var(--color-primary, #635BFF)", fontWeight: 600 }}>
                {assets.length} Ready
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {assets.map((asset, index) => {
                const isSelected = asset.id === selectedAssetId;
                const isVideoAsset = asset.asset_type === "video_concept" || asset.template_id === "video_storyboard";
                const isBannerAsset = asset.asset_type === "promo_banner" || asset.template_id === "promo_split_banner";

                return (
                  <button
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: isSelected
                        ? "2px solid var(--color-primary, #635BFF)"
                        : "1px solid var(--color-border, #E5E7EB)",
                      backgroundColor: isSelected ? "#FFFFFF" : "#F8FAFC",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "3px",
                      minWidth: "160px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
                      {isVideoAsset ? (
                        <Video size={13} color="#F43F5E" />
                      ) : isBannerAsset ? (
                        <ImageIcon size={13} color="#0D9488" />
                      ) : (
                        <FileText size={13} color="var(--color-primary, #635BFF)" />
                      )}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: isSelected ? "var(--color-primary, #635BFF)" : "var(--color-text, #172033)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                      >
                        {asset.title || `Asset ${index + 1}`}
                      </span>
                    </div>

                    <span style={{ fontSize: "11px", color: "#64748B" }}>
                      {asset.channel}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Banner-Specific Controls (Shown when active asset is a banner) */}
          {isBanner && (
            <Card padding="md" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Palette size={16} color="var(--color-primary, #635BFF)" />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                  Banner Layout & Visual Customizer
                </h4>
              </div>

              {/* Aspect Ratio Selector */}
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "6px" }}>
                  Aspect Ratio:
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setEditableAspectRatio(r.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: editableAspectRatio === r.id ? "#FFFFFF" : "transparent",
                        color: editableAspectRatio === r.id ? "var(--color-primary, #635BFF)" : "#64748B",
                        border: editableAspectRatio === r.id ? "2px solid var(--color-primary, #635BFF)" : "1px solid #CBD5E1",
                        cursor: "pointer",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "6px" }}>
                  Visual Color Theme:
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {BANNER_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setEditableBannerTheme(t.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: editableBannerTheme === t.id ? "#FFFFFF" : "transparent",
                        color: editableBannerTheme === t.id ? "var(--color-text, #172033)" : "#64748B",
                        border: editableBannerTheme === t.id ? "2px solid var(--color-primary, #635BFF)" : "1px solid #CBD5E1",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: t.color }} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Live In-place Copy Editor */}
          <Card padding="lg">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={18} color="var(--color-primary, #635BFF)" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                  Live Copy & Prompt Editor
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <StatusBadge label={selectedAsset?.status === "approved" ? "Approved" : "Draft"} variant={selectedAsset?.status === "approved" ? "approved" : "draft"} />
                <Button
                  variant="subtle"
                  size="sm"
                  icon={<RefreshCw size={13} />}
                  onClick={handleRegenerateVariant}
                  disabled={regenerating || !selectedAsset}
                >
                  {regenerating ? "Regenerating..." : "Regenerate Variant"}
                </Button>
              </div>
            </div>

            <p style={{ fontSize: "12.5px", color: "var(--color-text-muted, #667085)", margin: "0 0 16px 0" }}>
              Edits update the live preview card on the right immediately. Save to persist changes to the prototype backend.
            </p>

            <FieldWrapper label="Headline / Main Hook">
              <Input
                value={editableHeadline}
                onChange={(e) => setEditableHeadline(e.target.value)}
                placeholder="Headline or Hook"
              />
            </FieldWrapper>

            <FieldWrapper label="Caption Body / Context">
              <Textarea
                value={editableCaption}
                onChange={(e) => setEditableCaption(e.target.value)}
                placeholder="Caption copy"
                style={{ minHeight: "85px" }}
              />
            </FieldWrapper>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Call To Action (CTA)">
                <Input
                  value={editableCta}
                  onChange={(e) => setEditableCta(e.target.value)}
                  placeholder="e.g. Shop Now"
                />
              </FieldWrapper>

              <FieldWrapper label="Hashtags (Space separated)">
                <Input
                  value={editableHashtags}
                  onChange={(e) => setEditableHashtags(e.target.value)}
                  placeholder="#Brand #Product"
                />
              </FieldWrapper>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <Button
                variant="primary"
                icon={<Save size={16} />}
                onClick={handleSaveCopyEdits}
                disabled={savingAsset || !selectedAsset}
              >
                {savingAsset ? "Saving..." : "Save Copy Edits"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Visual Preview & Real Export */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Visual Creative Card */}
          <Card padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                  {isVideo
                    ? "Interactive Video Storyboard Player"
                    : isBanner
                    ? "Customizable Branded Banner Preview"
                    : "Template-Based Creative Preview"}
                </h3>
                <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                  Visibly using Brand Kit ({activeBrand?.name}) and Product ({activeProduct?.name || "General"})
                </span>
              </div>
              <StatusBadge label="Live Interactive" variant="info" />
            </div>

            {previewAsset ? (
              <div style={{ padding: "8px 0", display: "flex", justifyContent: "center" }}>
                {isVideo ? (
                  <VideoStoryboardVisual asset={previewAsset} brand={activeBrand} product={activeProduct} />
                ) : isBanner ? (
                  <BannerVisual asset={previewAsset} brand={activeBrand} product={activeProduct} />
                ) : previewAsset.template_id === "minimal_quote_card" ? (
                  <MinimalQuoteCard asset={previewAsset} brand={activeBrand} />
                ) : (
                  <HeroProductCard asset={previewAsset} brand={activeBrand} product={activeProduct} />
                )}
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                Click "Generate Drafts" to produce campaign content.
              </div>
            )}
          </Card>

          {/* Real Export Actions */}
          <Card padding="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                  Real Prototype Export
                </h4>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                  Downloads genuine creative files (no fake publishing or simulated downloads).
                </span>
              </div>
              <StatusBadge label="Download Ready" variant="approved" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isVideo ? "1fr 1fr" : "1fr 1fr 1fr", gap: "10px" }}>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={14} />}
                onClick={handleDownloadMarkdown}
                title="Download formatted Markdown campaign brief and copy package"
              >
                Brief (.md)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={14} />}
                onClick={handleDownloadJson}
                title="Download structured campaign JSON package"
              >
                Data (.json)
              </Button>

              {isVideo ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Video size={14} />}
                  onClick={handleDownloadVideoScript}
                  title="Download complete 15s Video Production Script with timestamps"
                >
                  Video Script (.md)
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ImageIcon size={14} />}
                  onClick={handleDownloadSvg}
                  title="Download branded graphic visual as an SVG file"
                >
                  Banner (.svg)
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .studio-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
