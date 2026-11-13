import React from "react";
import { AlertCircle, BookOpen, MessageSquareQuote } from "lucide-react";
import { Card } from "../../shared/components/Card";
import { StatusBadge } from "../../shared/components/StatusBadge";

export const GuideDemoPage: React.FC = () => {
  const journeySteps = [
    {
      step: 1,
      title: "Open the Dashboard",
      action: "Review the workspace overview, quick actions, and honest demo metrics.",
      evidence: "Demonstrates that metrics are explicitly labelled as demo data and no fake platform analytics are claimed.",
    },
    {
      step: 2,
      title: "Inspect or Create Brand Kit",
      action: "Review LumaBrew Roasters or create a new Brand Kit with colors, voice, and logo.",
      evidence: "Shows persistent Brand Kit storage, color palette selection, and logo validation.",
    },
    {
      step: 3,
      title: "Review Product Profile",
      action: "Examine product facts, pricing, benefits, and images for Aurora Cold Brew Concentrate.",
      evidence: "Demonstrates product grounding: AI output is strictly tied to entered product facts.",
    },
    {
      step: 4,
      title: "Plan Campaign & Brief",
      action: "Select objective, channel (Instagram), target audience, tone, and choose creation mode.",
      evidence: "Produces a reviewable campaign brief summary connecting brand, product, and marketing goals.",
    },
    {
      step: 5,
      title: "Test Individual Content vs Do My Campaign",
      action: "Generate single-format variants (Individual Content) or a 3-step coordinated package (Do My Campaign).",
      evidence: "Visibly demonstrates both creation modes defined in PRD Section 6 (F06).",
    },
    {
      step: 6,
      title: "Banner Customizer & Live Edit",
      action: "Select the Banner asset, customize aspect ratios (1:1, 9:16, 16:9) and theme colors, and edit headline/CTA in real time.",
      evidence: "Demonstrates live layout adaptation, brand theme rendering, and in-place copy editing per design.md.",
    },
    {
      step: 7,
      title: "Video Storyboard Player ('Video Images')",
      action: "Select the Video Storyboard asset and play or step through the 4-frame video ad scenes with camera prompts and voiceovers.",
      evidence: "Validates short-form video ad concept planning (0–15s hook, problem, proof, CTA) with script export.",
    },
    {
      step: 8,
      title: "Real File Export",
      action: "Download genuine files: Markdown brief (.md), JSON data (.json), SVG banner (.svg), or 15s Video Production Script (.md).",
      evidence: "Never fakes downloads; outputs real, inspection-ready marketing files to the filesystem.",
    },
  ];

  const capabilityMatrix = [
    {
      feature: "Brand Kit Management",
      phase0Status: "Functional",
      note: "Brand profile, palette colors, logo upload/SVG, voice guidance, prototype persistence.",
    },
    {
      feature: "Product Profile Management",
      phase0Status: "Functional",
      note: "Product facts, benefits, pricing, audience, and sample image selection.",
    },
    {
      feature: "Campaign Planning & Brief",
      phase0Status: "Functional",
      note: "Step-based setup, objective selection, audience, reviewable brief summary.",
    },
    {
      feature: "Individual Content Mode",
      phase0Status: "Functional",
      note: "Single format generation (Social post, banner, ad copy, carousel) with variants.",
    },
    {
      feature: "Do My Campaign Mode",
      phase0Status: "Functional",
      note: "Coordinated 3-asset draft package (Launch Post, Branded Banner, 15s Video Concept Storyboard).",
    },
    {
      feature: "Branded Promotional Banners",
      phase0Status: "Functional",
      note: "Customizable aspect ratios (1:1, 9:16, 16:9), color themes, and downloadable SVG.",
    },
    {
      feature: "Video Storyboards & Scenes",
      phase0Status: "Functional",
      note: "4-scene video player with camera directions, voiceovers, timeline, and .md script download.",
    },
    {
      feature: "Live Preview & Edit",
      phase0Status: "Functional",
      note: "In-place text editing with instant visual canvas update.",
    },
    {
      feature: "Real Export / Download",
      phase0Status: "Functional",
      note: "Real downloads of Markdown brief (.md), JSON package (.json), SVG banner (.svg), and Video Script (.md).",
    },
    {
      feature: "AI Provider Adapter",
      phase0Status: "Demo Adapter",
      note: "Deterministic demo generator clearly labelled; zero fake LLM API claims.",
    },
    {
      feature: "Production Auth & Workspaces",
      phase0Status: "Deferred (Phase 1)",
      note: "Phase 0 uses single local workspace; full auth in Phase 1 MVP.",
    },
    {
      feature: "Live Social Publishing & Scheduling",
      phase0Status: "Deferred (Phase 2)",
      note: "Requires official OAuth app reviews and live platform tokens.",
    },
    {
      feature: "Live Platform Analytics",
      phase0Status: "Deferred (Phase 2)",
      note: "Shown as unavailable placeholders; never fabricated in Phase 0.",
    },
    {
      feature: "Market Trends & Competitor Scrapes",
      phase0Status: "Deferred (Phase 3)",
      note: "Requires documented permitted sources and evidence tracking pipeline.",
    },
  ];

  const guideQuestions = [
    "Does the separation between 'Individual Content' and 'Do My Campaign' feel intuitive for small businesses?",
    "Is the level of brand grounding (palette, logo, voice) sufficient for initial marketing campaigns?",
    "Does the step-based Campaign Brief capture the right questions before creative generation begins?",
    "Are the export formats (Markdown brief, JSON, SVG banner) adequate for teams before direct social publishing is added in Phase 2?",
    "Which social platform publishing integration should be prioritized first in Phase 2 (e.g. Instagram/Meta vs LinkedIn)?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
            Project Guide Demonstration & Scope
          </h1>
          <StatusBadge label="Phase 0 Review" variant="info" />
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-muted, #667085)" }}>
          Structured demonstration script, capability boundaries, prototype limitations, and guide feedback questions.
        </p>
      </div>

      {/* Demonstration Script Walkthrough */}
      <Card padding="lg">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <BookOpen size={20} color="var(--color-primary, #635BFF)" />
          <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
            8-Step Guide Demonstration Script
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {journeySteps.map((item) => (
            <div
              key={item.step}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr",
                gap: "14px",
                alignItems: "flex-start",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#F8FAFC",
                border: "1px solid var(--color-border, #E5E7EB)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary, #635BFF)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--color-text, #172033)", marginBottom: "3px" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "13px", color: "#334155", marginBottom: "4px" }}>
                  <strong>Action:</strong> {item.action}
                </div>
                <div style={{ fontSize: "12px", color: "#64748B", fontStyle: "italic" }}>
                  <strong>Product Truth:</strong> {item.evidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Capability Truth & Limitations Matrix */}
      <Card padding="lg">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <AlertCircle size={20} color="var(--color-primary, #635BFF)" />
          <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
            Capability Matrix & Phase 0 Boundaries
          </h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border, #E5E7EB)", textAlign: "left", color: "#475569" }}>
                <th style={{ padding: "10px 12px" }}>Capability Area</th>
                <th style={{ padding: "10px 12px" }}>Phase 0 Status</th>
                <th style={{ padding: "10px 12px" }}>Implementation Note</th>
              </tr>
            </thead>
            <tbody>
              {capabilityMatrix.map((row, idx) => (
                <tr
                  key={row.feature}
                  style={{
                    borderBottom: "1px solid var(--color-border, #E5E7EB)",
                    backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                  }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--color-text, #172033)" }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <StatusBadge
                      label={row.phase0Status}
                      variant={
                        row.phase0Status === "Functional"
                          ? "approved"
                          : row.phase0Status === "Demo Adapter"
                          ? "demo"
                          : "coming_soon"
                      }
                    />
                  </td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feedback & Interview Questions */}
      <Card padding="lg">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <MessageSquareQuote size={20} color="var(--color-primary, #635BFF)" />
          <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--color-text, #172033)" }}>
            Feedback & Evaluation Questions for Project Guide
          </h2>
        </div>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted, #667085)", margin: "0 0 16px 0" }}>
          Record feedback from the project guide against these core design questions before Phase 1 approval.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {guideQuestions.map((q, idx) => (
            <div
              key={idx}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border, #E5E7EB)",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "13.5px",
                color: "var(--color-text, #172033)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--color-primary, #635BFF)" }}>Q{idx + 1}.</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
