import React from "react";

export type BadgeVariant =
  | "draft"
  | "needs_review"
  | "approved"
  | "demo"
  | "coming_soon"
  | "info"
  | "success"
  | "warning";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  draft: {
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  },
  needs_review: {
    bg: "#FEF3C7",
    color: "#92400E",
    border: "#FDE68A",
  },
  approved: {
    bg: "#DCFCE7",
    color: "#166534",
    border: "#BBF7D0",
  },
  demo: {
    bg: "#EFEEFF",
    color: "#5147E8",
    border: "#C7D2FE",
  },
  coming_soon: {
    bg: "#F3F4F6",
    color: "#9CA3AF",
    border: "#E5E7EB",
  },
  info: {
    bg: "#EFF6FF",
    color: "#1E40AF",
    border: "#BFDBFE",
  },
  success: {
    bg: "#F0FDF4",
    color: "#15803D",
    border: "#BBF7D0",
  },
  warning: {
    bg: "#FFFBEB",
    color: "#B45309",
    border: "#FDE68A",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "draft",
  className = "",
}) => {
  const style = variantStyles[variant] || variantStyles.draft;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "var(--radius-full, 9999px)",
        fontSize: "12px",
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        lineHeight: 1.4,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: style.color,
        }}
      />
      {label}
    </span>
  );
};

