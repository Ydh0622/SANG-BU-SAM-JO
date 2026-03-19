import { style, keyframes, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const AI_BLUE = "#2563EB";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(12px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const shimmer = keyframes({
  "0%": { backgroundPosition: "-400px 0" },
  "100%": { backgroundPosition: "400px 0" },
});

export const container = style({
  minHeight: "100vh",
  background: `
    radial-gradient(ellipse at 20% 20%, rgba(230, 0, 126, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(37, 99, 235, 0.06) 0%, transparent 50%),
    #F0F2F8
  `,
  display: "flex",
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
  padding: "0",
  boxShadow: `
    0 4px 6px rgba(0,0,0,0.04),
    0 20px 50px rgba(0,0,0,0.08),
    0 0 0 1px rgba(230,0,126,0.05)
  `,
  animation: `${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  overflow: "hidden",
});

export const cardHeader = style({
  background: `linear-gradient(135deg, #C5006C 0%, ${UPLUS_MAGENTA} 60%, #FF4FA3 100%)`,
  padding: "24px 28px 20px",
  position: "relative",
  overflow: "hidden",
  "::before": {
    content: "''",
    position: "absolute",
    top: "-50%",
    right: "-20%",
    width: "280px",
    height: "280px",
    background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)",
    borderRadius: "50%",
  },
});

export const cardBody = style({
  padding: "24px 28px 28px",
});

/* --- Q&A 리스트 아이템 --- */
export const qaItem = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "12px",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #F0F0F5",
  backgroundColor: "#FAFAFE",
  marginBottom: "10px",
  transition: "all 0.2s ease",
  width: "100%",
  boxSizing: "border-box",
  ":hover": {
    borderColor: "rgba(230,0,126,0.2)",
    backgroundColor: "#FFF",
    boxShadow: "0 4px 16px rgba(230,0,126,0.06)",
    transform: "translateX(2px)",
  },
});

export const qaTextContainer = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const qaTitle = style({
  fontSize: "14px",
  fontWeight: 700,
  color: "#1E293B",
  lineHeight: "1.4",
});

export const qaText = style({
  fontSize: "13px",
  color: "#64748B",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
  overflowWrap: "anywhere",
});

/* --- 버튼 영역 --- */
export const feedbackButtonGroup = style({
  display: "flex",
  gap: "6px",
  flexShrink: 0,
  marginTop: "2px",
});

/* --- 버튼 스타일 --- */
export const submitBtn = style({
  height: "54px",
  borderRadius: "14px",
  fontWeight: 800,
  border: "none",
  color: "#fff",
  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
  width: "100%",
  cursor: "pointer",
  background: `linear-gradient(135deg, #C5006C 0%, ${UPLUS_MAGENTA} 100%)`,
  boxShadow: "0 8px 20px rgba(230,0,126,0.25)",
  fontSize: "15px",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 28px rgba(230,0,126,0.35)",
  },
  ":disabled": {
    background: "#E5E7EB",
    color: "#9CA3AF",
    boxShadow: "none",
    cursor: "not-allowed",
    transform: "none",
  },
});

export const prevBtn = style({
  flex: 1,
  height: "54px",
  borderRadius: "14px",
  border: "1.5px solid #E5E7EB",
  background: "#fff",
  color: "#6B7280",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  transition: "all 0.2s",
  fontSize: "14px",
  ":hover": {
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    color: "#374151",
  },
});

export const loadingBox = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "28px",
  background: "linear-gradient(90deg, #F8F9FA 25%, #F0F0F8 50%, #F8F9FA 75%)",
  backgroundSize: "800px 100%",
  animation: `${shimmer} 1.5s infinite linear`,
  borderRadius: "12px",
  marginBottom: "8px",
});

globalStyle(`.${loadingBox} span`, {
  fontSize: "14px",
  color: "#94A3B8",
  fontWeight: 600,
});

export const aiAnswerBox = style({
  background: "linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 100%)",
  border: "1.5px solid rgba(37, 99, 235, 0.15)",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "8px",
  position: "relative",
});

export const aiLabel = style({
  fontSize: "11px",
  fontWeight: 800,
  color: AI_BLUE,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const aiAnswerText = style({
  fontSize: "14px",
  color: "#1E293B",
  lineHeight: "1.7",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  margin: 0,
});