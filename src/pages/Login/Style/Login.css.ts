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
  minHeight: "100vh", // ✅ 고정 height 대신 min-height 사용
  padding: "clamp(20px, 5vh, 40px)", // 화면 높이에 비례한 여백
  boxSizing: "border-box",
  backgroundImage: `
    radial-gradient(circle at 0% 0%, rgba(230, 0, 126, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 100% 100%, rgba(230, 0, 126, 0.08) 0%, transparent 35%)
  `,
});

/** 3. 로그인 카드: 가로폭과 높이를 자동으로 조절 */
export const loginCard = style({
  width: "100%",
  // ✅ 모니터 크기에 따라 최대 너비가 유동적으로 변함
  maxWidth: "clamp(320px, 90vw, 420px)", 
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(12px)",
  boxShadow: "0px 32px 64px rgba(0, 0, 0, 0.08)",
  borderRadius: "clamp(24px, 4vw, 32px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // ✅ 내부 패딩을 화면 크기에 맞게 가변 처리
  padding: "clamp(40px, 10vh, 60px) clamp(24px, 8vw, 44px)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  animation: `${fadeInDown} 0.6s ease-out`,
  boxSizing: "border-box",
});

/** 4. 타이틀 및 텍스트: 글자 크기 가변화 */
export const title = style({
  fontFamily: "'Pretendard', sans-serif",
  fontWeight: 800,
  // ✅ 폰트 크기가 화면 너비(vw)에 따라 미세하게 조절됨
  fontSize: "clamp(22px, 5vw, 30px)",
  letterSpacing: "-0.04em",
  color: UPLUS_BLACK,
  marginBottom: "12px",
  textAlign: "center",
  lineHeight: "1.2",
});

export const titleBrand = style({ color: UPLUS_MAGENTA, fontWeight: 900 });
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