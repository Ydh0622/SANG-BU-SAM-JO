import { style, keyframes } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

const zoomIn = keyframes({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
});

export const container = style({
    width: "100%",
    height: "100vh",
    backgroundColor: "#F3F4F6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
});

/** 시연용 확장 프레임 */
export const phoneFrame = style({
    width: "450px", 
    height: "820px",
    backgroundColor: "#FFF",
    borderRadius: "48px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    border: "12px solid #1A1A1A",
});

export const header = style({
    padding: "24px",
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    textAlign: "center",
});

export const chatArea = style({
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
    backgroundColor: "#F9FAFB",
});

export const categoryBtn = style({
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFF",
    fontSize: "15px",
    fontWeight: 700,
    color: "#4B5563", 
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    ":hover": {
        borderColor: UPLUS_MAGENTA,
        color: UPLUS_MAGENTA,
        backgroundColor: "#FFF0F6",
    },
});

export const inputArea = style({
    padding: "24px",
    backgroundColor: "#FFF",
    borderTop: "1px solid #EEE",
    display: "flex",
    gap: "12px",
    alignItems: "center"
});

export const textField = style({
    flex: 1,
    padding: "14px 20px",
    borderRadius: "28px",
    border: "1px solid #DDD",
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
    ":focus": { borderColor: UPLUS_MAGENTA },
});

/** ✨ 에러 해결: sendBtn 속성 추가 */
export const sendBtn = style({
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    border: "none",
    borderRadius: "50%",
    width: "52px",
    height: "52px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0, // 버튼 형태 유지
    ":hover": {
        transform: "scale(1.05)",
        backgroundColor: "#C5006C",
    },
    ":disabled": {
        backgroundColor: "#CCC",
        cursor: "not-allowed"
    }
});

export const modalOverlay = style({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "30px",
});

export const modalContent = style({
    backgroundColor: "#FFFFFF",
    padding: "40px 24px",
    borderRadius: "32px",
    textAlign: "center",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    animation: `${zoomIn} 0.2s ease-out`,
});

export const modalTitle = style({
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827", 
    marginBottom: "12px",
    fontFamily: "inherit",
});

export const modalText = style({
    fontSize: "15px",
    color: "#4B5563", 
    lineHeight: "1.6",
    marginBottom: "28px",
    fontFamily: "inherit",
});