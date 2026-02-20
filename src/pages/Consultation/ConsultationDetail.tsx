import {
	Clock,
	Edit3,
	Eye,
	EyeOff,
	Mail,
	MessageSquare,
	Phone,
	Save,
	Send,
	Sparkles,
	Tag,
	User,
	Users,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConsultation } from "../../hooks/useConsultation";
import * as styles from "./Style/Consultation.css.ts";

interface ConsultationRecord {
	customer_request: string;
	agent_action: string;
	summary_text: string;
	issue_type_code: string;
	resolution_code: string;
}

const ConsultationDetail: React.FC = () => {
	const { customerId } = useParams<{ customerId: string }>();
	const navigate = useNavigate();
	const scrollRef = useRef<HTMLDivElement>(null);
	const { waitingCount } = useConsultation();

	const [isPhoneVisible, setIsPhoneVisible] = useState(false);
	const [record, setRecord] = useState<ConsultationRecord>({
		customer_request: "",
		agent_action: "",
		summary_text: "",
		issue_type_code: "BILL_INQUIRY",
		resolution_code: "DONE",
	});

	const customer = useMemo(
		() => ({
			id: customerId || "500012",
			name: "고길동 고객님",
			grade: "VIP Platinum",
			mask_phone: "010-1002-****",
			real_phone: "010-1002-4567",
			email: "gogilldong@uplus.co.kr",
			unpaid_flag: true,
		}),
		[customerId],
	);

	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: "customer",
			text: "가족 결합 할인이 왜 이번 달에 적용이 안 됐나요?",
			time: "14:20",
		},
		{
			id: 2,
			sender: "ai",
			text: "[AI 분석] 최근 요금제 변경으로 인해 결합 조건이 일시 해지된 것으로 판단됩니다.",
			time: "14:21",
			isAI: true,
		},
	]);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (scrollContainer) {
			scrollContainer.scrollTo({
				top: scrollContainer.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages.length]);

	const handleSend = useCallback(() => {
		if (!inputValue.trim()) return;
		const newMessage = {
			id: Date.now(),
			sender: "agent",
			text: inputValue,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
		setMessages((prev) => [...prev, newMessage]);
		setInputValue("");
	}, [inputValue]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<div className={styles.statusDot} />
					<h1 className={styles.title}>상담 세션: {customer.id}</h1>
					<section className={styles.timer} aria-label="상담 경과 시간">
						<Clock size={16} /> 04:12
					</section>
				</div>
				<button
					type="button"
					className={styles.exitButton}
					onClick={() => navigate("/dashboard")}
				>
					<Save size={16} style={{ marginRight: "6px" }} /> 종료 및 기록 확정
				</button>
			</header>

			<div className={styles.mainLayout}>
				{/* 왼쪽 사이드바: 고객정보 및 요약 */}
				<aside className={styles.sideSection}>
					<article className={styles.card}>
						<h3 className={styles.cardTitle}>고객 정보</h3>
						<div className={styles.avatar} style={{ margin: "0 auto 16px" }}>
							<User size={40} color="#E6007E" />
						</div>
						<div style={{ textAlign: "center", marginBottom: "16px" }}>
							<strong>{customer.name}</strong>
							<p
								style={{ color: "#E6007E", fontWeight: 800, fontSize: "12px" }}
							>
								{customer.grade}
							</p>
						</div>
						<div
							style={{ display: "flex", flexDirection: "column", gap: "8px" }}
						>
							<div className={styles.infoItem}>
								<Phone size={16} color="#666" />
								<span>
									{isPhoneVisible ? customer.real_phone : customer.mask_phone}
								</span>
								<button
									type="button"
									onClick={() => setIsPhoneVisible(!isPhoneVisible)}
									style={{ marginLeft: "auto" }}
								>
									{isPhoneVisible ? (
										<EyeOff size={14} color="#999" />
									) : (
										<Eye size={14} color="#E6007E" />
									)}
								</button>
							</div>
							<div className={styles.infoItem}>
								<Mail size={16} color="#666" />
								<span style={{ fontSize: "13px" }}>{customer.email}</span>
							</div>
						</div>
					</article>

					<article className={styles.card}>
						<h3 className={styles.cardTitle}>
							<Edit3 size={18} color="#E6007E" /> 상담 요약
						</h3>
						<textarea
							className={styles.memoArea}
							placeholder="상담 내용을 요약하세요..."
							value={record.summary_text}
							onChange={(e) =>
								setRecord({ ...record, summary_text: e.target.value })
							}
							style={{ height: "120px" }}
						/>
					</article>
				</aside>

				{/* 중앙: 채팅 영역 */}
				<section className={styles.chatSection}>
					<div className={styles.messageList} ref={scrollRef}>
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={
									msg.sender === "customer"
										? styles.customerMsg
										: msg.isAI
											? styles.aiMsg
											: styles.agentMsg
								}
							>
								<div className={styles.bubble}>{msg.text}</div>
								<time className={styles.msgTime}>{msg.time}</time>
							</div>
						))}
					</div>

					<footer className={styles.aiGuideArea}>
						<div className={styles.aiGuideHeader}>
							<Sparkles size={16} /> AI 추천 답변
						</div>
						<div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
							<button
								type="button"
								className={styles.aiSuggestBtn}
								onClick={() =>
									setInputValue(
										"가족 결합 할인 누락 건 확인하여 소급 적용 안내 완료하였습니다.",
									)
								}
							>
								<MessageSquare size={14} /> 소급 적용 안내
							</button>
							<button
								type="button"
								className={styles.aiSuggestBtn}
								onClick={() =>
									setInputValue(
										"요금제 변경으로 인한 결합 해지 사유에 대해 설명드렸습니다.",
									)
								}
							>
								<Tag size={14} /> 결합 해지 설명
							</button>
						</div>
						<div className={styles.inputArea}>
							<input
								type="text"
								className={styles.input}
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSend()}
								placeholder="메시지를 입력하세요..."
							/>
							<button
								type="button"
								className={styles.sendBtn}
								onClick={handleSend}
								aria-label="메시지 전송"
							>
								<Send size={20} />
							</button>
						</div>
					</footer>
				</section>

				{/* 오른쪽 사이드바: 대기 현황 및 키워드 */}
				<aside className={styles.sideSection}>
					<article
						className={styles.card}
						style={{ backgroundColor: "#FFF0F6" }}
					>
						<h3 className={styles.cardTitle} style={{ color: "#E6007E" }}>
							<Users size={20} /> 실시간 대기
						</h3>
						<div style={{ textAlign: "center" }}>
							<span
								style={{ fontSize: "32px", fontWeight: 900, color: "#E6007E" }}
							>
								{waitingCount}
							</span>{" "}
							명
						</div>
					</article>
					<article className={styles.card}>
						<h3 className={styles.cardTitle}>
							<Tag size={18} color="#007AFF" /> 자동 추출 키워드
						</h3>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
							{["요금제변경", "가족결합", "미납안내"].map((tag) => (
								<span
									key={tag}
									style={{
										padding: "4px 10px",
										backgroundColor: "#F0F7FF",
										color: "#007AFF",
										borderRadius: "100px",
										fontSize: "12px",
										fontWeight: 700,
									}}
								>
									#{tag}
								</span>
							))}
						</div>
					</article>
				</aside>
			</div>
		</div>
	);
};

export default ConsultationDetail;
