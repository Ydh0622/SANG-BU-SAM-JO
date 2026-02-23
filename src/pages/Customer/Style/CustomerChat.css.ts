import { style, keyframes } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";

const popIn = keyframes({
    from: { opacity: 0, transform: "translateY(10px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

export const container = style({
    width: "100%",
    height: "100vh",
    backgroundColor: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Pretendard, system-ui, sans-serif",
});

export const phoneFrame = style({
    width: "450px",
    height: "820px",
    backgroundColor: "#F9FAFB",
    borderRadius: "48px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border: "12px solid #1A1A1A",
    position: "relative",
});

export const chatHeader = style({
    padding: "24px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #EEE",
    display: "flex",
    alignItems: "center",
    gap: "16px",
});

export const backBtn = style({
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    display: "flex",
    alignItems: "center",
});

export const chatArea = style({
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflowY: "auto",
    backgroundColor: "#F9FAFB",
});

/** ✨ 세로 꺾임 방지 핵심 스타일 */
const bubbleBase = style({
    padding: "12px 16px",
    fontSize: "15px",
    lineHeight: "1.5",
    
    // 1. 너비 결정 방식 수정
    width: "fit-content",      // 안의 내용물만큼만 너비를 가짐
    maxWidth: "80%",           // 최대 너비 제한
    minWidth: "45px",          // 너무 짧아도 동그란 형태 유지
    
    // 2. 줄바꿈 제어 (핵심!)
    whiteSpace: "pre-wrap",    // 공백과 엔터 유지
    wordBreak: "keep-all",     // 단어 단위로 줄바꿈 (ㅎㅇ가 쪼개지지 않음)
    overflowWrap: "anywhere",  // 의미 없는 긴 영문일 경우만 끊기
    
    animation: `${popIn} 0.3s ease-out`,
});

/** 내 메시지 (오른쪽 정렬) */
export const myMsgWrapper = style({
    alignSelf: "flex-end", 
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end", 
});

export const myBubble = style([bubbleBase, {
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    borderRadius: "20px 20px 0 20px", 
    boxShadow: "0 4px 10px rgba(230, 0, 126, 0.15)",
}]);

/** 상담사 메시지 (왼쪽 정렬) */
export const agentMsgWrapper = style({
    alignSelf: "flex-start", 
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", 
});

export const agentBubble = style([bubbleBase, {
    backgroundColor: "#FFF",
    color: UPLUS_BLACK,
    borderRadius: "0 20px 20px 20px", 
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
}]);

export const timeLabel = style({
    fontSize: "11px",
    color: "#999",
    marginTop: "4px",
    padding: "0 4px",
});

export const inputArea = style({
    padding: "16px 20px 30px", 
    backgroundColor: "#FFF",
    borderTop: "1px solid #EEE",
    display: "flex",
    gap: "12px",
    alignItems: "center",
});

export const textField = style({
    flex: 1,
    padding: "14px 20px",
    borderRadius: "28px",
    border: "1px solid #E5E7EB",
    fontSize: "15px",
    outline: "none",
    color: "#1A1A1A", 
    transition: "all 0.2s",
    ":focus": { 
        borderColor: UPLUS_MAGENTA,
        backgroundColor: "#FFF",
        boxShadow: "0 0 0 3px rgba(230, 0, 126, 0.1)"
    },
});

export const sendBtn = style({
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    ":active": { transform: "scale(0.9)" },
    ":disabled": {
        backgroundColor: "#E5E7EB",
        cursor: "not-allowed"
    }
});

// 모달 스타일 (동일)
export const modalOverlay = style({
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
});

export const modalContent = style({
    backgroundColor: "#FFF",
    padding: "32px",
    borderRadius: "32px",
    width: "85%",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    animation: `${popIn} 0.3s ease-out`,
});

export const modalTitle = style({
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "12px",
});

export const modalText = style({
    fontSize: "15px",
    color: "#666",
    lineHeight: 1.6,
});