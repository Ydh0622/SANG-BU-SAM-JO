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

export const homeBtn = style({
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    ":active": { transform: "scale(0.9)" },
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

const bubbleBase = style({
    padding: "12px 16px",
    fontSize: "15px",
    lineHeight: "1.5",
    width: "fit-content",
    maxWidth: "100%", // Wrapper에서 조절하므로 100%로 변경
    minWidth: "45px",
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
    animation: `${popIn} 0.3s ease-out`,
});

/** ✅ 내 메시지: 가로 배치 (시간이 왼쪽, 말풍선이 오른쪽) */
export const myMsgWrapper = style({
    alignSelf: "flex-end", 
    display: "flex",
    flexDirection: "row",      // 가로 정렬
    alignItems: "flex-end",    // 바닥 기준 정렬
    gap: "8px",                // 시간과 말풍선 사이 간격
    maxWidth: "85%",           // 전체 너비 제한
});

export const myBubble = style([bubbleBase, {
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    borderRadius: "20px 20px 0 20px", 
    boxShadow: "0 4px 10px rgba(230, 0, 126, 0.15)",
    order: 2,                  // 말풍선이 뒤로(오른쪽) 가게 함
}]);

/** ✅ 상담사 메시지: 가로 배치 (말풍선이 왼쪽, 시간이 오른쪽) */
export const agentMsgWrapper = style({
    alignSelf: "flex-start", 
    display: "flex",
    flexDirection: "row",      // 가로 정렬
    alignItems: "flex-end",    // 바닥 기준 정렬
    gap: "8px",
    maxWidth: "85%",
});

export const agentBubble = style([bubbleBase, {
    backgroundColor: "#FFF",
    color: UPLUS_BLACK,
    borderRadius: "0 20px 20px 20px", 
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    order: 1,                  // 말풍선이 앞으로(왼쪽) 오게 함
}]);

/** ✅ 시간 스타일 수정 */
export const timeLabel = style({
    fontSize: "11px",
    color: "#999",
    marginBottom: "2px",       // 바닥 정렬 시 살짝 띄움
    whiteSpace: "nowrap",      // 시간 줄바꿈 방지
    order: 0,                  // 기본 순서
});

// 내 시간만 말풍선 왼쪽으로 보내기 위해 별도로 order 설정 가능 (위의 myMsgWrapper/bubble에서 조절됨)

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
    width: "320px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    animation: `${popIn} 0.3s ease-out`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

export const modalConfirmBtn = style({
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    backgroundColor: UPLUS_MAGENTA,
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
        backgroundColor: "#c5006c",
    },
    ":active": {
        transform: "scale(0.98)",
    }
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