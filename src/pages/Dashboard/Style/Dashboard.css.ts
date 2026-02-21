import {
	globalStyle,
	keyframes,
	style,
	styleVariants,
} from "@vanilla-extract/css";

const UPLUS_MAGENTA = "#E6007E";
const UPLUS_BLACK = "#1A1A1A";
const UPLUS_SOFT_PINK = "#FFF0F6";
const AI_BLUE = "#007AFF";

/** 1. 애니메이션 */
const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideUp = keyframes({
	from: { transform: "translateY(20px)", opacity: 0 },
	to: { transform: "translateY(0)", opacity: 1 },
});
const pulse = keyframes({
	"0%": { boxShadow: "0 0 0 0 rgba(230, 0, 126, 0.4)" },
	"70%": { boxShadow: "0 0 0 10px rgba(230, 0, 126, 0)" },
	"100%": { boxShadow: "0 0 0 0 rgba(230, 0, 126, 0)" },
});

/** 2. 전역 설정 */
globalStyle("html, body, #root", {
	width: "100%",
	margin: 0,
	padding: 0,
	backgroundColor: "#F8F9FC",
	fontFamily: "'Pretendard', sans-serif",
	color: UPLUS_BLACK,
	overflowX: "hidden",
});

globalStyle("*", { boxSizing: "border-box" });

export const container = style({
	width: "100%",
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	animation: `${fadeIn} 0.8s ease-out`,
});

/** 3. 레이아웃 */
export const mainContent = style({
	flex: 1,
	width: "100%",
	display: "flex",
	justifyContent: "center",
	padding: "8px 24px 24px",
});

export const dashboardGrid = style({
	width: "100%",
	maxWidth: "1400px",
	display: "grid",
	gridTemplateColumns: "1fr minmax(300px, 340px)",
	gap: "20px",
	animation: `${slideUp} 0.8s ease-out`,
	"@media": {
		"screen and (max-width: 1024px)": { gridTemplateColumns: "1fr" },
	},
});

export const mainContentLeft = style({
	display: "flex",
	flexDirection: "column",
	gap: "20px",
	minWidth: 0,
});
export const mainContentRight = style({
	display: "flex",
	flexDirection: "column",
	gap: "20px",
	minWidth: 0,
});

/** 4. 헤더 */
export const header = style({
	width: "100%",
	height: "72px",
	display: "flex",
	justifyContent: "center",
	position: "sticky",
	top: 0,
	zIndex: 100,
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	backdropFilter: "blur(20px)",
	borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
});

export const headerContent = style({
	width: "100%",
	maxWidth: "1400px",
	padding: "0 40px",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});

export const brandLogo = style({ fontSize: "24px", fontWeight: 900 });
export const magentaText = style({ color: UPLUS_MAGENTA });
export const logoArea = style({ display: "flex", alignItems: "center" });
export const headerRight = style({
	display: "flex",
	alignItems: "center",
	gap: "24px",
});
export const dateTimeDesktop = style({
	fontSize: "13px",
	fontWeight: 600,
	color: "#444",
});

export const iconButton = style({
	position: "relative",
	cursor: "pointer",
	background: "none",
	border: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "8px",
	borderRadius: "12px",
	transition: "all 0.2s ease",
	":hover": {
		backgroundColor: UPLUS_SOFT_PINK,
		transform: "scale(1.05)",
	},
});

export const notificationBadge = style({
	position: "absolute",
	top: "6px",
	right: "6px",
	width: "8px",
	height: "8px",
	background: UPLUS_MAGENTA,
	borderRadius: "50%",
	border: "2px solid #FFF",
});

