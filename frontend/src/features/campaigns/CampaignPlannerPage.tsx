import React, { useState } from "react";
import { Sparkles, Layers, FileText } from "lucide-react";
import type {
  BrandKit,
  CampaignBrief,
  CampaignMode,
  CampaignObjective,
  ProductProfile,
} from "../../shared/types";
import { apiClient } from "../../shared/api/client";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { FieldWrapper, Input, Select, Textarea } from "../../shared/components/FormControls";
import { StatusBadge } from "../../shared/components/StatusBadge";

interface CampaignPlannerPageProps {
  brands: BrandKit[];
  products: ProductProfile[];
  initialProductId?: string;
  onCampaignCreated: (campaign: CampaignBrief) => void;
}

const OBJECTIVES: { id: CampaignObjective; label: string; desc: string }[] = [
  { id: "product_launch", label: "Product Launch", desc: "Introduce a new product or seasonal item to the market." },
  { id: "awareness", label: "Brand Awareness", desc: "Reach new prospective customers and tell your brand story." },
  { id: "engagement", label: "Audience Engagement", desc: "Spark community discussion and gather feedback." },
  { id: "traffic", label: "Website Traffic", desc: "Drive qualified visitors to your shop or landing page." },
  { id: "sales_promotion", label: "Sales Promotion", desc: "Highlight a limited-time discount or bundle offer." },
  { id: "lead_generation", label: "Lead Generation", desc: "Collect inquiries or sign-ups for a product or service." },
];

const CHANNELS = ["Instagram", "LinkedIn", "Facebook", "Email Newsletter", "TikTok", "X / Twitter"];

const TONES = [
  "Warm & Craft-Focused",
  "Energetic & Inspiring",
  "Professional & Direct",
  "Playful & Casual",
  "Urgent & Promotional",
];

