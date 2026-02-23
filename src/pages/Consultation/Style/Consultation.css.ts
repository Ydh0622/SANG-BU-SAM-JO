import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";
const AI_BLUE = "#007AFF"; 
const AI_SOFT_BLUE = "#F0F7FF"; 

/** 애니메이션 정의 */
const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideUp = keyframes({ from: { transform: "translateY(20px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } });
const dotTyping = keyframes({
    "0%": { opacity: 0.2 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.2 },
});

globalStyle("button", {
    fontFamily: "inherit",
    padding: 0,
    margin: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
});

globalStyle("textarea, input, select", {
    fontFamily: "inherit",
});

export const container = style({
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F3F4F6",
    animation: `${fadeIn} 0.4s ease-out`,
});

/** 1. 헤더 영역 */
export const header = style({
    height: "64px",
    padding: "0 24px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
});

export const headerLeft = style({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const backBtn = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    ":hover": { transform: "translateX(-3px)" }
});

export const statusDot = style({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22C55E",
    boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.2)",
});

export const title = style({
    fontSize: "16px",
    fontWeight: 700,
    color: UPLUS_BLACK,
});

export const timer = style({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    padding: "4px 10px",
    borderRadius: "20px",
});

/** ✨ [추가] 대화 저장 버튼 스타일 */
export const saveButton = style({
    padding: "8px 16px",
    backgroundColor: "#F3F4F6", // 차분한 그레이 배경
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#4B5563", // 진한 그레이 텍스트
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    border: "1px solid #E5E7EB",
    ":hover": { 
        backgroundColor: "#E5E7EB",
        transform: "translateY(-1px)",
        color: UPLUS_BLACK 
    },
});

export const exitButton = style({
    padding: "8px 16px",
    backgroundColor: UPLUS_MAGENTA,
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#FFF",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
    ":hover": { opacity: 0.9, transform: "translateY(-1px)" },
});

/** 2. 메인 레이아웃 */
export const mainLayout = style({
    flex: 1,
    display: "grid",
    gridTemplateColumns: "360px 1fr 360px",
    gap: "1px",
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
});

export const sideSection = style({
    backgroundColor: "#F9FAFB",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
});

/** 3. 카드 컴포넌트 */
export const card = style({
    backgroundColor: "#FFF",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
});

export const cardHeader = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
});

export const badgeVIP = style({
    fontSize: "11px",
    fontWeight: 800,
    color: UPLUS_MAGENTA,
    backgroundColor: UPLUS_SOFT_PINK,
    padding: "4px 8px",
    borderRadius: "6px",
});

export const cardTitle = style({
    fontSize: "15px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#374151",
});

export const avatar = style({
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #E5E7EB",
    margin: "0 auto 12px",
});

export const infoItem = style({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13.5px",
    color: "#4B5563",
    padding: "8px 0",
});

export const eyeBtn = style({
    marginLeft: "auto",
    color: "#9CA3AF",
    ":hover": { color: UPLUS_MAGENTA },
});

export const memoArea = style({
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: `1px solid ${AI_BLUE}33`, 
    backgroundColor: AI_SOFT_BLUE, 
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#1F2937",
    resize: "none",
    height: "180px",
    transition: "all 0.2s ease",
    ":focus": {
        outline: "none",
        borderColor: AI_BLUE,
        backgroundColor: "#FFF",
        boxShadow: `0 0 0 3px ${AI_SOFT_BLUE}`,
    },
});

export const aiGlowText = style({
    fontSize: "12px",
    color: AI_BLUE, 
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "8px",
    fontWeight: 600,
});

/** 4. 채팅 영역 */
export const chatSection = style({
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "column",
});

export const messageList = style({
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#FFF",
});

export const customerMsg = style({ 
    alignSelf: "flex-start", 
    display: "flex", 
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: "75%",
});

export const agentMsg = style({ 
    alignSelf: "flex-end", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "flex-end",
    maxWidth: "75%",
});

export const bubble = style({
    width: "fit-content",
    minWidth: "40px",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "14.5px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap", 
    wordBreak: "keep-all",
    selectors: {
        [`${customerMsg} &`]: { 
            backgroundColor: "#F3F4F6", 
            color: UPLUS_BLACK, 
            borderBottomLeftRadius: "2px" 
        },
        [`${agentMsg} &`]: { 
            backgroundColor: UPLUS_MAGENTA, 
            color: "#FFF", 
            borderBottomRightRadius: "2px" 
        },
    },
});

export const typingBubble = style({
    backgroundColor: "#F3F4F6",
    padding: "12px 16px",
    borderRadius: "18px",
    display: "flex",
    gap: "4px",
    alignItems: "center",
    width: "fit-content",
});

