import React from "react";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  required,
  helpText,
  error,
  children,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text, #172033)" }}>
      {label} {required && <span style={{ color: "var(--color-danger, #DC2626)" }}>*</span>}
    </label>
    {children}
    {helpText && !error && (
      <span style={{ fontSize: "12px", color: "var(--color-text-muted, #667085)" }}>
        {helpText}
      </span>
    )}
    {error && (
      <span style={{ fontSize: "12px", color: "var(--color-danger, #DC2626)", fontWeight: 500 }}>
        {error}
      </span>
    )}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ style, ...props }) => (
  <input
    style={{
      height: "40px",
      padding: "0 12px",
      borderRadius: "var(--radius-md, 8px)",
      border: "1px solid var(--color-border, #E5E7EB)",
      backgroundColor: "#FFFFFF",
      color: "var(--color-text, #172033)",
      fontSize: "14px",
      outline: "none",
      width: "100%",
      ...style,
    }}
    {...props}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ style, ...props }) => (
  <textarea
    style={{
      minHeight: "80px",
      padding: "10px 12px",
      borderRadius: "var(--radius-md, 8px)",
      border: "1px solid var(--color-border, #E5E7EB)",
      backgroundColor: "#FFFFFF",
      color: "var(--color-text, #172033)",
      fontSize: "14px",
      outline: "none",
      width: "100%",
      resize: "vertical",
      fontFamily: "inherit",
      ...style,
    }}
    {...props}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ style, children, ...props }) => (
  <select
    style={{
      height: "40px",
      padding: "0 12px",
      borderRadius: "var(--radius-md, 8px)",
      border: "1px solid var(--color-border, #E5E7EB)",
      backgroundColor: "#FFFFFF",
      color: "var(--color-text, #172033)",
      fontSize: "14px",
      outline: "none",
      width: "100%",
      cursor: "pointer",
      ...style,
    }}
    {...props}
  >
    {children}
  </select>
);

