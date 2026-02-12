import { keyframes, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";

const fadeInDown = keyframes({
  from: { opacity: 0, transform: "translateY(-10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  backgroundColor: "#F8F9FA",
  padding: "20px",
  boxSizing: "border-box",
  backgroundImage: `
    radial-gradient(circle at 0% 0%, rgba(230, 0, 126, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 100% 100%, rgba(230, 0, 126, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(248, 249, 250, 1) 100%)
  `,
});

export const loginCard = style({
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0px 32px 64px rgba(0, 0, 0, 0.08)",
  borderRadius: "32px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "clamp(40px, 8vw, 60px) clamp(24px, 6vw, 40px)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  animation: `${fadeInDown} 0.6s ease-out`,
  boxSizing: "border-box",

  "@media": {
    "screen and (max-width: 480px)": {
      borderRadius: "24px",
      padding: "40px 24px",
    }
  }
});

export const title = style({
  fontFamily: "'Pretendard', sans-serif",
  fontWeight: 800,
  fontSize: "clamp(24px, 5vw, 32px)",
  letterSpacing: "-0.04em",
  color: UPLUS_BLACK,
  marginBottom: "8px",
  textAlign: "center",
  lineHeight: "1.3",
});

export const titleBrand = style({
  display: "inline-block",
  position: "relative",
  color: UPLUS_MAGENTA,
  letterSpacing: "-0.02em",
});

export const titlePlus = style({
  marginLeft: "2px",
  fontWeight: 900,
  fontSize: "0.9em",
  verticalAlign: "top",
});

export const description = style({
  fontSize: "clamp(14px, 3.5vw, 15px)",
  color: "#666",
  textAlign: "center",
  lineHeight: "1.6",
  marginBottom: "40px",
  wordBreak: "keep-all",
});

export const googleButton = style({
  width: "100%",
  height: "56px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "16px",
  
  // 이미지와 텍스트 가로 정렬 핵심 스타일
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  
  fontSize: "16px",
  fontWeight: "600",
  color: "#374151",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",

  ":hover": {
    backgroundColor: UPLUS_SOFT_PINK, 
    borderColor: UPLUS_MAGENTA,       
    color: UPLUS_MAGENTA,             
    boxShadow: "0 4px 12px rgba(230, 0, 126, 0.15)",
    transform: "translateY(-2px)",
  },
  
  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },

  "@media": {
    "screen and (max-width: 360px)": {
      gap: "8px",
      fontSize: "14px",
    }
  }
});

export const footerText = style({
  marginTop: "24px",
  fontSize: "13px",
  color: "#9CA3AF",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  transition: "all 0.2s ease",
  padding: "8px",

  ":hover": {
    color: "#4B5563",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
});