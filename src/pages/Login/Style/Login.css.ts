import { keyframes, style, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";

/** 1. 전역 스타일: 어떤 모니터에서도 가로 스크롤 방지 */
globalStyle("html, body, #root", {
  width: "100%",
  margin: 0,
  padding: 0,
  backgroundColor: "#F8F9FA",
  overflowX: "hidden", // ✅ 모니터 배율 차이로 인한 미세 스크롤 차단
});

const fadeInDown = keyframes({
  from: { opacity: 0, transform: "translateY(-10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

/** 2. 컨테이너: 화면 높이에 유연하게 대응 */
export const container = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "100vh",
  padding: "clamp(20px, 5vh, 40px)",
  boxSizing: "border-box",
  background: `
    radial-gradient(ellipse at 20% 20%, rgba(230, 0, 126, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(230, 0, 126, 0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 0%, rgba(255, 79, 163, 0.08) 0%, transparent 40%),
    #F8F9FC
  `,
});

/** 3. 로그인 카드: 가로폭과 높이를 자동으로 조절 */
export const loginCard = style({
  width: "100%",
  maxWidth: "clamp(320px, 90vw, 440px)",
  backgroundColor: "#FFFFFF",
  backdropFilter: "blur(20px)",
  boxShadow: `
    0 4px 6px rgba(0, 0, 0, 0.04),
    0 24px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(230, 0, 126, 0.06)
  `,
  borderRadius: "clamp(24px, 4vw, 36px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "clamp(40px, 10vh, 64px) clamp(24px, 8vw, 48px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  animation: `${fadeInDown} 0.6s ease-out`,
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  "::before": {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${UPLUS_MAGENTA} 0%, #FF4FA3 50%, ${UPLUS_MAGENTA} 100%)`,
  },
});

/** 4. 타이틀 및 텍스트: 글자 크기 가변화 */
export const title = style({
  fontFamily: "'Pretendard', sans-serif",
  fontWeight: 900,
  fontSize: "clamp(28px, 6vw, 38px)",
  letterSpacing: "-0.05em",
  color: UPLUS_BLACK,
  marginBottom: "12px",
  textAlign: "center",
  lineHeight: "1.15",
});

export const titleBrand = style({
  background: `linear-gradient(135deg, ${UPLUS_MAGENTA} 0%, #FF4FA3 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 900,
});
export const titlePlus = style({ marginLeft: "1px", fontSize: "0.85em", verticalAlign: "top" });

export const description = style({
  fontSize: "clamp(13px, 3.5vw, 15px)",
  color: "#666",
  textAlign: "center",
  lineHeight: "1.6",
  marginBottom: "clamp(30px, 5vh, 44px)", // ✅ 버튼과의 간격도 화면 높이에 맞춰 조절
  wordBreak: "keep-all",
});

/** 5. 버튼: 클릭하기 쉬운 크기를 유지하면서 유연하게 대응 */
export const googleButton = style({
  width: "100%",
  // ✅ 버튼 높이도 화면 크기에 따라 미세하게 변함
  height: "clamp(50px, 7vh, 58px)", 
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(8px, 2vw, 12px)",
  
  fontSize: "clamp(14px, 3.5vw, 16px)",
  fontWeight: "600",
  color: "#374151",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

  ":hover": {
    backgroundColor: UPLUS_SOFT_PINK, 
    borderColor: UPLUS_MAGENTA,       
    color: UPLUS_MAGENTA,             
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(230, 0, 126, 0.12)",
  },
  
  ":active": { transform: "translateY(0)" },
});

export const footerText = style({
  marginTop: "clamp(20px, 4vh, 28px)",
  fontSize: "clamp(12px, 3vw, 13px)",
  color: "#9CA3AF",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "8px",
  ":hover": { color: "#4B5563", textDecoration: "underline" },
});