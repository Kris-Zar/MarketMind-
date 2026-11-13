import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  style,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: { height: "32px", padding: "0 12px", fontSize: "13px" },
    md: { height: "40px", padding: "0 16px", fontSize: "14px" },
    lg: { height: "46px", padding: "0 22px", fontSize: "15px" },
  }[size];

  const variantStyles = {
    primary: {
      backgroundColor: "var(--color-primary, #635BFF)",
      color: "#FFFFFF",
      border: "1px solid transparent",
    },
    secondary: {
      backgroundColor: "var(--color-surface, #FFFFFF)",
      color: "var(--color-text, #172033)",
      border: "1px solid var(--color-border, #E5E7EB)",
    },
    subtle: {
      backgroundColor: "var(--color-primary-soft, #EFEEFF)",
      color: "var(--color-primary, #635BFF)",
      border: "1px solid transparent",
    },
    danger: {
      backgroundColor: "var(--color-danger, #DC2626)",
      color: "#FFFFFF",
      border: "1px solid transparent",
    },
  }[variant];

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        borderRadius: "var(--radius-md, 8px)",
        fontWeight: 600,
        transition: "all 0.15s ease",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: variant === "primary" ? "var(--shadow-sm)" : "none",
        ...sizeStyles,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
};

