import React, { useState } from "react";
import { Plus, Check, Upload, Package, Tag, Users } from "lucide-react";
import type { BrandKit, ProductImageItem, ProductProfile } from "../../shared/types";
import { apiClient } from "../../shared/api/client";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { FieldWrapper, Input, Select, Textarea } from "../../shared/components/FormControls";
import { StatusBadge } from "../../shared/components/StatusBadge";

interface ProductProfilePageProps {
  products: ProductProfile[];
  brands: BrandKit[];
  onProductUpdated: () => void;
  onNavigateToCampaign: (productId: string) => void;
}

export const ProductProfilePage: React.FC<ProductProfilePageProps> = ({
  products,
  brands,
  onProductUpdated,
  onNavigateToCampaign,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form State
  const [brandId, setBrandId] = useState<string>(brands[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [images, setImages] = useState<ProductImageItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSelectProduct = (prod: ProductProfile) => {
    setSelectedProductId(prod.id);
    setIsCreatingNew(false);
    setBrandId(prod.brand_id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price || "");
    setBenefitsText(prod.benefits.join("\n"));
    setOffer(prod.offer || "");
    setAudience(prod.audience || "");
    setImages(prod.images || []);
    setErrorMessage(null);
    setSaveSuccess(false);
  };

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setSelectedProductId("");
    setBrandId(brands[0]?.id || "");
    setName("");
    setDescription("");
    setPrice("");
    setBenefitsText("");
    setOffer("");
    setAudience("");
    setImages([]);
    setErrorMessage(null);
    setSaveSuccess(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 400 * 1024) {
      setErrorMessage("Image exceeds 400KB limit for prototype.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newImage: ProductImageItem = {
        id: `img-user-${Date.now()}`,
        label: file.name,
        url: dataUrl,
        is_sample: false,
      };
      setImages((prev) => [...prev.slice(0, 2), newImage]);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!name.trim() || !description.trim()) {
      setErrorMessage("Product Name and Description are required.");
      return;
    }

    const parsedBenefits = benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    setSaving(true);
    try {
      if (isCreatingNew) {
        const created = await apiClient.createProduct({
          brand_id: brandId,
          name: name.trim(),
          description: description.trim(),
          images,
          price: price.trim() || undefined,
          benefits: parsedBenefits,
          offer: offer.trim() || undefined,
          audience: audience.trim() || undefined,
        });
        setSelectedProductId(created.id);
        setIsCreatingNew(false);
      }
      setSaveSuccess(true);
      onProductUpdated();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save product profile");
    } finally {
      setSaving(false);
    }
  };

  // Sync initial product values
  React.useEffect(() => {
    if (selectedProduct && !isCreatingNew) {
      setBrandId(selectedProduct.brand_id);
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price || "");
      setBenefitsText(selectedProduct.benefits.join("\n"));
      setOffer(selectedProduct.offer || "");
      setAudience(selectedProduct.audience || "");
      setImages(selectedProduct.images || []);
    }
  }, [selectedProductId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--color-text, #172033)" }}>
            Product Profile Library
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-muted, #667085)" }}>
            Maintain product facts, imagery, pricing, and offers so campaign copy stays grounded and truthful.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={handleStartNew}>
          Add Product Profile
        </Button>
      </div>

      {/* Product Selector Cards */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
        {products.map((p) => {
          const isSelected = !isCreatingNew && p.id === (selectedProductId || selectedProduct?.id);
          const brand = brands.find((b) => b.id === p.brand_id);
          return (
            <div
              key={p.id}
              onClick={() => handleSelectProduct(p)}
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
                  {p.name}
                </span>
                {p.is_demo ? <StatusBadge label="Demo Product" variant="demo" /> : <StatusBadge label="Saved" variant="approved" />}
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
                Brand: {brand?.name || "Unassigned"}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-primary, #635BFF)" }}>
                  {p.price || "Custom Quote"}
                </span>
                <span style={{ fontSize: "11px", color: "#64748B" }}>
                  {p.images?.length || 0} image(s)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split: Editor and Summary Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" }} className="product-grid-split">
        {/* Editor Card */}
        <Card padding="lg">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
              {isCreatingNew ? "Add Product Profile" : `Edit: ${name || selectedProduct?.name}`}
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
              <Check size={16} /> Product profile saved successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Associated Brand Kit" required>
                <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>

              <FieldWrapper label="Product / Service Name" required>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aurora Cold Brew Concentrate"
                  required
                />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Product Description" required helpText="Factual product information. AI will not invent claims beyond this text.">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product, ingredients/materials, usage, and key features."
                required
                style={{ minHeight: "85px" }}
              />
            </FieldWrapper>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FieldWrapper label="Price / Pricing Note (Optional)">
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. $18.00 or From $24"
                />
              </FieldWrapper>

              <FieldWrapper label="Special Offer (Optional)">
                <Input
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder="e.g. 15% off first 2-bottle starter bundle"
                />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Key Benefits (One per line)" helpText="Used as hook points in campaign copy.">
              <Textarea
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder="Smooth 18-hour cold extraction&#10;Zero added sugar or preservatives&#10;Makes 12 iced servings"
                style={{ minHeight: "75px" }}
              />
            </FieldWrapper>

            <FieldWrapper label="Target Customer Profile (Optional)">
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Remote professionals and iced coffee lovers"
              />
            </FieldWrapper>

            <FieldWrapper label="Product Visuals (1–3 Images)" helpText="Select sample visuals or upload custom image files.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                {images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border, #E5E7EB)",
                      overflow: "hidden",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#FFFFFF",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      border: "1px dashed var(--color-border, #CBD5E1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "var(--color-text-muted, #667085)",
                      gap: "4px",
                    }}
                  >
                    <Upload size={16} />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                )}
              </div>
            </FieldWrapper>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              {isCreatingNew && (
                <Button variant="secondary" onClick={() => handleSelectProduct(selectedProduct)}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : isCreatingNew ? "Save Product Profile" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Product Summary Card (Pre-Campaign View) */}
        <Card padding="lg" style={{ height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
              Product Summary Card
            </h3>
            {selectedProduct?.is_demo && <StatusBadge label="Demo Record" variant="demo" />}
          </div>

          <div
            style={{
              borderRadius: "var(--radius-lg, 12px)",
              overflow: "hidden",
              border: "1px solid var(--color-border, #E5E7EB)",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* Visual Header */}
            <div style={{ height: "140px", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {images.length > 0 ? (
                <img src={images[0].url} alt={name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <Package size={42} color="#94A3B8" />
              )}
            </div>

            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--color-text, #172033)" }}>
                  {name || "Product Name"}
                </h4>
                {price && (
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-primary, #635BFF)" }}>
                    {price}
                  </span>
                )}
              </div>

              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.45, margin: "0 0 14px 0" }}>
                {description || "Add product description to preview."}
              </p>

              {offer && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#B45309", backgroundColor: "#FFFBEB", padding: "6px 10px", borderRadius: "6px", marginBottom: "12px", fontWeight: 600 }}>
                  <Tag size={13} /> {offer}
                </div>
              )}

              {benefitsText && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B", marginBottom: "6px" }}>
                    Benefits Highlighted
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#334155" }}>
                    {benefitsText.split("\n").filter(Boolean).map((ben, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}

              {audience && (
                <div style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                  <Users size={14} /> Audience: {audience}
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                style={{ width: "100%" }}
                onClick={() => onNavigateToCampaign(selectedProduct?.id || "")}
              >
                Use Product in Campaign
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

