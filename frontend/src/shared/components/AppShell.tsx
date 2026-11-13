import React, { useState } from "react";
import {
  LayoutDashboard,
  Palette,
  Package,
  Compass,
  Sparkles,
  Share2,
  BarChart3,
  TrendingUp,
  Users,
  Lightbulb,
  FolderOpen,
  Settings,
  Menu,
  X,
  RotateCcw,
  BookOpen,
} from "lucide-react";

export type NavItemKey =
  | "dashboard"
  | "brands"
  | "products"
  | "campaigns"
  | "studio"
  | "guide";

interface AppShellProps {
  currentView: NavItemKey;
  onNavigate: (view: NavItemKey) => void;
  onResetDemo: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  onResetDemo,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeNavItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "brands", label: "Brand Kit", icon: <Palette size={18} /> },
    { key: "products", label: "Products", icon: <Package size={18} /> },
    { key: "campaigns", label: "Campaigns", icon: <Compass size={18} /> },
    { key: "studio", label: "Content Studio", icon: <Sparkles size={18} /> },
    { key: "guide", label: "Guide & Scope", icon: <BookOpen size={18} /> },
  ] as const;

  const futureRoadmapItems = [
    { label: "Publishing", icon: <Share2 size={18} /> },
    { label: "Analytics", icon: <BarChart3 size={18} /> },
    { label: "Market Trends", icon: <TrendingUp size={18} /> },
    { label: "Competitors", icon: <Users size={18} /> },
    { label: "Recommendations", icon: <Lightbulb size={18} /> },
    { label: "Asset Library", icon: <FolderOpen size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleNavClick = (key: NavItemKey) => {
    onNavigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-background, #F7F8FC)" }}>
      {/* Mobile Header */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "56px",
          backgroundColor: "var(--color-sidebar, #111827)",
          color: "#FFFFFF",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 40,
        }}
        className="mobile-header-bar"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--color-primary, #635BFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>MarketMind AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: "#FFFFFF", padding: "8px" }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Persistent Left Sidebar */}
      <aside
        style={{
          width: "var(--sidebar-width, 240px)",
          backgroundColor: "var(--color-sidebar, #111827)",
          color: "var(--color-sidebar-text, #F3F4F6)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          borderRight: "1px solid var(--color-sidebar-border, #1E293B)",
          zIndex: 30,
        }}
        className={`sidebar-nav ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        {/* Logo / App Name */}
        <div
          style={{
            height: "var(--topbar-height, 64px)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "12px",
            borderBottom: "1px solid var(--color-sidebar-border, #1E293B)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary, #635BFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "16px",
              boxShadow: "0 2px 6px rgba(99,91,255,0.4)",
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>MarketMind AI</div>
            <div style={{ fontSize: "11px", color: "var(--color-sidebar-text-muted, #9CA3AF)" }}>
              Phase 0 Prototype
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-sidebar-text-muted, #9CA3AF)",
              padding: "0 8px 8px 8px",
            }}
          >
            Prototype Flow
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "20px" }}>
            {activeNavItems.map((item) => {
              const active = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "var(--radius-md, 8px)",
                    fontSize: "13.5px",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#FFFFFF" : "var(--color-sidebar-text-muted, #9CA3AF)",
                    backgroundColor: active
                      ? "var(--color-sidebar-active-bg, rgba(99, 91, 255, 0.18))"
                      : "transparent",
                    borderLeft: active ? "3px solid var(--color-primary, #635BFF)" : "3px solid transparent",
                    textAlign: "left",
                    transition: "all 0.12s ease",
                  }}
                >
                  <span style={{ color: active ? "var(--color-primary, #635BFF)" : "inherit" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-sidebar-text-muted, #9CA3AF)",
              padding: "8px 8px 6px 8px",
              borderTop: "1px solid var(--color-sidebar-border, #1E293B)",
            }}
          >
            Roadmap (Later Phases)
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {futureRoadmapItems.map((item) => (
              <div
                key={item.label}
                title="Planned for later phases; not operational in Phase 0"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md, 8px)",
                  fontSize: "13px",
                  color: "#6B7280",
                  cursor: "not-allowed",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "#1F2937",
                    color: "#9CA3AF",
                  }}
                >
                  Phase 1–3
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer profile snippet */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--color-sidebar-border, #1E293B)",
            backgroundColor: "#0B0F19",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "var(--color-secondary, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "13px",
                color: "#FFFFFF",
              }}
            >
              GD
            </div>
            <div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#FFFFFF" }}>Guide Demo</div>
              <div style={{ fontSize: "11px", color: "var(--color-sidebar-text-muted, #9CA3AF)" }}>
                Local Workspace
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Utility Bar */}
        <header
          style={{
            height: "var(--topbar-height, 64px)",
            backgroundColor: "var(--color-surface, #FFFFFF)",
            borderBottom: "1px solid var(--color-border, #E5E7EB)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text, #172033)" }}>
              Workspace:
            </span>
            <span
              style={{
                fontSize: "13px",
                backgroundColor: "var(--color-surface-muted, #F8FAFC)",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid var(--color-border, #E5E7EB)",
                fontWeight: 500,
              }}
            >
              Demo Business (LumaBrew / VeloFit)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "12px",
                backgroundColor: "#EFEEFF",
                color: "#5147E8",
                fontWeight: 600,
                border: "1px solid #C7D2FE",
              }}
            >
              Phase 0 Prototype
            </span>

            <button
              onClick={onResetDemo}
              title="Reset prototype store back to seeded demo state"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12.5px",
                padding: "6px 12px",
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border, #E5E7EB)",
                backgroundColor: "#FFFFFF",
                color: "var(--color-text-muted, #667085)",
                fontWeight: 500,
              }}
            >
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main
          style={{
            flex: 1,
            padding: "28px",
            maxWidth: "1320px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .mobile-header-bar {
            display: flex !important;
          }
          .sidebar-nav {
            position: fixed;
            top: 56px;
            bottom: 0;
            left: -260px;
            transition: left 0.2s ease;
          }
          .sidebar-nav.mobile-open {
            left: 0;
          }
          main {
            padding: 16px !important;
            margin-top: 56px;
          }
        }
      `}</style>
    </div>
  );
};