export const profileChip = style({
	display: "flex",
	alignItems: "center",
	gap: "10px",
	padding: "8px 18px",
	backgroundColor: "#FFF",
	borderRadius: "100px",
	border: "1px solid #EEE",
});
export const avatarMini = style({
	width: "24px",
	height: "24px",
	backgroundColor: UPLUS_MAGENTA,
	borderRadius: "50%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});
export const userNameText = style({ fontSize: "13px", fontWeight: 700 });
export const logoutBtn = style({
	background: "none",
	border: "none",
	cursor: "pointer",
	color: "#AAA",
	transition: "color 0.2s",
	":hover": { color: UPLUS_BLACK },
});

/** 5. 인사말 카드 및 통계 */
export const heroCard = style({
	background: "linear-gradient(135deg, #1A1A1A 0%, #333 100%)",
	padding: "32px 48px",
	borderRadius: "40px",
	color: "#FFF",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});

export const heroInfo = style({
	display: "flex",
	flexDirection: "column",
	gap: "4px",
});
export const heroTitle = style({
	fontSize: "30px",
	fontWeight: 900,
	margin: 0,
});

export const statsGrid = style({
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
	gap: "20px",
});
export const statCard = style({
	backgroundColor: "#FFF",
	padding: "24px",
	borderRadius: "28px",
	display: "flex",
	alignItems: "center",
	gap: "20px",
	boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
	transition: "transform 0.3s ease",
	":hover": { transform: "translateY(-6px)" },
});

export const statIcon = style({
	width: "52px",
	height: "52px",
	borderRadius: "18px",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});
export const statLabel = style({
	fontSize: "13px",
	color: "#888",
	fontWeight: 600,
});
export const statValue = style({ fontSize: "28px", fontWeight: 900 });

/** 6. 실시간 긴급 알림 바 */
export const alertBanner = style({
	backgroundColor: UPLUS_SOFT_PINK,
	border: `1px solid ${UPLUS_MAGENTA}`,
	padding: "14px 24px",
	borderRadius: "16px",
	marginBottom: "12px",
	display: "flex",
	alignItems: "center",
	gap: "16px",
	width: "100%",
	boxShadow: "0 4px 15px rgba(230, 0, 126, 0.1)",
	animation: `${pulse} 2s infinite ease-in-out`,
});

export const alertLevelBadge = styleVariants({
	CRITICAL: {
		backgroundColor: UPLUS_MAGENTA,
		color: "#FFF",
		padding: "4px 10px",
		borderRadius: "6px",
		fontSize: "11px",
		fontWeight: 900,
		flexShrink: 0,
	},
	HIGH: {
		backgroundColor: "#F97316",
		color: "#FFF",
		padding: "4px 10px",
		borderRadius: "6px",
		fontSize: "11px",
		fontWeight: 900,
		flexShrink: 0,
	},
	MID: {
		backgroundColor: AI_BLUE,
		color: "#FFF",
		padding: "4px 10px",
		borderRadius: "6px",
		fontSize: "11px",
		fontWeight: 900,
		flexShrink: 0,
	},
});

export const alertText = style({
	margin: 0,
	fontSize: "14px",
	color: UPLUS_BLACK,
	fontWeight: 700,
	flex: 1,
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
});

export const alertLinkBtn = style({
	backgroundColor: UPLUS_MAGENTA,
	color: "#FFF",
	border: "none",
	padding: "8px 16px",
	borderRadius: "10px",
	fontSize: "12px",
	fontWeight: 700,
	cursor: "pointer",
	flexShrink: 0,
	transition: "all 0.2s ease",
	":hover": {
		backgroundColor: "#C5006C",
		transform: "scale(1.05)",
	},
});

/** 7. 리스트 섹션 */
export const glassCard = style({
	backgroundColor: "#FFF",
	padding: "24px",
	borderRadius: "32px",
	boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
	width: "100%",
});

export const activityList = style({
	display: "flex",
	flexDirection: "column",
	gap: "10px",
});

export const activityItem = style({
	appearance: "none",
	background: "#F9FAFB",
	border: "1px solid #F1F3F5",
	padding: "16px 14px",
	borderRadius: "18px",
	cursor: "pointer",
	width: "100%",
	display: "flex",
	alignItems: "center",
	textAlign: "left",
	fontFamily: "inherit",
	transition: "all 0.2s ease",
	selectors: {
		"&:hover": {
			backgroundColor: "#FFF",
			borderColor: UPLUS_MAGENTA,
			transform: "translateX(6px)",
			boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
		},
	},
});

export const timeTag = style({
	fontSize: "13px",
	color: "#999",
	fontWeight: 700,
	width: "50px",
	flexShrink: 0,
	textAlign: "center",
});
export const customerName = style({
	fontSize: "16px",
	fontWeight: 700,
	color: UPLUS_BLACK,
});
export const arrowIcon = style({
	color: "#DDD",
	marginLeft: "auto",
	flexShrink: 0,
});

/** 8. 가변 배지 스타일  */
export const priorityBadge = styleVariants({
	HIGH: {
		color: UPLUS_MAGENTA,
		backgroundColor: UPLUS_SOFT_PINK,
		border: `1px solid #FFD6E7`,
		padding: "2px 8px",
		borderRadius: "4px",
		fontSize: "10px",
		fontWeight: 800,
	},
	MID: {
		color: AI_BLUE,
		backgroundColor: "#EFF6FF",
		border: `1px solid #DBEAFE`,
		padding: "2px 8px",
		borderRadius: "4px",
		fontSize: "10px",
		fontWeight: 800,
	},
	LOW: {
		color: "#6B7280",
		backgroundColor: "#F3F4F6",
		border: `1px solid #E5E7EB`,
		padding: "2px 8px",
		borderRadius: "4px",
		fontSize: "10px",
		fontWeight: 800,
	},
});

export const statusBadge = styleVariants({
	DONE: {
		color: "#166534",
		backgroundColor: "#DCFCE7",
		padding: "4px 10px",
		borderRadius: "100px",
		fontSize: "11px",
		fontWeight: 800,
		display: "flex",
		alignItems: "center",
		gap: "4px",
	},
	IN_PROGRESS: {
		color: "#1E40AF",
		backgroundColor: "#DBEAFE",
		padding: "4px 10px",
		borderRadius: "100px",
		fontSize: "11px",
		fontWeight: 800,
		display: "flex",
		alignItems: "center",
		gap: "4px",
	},
	CANCELED: {
		color: "#4B5563",
		backgroundColor: "#F3F4F6",
		padding: "4px 10px",
		borderRadius: "100px",
		fontSize: "11px",
		fontWeight: 800,
		display: "flex",
		alignItems: "center",
		gap: "4px",
	},
});

/** 9. 사이드바 구성 요소 */
export const memoArea = style({
	width: "100%",
	minHeight: "160px",
	padding: "16px",
	borderRadius: "20px",
	backgroundColor: "#F9FAFB",	
	border: "1px solid #EEE",
	color: '#1a1a1a',
	fontSize: "14px",
	resize: "none",
	marginTop: "12px",
	fontFamily: "inherit",
});

export const noticeList = style({
	display: "flex",
	flexDirection: "column",
	gap: "4px",
	marginTop: "12px",
});

export const noticeItem = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	fontSize: "14px",
	borderBottom: "1px solid #F3F4F6",
	padding: "10px 0",
	":last-child": {
		borderBottom: "none",
	},
});

