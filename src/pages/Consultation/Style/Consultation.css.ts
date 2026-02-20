import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";
const AI_BLUE = "#007AFF";
const AI_SOFT_BLUE = "#F0F7FF";

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

globalStyle("button", {
	fontFamily: "inherit",
	padding: 0,
	margin: 0,
	border: "none",
	background: "none",
	cursor: "pointer",
});

globalStyle("textarea, input", {
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

/** 2. 헤더 영역 */
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
	gap: "4px",
	fontSize: "14px",
	color: "#6B7280",
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

/** 3. 메인 레이아웃 */
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

/** 4. 카드 및 입력 폼 */
export const card = style({
	backgroundColor: "#FFF",
	padding: "24px",
	borderRadius: "20px",
	border: "1px solid #E5E7EB",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
});

export const cardTitle = style({
	fontSize: "15px",
	fontWeight: 800,
	marginBottom: "16px",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	color: "#374151",
});

export const memoArea = style({
	width: "100%",
	padding: "12px",
	borderRadius: "10px",
	border: "1px solid #D1D5DB",
	backgroundColor: "#F9FAFB",
	fontSize: "14px",
	lineHeight: "1.6",
	color: "#1F2937",
	resize: "none",
	transition: "all 0.2s ease",
	":focus": {
		outline: "none",
		borderColor: UPLUS_MAGENTA,
		backgroundColor: "#FFF",
		boxShadow: `0 0 0 3px ${UPLUS_SOFT_PINK}`,
	},
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
});

export const infoItem = style({
	display: "flex",
	alignItems: "center",
	gap: "10px",
	fontSize: "13.5px",
	color: "#4B5563",
});

/** 5. 채팅 영역 */
export const chatSection = style({
	backgroundColor: "#F9FAFB",
	display: "flex",
	flexDirection: "column",
	position: "relative",
	alignItems: "center",
});

export const messageList = style({
	flex: 1,
	width: "100%",
	maxWidth: "850px",
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
});
export const agentMsg = style({
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
});
export const aiMsg = style({
	alignSelf: "center",
	width: "100%",
	maxWidth: "650px",
});

export const bubble = style({
	maxWidth: "85%",
	padding: "12px 16px",
	borderRadius: "18px",
	fontSize: "14.5px",
	lineHeight: "1.6",
	selectors: {
		[`${customerMsg} &`]: {
			backgroundColor: "#F3F4F6",
			color: UPLUS_BLACK,
			borderBottomLeftRadius: "2px",
		},
		[`${agentMsg} &`]: {
			backgroundColor: UPLUS_MAGENTA,
			color: "#FFF",
			borderBottomRightRadius: "2px",
		},
		[`${aiMsg} &`]: {
			backgroundColor: AI_SOFT_BLUE,
			color: AI_BLUE,
			border: `1px dashed ${AI_BLUE}`,
			textAlign: "center",
		},
	},
});

export const msgTime = style({
	fontSize: "11px",
	color: "#9CA3AF",
	marginTop: "4px",
});

/** 6. 하단 입력 및 AI 가이드 */
export const aiGuideArea = style({
	width: "100%",
	maxWidth: "850px",
	padding: "16px 24px",
	backgroundColor: "#F8FAFC",
	borderTop: "1px solid #E5E7EB",
});

export const aiGuideHeader = style({
	display: "flex",
	alignItems: "center",
	gap: "6px",
	fontSize: "13.3px",
	fontWeight: 800,
	color: AI_BLUE,
	marginBottom: "12px",
});

export const aiSuggestBtn = style({
	fontSize: "12.5px",
	padding: "8px 16px",
	borderRadius: "12px",
	border: `1px solid rgba(0, 122, 255, 0.15)`,
	backgroundColor: "#FFF",
	color: AI_BLUE,
	fontWeight: 700,
	cursor: "pointer",
	transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
	display: "flex",
	alignItems: "center",
	gap: "6px",
	":hover": {
		backgroundColor: AI_BLUE,
		color: "#FFF",
		transform: "translateY(-2px)",
		boxShadow: "0 6px 15px rgba(0, 122, 255, 0.2)",
	},
});

export const inputArea = style({
	width: "100%",
	display: "flex",
	gap: "12px",
	alignItems: "center",
	backgroundColor: "#FFF",
	padding: "12px 0",
});
export const input = style({
	flex: 1,
	height: "48px",
	padding: "0 20px",
	borderRadius: "24px",
	border: "1px solid #E5E7EB",
	fontSize: "15px",
	":focus": { outline: "none", borderColor: UPLUS_MAGENTA },
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
});
