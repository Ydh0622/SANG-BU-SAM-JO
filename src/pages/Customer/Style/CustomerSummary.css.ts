import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

// 뷰포트 크기에 따른 중단점 설정 (모바일/태블릿 기준)
const media = {
  mobile: "screen and (max-width: 480px)",
  tablet: "screen and (max-width: 768px)",
};

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
  padding: "clamp(16px, 5vw, 40px)", // 화면 크기에 따라 패딩 가변 조절
  fontFamily: "'Pretendard', sans-serif",
  boxSizing: "border-box",
});

export const card = style({
  width: "100%",
  // maxWidth를 유지하되, 작은 화면에서는 95% 정도로 보정
  maxWidth: "480px",
  backgroundColor: "#ffffff",
  borderRadius: "clamp(20px, 4vw, 28px)", // 라운드 값도 화면에 맞춰 조절
  padding: "clamp(24px, 6vw, 40px) clamp(16px, 5vw, 28px)", // 상하/좌우 패딩 가변
  boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.04)",
  borderTop: `4px solid ${UPLUS_MAGENTA}`,
  animation: `${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
  position: "relative",
  boxSizing: "border-box",

  "@media": {
    [media.mobile]: {
      maxWidth: "100%", // 모바일에서는 꽉 차게
    }
  }
});

export const section = style({
  marginBottom: "clamp(12px, 3vw, 20px)",
  textAlign: "left",
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "clamp(11px, 2.5vw, 12px)", // 글자 크기 가변
  fontWeight: 800,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "8px",
});

globalStyle(`${label} svg`, {
  color: UPLUS_MAGENTA,
  width: "clamp(14px, 3vw, 18px)", // 아이콘 크기 조절
});

export const contentBox = style({
  backgroundColor: "#F9FAFB",
  padding: "clamp(12px, 3vw, 16px) clamp(14px, 3.5vw, 18px)",
  borderRadius: "14px",
  border: "1px solid #EDEEF0",
  fontSize: "clamp(14px, 3vw, 15px)", // 본문 텍스트 크기 가변
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
  fontSize: "clamp(13px, 2.8vw, 14px)",
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
  margin: "clamp(16px, 4vw, 24px) 0",
});

export const buttonRow = style({
  display: "flex",
  gap: "12px",
  
  "@media": {
    [media.mobile]: {
      flexDirection: "column", // 모바일에서는 버튼을 세로로 배치
    }
  }
});

export const primaryBtn = style({
  flex: 2,
  height: "clamp(48px, 12vw, 56px)", // 버튼 높이 가변
  background: `linear-gradient(135deg, ${UPLUS_MAGENTA} 0%, #C5006C 100%)`,
  color: "#ffffff",
  border: "none",
  borderRadius: "16px",
  fontSize: "clamp(14px, 3.5vw, 16px)",
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
  
  "@media": {
    [media.mobile]: {
      width: "100%",
    }
  }
});

export const secondaryBtn = style({
  flex: 1,
  height: "clamp(48px, 12vw, 56px)",
  backgroundColor: "#F3F4F6",
  color: "#6B7280",
  border: "none",
  borderRadius: "16px",
  fontSize: "clamp(13px, 3.2vw, 15px)",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#E5E7EB",
    color: "#1A1A1A",
  },

  "@media": {
    [media.mobile]: {
      width: "100%",
    }
  }
});