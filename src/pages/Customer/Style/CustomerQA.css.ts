import { style, keyframes } from "@vanilla-extract/css";

// 애니메이션 정의
const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#F3F4F6", 
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "'Pretendard', -apple-system, sans-serif",
});

export const card = style({
  width: "100%",
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "32px 24px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
  animation: `${fadeIn} 0.5s ease-out`,
});

/* --- 상단 Step Bar 스타일 (새로 추가) --- */
export const stepContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
});

export const stepBox = style({
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "14px",
  border: "1px solid #D1D5DB",
  backgroundColor: "#ffffff",
  color: "#9CA3AF",
  transition: "all 0.3s ease",
});

export const stepBoxActive = style({
  backgroundColor: "#E6007E",
  borderColor: "#E6007E",
  color: "#ffffff",
});

/* --- 기존 헤더 및 입력 스타일 --- */
export const header = style({
  textAlign: "center",
  marginBottom: "32px",
});

export const iconCircle = style({
  width: "64px",
  height: "64px",
  backgroundColor: "#FFF1F8",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
});

export const title = style({
  fontSize: "22px",
  fontWeight: "800",
  color: "#111827",
  letterSpacing: "-0.5px",
  marginBottom: "8px",
});

export const subtitle = style({
  fontSize: "14px",
  color: "#6B7280",
  lineHeight: "1.5",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const label = style({
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  paddingLeft: "4px",
});

export const inputWrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#F9FAFB",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  selectors: {
    "&:focus-within": {
      borderColor: "#E6007E",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(230, 0, 126, 0.1)",
    },
  },
});

export const inputIcon = style({
  marginLeft: "12px",
  color: "#9CA3AF",
});

export const input = style({
  width: "100%",
  padding: "14px 12px",
  fontSize: "15px",
  border: "none",
  background: "transparent",
  outline: "none",
  color: "#111827",
  selectors: {
    "&::placeholder": {
      color: "#9CA3AF",
    },
  },
});

export const submitBtn = style({
  width: "100%",
  padding: "16px",
  backgroundColor: "#E6007E",
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  ":hover": {
    backgroundColor: "#C5006C",
    transform: "translateY(-1px)",
  },
  ":disabled": {
    backgroundColor: "#F9A8D4",
    cursor: "not-allowed",
  },
});

/* --- Q&A 페이지용 스타일 --- */
export const qaItem = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid #E5E7EB",
  cursor: "pointer",
  transition: "all 0.2s",
  backgroundColor: "#ffffff",
  marginBottom: "12px",
});

export const qaItemActive = style({
  borderColor: "#E6007E",
  backgroundColor: "#FFF1F8",
});

/* --- 3단계: 최종 확인 페이지용 요약 박스 (새로 추가) --- */
export const summaryBox = style({
  backgroundColor: "#F9FAFB",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "24px",
  border: "1px solid #F3F4F6",
});

export const summaryItem = style({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #F3F4F6",
  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});