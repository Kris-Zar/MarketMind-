import React from "react";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";

export interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  isDemo?: boolean;
  unavailableNote?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendPositive = true,
  isDemo = false,
  unavailableNote,
  icon,
}) => {
  return (
    <Card padding="md">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-muted, #667085)" }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {isDemo && <StatusBadge label="Demo Data" variant="demo" />}
          {icon && (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md, 8px)",
                backgroundColor: "var(--color-primary-soft, #EFEEFF)",
                color: "var(--color-primary, #635BFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-text, #172033)", marginBottom: "4px" }}>
        {value}
      </div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <span
            style={{
              fontWeight: 600,
              color: trendPositive ? "var(--color-success, #16A34A)" : "var(--color-danger, #DC2626)",
            }}
          >
            {trend}
          </span>
          <span style={{ color: "var(--color-text-subtle, #94A3B8)" }}>vs prior period</span>
        </div>
      )}
      {unavailableNote && (
        <div style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)", fontStyle: "italic" }}>
          {unavailableNote}
        </div>
      )}
    </Card>
  );
};

