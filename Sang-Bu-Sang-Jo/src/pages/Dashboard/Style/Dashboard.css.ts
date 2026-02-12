import { style, keyframes, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6"; 
const AI_BLUE = "#007AFF";

/** 1. 애니메이션 정의 */
const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideUp = keyframes({ from: { transform: "translateY(30px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } });
const neonGlow = keyframes({
  '0%': { boxShadow: `0 0 5px rgba(230, 0, 126, 0.3)` },
  '50%': { boxShadow: `0 0 20px rgba(230, 0, 126, 0.5), 0 0 30px rgba(230, 0, 126, 0.2)` },
  '100%': { boxShadow: `0 0 5px rgba(230, 0, 126, 0.3)` }
});
const pulse = keyframes({
  '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0px rgba(230, 0, 126, 0.4)' },
  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(230, 0, 126, 0)' },
  '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0px rgba(230, 0, 126, 0)' }
});
const float = keyframes({ '0%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' }, '100%': { transform: 'translateY(0px)' } });

/** 2. 전역 스타일 및 가로 스크롤 방지 */
globalStyle("html, body, #root", {
  width: "100%", margin: 0, padding: 0,
  backgroundColor: "#F8F9FC", fontFamily: "'Pretendard', sans-serif",
  color: UPLUS_BLACK, overflowX: "hidden", 
});

export const container = style({
  width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column",
  backgroundImage: `radial-gradient(circle at 2% 2%, rgba(230, 0, 126, 0.05) 0%, transparent 25%), radial-gradient(circle at 98% 98%, rgba(0, 122, 255, 0.04) 0%, transparent 25%)`,
  animation: `${fadeIn} 0.8s ease-out`,
});

/** 3. 반응형 그리드 레이아웃 */
export const mainContent = style({
  flex: 1, width: "100%", display: "flex", justifyContent: "center",
  padding: "clamp(24px, 4vw, 48px) clamp(16px, 3vw, 24px)",
});

export const dashboardGrid = style({
  width: "100%", maxWidth: "1400px", 
  display: "grid", 
  gridTemplateColumns: "1fr 360px", 
  gap: "32px",
  animation: `${slideUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1)`,
  "@media": { "screen and (max-width: 1100px)": { gridTemplateColumns: "1fr" } }
});

export const mainContentLeft = style({ display: "flex", flexDirection: "column", gap: "32px", minWidth: 0 });
export const mainContentRight = style({ display: "flex", flexDirection: "column", gap: "32px", minWidth: 0 });

/** 4. 헤더 및 상단 요소 */
export const header = style({
  width: "100%", height: "72px", display: "flex", justifyContent: "center",
  position: "sticky", top: 0, zIndex: 100,
  backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
});

export const headerContent = style({ width: "100%", maxWidth: "1400px", padding: "0 clamp(16px, 4vw, 40px)", display: "flex", justifyContent: "space-between", alignItems: "center" });
export const logoArea = style({ display: "flex", alignItems: "center" });
export const brandLogo = style({ fontSize: "24px", fontWeight: 900 });
export const magentaText = style({ color: UPLUS_MAGENTA });
export const serviceName = style({ fontSize: "14px", color: "#888", marginLeft: "10px", fontWeight: 600 });
export const headerRight = style({ display: "flex", alignItems: "center", gap: "24px" });
export const dateTimeDesktop = style({ fontSize: "13px", fontWeight: 600, "@media": { "screen and (max-width: 768px)": { display: "none" } } });
export const iconButton = style({ position: "relative", cursor: "pointer" });
export const notificationBadge = style({ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: UPLUS_MAGENTA, borderRadius: "50%", border: "2px solid #FFF" });

export const profileChip = style({ display: "flex", alignItems: "center", gap: "10px", padding: "8px 18px", backgroundColor: "#FFF", borderRadius: "100px", border: "1px solid #EEE" });
export const avatarMini = style({ width: "24px", height: "24px", backgroundColor: UPLUS_MAGENTA, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: "#FFF" });
export const userNameText = style({ fontSize: "13px", fontWeight: 700 });
export const logoutBtn = style({ background: "none", border: "none", cursor: "pointer", color: "#AAA" });

/** 5. 히어로 카드 및 통계 카드 (에러 해결 핵심) */
export const heroCard = style({
  background: "linear-gradient(135deg, #1A1A1A 0%, #333 100%)",
  padding: "clamp(24px, 5vw, 56px)", borderRadius: "40px", color: "#FFF",
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
  "@media": { "screen and (max-width: 640px)": { flexDirection: "column", alignItems: "flex-start" } }
});

export const heroInfo = style({ display: "flex", flexDirection: "column" });
export const heroTitle = style({ fontSize: "clamp(20px, 3.5vw, 34px)", fontWeight: 900, margin: 0 });
export const heroSubtitle = style({ fontSize: "clamp(13px, 1.8vw, 17px)", color: "rgba(255,255,255,0.6)", marginTop: "10px" });

export const statsGrid = style({
  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px",
  "@media": { 
    "screen and (max-width: 768px)": { gridTemplateColumns: "repeat(2, 1fr)" },
    "screen and (max-width: 480px)": { gridTemplateColumns: "1fr" } 
  }
});

// ✅ 에러 해결: statCard 속성을 정상적으로 export 합니다.
export const statCard = style({
  backgroundColor: "#FFF", padding: "24px", borderRadius: "28px", 
  display: "flex", alignItems: "center", gap: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.02)", transition: "all 0.3s ease",
  ":hover": { transform: "translateY(-6px)" }
});