export const CampaignPlannerPage: React.FC<CampaignPlannerPageProps> = ({
  brands,
  products,
  initialProductId,
  onCampaignCreated,
}) => {
  const initialProd = products.find((p) => p.id === initialProductId) || products[0];
  const initialBrandId = initialProd ? initialProd.brand_id : brands[0]?.id || "";

  const [brandId, setBrandId] = useState<string>(initialBrandId);
  const [productId, setProductId] = useState<string>(initialProd?.id || "");
  const [name, setName] = useState(initialProd ? `${initialProd.name} Campaign` : "Summer Launch Campaign");
  const [objective, setObjective] = useState<CampaignObjective>("product_launch");
  const [audience, setAudience] = useState(
    initialProd?.audience || "Busy professionals and design-conscious shoppers"
  );
  const [channel, setChannel] = useState("Instagram");
  const [tone, setTone] = useState("Warm & Craft-Focused");
  const [keyMessage, setKeyMessage] = useState(
    initialProd
      ? `Experience ${initialProd.name}: ${initialProd.description.slice(0, 100)}.`
      : "Discover our latest release crafted for everyday quality."
  );
  const [mode, setMode] = useState<CampaignMode>("do_my_campaign");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeBrand = brands.find((b) => b.id === brandId) || brands[0];
  const availableProducts = products.filter((p) => p.brand_id === brandId);
  const activeProduct = products.find((p) => p.id === productId);

  // Update product list if brand changes
  const handleBrandChange = (newBrandId: string) => {
    setBrandId(newBrandId);
    const firstMatchingProd = products.find((p) => p.brand_id === newBrandId);
    setProductId(firstMatchingProd?.id || "");
  };

  const handleProductChange = (newProdId: string) => {
    setProductId(newProdId);
    const prod = products.find((p) => p.id === newProdId);
    if (prod) {
      if (prod.audience) setAudience(prod.audience);
      setKeyMessage(`Experience ${prod.name}: ${prod.description.slice(0, 90)}.`);
      setName(`${prod.name} Launch`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !audience.trim() || !keyMessage.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSaving(true);
    try {
      const created = await apiClient.createCampaign({
        name: name.trim(),
        brand_id: brandId,
        product_id: productId || undefined,
        objective,
        audience: audience.trim(),
        channel,
        tone,
        key_message: keyMessage.trim(),
        mode,
      });
      onCampaignCreated(created);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create campaign draft");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--color-text, #172033)" }}>
          AI Campaign Planning
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-muted, #667085)" }}>
          Assemble brand facts, product details, and marketing objectives into a reviewable brief before generating creative content.
        </p>
      </div>

      {errorMessage && (
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#FEF2F2", color: "#B91C1C", fontSize: "13px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }} className="planner-grid-split">
          {/* Setup Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Step 1: Context */}
            <Card padding="lg">
              <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", color: "var(--color-text, #172033)" }}>
                1. Context Selection
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FieldWrapper label="Brand Kit" required>
                  <Select value={brandId} onChange={(e) => handleBrandChange(e.target.value)}>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </Select>
                </FieldWrapper>

                <FieldWrapper label="Featured Product (Optional)">
                  <Select value={productId} onChange={(e) => handleProductChange(e.target.value)}>
                    <option value="">General Brand Campaign (No specific product)</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.price ? `(${p.price})` : ""}
                      </option>
                    ))}
                  </Select>
                </FieldWrapper>
              </div>

              <FieldWrapper label="Campaign Name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Pour Launch"
                  required
                />
              </FieldWrapper>
            </Card>

            {/* Step 2: Goal & Audience */}
            <Card padding="lg">
              <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", color: "var(--color-text, #172033)" }}>
                2. Marketing Goal & Audience
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text, #172033)", display: "block", marginBottom: "8px" }}>
                  Campaign Objective *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                  {OBJECTIVES.map((obj) => {
                    const isSelected = objective === obj.id;
                    return (
                      <div
                        key={obj.id}
                        onClick={() => setObjective(obj.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: isSelected
                            ? "2px solid var(--color-primary, #635BFF)"
                            : "1px solid var(--color-border, #E5E7EB)",
                          backgroundColor: isSelected ? "var(--color-primary-soft, #EFEEFF)" : "#FFFFFF",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "13.5px", color: isSelected ? "var(--color-primary, #635BFF)" : "var(--color-text, #172033)" }}>
                          {obj.label}
                        </span>
                        <span style={{ fontSize: "11.5px", color: "var(--color-text-muted, #667085)", lineHeight: 1.35 }}>
                          {obj.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FieldWrapper label="Primary Channel" required>
                  <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </Select>
                </FieldWrapper>

                <FieldWrapper label="Tone of Voice" required>
                  <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </FieldWrapper>
              </div>

              <FieldWrapper label="Target Audience Description" required helpText="Identifies who the marketing copy will speak to.">
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Remote professionals looking for café-quality cold brew at home"
                  required
                />
              </FieldWrapper>

              <FieldWrapper label="Key Campaign Message / Hook" required helpText="The core truth or proposition your content must convey.">
                <Textarea
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="e.g. Pour smooth, rich cold brew in under 30 seconds without waiting in café lines."
                  required
                  style={{ minHeight: "75px" }}
                />
              </FieldWrapper>
            </Card>

            {/* Step 3: Choose Generation Mode (PRD & phases.md mandatory requirement) */}
            <Card padding="lg">
              <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--color-text, #172033)" }}>
                3. Choose Creation Mode
              </h2>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 16px 0" }}>
                Select how you would like AI generation to package your campaign.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Mode A: Individual Content */}
                <div
                  onClick={() => setMode("individual_content")}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-lg, 12px)",
                    border: mode === "individual_content"
                      ? "2px solid var(--color-primary, #635BFF)"
                      : "1px solid var(--color-border, #E5E7EB)",
                    backgroundColor: mode === "individual_content" ? "#F5F3FF" : "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#EFEEFF",
                        color: "#635BFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-text, #172033)" }}>
                        Individual Content
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>
                        Single Asset + Variants
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#475569", margin: 0, lineHeight: 1.4 }}>
                    Choose one specific asset format (e.g. Social Post or Promo Banner) and generate focused variations to compare.
                  </p>
                </div>

                {/* Mode B: Do My Campaign */}
                <div
                  onClick={() => setMode("do_my_campaign")}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-lg, 12px)",
                    border: mode === "do_my_campaign"
                      ? "2px solid var(--color-primary, #635BFF)"
                      : "1px solid var(--color-border, #E5E7EB)",
                    backgroundColor: mode === "do_my_campaign" ? "#F5F3FF" : "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#EFEEFF",
                        color: "#635BFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Layers size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-text, #172033)" }}>
                        Do My Campaign
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>
                        Coordinated Draft Package
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#475569", margin: 0, lineHeight: 1.4 }}>
                    Produce a 3-step coordinated package (Awareness hook, Value banner, Call to Action) aligned to your brief.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Reviewable Campaign Brief Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Card padding="lg" style={{ height: "fit-content", position: "sticky", top: "84px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
                  Reviewable Campaign Brief
                </h3>
                <StatusBadge label="Ready to Generate" variant="info" />
              </div>

              <div
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F8FAFC",
                  padding: "16px",
                  border: "1px solid var(--color-border, #E5E7EB)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Brand Context
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--color-text, #172033)" }}>
                    {activeBrand?.name} ({activeBrand?.category})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Product Focus
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--color-text, #172033)" }}>
                    {activeProduct ? activeProduct.name : "General Brand Focus"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Objective & Channel
                  </div>
                  <div style={{ color: "#334155" }}>
                    {objective.replace("_", " ").toUpperCase()} on {channel} ({tone})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Target Audience
                  </div>
                  <div style={{ color: "#334155" }}>
                    {audience || "—"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Key Message
                  </div>
                  <div style={{ color: "#334155", fontStyle: "italic" }}>
                    “{keyMessage || "—"}”
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B" }}>
                    Selected Mode
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--color-primary, #635BFF)" }}>
                    {mode === "do_my_campaign" ? "Do My Campaign (3-Asset Package)" : "Individual Content (Focused Variants)"}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={saving}
                icon={<Sparkles size={18} />}
                style={{ width: "100%" }}
              >
                {saving ? "Creating Brief..." : "Review & Generate Drafts"}
              </Button>
            </Card>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .planner-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
