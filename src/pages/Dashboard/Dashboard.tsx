import {
	Activity,
	AlertTriangle,
	Bell,
	CheckCircle2,
	ChevronRight,
	Clock,
	Edit3,
	FileText,
	Hash,
	LogOut,
	Megaphone,
	MessageSquare,
	Phone,
	User,
	Users,
	X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useConsultation } from "../../hooks/useConsultation";
import * as styles from "./Style/Dashboard.css.ts";

interface ConsultationLog {
	consultation_id: string;
	customer_name: string;
	mask_phone: string;
	channel_code: "CALL" | "CHAT" | "APP";
	status_code: "DONE" | "IN_PROGRESS" | "CANCELED";
	priority_code: "LOW" | "MID" | "HIGH";
	category_display: string;
	issue_display: string;
	summary_preview: string;
	started_at: string;
	parent_consultation_id: string | null;
}

interface AssignedCustomer {
	id: string;
	name: string;
	recentHistory?: string;
}

const NOTICES = [
	{ id: 1, title: "신규 5G 시그니처 요금제 가이드 배포", date: "02.12" },
	{ id: 2, title: "시스템 정기 점검 안내 (02.15 02:00)", date: "02.10" },
];

const Dashboard: React.FC = () => {
	const {
		status,
		toggleWorkStatus,
		assignedCustomer,
		setAssignedCustomer,
		waitingCount,
	} = useConsultation();
	const customer = assignedCustomer as AssignedCustomer | null;
	const navigate = useNavigate();
	const [adminName] = useState(
		() => localStorage.getItem("userName") || "상담원",
	);
	const [now, setNow] = useState(new Date());
	const [memo, setMemo] = useState("");
	const [showGuide, setShowGuide] = useState(false);

	const [activities] = useState<ConsultationLog[]>([
		{
			consultation_id: "102938",
			customer_name: "김철수",
			mask_phone: "010-****-5678",
			channel_code: "CALL",
			status_code: "DONE",
			priority_code: "HIGH",
			category_display: "요금문의",
			issue_display: "결합 할인 미적용",
			summary_preview:
				"5G 가족 결합 할인 누락 건 확인하여 소급 적용 안내 완료.",
			started_at: "2026-02-19T10:42:00",
			parent_consultation_id: "102900",
		},
		{
			consultation_id: "102939",
			customer_name: "고길동",
			mask_phone: "010-****-4000",
			channel_code: "CHAT",
			status_code: "IN_PROGRESS",
			priority_code: "MID",
			category_display: "기기변경",
			issue_display: "단말기 파손 보상",
			summary_preview: "보험 가입 여부 확인 후 보상 절차 정보 전송 중.",
			started_at: "2026-02-19T10:15:00",
			parent_consultation_id: null,
		},
		{
			consultation_id: "102940",
			customer_name: "이영희",
			mask_phone: "010-****-1234",
			channel_code: "CALL",
			status_code: "DONE",
			priority_code: "LOW",
			category_display: "로밍",
			issue_display: "데이터 로밍 차단",
			summary_preview: "해외 출국 전 데이터 자동 차단 서비스 설정 도와드림.",
			started_at: "2026-02-19T09:30:00",
			parent_consultation_id: null,
		},
	]);

	const handleNavigateToDetail = useCallback(
		(id: string) => {
			navigate(`/consultation/${id}`);
		},
		[navigate],
	);

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<div className={styles.logoArea}>
						<span className={styles.brandLogo}>
							LG U<span className={styles.magentaText}>+</span>
						</span>
					</div>
					<div className={styles.headerRight}>
						<div className={styles.dateTimeDesktop}>
							{now.toLocaleDateString("ko-KR", {
								month: "long",
								day: "numeric",
								weekday: "short",
							})}{" "}
							{now.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
						<button
							type="button"
							className={styles.iconButton}
							aria-label="알림"
						>
							<Bell size={22} color="#1A1A1A" strokeWidth={2.5} />
							<span className={styles.notificationBadge}></span>
						</button>
						<div className={styles.profileChip}>
							<div className={styles.avatarMini}>
								<User size={16} color="white" />
							</div>
							<span className={styles.userNameText}>{adminName}님</span>
						</div>
						<button
							type="button"
							className={styles.logoutBtn}
							onClick={() => navigate("/")}
							aria-label="로그아웃"
						>
							<LogOut size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className={styles.mainContent}>
				<div className={styles.dashboardGrid}>
					<div className={styles.mainContentLeft}>
						{/* 🚨 실시간 긴급 알림 바 */}
						<div className={styles.alertBanner}>
							<div className={styles.alertLevelBadge.CRITICAL}>
								<AlertTriangle size={14} /> CRITICAL
							</div>
							<p className={styles.alertText}>
								[긴급 이슈] 현재 서울 지역 IPTV 접속 장애 문의가 평소 대비 250%
								급증하고 있습니다.
							</p>
							<button
								type="button"
								className={styles.alertLinkBtn}
								onClick={() => setShowGuide(true)}
							>
								가이드 보기
							</button>
						</div>

						<section className={styles.heroCard}>
							<div className={styles.heroInfo}>
								<h2 className={styles.heroTitle}>
									반갑습니다, {adminName}님! 👋
								</h2>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
										marginTop: "4px",
									}}
								>
									{status === "AVAILABLE" ? (
										<Activity size={16} className={styles.magentaText} />
									) : (
										<Clock size={16} color="#999" />
									)}
									<span style={{ fontSize: "14px", fontWeight: 600 }}>
										{status === "AVAILABLE" ? "상담 대기 중" : "업무 정지 중"}
									</span>
								</div>
							</div>
							<button
								type="button"
								className={
									status === "AVAILABLE"
										? styles.workStopBtn
										: styles.workStartBtn
								}
								onClick={toggleWorkStatus}
							>
								{status === "AVAILABLE" ? "업무 잠시 멈춤" : "업무 시작하기"}
							</button>
						</section>

						<div className={styles.statsGrid}>
							{[
								{
									id: "stat-waiting",
									label: "실시간 대기",
									value: `${waitingCount}명`,
									icon: <Users size={20} />,
									bg: "#FFF0F6",
									color: "#E6007E",
								},
								{
									id: "stat-done",
									label: "오늘 완료",
									value: "12건",
									icon: <CheckCircle2 size={20} />,
									bg: "#F0FDF4",
									color: "#22C55E",
								},
								{
									id: "stat-total",
									label: "총 상담 건수",
									value: "154건",
									icon: <FileText size={20} />,
									bg: "#E6F0FF",
									color: "#007AFF",
								},
							].map((stat) => (
								<div key={stat.id} className={styles.statCard}>
									<div
										className={styles.statIcon}
										style={{ background: stat.bg, color: stat.color }}
									>
										{stat.icon}
									</div>
									<div>
										<span className={styles.statLabel}>{stat.label}</span>
										<div className={styles.statValue}>{stat.value}</div>
									</div>
								</div>
							))}
						</div>

						{/* ✅ 처리 결과 표시가 추가된 상담 목록 섹션 */}
						<section className={styles.glassCard}>
							<div className={styles.cardHeader}>
								<h3 className={styles.cardTitle}>최근 상담 내역</h3>
								<button
									type="button"
									onClick={() => navigate("/search")}
									style={{
										color: "#E6007E",
										background: "none",
										border: "none",
										fontWeight: 700,
										cursor: "pointer",
									}}
								>
									전체보기
								</button>
							</div>
							<div className={styles.activityList}>
								{activities.map((log) => (
									<button
										key={log.consultation_id}
										type="button"
										className={styles.activityItem}
										onClick={() => handleNavigateToDetail(log.consultation_id)}
									>
										<div className={styles.timeTag}>
											{log.channel_code === "CALL" ? (
												<Phone size={18} />
											) : (
												<MessageSquare size={18} />
											)}
										</div>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												flex: 1,
												marginLeft: "12px",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "8px",
													marginBottom: "6px",
												}}
											>
												<span className={styles.customerName}>
													{log.customer_name} 고객님
												</span>
												<span
													className={styles.priorityBadge[log.priority_code]}
												>
													{log.priority_code}
												</span>
											</div>
											<div
												style={{
													fontSize: "13px",
													color: "#E6007E",
													fontWeight: 700,
													marginBottom: "4px",
												}}
											>
												{log.category_display} {">"} {log.issue_display}
											</div>
											<div
												style={{
													fontSize: "14px",
													color: "#555",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{log.summary_preview}
											</div>
										</div>
										{/* ✅ 처리 결과 배지 영역 */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "12px",
												marginLeft: "16px",
											}}
										>
											<div className={styles.statusBadge[log.status_code]}>
												{log.status_code === "DONE" ? (
													<CheckCircle2 size={12} />
												) : (
													<Clock size={12} />
												)}
												{log.status_code === "DONE" ? "처리완료" : "상담중"}
											</div>
											<ChevronRight size={18} className={styles.arrowIcon} />
										</div>
									</button>
								))}
							</div>
						</section>
					</div>

					<aside className={styles.mainContentRight}>
						<section className={styles.glassCard}>
							<div className={styles.cardHeader}>
								<h3 className={styles.cardTitle}>
									<Edit3 size={18} color="#E6007E" /> 나의 메모
								</h3>
							</div>
							<textarea
								className={styles.memoArea}
								value={memo}
								onChange={(e) => setMemo(e.target.value)}
								placeholder="상담 키워드를 메모하세요..."
							/>
						</section>
						<section className={styles.glassCard}>
							<h3 className={styles.cardTitle}>
								<Hash size={18} color="#007AFF" /> 실시간 키워드
							</h3>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "8px",
									marginTop: "16px",
								}}
							>
								{[
									"5G 요금제",
									"결합할인",
									"유심교체",
									"해외로밍",
									"멤버십",
								].map((tag) => (
									<span key={tag} className={styles.categoryTag}>
										#{tag}
									</span>
								))}
							</div>
						</section>
						<section className={styles.glassCard}>
							<div className={styles.cardHeader}>
								<h3 className={styles.cardTitle}>
									<Megaphone size={18} color="#E6007E" /> 공지사항
								</h3>
							</div>
							<div className={styles.noticeList}>
								{NOTICES.map((notice) => (
									<div key={notice.id} className={styles.noticeItem}>
										<span className={styles.noticeTitle}>{notice.title}</span>
										<span className={styles.noticeDate}>{notice.date}</span>
									</div>
								))}
							</div>
						</section>
					</aside>
				</div>
			</main>

			{/* ✅ 장애 대응 가이드 모달 */}
			{showGuide && (
				<div className={styles.modalOverlay}>
					<div className={styles.premiumModal} style={{ maxWidth: "600px" }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<div className={styles.aiGlowBadge}>KNOWLEDGE BASE #1029</div>
							<button
								type="button"
								onClick={() => setShowGuide(false)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
								}}
							>
								<X size={24} color="#999" />
							</button>
						</div>
						<h2 className={styles.modalHeading}>
							서울 지역 IPTV 접속 장애 가이드
						</h2>
						<div className={styles.aiGuideBox} style={{ marginBottom: "20px" }}>
							<p className={styles.aiGuideText}>
								[긴급] 현재 강남/서초 지역 L2 스위치 과부하로 인한 인증 지연
								현상 발생 중.
							</p>
						</div>
						<button
							type="button"
							className={styles.primaryBtn}
							style={{ marginTop: "30px", width: "100%" }}
							onClick={() => setShowGuide(false)}
						>
							내용 확인 완료
						</button>
					</div>
				</div>
			)}

			{/* 새 상담 배정 모달 */}
			{customer && (
				<div className={styles.modalOverlay}>
					<div className={styles.premiumModal}>
						<div className={styles.aiGlowBadge}>NEW</div>
						<h2 className={styles.modalHeading}>새로운 상담 배정</h2>
						<div className={styles.modalCustomerCard}>
							<span className={styles.modalCustomerName}>
								{customer.name} 고객님
							</span>
							<div className={styles.aiGuideBox}>
								<p className={styles.aiGuideText}>
									{customer.recentHistory || "내용을 불러오는 중입니다..."}
								</p>
							</div>
						</div>
						<div className={styles.modalActions}>
							<button
								type="button"
								className={styles.primaryBtn}
								onClick={() => handleNavigateToDetail(customer.id)}
							>
								상담 시작
							</button>
							<button
								type="button"
								className={styles.secondaryBtn}
								onClick={() => setAssignedCustomer(null)}
							>
								나중에 하기
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
