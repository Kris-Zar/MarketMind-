import React, { useState } from "react";
import { Plus, Check, Upload } from "lucide-react";
import type { BrandKit } from "../../shared/types";
import { apiClient } from "../../shared/api/client";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { FieldWrapper, Input, Select, Textarea } from "../../shared/components/FormControls";
import { StatusBadge } from "../../shared/components/StatusBadge";

interface BrandKitPageProps {
  brands: BrandKit[];
  onBrandUpdated: () => void;
}

const VOICE_OPTIONS = [
  "Warm, Modern & Craft-Focused",
  "Energetic, Clear & Encouraging",
  "Professional, Trustworthy & Direct",
  "Playful, Bold & Friendly",
  "Sophisticated, Calm & Minimalist",
];

const CATEGORY_OPTIONS = [
  "Specialty Coffee & Beverages",
  "Activewear & Wellness",
  "Organic Skincare & Beauty",
  "Home Goods & Ceramics",
  "Software & Digital Services",
  "Artisan Food & Bakery",
];

export const BrandKitPage: React.FC<BrandKitPageProps> = ({ brands, onBrandUpdated }) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string>(brands[0]?.id || "");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [voice, setVoice] = useState(VOICE_OPTIONS[0]);
  const [primaryColor, setPrimaryColor] = useState("#635BFF");
  const [secondaryColor, setSecondaryColor] = useState("#1F2A44");
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState("Custom Uploaded Logo");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  const handleSelectBrand = (brand: BrandKit) => {
    setSelectedBrandId(brand.id);
    setIsCreatingNew(false);
    setName(brand.name);
    setCategory(brand.category);
    setDescription(brand.description);
    setVoice(brand.voice);
    setPrimaryColor(brand.primary_color);
    setSecondaryColor(brand.secondary_color);
    setTagline(brand.tagline || "");
    setLogoUrl(brand.logo_url || null);
    setLogoLabel(brand.logo_label || "Sample Logo");
    setErrorMessage(null);
    setSaveSuccess(false);
  };

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setSelectedBrandId("");
    setName("");
    setCategory(CATEGORY_OPTIONS[2]);
    setDescription("");
    setVoice(VOICE_OPTIONS[0]);
    setPrimaryColor("#635BFF");
    setSecondaryColor("#1F2A44");
    setTagline("");
    setLogoUrl(null);
    setLogoLabel("User Logo");
    setErrorMessage(null);
    setSaveSuccess(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPEG, WebP, or SVG).");
      return;
    }

    if (file.size > 300 * 1024) {
      setErrorMessage("Logo file size exceeds 300KB limit for prototype.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
      setLogoLabel(file.name);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!name.trim() || !description.trim()) {
      setErrorMessage("Brand Name and Description are required.");
      return;
    }

    setSaving(true);
    try {
      if (isCreatingNew) {
        const created = await apiClient.createBrand({
          name: name.trim(),
          category,
          description: description.trim(),
          voice,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          tagline: tagline.trim(),
          logo_url: logoUrl,
          logo_label: logoLabel,
        });
        setSelectedBrandId(created.id);
        setIsCreatingNew(false);
      }
      setSaveSuccess(true);
      onBrandUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save Brand Kit");
    } finally {
      setSaving(false);
    }
  };

  // Sync initial form values
  React.useEffect(() => {
    if (selectedBrand && !isCreatingNew) {
      setName(selectedBrand.name);
      setCategory(selectedBrand.category);
      setDescription(selectedBrand.description);
      setVoice(selectedBrand.voice);
      setPrimaryColor(selectedBrand.primary_color);
      setSecondaryColor(selectedBrand.secondary_color);
      setTagline(selectedBrand.tagline || "");
      setLogoUrl(selectedBrand.logo_url || null);
      setLogoLabel(selectedBrand.logo_label || "Sample Logo");
    }
  }, [selectedBrandId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--color-text, #172033)" }}>
            Brand Kit Management
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-muted, #667085)" }}>
            Establish reusable brand voice, palette colors, and logos to ground all campaign generation.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={handleStartNew}>
          Create New Brand Kit
        </Button>
      </div>

      {/* Brand Selector Cards */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
        {brands.map((b) => {
          const isSelected = !isCreatingNew && b.id === (selectedBrandId || selectedBrand?.id);
          return (
            <div
              key={b.id}
              onClick={() => handleSelectBrand(b)}
              style={{
                flex: "0 0 280px",
                padding: "14px 16px",
                borderRadius: "var(--radius-lg, 12px)",
                border: isSelected
                  ? "2px solid var(--color-primary, #635BFF)"
                  : "1px solid var(--color-border, #E5E7EB)",
                backgroundColor: isSelected ? "var(--color-surface, #FFFFFF)" : "#F9FAFB",
                cursor: "pointer",
                boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--color-text, #172033)" }}>
                  {b.name}
                </span>
                {b.is_demo ? <StatusBadge label="Demo Brand" variant="demo" /> : <StatusBadge label="Saved" variant="approved" />}
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                {b.category}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: b.primary_color }} />
                <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: b.secondary_color }} />
                <span style={{ fontSize: "11px", color: "#64748B", marginLeft: "4px" }}>
                  {b.voice.split(",")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor & Live Preview Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }} className="brand-grid-split">
        {/* Editor Form */}
        <Card padding="lg">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
              {isCreatingNew ? "Create Brand Kit" : `Edit: ${name || selectedBrand?.name}`}
            </h2>
            {isCreatingNew && <StatusBadge label="New Draft" variant="draft" />}
          </div>

          {errorMessage && (
            <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#FEF2F2", color: "#B91C1C", fontSize: "13px", marginBottom: "16px" }}>
              {errorMessage}
            </div>
          )}

          {saveSuccess && (
            <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#F0FDF4", color: "#15803D", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={16} /> Brand Kit saved successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Brand Name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. LumaBrew Roasters"
                  required
                />
              </FieldWrapper>

              <FieldWrapper label="Business Category" required>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>
            </div>

            <FieldWrapper label="Brand Description & Mission" required helpText="Grounded context used by AI generators.">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your brand makes, who it serves, and what makes it special."
                required
                style={{ minHeight: "90px" }}
              />
            </FieldWrapper>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Brand Voice / Tone" required>
                <Select value={voice} onChange={(e) => setVoice(e.target.value)}>
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper label="Brand Tagline (Optional)">
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Crafted mornings, without the rush."
                />
              </FieldWrapper>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Primary Brand Color" required>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                    style={{ width: "42px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#635BFF"
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Secondary / Dark Color" required>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value.toUpperCase())}
                    style={{ width: "42px", height: "40px", border: "none", cursor: "pointer", borderRadius: "6px" }}
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value.toUpperCase())}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#1F2A44"
                  />
                </div>
              </FieldWrapper>
            </div>

            <FieldWrapper label="Brand Logo" helpText="Upload PNG, JPEG, SVG (max 300KB) or use the sample SVG logo.">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {logoUrl && (
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border, #E5E7EB)",
                      padding: "4px",
                      backgroundColor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={logoUrl} alt="Logo preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                  </div>
                )}
                <div>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "1px solid var(--color-border, #E5E7EB)",
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    <Upload size={14} /> Upload Custom Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                  </label>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted, #667085)", marginTop: "4px" }}>
                    {logoLabel}
                  </div>
                </div>
              </div>
            </FieldWrapper>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              {isCreatingNew && (
                <Button variant="secondary" onClick={() => handleSelectBrand(selectedBrand)}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : isCreatingNew ? "Save New Brand Kit" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Mini Brand Preview Card */}
        <Card padding="lg" style={{ height: "fit-content" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px 0", color: "var(--color-text, #172033)" }}>
            Live Brand Identity Preview
          </h3>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 16px 0" }}>
            This preview demonstrates how entered colors, logo, voice, and typography will brand generated creatives.
          </p>

          <div
            style={{
              borderRadius: "var(--radius-lg, 12px)",
              overflow: "hidden",
              border: "1px solid var(--color-border, #E5E7EB)",
              backgroundColor: "#FFFFFF",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Header banner */}
            <div
              style={{
                height: "80px",
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                padding: "16px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                color: "#FFFFFF",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 600, opacity: 0.9 }}>
                {category}
              </span>
            </div>

            {/* Profile body */}
            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "-36px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    border: "3px solid #FFFFFF",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", backgroundColor: primaryColor, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      {name ? name[0] : "B"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                    {name || "Your Brand Name"}
                  </h4>
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                    {voice}
                  </span>
                </div>
              </div>

              {tagline && (
                <div style={{ fontSize: "13px", fontWeight: 600, color: primaryColor, marginBottom: "8px" }}>
                  “{tagline}”
                </div>
              )}

              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.45, margin: "0 0 14px 0" }}>
                {description || "Enter a description to see how your mission will ground campaign briefs."}
              </p>

              {/* Palette swatches */}
              <div style={{ borderTop: "1px solid var(--color-border, #E5E7EB)", paddingTop: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B", marginBottom: "8px" }}>
                  Palette Swatches
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#334155" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: primaryColor }} />
                    {primaryColor}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#334155" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: secondaryColor }} />
                    {secondaryColor}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .brand-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