export const dot = style({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#9CA3AF",
    animation: `${dotTyping} 1.4s infinite ease-in-out`,
    selectors: {
        "&:nth-child(2)": { animationDelay: "0.2s" },
        "&:nth-child(3)": { animationDelay: "0.4s" },
    },
});

export const msgTime = style({ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" });

/** 5. 채팅 푸터 */
export const chatFooter = style({
    padding: "20px 24px",
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
});

export const aiGuideHeader = style({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 800,
    color: AI_BLUE, 
    marginBottom: "12px",
});

export const aiSuggestRow = style({ display: "flex", gap: "10px", marginBottom: "16px" });

export const aiSuggestBtn = style({
    fontSize: "12px",
    padding: "8px 14px",
    borderRadius: "10px",
    border: `1px solid ${AI_SOFT_BLUE}`,
    backgroundColor: "#FFF",
    color: AI_BLUE, 
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
    ":hover": { borderColor: AI_BLUE, backgroundColor: AI_SOFT_BLUE, transform: "translateY(-2px)" },
});

export const inputArea = style({ display: "flex", gap: "12px" });

export const input = style({
    flex: 1,
    height: "48px",
    padding: "0 20px",
    borderRadius: "24px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFF",
    fontSize: "15px",
    color: UPLUS_BLACK, 
    fontWeight: 500,
    ":focus": { 
        outline: "none", 
        borderColor: UPLUS_MAGENTA, 
        boxShadow: `0 0 0 3px ${UPLUS_SOFT_PINK}` 
    },
    "::placeholder": { color: "#9CA3AF" },
});

export const sendBtn = style({
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s",
    ":hover": { transform: "scale(1.05)" },
    ":disabled": { backgroundColor: "#E5E7EB", cursor: "not-allowed" }
});

/** 6. 대기 및 FAQ 사이드바 */
export const statCard = style({
    backgroundColor: UPLUS_SOFT_PINK,
    padding: "20px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
});

export const waitNumber = style({
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
});

globalStyle(`${waitNumber} strong`, {
    fontSize: "24px",
    fontWeight: 900,
    color: UPLUS_MAGENTA,
});

globalStyle(`${waitNumber} span`, {
    fontSize: "12px",
    color: UPLUS_MAGENTA,
    fontWeight: 700,
});

export const faqWrapper = style({ display: "flex", flexDirection: "column", gap: "12px" });

export const faqItem = style({
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
});

export const faqQuestion = style({ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" });

export const faqCopyBtn = style({
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: `1px solid ${UPLUS_MAGENTA}`,
    color: UPLUS_MAGENTA,
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: "transparent",
    transition: "all 0.2s",
    ":hover": { backgroundColor: UPLUS_MAGENTA, color: "#FFF" },
});

/** 7. 종료 모달 */
export const modalOverlay = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
    animation: `${fadeIn} 0.2s ease`,
});

export const exitModal = style({
    backgroundColor: "#FFF",
    width: "100%",
    maxWidth: "520px",
    borderRadius: "24px",
    overflow: "hidden",
    animation: `${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
});

export const modalHeader = style({
    padding: "24px",
    borderBottom: "1px solid #F3F4F6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

globalStyle(`${modalHeader} h2`, {
    fontSize: "18px",
    fontWeight: 800,
    color: UPLUS_BLACK,
    margin: 0,
});

export const modalBody = style({ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" });

export const fieldGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

globalStyle(`${fieldGroup} label`, {
    fontSize: "13px",
    fontWeight: 700,
    color: "#4B5563",
    display: "flex",
    alignItems: "center",
    gap: "4px",
});

globalStyle(`${fieldGroup} textarea`, {
    height: "120px",
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    fontSize: "14px",
    color: UPLUS_BLACK, 
    backgroundColor: "#F9FAFB",
    resize: "none",
});

globalStyle(`${fieldGroup} select`, {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    fontSize: "14px",
    backgroundColor: "#FFF",
    color: UPLUS_BLACK, 
    fontWeight: 500,
    outline: "none",
});

globalStyle(`${fieldGroup} select option`, {
    color: UPLUS_BLACK,
    backgroundColor: "#FFF",
});

export const fieldRow = style({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" });

export const modalFooter = style({
    padding: "20px 24px",
    backgroundColor: "#F9FAFB",
    display: "flex",
    gap: "12px",
});

export const modalCancelBtn = style({
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#E5E7EB",
    color: "#4B5563",
    fontWeight: 700,
    fontSize: "14px",
});

export const modalConfirmBtn = style({
    flex: 2,
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    fontWeight: 700,
    fontSize: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
});

export const loadingContainer = style({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    color: UPLUS_MAGENTA,
    fontWeight: 700
});

export const emptyFaqText = style({ textAlign: "center", color: "#9CA3AF", fontSize: "13px", padding: "20px 0" });