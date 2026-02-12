import { style, globalStyle, keyframes } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  padding: "40px",
  backgroundColor: "#F8F9FA",
  minHeight: "100vh",
  animation: `${fadeIn} 0.4s ease-out`,
});

// 1. 상단 필터 섹션
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

// ✅ globalStyle로 h2 선택 (에러 해결)
globalStyle(`${filterTitle} h2`, {
  fontSize: "18px",
  fontWeight: 800,
  color: UPLUS_BLACK,
  margin: 0,
});

export const filterGrid = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  alignItems: "flex-end",
});

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  flex: "1 1 220px",
});

// ✅ globalStyle로 label 선택 (에러 해결)
globalStyle(`${inputGroup} label`, {
  fontSize: "14px",
  fontWeight: 700,
  color: "#444",
});

export const inputWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "#F9FAFB",
  border: "1px solid #E5E7EB",
  padding: "0 18px",
  borderRadius: "14px",
  height: "52px",
  width: "100%",
  boxSizing: "border-box",
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
  color: UPLUS_BLACK,
  fontWeight: 500,
});

// input 내부에 placeholder 색상 처리
globalStyle(`${input}::placeholder`, {
  color: "#AAA",
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
  width: "100%",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":focus": { borderColor: UPLUS_MAGENTA, backgroundColor: "#FFF" },
});

export const searchBtn = style({
  height: "52px",
  padding: "0 32px",
  backgroundColor: UPLUS_BLACK,
  color: "#FFF",
  border: "none",
  borderRadius: "14px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": { backgroundColor: "#333", transform: "translateY(-1px)" },
  ":active": { transform: "translateY(0)" },
});

export const resetBtn = style({
  height: "52px",
  padding: "0 20px",
  backgroundColor: "#FFF",
  border: "1px solid #E5E7EB",
  borderRadius: "14px",
  fontWeight: 700,
  cursor: "pointer",
  color: "#6B7280",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s ease",
  ":hover": { backgroundColor: "#F9FAFB", color: UPLUS_BLACK },
});

// 2. 검색 결과 섹션
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
});

// ✅ globalStyle로 내부 span과 strong 선택 (에러 해결)
globalStyle(`${resultHeader} span`, {
  fontSize: "14px",
  color: "#666",
});

globalStyle(`${resultHeader} strong`, {
  color: UPLUS_MAGENTA,
  fontWeight: 800,
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
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": { backgroundColor: "#F9FAFB", color: UPLUS_BLACK },
});

export const tableWrapper = style({
  width: "100%",
  overflowX: "auto",
  borderRadius: "16px",
  border: "1px solid #F1F3F5",
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
  fontSize: "13px",
  color: "#888",
  fontWeight: 700,
  backgroundColor: "#FCFCFD",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export const tableRow = style({
  cursor: "pointer",
  borderBottom: "1px solid #F8F9FA",
  transition: "all 0.2s ease",
  ":hover": { backgroundColor: "#FFF0F6" },
});

globalStyle(`${tableRow} td`, {
  padding: "20px",
  fontSize: "14px",
  color: "#374151",
  verticalAlign: "middle",
});

export const typeBadge = style({
  padding: "6px 12px",
  backgroundColor: "#F3F4F6",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 800,
  color: "#4B5563",
});

export const statusComplete = style({ 
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: "#059669", 
  fontWeight: 800,
  fontSize: "13px"
});

export const statusDoing = style({ 
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: UPLUS_MAGENTA, 
  fontWeight: 800,
  fontSize: "13px"
});