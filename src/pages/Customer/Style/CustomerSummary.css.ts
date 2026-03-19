import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

const fadeUp = keyframes({
  from: { opacity: 0, transform: "translateY(16px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 30% 0%, rgba(230,0,126,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(0,122,255,0.04) 0%, transparent 50%),
    #F3F4F6
  `,
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
  borderRadius: "28px",
  padding: "40px 28px 32px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.04)",
  borderTop: `4px solid ${UPLUS_MAGENTA}`,
  animation: `${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  position: "relative",
});

export const section = style({
  marginBottom: "20px",
  textAlign: "left",
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontWeight: 800,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "8px",
});

globalStyle(`${label} svg`, {
  color: UPLUS_MAGENTA,
});

export const contentBox = style({
  backgroundColor: "#F9FAFB",
  padding: "16px 18px",
  borderRadius: "14px",
  border: "1px solid #EDEEF0",
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.65",
  fontWeight: 500,
});

export const selectedTag = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#FFF5FA",
  padding: "12px 16px",
  borderRadius: "12px",
  fontSize: "14px",
  color: UPLUS_MAGENTA,
  fontWeight: 700,
  border: "1px solid #FFD6E7",
  marginBottom: "8px",
  transition: "transform 0.15s ease",
  ":hover": {
    transform: "translateX(2px)",
  },
});

export const divider = style({
  height: "1px",
  backgroundColor: "#F1F3F5",
  margin: "24px 0",
});

export const buttonRow = style({
  display: "flex",
  gap: "12px",
});

export const primaryBtn = style({
  flex: 2,
  height: "56px",
  background: `linear-gradient(135deg, ${UPLUS_MAGENTA} 0%, #C5006C 100%)`,
  color: "#ffffff",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
  boxShadow: "0 6px 20px rgba(230, 0, 126, 0.3)",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 28px rgba(230, 0, 126, 0.4)",
  },
  ":active": { transform: "scale(0.97)" },
});

export const secondaryBtn = style({
  flex: 1,
  height: "56px",
  backgroundColor: "#F3F4F6",
  color: "#6B7280",
  border: "none",
  borderRadius: "16px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#E5E7EB",
    color: "#1A1A1A",
  },
});