export const noticeTitle = style({
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	flex: 1,
	fontWeight: 500,
	color: "#374151",
});

export const noticeDate = style({
	fontSize: "12px",
	color: "#9CA3AF",
	marginLeft: "10px",
});

export const categoryTag = style({
	fontSize: "12px",
	color: UPLUS_MAGENTA,
	fontWeight: 700,
	backgroundColor: UPLUS_SOFT_PINK,
	padding: "4px 12px",
	borderRadius: "100px",
});

/** 10. 모달 관련 스타일 */
export const modalOverlay = style({
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backgroundColor: "rgba(0,0,0,0.3)",
	backdropFilter: "blur(6px)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 1000,
});
export const premiumModal = style({
	backgroundColor: "#FFF",
	width: "90%",
	maxWidth: "500px",
	borderRadius: "40px",
	padding: "40px",
	boxShadow: "0 30px 70px rgba(0,0,0,0.2)",
});
export const aiGlowBadge = style({
	display: "inline-block",
	padding: "6px 16px",
	borderRadius: "100px",
	backgroundColor: "rgba(0,122,255,0.1)",
	color: AI_BLUE,
	fontSize: "12px",
	fontWeight: 800,
	marginBottom: "20px",
});
export const modalHeading = style({
	fontSize: "26px",
	fontWeight: 800,
	marginBottom: "20px",
});
export const modalCustomerCard = style({
	backgroundColor: "#F9FAFB",
	borderRadius: "24px",
	padding: "24px",
	marginBottom: "32px",
	border: "1px solid #EEE",
});
export const modalCustomerName = style({ fontSize: "20px", fontWeight: 800 });
export const aiGuideBox = style({
	backgroundColor: "#FFF",
	borderRadius: "16px",
	padding: "16px",
	border: "1px solid rgba(0,122,255,0.1)",
});
export const aiGuideTitle = style({
	fontSize: "13px",
	fontWeight: 700,
	color: AI_BLUE,
	display: "flex",
	alignItems: "center",
	gap: "6px",
	marginBottom: "8px",
});
export const aiGuideText = style({
	fontSize: "14px",
	color: "#555",
	lineHeight: "1.6",
	margin: 0,
});
export const modalActions = style({ display: "flex", gap: "12px" });
export const primaryBtn = style({
	flex: 2,
	height: "60px",
	backgroundColor: UPLUS_MAGENTA,
	color: "#FFF",
	border: "none",
	borderRadius: "20px",
	fontSize: "17px",
	fontWeight: 800,
	cursor: "pointer",
});
export const secondaryBtn = style({
	flex: 1,
	height: "60px",
	backgroundColor: "#F3F4F6",
	color: "#666",
	border: "none",
	borderRadius: "20px",
	fontSize: "17px",
	fontWeight: 700,
	cursor: "pointer",
});
export const workStartBtn = style({
	padding: "12px 24px",
	backgroundColor: UPLUS_MAGENTA,
	color: "#FFF",
	border: "none",
	borderRadius: "14px",
	fontWeight: 800,
	cursor: "pointer",
});
export const workStopBtn = style({
	padding: "12px 24px",
	backgroundColor: "rgba(255,255,255,0.1)",
	color: "#FFF",
	border: "1px solid rgba(255,255,255,0.3)",
	borderRadius: "14px",
	fontWeight: 800,
	cursor: "pointer",
});
export const cardHeader = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: "16px",
});
export const cardTitle = style({
	fontSize: "19px",
	fontWeight: 800,
	margin: 0,
});
