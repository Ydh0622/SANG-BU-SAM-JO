import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#F3F4F6",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "'Pretendard', sans-serif",
});

export const card = style({
  width: "100%",
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "40px 24px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
});

export const section = style({
  marginBottom: "24px",
  textAlign: "left",
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  marginBottom: "8px",
});

export const contentBox = style({
  backgroundColor: "#F9FAFB",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  fontSize: "15px",
  color: "#4B5563",
  lineHeight: "1.6",
});

export const selectedTag = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#FFF5FA",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "13px",
  color: "#E6007E",
  fontWeight: "600",
  border: "1px solid #FCE7F3",
  marginBottom: "8px",
});

export const primaryBtn = style({
  flex: 2,
  height: "56px",
  backgroundColor: "#E6007E",
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  ":hover": { backgroundColor: "#C5006C" },
});

export const secondaryBtn = style({
  flex: 1,
  height: "56px",
  backgroundColor: "#ffffff",
  color: "#6B7280",
  border: "1px solid #E5E7EB",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
});