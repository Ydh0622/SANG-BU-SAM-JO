import { style, keyframes } from "@vanilla-extract/css";

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const container = style({
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F8F9FC",
    animation: `${fadeIn} 0.5s ease-out`,
});

export const header = style({
    height: "72px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #EEE",
    display: "flex",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
});

export const headerContent = style({
    width: "100%",
    maxWidth: "800px",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

export const title = style({
    fontSize: "18px",
    fontWeight: 800,
    margin: 0,
    color: "#1A1A1A",
});

export const backBtn = style({
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    ":hover": { backgroundColor: "#F1F5F9" },
});

export const readAllBtn = style({
    background: "none",
    border: "none",
    color: "#E6007E",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background 0.2s",
    ":hover": { backgroundColor: "#FFF0F6" },
});

export const mainContent = style({
    padding: "24px",
    display: "flex",
    justifyContent: "center",
});

export const listWrapper = style({
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
});

export const notiItem = style({
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "24px",
    display: "flex",
    gap: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: "1px solid transparent",
    ":hover": { 
        transform: "translateY(-2px)", 
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        borderColor: "#E6007E" 
    },
});

export const readItem = style({
    opacity: 0.6,
    backgroundColor: "#FAFAFA",
    ":hover": {
        borderColor: "transparent"
    }
});

export const iconArea = style({
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    backgroundColor: "#F8F9FC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
});

export const contentArea = style({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
});

export const itemHeader = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const itemTitle = style({
    fontWeight: 700,
    fontSize: "15px",
    color: "#1A1A1A",
});

export const itemTime = style({
    fontSize: "12px",
    color: "#94A3B8",
});

export const itemDesc = style({
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
    lineHeight: "1.6",
});

/** ✨ 에러 해결: 누락되었던 actionArea 속성 추가 */
export const actionArea = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "12px",
    borderLeft: "1px solid #F1F5F9",
});

export const moreBtn = style({
    background: "none",
    border: "none",
    color: "#94A3B8",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    ":hover": { 
        backgroundColor: "#F1F5F9",
        color: "#1A1A1A" 
    },
});

export const deleteBtn = style({
    background: "none",
    border: "none",
    color: "#CBD5E1",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    ":hover": { 
        color: "#EF4444",
        backgroundColor: "#FEF2F2"
    },
});

export const emptyState = style({
    textAlign: "center",
    padding: "100px 0",
    color: "#94A3B8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
});