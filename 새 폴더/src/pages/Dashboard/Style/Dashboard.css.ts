import { style, keyframes, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";
const AI_BLUE = "#007AFF";

// 전역 스타일 초기화
globalStyle("html, body, #root", {
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  overflowX: "hidden",
  backgroundColor: "#F8F9FA",
  fontFamily: "'Pretendard', sans-serif",
});

globalStyle("*", {
  boxSizing: "border-box",
});

// 애니메이션
const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideUp = keyframes({ from: { transform: "translateY(20px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } });
const pulse = keyframes({
  '0%': { boxShadow: '0 0 0 0px rgba(230, 0, 126, 0.4)' },
  '70%': { boxShadow: '0 0 0 10px rgba(230, 0, 126, 0)' },
  '100%': { boxShadow: '0 0 0 0px rgba(230, 0, 126, 0)' }
});

export const container = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundImage: `
    radial-gradient(circle at 10% 10%, rgba(230, 0, 126, 0.04) 0%, transparent 40%),
    radial-gradient(circle at 90% 90%, rgba(230, 0, 126, 0.04) 0%, transparent 40%)
  `,
  animation: `${fadeIn} 0.6s ease-out`,
});

export const header = style({
  width: "100%",
  height: "72px",
  padding: "0 clamp(20px, 5vw, 40px)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 100,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
});

// ✅ userInfo 스타일 추가
export const userInfo = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "6px 16px",
  backgroundColor: "rgba(0, 0, 0, 0.03)",
  borderRadius: "30px",
});

export const avatar = style({
  width: "32px",
  height: "32px",
  backgroundColor: UPLUS_MAGENTA,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const logoutButton = style({
  padding: "10px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#AAA",
  transition: "all 0.2s",
  ":hover": { color: UPLUS_BLACK, transform: "scale(1.1)" }
});

export const mainContent = style({
  flex: 1,
  width: "100%",
  maxWidth: "1600px",
  margin: "0 auto",
  padding: "30px",
  display: "grid",
  gridTemplateColumns: "1fr 340px",
  gap: "24px",
  animation: `${slideUp} 0.6s ease-out`,
  "@media": { "screen and (max-width: 1024px)": { gridTemplateColumns: "1fr" } }
});

export const leftSection = style({ display: "flex", flexDirection: "column", gap: "24px" });
export const rightSection = style({ display: "flex", flexDirection: "column", gap: "24px" });

export const card = style({
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  padding: "24px",
  borderRadius: "28px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
});

export const statusContainer = style({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" });

export const statusIndicator = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  borderRadius: "100px",
  fontSize: "13px",
  fontWeight: 700,
});

export const activeIndicator = style({ animation: `${pulse} 2s infinite` });

export const startButton = style({
  width: "100%",
  height: "56px",
  backgroundColor: UPLUS_MAGENTA,
  color: "#FFF",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": { transform: "translateY(-2px)", boxShadow: "0 8px 15px rgba(230, 0, 126, 0.2)" }
});

export const stopButton = style([startButton, {
  backgroundColor: "#FFF",
  color: "#4B5563",
  border: "1px solid #E5E7EB",
  ":hover": { backgroundColor: "#F9FAFB", color: UPLUS_BLACK }
}]);

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  "@media": { "screen and (max-width: 640px)": { gridTemplateColumns: "1fr" } }
});

export const statBox = style({
  backgroundColor: "#FFF",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid rgba(0,0,0,0.03)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const statLabel = style({ color: "#888", fontSize: "13px", fontWeight: 600 });
export const statValue = style({ color: UPLUS_BLACK, fontSize: "28px", fontWeight: 800, display: "flex", alignItems: "center" });

export const activityList = style({ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" });

export const activityItem = style({
  display: "flex",
  alignItems: "center",
  padding: "16px 12px",
  borderRadius: "16px",
  transition: "all 0.2s",
  ":hover": { backgroundColor: "rgba(230, 0, 126, 0.02)", transform: "translateX(4px)" }
});

export const activityTime = style({ 
  fontSize: "13px", 
  color: "#AAA", 
  minWidth: "70px", 
  fontWeight: 600, 
  lineHeight: "1.4" 
});

export const activityContent = style({ 
  flex: 1, 
  padding: "0 16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
});

export const activityName = style({ fontSize: "15px", fontWeight: 700, color: "#333" });
export const activityDesc = style({ fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "4px" });

export const activityBadge = style({
  padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700",
  backgroundColor: "#F3F4F6", color: "#666" 
});

// ✅ noticeItem 스타일 추가
export const noticeItem = style({
  padding: "16px",
  backgroundColor: "#F9FAFB",
  borderRadius: "16px",
  fontSize: "13px",
  color: "#555",
  marginBottom: "12px",
  borderLeft: "4px solid #DDD",
  fontWeight: 500,
  transition: "all 0.2s",
  cursor: "pointer",
  ":hover": { 
    borderColor: UPLUS_MAGENTA, 
    backgroundColor: "#FFF", 
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  }
});

export const progressContainer = style({ width: "100%", height: "8px", backgroundColor: "#F1F3F5", borderRadius: "10px", overflow: "hidden" });
export const progressBar = style({ height: "100%", backgroundColor: UPLUS_MAGENTA, borderRadius: "10px", transition: "width 1s ease-in-out" });

export const modalOverlay = style({
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(10px)",
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
  animation: `${fadeIn} 0.3s ease-out`,
});

export const modal = style({
  backgroundColor: "#FFF",
  width: "90%",
  maxWidth: "480px",
  borderRadius: "36px",
  padding: "40px",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  border: "1px solid rgba(0,0,0,0.05)",
});

export const aiBadge = style({
  display: "inline-block",
  padding: "6px 14px",
  backgroundColor: "rgba(0, 122, 255, 0.08)",
  color: AI_BLUE,
  borderRadius: "100px",
  fontSize: "12px",
  fontWeight: 800,
  marginBottom: "16px",
});

export const customerSummary = style({ 
  backgroundColor: "#F9FAFB", 
  padding: "24px", 
  borderRadius: "24px", 
  marginBottom: "24px",
  textAlign: "left"
});

export const modalTag = style({ fontSize: "12px", color: UPLUS_MAGENTA, fontWeight: 700, backgroundColor: UPLUS_SOFT_PINK, padding: "4px 10px", borderRadius: "8px" });

export const modalButtons = style({ display: "flex", gap: "12px", marginTop: "24px" });

export const acceptButton = style({ 
  flex: 2, height: "56px", backgroundColor: UPLUS_MAGENTA, color: "#FFF", 
  borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer", 
  transition: "all 0.2s", ":hover": { transform: "scale(1.02)", boxShadow: "0 10px 20px rgba(230, 0, 126, 0.2)" } 
});

export const refuseButton = style({ 
  flex: 1, height: "56px", backgroundColor: "#F3F4F6", color: "#6B7280", 
  borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: 600, cursor: "pointer", 
  ":hover": { backgroundColor: "#E5E7EB" } 
});