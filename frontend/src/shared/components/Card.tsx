import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = "md",
  elevated = false,
  style,
  children,
  ...props
}) => {
  const paddingMap = {
    none: "0",
    sm: "12px",
    md: "20px",
    lg: "28px",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface, #FFFFFF)",
        border: "1px solid var(--color-border, #E5E7EB)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: paddingMap[padding],
        boxShadow: elevated ? "var(--shadow-md)" : "var(--shadow-sm)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

