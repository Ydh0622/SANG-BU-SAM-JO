import { globalStyle, keyframes, style, styleVariants } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_GRAY = "#6B7280";
const UPLUS_SOFT_PINK = "#FFF0F6";
const AI_BLUE = "#007AFF";

const fadeIn = keyframes({
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
    padding: "40px",
    backgroundColor: "#F8F9FA",
    minHeight: "100vh",
    animation: `${fadeIn} 0.4s ease-out`,
    "@media": {
        "screen and (max-width: 768px)": {
            padding: "20px 16px",
        },
    },
});

/** 1. 상단 네비게이션 */
export const backButton = style({
    border: "none",
    background: "#FFF",
    padding: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    ":hover": {
        backgroundColor: "#F1F3F5",
        transform: "translateX(-2px)",
    },
});

/** 2. 상단 필터 섹션 */
export const filterSection = style({
    backgroundColor: "#FFF",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
    marginBottom: "32px",
    border: "1px solid rgba(0,0,0,0.05)",
});

export const filterTitle = style({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
});

globalStyle(`${filterTitle} h2`, {
    fontSize: "18px",
    fontWeight: 800,
    color: UPLUS_BLACK,
    margin: 0,
});

export const filterGrid = style({
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "flex-end",
});

export const inputGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: "1 1 220px",
});

globalStyle(`${inputGroup} label`, {
    fontSize: "13px",
    fontWeight: 800,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
});

/** ✅ 9번 기능: 상태 필터 칩(Chip) 스타일 */
export const filterChipContainer = style({
    display: "flex",
    gap: "8px",
    marginTop: "4px",
    flexWrap: "wrap",
});

export const filterChip = style({
    padding: "10px 18px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFF",
    color: "#666",
    ":hover": {
        borderColor: UPLUS_MAGENTA,
        color: UPLUS_MAGENTA,
        backgroundColor: UPLUS_SOFT_PINK,
    },
});

export const filterChipActive = style({
    backgroundColor: UPLUS_MAGENTA,
    color: "#FFF",
    borderColor: UPLUS_MAGENTA,
    boxShadow: `0 4px 12px rgba(230, 0, 126, 0.2)`,
    ":hover": {
        backgroundColor: "#C5006C",
        color: "#FFF",
    }
});

/** 3. 입력 필드 및 버튼 */
export const inputWrapper = style({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    padding: "0 18px",
    borderRadius: "14px",
    height: "52px",
    transition: "all 0.2s ease",
    ":focus-within": {
        borderColor: UPLUS_MAGENTA,
        backgroundColor: "#FFF",
        boxShadow: `0 0 0 4px rgba(230, 0, 126, 0.1)`,
    },
});

export const input = style({
    border: "none",
    background: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    fontWeight: 500,
});

export const select = style({
    height: "52px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: "14px",
    padding: "0 16px",
    outline: "none",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
});

export const searchBtn = style({
    height: "52px",
    padding: "0 32px",
    backgroundColor: UPLUS_BLACK,
    color: "#FFF",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 700,
    ":hover": { backgroundColor: "#333", transform: "translateY(-1px)" },
});

export const resetBtn = style({
    height: "52px",
    padding: "0 20px",
    backgroundColor: "#FFF",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    fontWeight: 700,
    color: UPLUS_GRAY,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ":hover": { backgroundColor: "#F9FAFB", color: UPLUS_BLACK },
});

/** 4. 검색 결과 섹션 */
export const resultSection = style({
    backgroundColor: "#FFF",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0,0,0,0.05)",
});

export const resultHeader = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
});

export const downloadBtn = style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFF",
    fontSize: "13px",
    fontWeight: 700,
    color: "#4B5563",
    ":hover": { backgroundColor: "#F9FAFB" },
});

export const tableWrapper = style({
    width: "100%",
    overflowX: "auto",
    borderRadius: "16px",
    border: "1px solid #F1F3F5",
    "::-webkit-scrollbar": { height: "6px" },
    "::-webkit-scrollbar-thumb": { backgroundColor: "#E5E7EB", borderRadius: "10px" },
});

export const table = style({
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
});

globalStyle(`${table} th`, {
    textAlign: "left",
    padding: "18px 20px",
    borderBottom: "1px solid #F1F3F5",
    fontSize: "12px",
    color: "#888",
    fontWeight: 800,
    backgroundColor: "#FCFCFD",
    textTransform: "uppercase",
});

export const tableRow = style({
    cursor: "pointer",
    borderBottom: "1px solid #F8F9FA",
    transition: "all 0.2s ease",
    ":hover": { backgroundColor: UPLUS_SOFT_PINK },
});

/** ✅ 10번 기능: 상태 관리 차별화를 위한 배지 스타일 */
export const statusBadge = styleVariants({
    INDEXED: { color: "#059669", backgroundColor: "#DCFCE7", padding: "4px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 },
    PENDING: { color: "#D97706", backgroundColor: "#FEF3C7", padding: "4px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 },
    FAILED: { color: "#DC2626", backgroundColor: "#FEE2E2", padding: "4px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 },
});

export const keywordTag = style({
    fontSize: "11px",
    padding: "4px 8px",
    backgroundColor: "#F0F7FF",
    color: AI_BLUE,
    borderRadius: "6px",
    fontWeight: 700,
    border: "1px solid rgba(0, 122, 255, 0.1)",
});

/** ✅ 10번 기능 대비: 상세페이지 사이드바 미리 정의 */
export const sideHistoryCard = style({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E5E7EB",
});

export const timelineItem = style({
    position: "relative",
    paddingLeft: "24px",
    paddingBottom: "20px",
    borderLeft: "2px solid #E5E7EB",
    ":last-child": { borderLeft: "none" },
    "::before": {
        content: "",
        position: "absolute",
        left: "-7px",
        top: "0",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: UPLUS_MAGENTA,
        border: "2px solid #FFF",
    }
});