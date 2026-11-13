import React, { useState, useEffect } from "react";
import type { BrandKit, CampaignBrief, ContentAsset, ProductProfile } from "./shared/types";
import { apiClient } from "./shared/api/client";
import { AppShell, type NavItemKey } from "./shared/components/AppShell";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { BrandKitPage } from "./features/brands/BrandKitPage";
import { ProductProfilePage } from "./features/products/ProductProfilePage";
import { CampaignPlannerPage } from "./features/campaigns/CampaignPlannerPage";
import { ContentStudioPage } from "./features/studio/ContentStudioPage";
import { GuideDemoPage } from "./features/guide/GuideDemoPage";

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavItemKey>("dashboard");
  const [brands, setBrands] = useState<BrandKit[]>([]);
  const [products, setProducts] = useState<ProductProfile[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignBrief[]>([]);
  const [recentAssets, setRecentAssets] = useState<ContentAsset[]>([]);

  const [selectedProductIdForCampaign, setSelectedProductIdForCampaign] = useState<string | undefined>();
  const [selectedCampaignIdForStudio, setSelectedCampaignIdForStudio] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [brandsData, prodsData, campsData] = await Promise.all([
        apiClient.listBrands(),
        apiClient.listProducts(),
        apiClient.listCampaigns(),
      ]);

      setBrands(brandsData);
      setProducts(prodsData);
      setCampaigns(campsData);

      if (campsData.length > 0) {
        const assetsData = await apiClient.listAssets(campsData[0].id);
        setRecentAssets(assetsData);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load prototype records. Make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetDemo = async () => {
    if (window.confirm("Reset prototype store to initial seeded demo data?")) {
      try {
        await apiClient.resetDemo();
        await loadData();
        setCurrentView("dashboard");
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Reset failed");
      }
    }
  };

  const handleNavigateToCampaignWithProduct = (productId: string) => {
    setSelectedProductIdForCampaign(productId);
    setCurrentView("campaigns");
  };

  const handleCampaignCreated = (newCampaign: CampaignBrief) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setSelectedCampaignIdForStudio(newCampaign.id);
    setCurrentView("studio");
  };

  return (
    <AppShell
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
      onResetDemo={handleResetDemo}
    >
      {error && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "var(--radius-md, 8px)",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            marginBottom: "20px",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={loadData}
            style={{
              padding: "6px 12px",
              backgroundColor: "#991B1B",
              color: "#FFFFFF",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {loading && brands.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-text-muted, #667085)" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
            Connecting to MarketMind AI Prototype API...
          </div>
          <div style={{ fontSize: "13px" }}>Loading Brand Kits, Products, and Campaign Briefs.</div>
        </div>
      ) : (
        <>
          {currentView === "dashboard" && (
            <DashboardPage
              brands={brands}
              products={products}
              campaigns={campaigns}
              recentAssets={recentAssets}
              onNavigate={(v) => setCurrentView(v)}
              onSelectCampaignForStudio={(id) => setSelectedCampaignIdForStudio(id)}
            />
          )}

          {currentView === "brands" && (
            <BrandKitPage brands={brands} onBrandUpdated={loadData} />
          )}

          {currentView === "products" && (
            <ProductProfilePage
              products={products}
              brands={brands}
              onProductUpdated={loadData}
              onNavigateToCampaign={handleNavigateToCampaignWithProduct}
            />
          )}

          {currentView === "campaigns" && (
            <CampaignPlannerPage
              brands={brands}
              products={products}
              initialProductId={selectedProductIdForCampaign}
              onCampaignCreated={handleCampaignCreated}
            />
          )}

          {currentView === "studio" && (
            <ContentStudioPage
              campaigns={campaigns}
              brands={brands}
              products={products}
              initialCampaignId={selectedCampaignIdForStudio}
              onCampaignUpdated={loadData}
            />
          )}

          {currentView === "guide" && <GuideDemoPage />}
        </>
      )}
    </AppShell>
  );
};

export default App;

