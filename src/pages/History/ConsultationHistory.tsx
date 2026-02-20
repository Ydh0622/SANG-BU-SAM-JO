import {
	ArrowLeft,
	Calendar,
	Clock,
	Download,
	Eye,
	FileText,
	History,
	MessageCircle,
	User,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as styles from "./Style/HistoryDetail.css.ts";

/** ✅ 1. ERD 명세 기반 타입 정의 */
interface Message {
	id: number;
	sender_type_code: "CUSTOMER" | "AGENT" | "SYSTEM";
	content: string;
	sent_at: string;
}

interface HistoryData {
	consultation_id: string;
	started_at: string; // 상담 시작 시각
	ended_at: string; // 상담 종료 시각
	duration: string; // 소요 시간 (계산된 값)
	customer_name: string;
	mask_phone: string;
	category_display: string;
	agent_name: string;
	customer_request: string;
	agent_action: string;
	summary_text: string;
	messages: Message[];
	version_count: number;
}

const MOCK_HISTORY_DB: Record<string, HistoryData> = {
	LOG_001: {
		consultation_id: "102938",
		started_at: "2026.02.11 10:42",
		ended_at: "10:55",
		duration: "13분",
		customer_name: "김철수",
		mask_phone: "010-****-5678",
		category_display: "요금제 변경",
		agent_name: "나상담",
		customer_request: "요금제 부담으로 인한 혜택 강화 상품 문의",
		agent_action: "5G 시그니처 요금제 및 결합 할인 안내 후 변경 접수",
		summary_text: "5G 시그니처 요금제 변경 및 가족 결합 할인 혜택 안내 완료.",
		version_count: 1,
		messages: [
			{
				id: 1,
				sender_type_code: "CUSTOMER",
				content: "요금제가 너무 비싼 것 같은데 혜택이 더 좋은 게 있나요?",
				sent_at: "10:42",
			},
			{
				id: 2,
				sender_type_code: "AGENT",
				content:
					"안녕하세요 김철수 고객님! 5G 시그니처로 옮기시면 결합 할인이 커져서 유리합니다.",
				sent_at: "10:45",
			},
		],
	},
};

const ConsultationHistory: React.FC = () => {
	const { historyId } = useParams<{ historyId: string }>();
	const navigate = useNavigate();
	const [isPhoneVisible, setIsPhoneVisible] = useState(false);

	const historyData = useMemo<HistoryData>(() => {
		return MOCK_HISTORY_DB[historyId || ""] || MOCK_HISTORY_DB["LOG_001"];
	}, [historyId]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<button
						type="button"
						className={styles.backButton}
						onClick={() => navigate(-1)}
						aria-label="뒤로 가기"
					>
						<ArrowLeft size={24} color="#333" />
					</button>
					<h1 className={styles.title}>
						상담 기록 상세조회
						<span
							style={{
								marginLeft: "12px",
								color: "#888",
								fontWeight: 500,
								fontSize: "14px",
							}}
						>
							ID: {historyData.consultation_id}
						</span>
					</h1>
				</div>
				<div style={{ display: "flex", gap: "8px" }}>
					{historyData.version_count > 0 && (
						<button
							type="button"
							className={styles.downloadBtn}
							style={{ backgroundColor: "#f3f4f6", color: "#666" }}
						>
							<History size={16} /> 수정 이력 ({historyData.version_count})
						</button>
					)}
					<button type="button" className={styles.downloadBtn}>
						<Download size={18} /> 기록 PDF 저장
					</button>
				</div>
			</header>

			<div className={styles.mainLayout}>
				<aside className={styles.sideSection}>
					<article className={styles.card}>
						<h3 className={styles.cardTitle}>
							<User size={18} /> 고객 및 상담 정보
						</h3>
						<div className={styles.infoList}>
							<div className={styles.infoItem}>
								<strong>
									<Calendar size={14} /> 상담일자
								</strong>
								<span>{historyData.started_at.split(" ")[0]}</span>
							</div>
							<div className={styles.infoItem}>
								<strong>
									{/* ✅ Clock 아이콘 사용: 상담 소요 시간 강조 */}
									<Clock size={14} /> 상담시간
								</strong>
								<span>
									{historyData.started_at.split(" ")[1]} ~{" "}
									{historyData.ended_at} ({historyData.duration})
								</span>
							</div>
							<div className={styles.infoItem}>
								<strong>고객명</strong>
								<span>{historyData.customer_name}</span>
							</div>
							<div className={styles.infoItem}>
								<strong>연락처</strong>
								<div
									style={{ display: "flex", alignItems: "center", gap: "4px" }}
								>
									<span>
										{isPhoneVisible ? "010-1234-5678" : historyData.mask_phone}
									</span>
									<button
										type="button"
										onClick={() => setIsPhoneVisible(!isPhoneVisible)}
										aria-label="번호 보기"
									>
										<Eye size={14} color="#E6007E" />
									</button>
								</div>
							</div>
						</div>
					</article>

					<article className={styles.card}>
						<h3 className={styles.cardTitle}>
							<FileText size={18} /> 상담 기록 요약
						</h3>
						<div
							style={{ display: "flex", flexDirection: "column", gap: "12px" }}
						>
							<div>
								<h4
									style={{
										fontSize: "12px",
										color: "#888",
										marginBottom: "4px",
									}}
								>
									고객 요청
								</h4>
								<p style={{ fontSize: "14px" }}>
									{historyData.customer_request}
								</p>
							</div>
							<div>
								<h4
									style={{
										fontSize: "12px",
										color: "#888",
										marginBottom: "4px",
									}}
								>
									상담사 조치
								</h4>
								<p style={{ fontSize: "14px" }}>{historyData.agent_action}</p>
							</div>
							<div
								style={{
									backgroundColor: "#fff0f6",
									padding: "12px",
									borderRadius: "10px",
								}}
							>
								<h4
									style={{
										fontSize: "12px",
										color: "#E6007E",
										fontWeight: 800,
										marginBottom: "4px",
									}}
								>
									최종 요약
								</h4>
								<p style={{ fontSize: "14px", fontWeight: 500 }}>
									{historyData.summary_text}
								</p>
							</div>
						</div>
					</article>
				</aside>

				<section className={styles.chatSection}>
					<div className={styles.chatHeader}>
						<MessageCircle size={18} color="#666" /> 전체 대화 기록
					</div>
					<div className={styles.messageList} role="log">
						{historyData.messages.map((msg) => (
							<div
								key={msg.id}
								className={
									msg.sender_type_code === "CUSTOMER"
										? styles.customerMsg
										: styles.agentMsg
								}
							>
								<div className={styles.bubble}>{msg.content}</div>
								<time className={styles.msgTime}>{msg.sent_at}</time>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default ConsultationHistory;
