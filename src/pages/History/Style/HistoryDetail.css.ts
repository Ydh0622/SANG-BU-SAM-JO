import { globalStyle, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const AI_BLUE = "#007AFF"; // ✅ 미사용 경고 해결 (aiMsg 스타일에서 활용)
const AI_SOFT_BLUE = "#F0F7FF";

export const container = style({
	width: "100%",
	minHeight: "100vh",
	backgroundColor: "#F8F9FA",
	display: "flex",
	flexDirection: "column",
});

/** 1. 헤더 영역 */
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
	fontSize: "18px", // 가독성을 위해 약간 조정
	fontWeight: 800,
	color: UPLUS_BLACK,
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
	padding: "10px 18px",
	borderRadius: "10px",
	border: "1px solid #EEE",
	backgroundColor: "#FFF",
	fontWeight: 700,
	display: "flex",
	alignItems: "center",
	gap: "8px",
	cursor: "pointer",
	fontSize: "13px",
	transition: "all 0.2s",
	":hover": {
		backgroundColor: "#F9FAFB",
		transform: "translateY(-1px)",
		boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
	},
});

/** 2. 메인 레이아웃 (ERD 3-1, 3-9 기반 구조) */
export const mainLayout = style({
	display: "grid",
	gridTemplateColumns: "380px 1fr", // 정보 집약도를 위해 사이드바 소폭 확장
	gap: "32px",
	padding: "32px 40px",
	maxWidth: "1440px",
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
	padding: "24px",
	borderRadius: "24px",
	boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
	border: "1px solid #F0F0F0",
});

export const cardTitle = style({
	fontSize: "15px",
	fontWeight: 800,
	marginBottom: "20px",
	color: "#333",
	display: "flex",
	alignItems: "center",
	gap: "8px",
});

// 아이콘 포인트 컬러 적용
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
	alignItems: "center",
	paddingBottom: "12px",
	borderBottom: "1px solid #F8F9FA",
});

globalStyle(`${infoItem} strong`, {
	display: "flex",
	alignItems: "center",
	gap: "6px",
	color: "#888",
	fontWeight: 600,
});

/** 3. 채팅 및 대화 영역 (ERD 3-7 명세 반영) */
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
	fontWeight: 800,
	color: UPLUS_BLACK,
	display: "flex",
	alignItems: "center",
	gap: "8px",
	backgroundColor: "#FAFAFA",
});

export const messageList = style({
	flex: 1,
	padding: "30px",
	overflowY: "auto",
	display: "flex",
	flexDirection: "column",
	gap: "20px",
});

// 스크롤바 커스텀
globalStyle(`${messageList}::-webkit-scrollbar`, { width: "6px" });
globalStyle(`${messageList}::-webkit-scrollbar-thumb`, {
	backgroundColor: "#E5E7EB",
	borderRadius: "10px",
});

export const bubble = style({
	padding: "12px 18px",
	borderRadius: "18px",
	maxWidth: "80%",
	fontSize: "14.5px",
	lineHeight: "1.6",
});

export const msgTime = style({
	fontSize: "11px",
	color: "#AAA",
	marginTop: "6px",
});

// ✅ 메시지 주체별 스타일 (ERD 3-8 기반 구분)
export const customerMsg = style({
	alignSelf: "flex-start",
	display: "flex",
	flexDirection: "column",
});
globalStyle(`${customerMsg} .${bubble}`, {
	backgroundColor: "#F3F4F6",
	color: UPLUS_BLACK,
	borderBottomLeftRadius: "2px",
});

export const agentMsg = style({
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
});
globalStyle(`${agentMsg} .${bubble}`, {
	backgroundColor: UPLUS_MAGENTA,
	color: "#FFF",
	borderBottomRightRadius: "2px",
});

// ✅ AIMsg 스타일 보강 (AI_BLUE 사용으로 경고 해결)
export const aiMsg = style({
	alignSelf: "center",
	width: "100%",
	maxWidth: "90%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	margin: "10px 0",
});
globalStyle(`${aiMsg} .${bubble}`, {
	backgroundColor: AI_SOFT_BLUE,
	color: AI_BLUE,
	border: `1px dashed ${AI_BLUE}`,
	borderRadius: "16px",
	textAlign: "center",
	fontSize: "13px",
	fontWeight: 500,
});

export const footerNote = style({
	padding: "16px",
	textAlign: "center",
	color: "#9CA3AF",
	fontSize: "12px",
	backgroundColor: "#FAFAFA",
	borderTop: "1px solid #EEE",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "6px",
});
