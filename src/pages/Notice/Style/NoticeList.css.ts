import { style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";

export const container = style({
    padding: "40px 24px",
    background: `
        radial-gradient(ellipse at 0% 0%, rgba(230,0,126,0.04) 0%, transparent 40%),
        #F8F9FC
    `,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
});

export const contentWrapper = style({
    maxWidth: "1000px",
    width: "100%",
});

/** ✅ 뒤로가기 버튼: Search 페이지와 동일한 효과 적용 */
export const backButton = style({
    width: "40px",
    height: "40px",
    border: "none",
    background: "#FFF",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    marginBottom: "24px", // 기존 간격 유지
    ":hover": {
        backgroundColor: "#F1F3F5",
        transform: "translateX(-2px)", // 👈 왼쪽으로 2px 이동하는 포인트 효과
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
});

export const titleSection = style({
    marginBottom: "32px",
});

export const mainTitle = style({
    fontSize: "28px",
    fontWeight: 800,
    margin: "0 0 8px 0",
    color: "#1A1A1A",
});

export const subTitle = style({
    fontSize: "15px",
    color: "#888",
    margin: 0,
});

export const listCard = style({
    backgroundColor: "#FFF",
    borderRadius: "32px",
    padding: "16px 32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
});

export const listItem = style({
    display: "grid",
    gridTemplateColumns: "100px 1fr 120px",
    alignItems: "center",
    padding: "20px 8px",
    borderBottom: "1px solid #F3F4F6",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderRadius: "12px",
    ":last-child": {
        borderBottom: "none",
    },
    ":hover": {
        transform: "translateX(6px)",
        backgroundColor: "#FFF0F6",
    },
});

export const categoryTag = style({
    fontSize: "12px",
    fontWeight: 800,
    color: UPLUS_MAGENTA,
    backgroundColor: "#FFF0F6",
    padding: "4px 12px",
    borderRadius: "100px",
    width: "fit-content",
});

export const itemTitle = style({
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "0 20px",
});

export const itemDate = style({
    fontSize: "14px",
    color: "#999",
    textAlign: "right",
});