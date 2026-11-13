import React from "react";
import { Plus, Sparkles, Palette, Package, ArrowRight, Compass } from "lucide-react";
import type { BrandKit, CampaignBrief, ContentAsset, ProductProfile } from "../../shared/types";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { MetricCard } from "../../shared/components/MetricCard";
import { StatusBadge } from "../../shared/components/StatusBadge";
import type { NavItemKey } from "../../shared/components/AppShell";

interface DashboardPageProps {
  brands: BrandKit[];
  products: ProductProfile[];
  campaigns: CampaignBrief[];
  recentAssets: ContentAsset[];
  onNavigate: (view: NavItemKey) => void;
  onSelectCampaignForStudio: (campaignId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  brands,
  products,
  campaigns,
  recentAssets,
  onNavigate,
  onSelectCampaignForStudio,
}) => {
  const activeBrand = brands[0];
  const demoBannerAsset = recentAssets.find((a) => a.template_id === "hero_product_card") || recentAssets[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #111827 0%, #1F2A44 100%)",
          borderRadius: "var(--radius-lg, 12px)",
          padding: "32px",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--color-primary-soft, #EFEEFF)",
              }}
            >
              Phase 0 Prototype Demonstration
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
            Welcome to MarketMind AI
          </h1>
          <p style={{ margin: 0, fontSize: "14.5px", color: "#9CA3AF", maxWidth: "560px", lineHeight: 1.5 }}>
            Guide-ready prototype validating the connected marketing workflow: from brand and product setup
            to campaign briefs and reviewable copy/creative assets.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus size={18} />}
            onClick={() => onNavigate("campaigns")}
          >
            Create Campaign
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Sparkles size={18} />}
            onClick={() => onNavigate("studio")}
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            Content Studio
          </Button>
        </div>
      </div>

      {/* Honest Prototype Metric Cards (PRD & design.md honest data requirement) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        <MetricCard
          title="Active Brand Kits"
          value={brands.length.toString()}
          trend={brands.length > 1 ? "2 Brands Ready" : "1 Brand Configured"}
          trendPositive={true}
          isDemo={false}
          icon={<Palette size={18} />}
        />
        <MetricCard
          title="Saved Products"
          value={products.length.toString()}
          trend="Ready for campaigns"
          trendPositive={true}
          isDemo={false}
          icon={<Package size={18} />}
        />
        <MetricCard
          title="Campaign Drafts"
          value={campaigns.length.toString()}
          trend="Individual & Do My Campaign"
          trendPositive={true}
          isDemo={false}
          icon={<Compass size={18} />}
        />
        <MetricCard
          title="Live Social Publishing"
          value="Phase 2"
          unavailableNote="Live OAuth/publishing not connected in Phase 0 prototype."
          isDemo={false}
        />
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 14px 0", color: "var(--color-text, #172033)" }}>
          Prototype Journey Steps
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          <Card
            padding="md"
            onClick={() => onNavigate("brands")}
            style={{ cursor: "pointer", transition: "transform 0.15s ease, border-color 0.15s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#EFEEFF",
                  color: "#635BFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Palette size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: "14.5px" }}>1. Brand Kit</div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 12px 0" }}>
              Configure brand voice, palette colors, and logo for consistent generation.
            </p>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-primary, #635BFF)", display: "flex", alignItems: "center", gap: "4px" }}>
              Manage Brand Kit <ArrowRight size={14} />
            </span>
          </Card>

          <Card
            padding="md"
            onClick={() => onNavigate("products")}
            style={{ cursor: "pointer", transition: "transform 0.15s ease, border-color 0.15s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#ECFDF5",
                  color: "#0F766E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Package size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: "14.5px" }}>2. Product Profile</div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 12px 0" }}>
              Define product descriptions, visuals, pricing, benefits, and target offer.
            </p>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-primary, #635BFF)", display: "flex", alignItems: "center", gap: "4px" }}>
              View Products <ArrowRight size={14} />
            </span>
          </Card>

          <Card
            padding="md"
            onClick={() => onNavigate("campaigns")}
            style={{ cursor: "pointer", transition: "transform 0.15s ease, border-color 0.15s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFBEB",
                  color: "#D97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Compass size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: "14.5px" }}>3. Campaign Brief</div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 12px 0" }}>
              Set objective, audience, tone, and choose Individual Content or Do My Campaign.
            </p>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-primary, #635BFF)", display: "flex", alignItems: "center", gap: "4px" }}>
              Plan Campaign <ArrowRight size={14} />
            </span>
          </Card>

          <Card
            padding="md"
            onClick={() => onNavigate("studio")}
            style={{ cursor: "pointer", transition: "transform 0.15s ease, border-color 0.15s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#F5F3FF",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={20} />
              </div>
              <div style={{ fontWeight: 600, fontSize: "14.5px" }}>4. Creative Studio</div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 12px 0" }}>
              Review generated copy, edit live previews, regenerate, and export real files.
            </p>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-primary, #635BFF)", display: "flex", alignItems: "center", gap: "4px" }}>
              Open Studio <ArrowRight size={14} />
            </span>
          </Card>
        </div>
      </div>

      {/* Recent Campaigns and Featured Creative Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" }} className="dashboard-grid-split">
        {/* Recent Campaigns List */}
        <Card padding="md">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
                Recent Campaigns
              </h3>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                Click a campaign to open in Content Studio
              </span>
            </div>
            <Button variant="subtle" size="sm" onClick={() => onNavigate("campaigns")}>
              New Campaign
            </Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => {
                  onSelectCampaignForStudio(camp.id);
                  onNavigate("studio");
                }}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md, 8px)",
                  border: "1px solid var(--color-border, #E5E7EB)",
                  backgroundColor: "var(--color-surface-muted, #F8FAFC)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.15s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text, #172033)" }}>
                      {camp.name}
                    </span>
                    {camp.is_demo && <StatusBadge label="Demo" variant="demo" />}
                    <StatusBadge
                      label={camp.status === "approved" ? "Approved" : "Needs Review"}
                      variant={camp.status === "approved" ? "approved" : "needs_review"}
                    />
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                    {camp.channel} · {camp.mode === "do_my_campaign" ? "Do My Campaign" : "Individual Content"} · {camp.tone}
                  </div>
                </div>
                <ArrowRight size={16} color="#667085" />
              </div>
            ))}
          </div>
        </Card>

        {/* Featured Creative Preview */}
        <Card padding="md">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
                Sample Creative Preview
              </h3>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                Visual reflecting active Brand Kit values
              </span>
            </div>
            <StatusBadge label="Demo Preview" variant="demo" />
          </div>

          {demoBannerAsset ? (
            <div
              style={{
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border, #E5E7EB)",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${activeBrand?.primary_color || "#635BFF"} 0%, ${activeBrand?.secondary_color || "#1F2A44"} 100%)`,
                  padding: "20px",
                  color: "#FFFFFF",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.9, marginBottom: "4px" }}>
                  {activeBrand?.name || "MarketMind Brand"}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px" }}>
                  {demoBannerAsset.headline}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.85, lineHeight: 1.4, marginBottom: "14px" }}>
                  {demoBannerAsset.caption.slice(0, 100)}...
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    backgroundColor: "#FFFFFF",
                    color: activeBrand?.primary_color || "#635BFF",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {demoBannerAsset.cta}
                </div>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  Format: {demoBannerAsset.channel}
                </span>
                <Button variant="subtle" size="sm" onClick={() => onNavigate("studio")}>
                  Open in Studio
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "#667085", fontSize: "13px" }}>
              No creative assets generated yet.
            </div>
          )}
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