export const statIcon = style({ width: "52px", height: "52px", borderRadius: "18px", display: "flex", justifyContent: "center", alignItems: "center" });
export const statLabel = style({ fontSize: "13px", color: "#888", fontWeight: 600 });
export const statValue = style({ fontSize: "28px", fontWeight: 900, marginTop: "4px" });
export const trendUp = style({ fontSize: "14px", color: "#28a745", marginLeft: "4px", display: "flex", alignItems: "center", gap: "2px" });

/** 6. 리스트 및 기타 컴포넌트 */
export const glassCard = style({
  backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(15px)", 
  padding: "clamp(20px, 3vw, 32px)", borderRadius: "36px", 
  border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
});

export const cardHeader = style({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" });
export const cardTitle = style({ fontSize: "19px", fontWeight: 800 });
export const textBtn = style({ background: "none", border: "none", color: UPLUS_MAGENTA, fontWeight: 700, cursor: "pointer", fontSize: "13px" });
export const activityList = style({ display: "flex", flexDirection: "column", gap: "10px" });
export const activityItem = style({ display: "flex", alignItems: "center", padding: "18px", borderRadius: "22px", cursor: "pointer", transition: "all 0.3s ease", ":hover": { backgroundColor: "#FFF", transform: "translateX(10px)" } });
export const timeTag = style({ fontSize: "13px", color: "#AAA", fontWeight: 700, width: "65px" });
export const customerInfoMain = style({ flex: 1, display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 });
export const customerName = style({ fontSize: "16px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" });
export const consultType = style({ fontSize: "13px", color: "#666" });
export const arrowIcon = style({ color: "#CCC" });

export const progressCircleArea = style({ padding: "24px 0", textAlign: "center" });
export const percentageText = style({ fontSize: "52px", fontWeight: 900, color: UPLUS_MAGENTA });
export const goalDescription = style({ fontSize: "14px", color: "#666", marginTop: "8px" });
export const progressBarBg = style({ width: "100%", height: "12px", backgroundColor: "#E5E7EB", borderRadius: "10px", overflow: "hidden" });
export const progressBarFill = style({ height: "100%", backgroundColor: UPLUS_MAGENTA, borderRadius: "10px", transition: "width 1s ease-in-out" });

export const noticeList = style({ display: "flex", flexDirection: "column", gap: "16px" });
export const noticeItem = style({ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "20px", ":hover": { backgroundColor: "rgba(0,0,0,0.02)" } });
export const noticePoint = style({ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: UPLUS_MAGENTA });
export const noticeSubject = style({ fontSize: "14px", fontWeight: 700 });
export const noticeDate = style({ fontSize: "12px", color: "#AAA" });

/** 7. 상태 표시 및 모달 */
export const activeIndicator = style({ animation: `${neonGlow} 2s infinite ease-in-out`, backgroundColor: UPLUS_MAGENTA, width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" });
export const pulseDot = style({ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: UPLUS_MAGENTA, animation: `${pulse} 2s infinite` });
export const staticDot = style({ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#999" });
export const online = style({ backgroundColor: "rgba(230, 0, 126, 0.1)", color: UPLUS_MAGENTA });
export const offline = style({ backgroundColor: "rgba(0,0,0,0.05)", color: "#666" });
export const statusBadge = style({ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 700 });
export const statusBoxMobile = style({ marginTop: "16px" });

export const workStartBtn = style({ padding: "16px 32px", backgroundColor: UPLUS_MAGENTA, color: "#FFF", border: "none", borderRadius: "20px", fontWeight: 800, cursor: "pointer" });
export const workStopBtn = style({ padding: "16px 32px", backgroundColor: "rgba(255,255,255,0.1)", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px", fontWeight: 800, cursor: "pointer" });

export const modalOverlay = style({ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 });
export const premiumModal = style({ backgroundColor: "#FFF", width: "90%", maxWidth: "520px", borderRadius: "44px", padding: "48px", textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.15)", animation: `${float} 4s infinite ease-in-out` });
export const aiGlowBadge = style({ display: "inline-block", padding: "6px 16px", borderRadius: "100px", backgroundColor: "#E6F0FF", color: AI_BLUE, fontSize: "12px", fontWeight: 800, marginBottom: "20px" });
export const modalHeading = style({ fontSize: "28px", fontWeight: 800, marginBottom: "24px" });
export const modalCustomerCard = style({ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "28px", textAlign: "left" });
export const modalCustomerHeader = style({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" });
export const modalCustomerName = style({ fontSize: "20px", fontWeight: 800 });
export const categoryTag = style({ fontSize: "12px", color: UPLUS_MAGENTA, fontWeight: 700, backgroundColor: UPLUS_SOFT_PINK, padding: "4px 12px", borderRadius: "10px" });
export const aiGuideBox = style({ marginTop: "20px", borderLeft: `4px solid ${AI_BLUE}`, paddingLeft: "20px" });
export const aiGuideTitle = style({ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: AI_BLUE });
export const aiGuideText = style({ fontSize: "15px", lineHeight: "1.6", margin: "8px 0 0 0" });
export const modalActions = style({ display: "flex", gap: "16px", marginTop: "36px" });
export const primaryBtn = style({ flex: 2, height: "64px", background: `linear-gradient(135deg, ${UPLUS_MAGENTA} 0%, #FF4D97 100%)`, color: "#FFF", border: "none", borderRadius: "22px", fontSize: "18px", fontWeight: 800, cursor: "pointer" });
export const secondaryBtn = style({ flex: 1, height: "64px", backgroundColor: "#F3F4F6", color: "#666", border: "none", borderRadius: "22px", fontSize: "17px", fontWeight: 700, cursor: "pointer" });