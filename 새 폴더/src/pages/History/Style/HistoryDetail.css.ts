import { style, globalStyle } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const AI_BLUE = "#007AFF";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#F8F9FA",
  display: "flex",
  flexDirection: "column",
});

export const header = style({
  height: "72px",
  padding: "0 40px",
  backgroundColor: "#FFF",
  borderBottom: "1px solid #EEE",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 10,
});

export const headerLeft = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const title = style({
  fontSize: "20px",
  fontWeight: 800,
  color: "#1A1A1A",
});

export const backButton = style({
  border: "none",
  background: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "8px",
  borderRadius: "50%",
  transition: "0.2s",
  ":hover": { backgroundColor: "#F1F3F5" },
});

export const downloadBtn = style({
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid #EEE",
  backgroundColor: "#FFF",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.2s",
  ":hover": { backgroundColor: "#F9FAFB" },
});

export const mainLayout = style({
  display: "grid",
  gridTemplateColumns: "320px 1fr",
  gap: "32px",
  padding: "40px",
  maxWidth: "1400px",
  margin: "0 auto",
  width: "100%",
});

export const sideSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const card = style({
  backgroundColor: "#FFF",
  padding: "28px",
  borderRadius: "24px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  border: "1px solid #F0F0F0",
});

export const cardTitle = style({
  fontSize: "16px",
  fontWeight: 700,
  marginBottom: "20px",
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

// 아이콘에 UPLUS_MAGENTA 적용하여 미사용 경고 해결
globalStyle(`${cardTitle} svg`, {
  color: UPLUS_MAGENTA,
});

export const infoList = style({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
});

export const infoItem = style({
  fontSize: "14px",
  color: "#555",
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #F8F9FA",
  paddingBottom: "10px",
});

globalStyle(`${infoItem} strong`, {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#888",
  fontWeight: 500,
});

export const summaryText = style({
  fontSize: "14px",
  color: "#444",
  lineHeight: "1.7",
});

export const chatSection = style({
  backgroundColor: "#FFF",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #F0F0F0",
  height: "calc(100vh - 152px)",
  overflow: "hidden",
});

export const chatHeader = style({
  padding: "20px 30px",
  borderBottom: "1px solid #F8F9FA",
  fontWeight: 700,
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const messageList = style({
  flex: 1,
  padding: "30px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const bubble = style({
  padding: "14px 20px",
  borderRadius: "20px",
  maxWidth: "75%",
  fontSize: "14px",
  lineHeight: "1.6",
});

export const msgTime = style({
  fontSize: "11px",
  color: "#AAA",
  marginTop: "6px",
});

// 메시지 타입별 스타일 (globalStyle로 에러 방지)
export const customerMsg = style({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});
globalStyle(`${customerMsg} .${bubble}`, {
  backgroundColor: "#F1F3F5",
  color: "#333",
});

export const agentMsg = style({
  alignSelf: "flex-end",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
});
globalStyle(`${agentMsg} .${bubble}`, {
  backgroundColor: UPLUS_MAGENTA, // 상담원 메시지 마젠타 적용
  color: "#FFF",
});

export const aiMsg = style({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});
globalStyle(`${aiMsg} .${bubble}`, {
  backgroundColor: "#E6F0FF",
  color: AI_BLUE,
  border: "1px solid #CCE0FF",
});

export const footerNote = style({
  padding: "20px",
  textAlign: "center",
  color: "#AAA",
  fontSize: "12px",
  backgroundColor: "#FAFAFA",
  borderTop: "1px solid #EEE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
});