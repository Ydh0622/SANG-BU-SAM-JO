import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	ChevronRight,
	ClipboardList,
	Clock,
	Download,
	ExternalLink,
	Filter,
	MessageCircle,
	RefreshCcw,
	RotateCcw,
	Search,
	User,
	UserCheck,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./Style/Search.css.ts";

/** ✅ 상담사 실무 중심의 데이터 인터페이스 정의 */
interface SearchResult {
	id: string;
	date: string;
	customer: string;
	category: string;
	summary: string;
	keywords: string[];
	agent: string;
	is_mine: boolean; // 내 상담 여부
	is_repeat: boolean; // 재상담(집중 관리) 여부
	// 실무 프로세스 상태: 처리완료, 기록대기(통화후 미작성), 이관됨
	process_status: "COMPLETED" | "PENDING" | "TRANSFERRED";
}

const MOCK_RESULTS: SearchResult[] = [
	{
		id: "102938",
		date: "2026.02.11",
		customer: "김철수",
		category: "요금제",
		summary: "5G 가족결합 할인 누락 건 소급 적용 안내",
		keywords: ["5G", "결합할인"],
		agent: "나상담",
		is_mine: true,
		is_repeat: true,
		process_status: "COMPLETED",
	},
	{
		id: "102939",
		date: "2026.02.10",
		customer: "고길동",
		category: "기기변경",
		summary: "아이폰 17 프로 사전예약 및 보상판매 문의",
		keywords: ["재고", "기변"],
		agent: "나상담",
		is_mine: true,
		is_repeat: false,
		process_status: "PENDING",
	},
	{
		id: "102940",
		date: "2026.02.09",
		customer: "이영희",
		category: "해지방어",
		summary: "인터넷 해지 방어 혜택 제안 및 부서 이관",
		keywords: ["해지", "이관"],
		agent: "홍길동",
		is_mine: false,
		is_repeat: false,
		process_status: "TRANSFERRED",
	},
];

const ConsultationSearch: React.FC = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");

	/** ✅ 상담사 전용 퀵 필터 State (전체, 내상담, 재상담, 미결재) */
	const [activeFilter, setActiveFilter] = useState<string>("ALL");

	/** ✅ 실무 로직 기반 필터링 */
	const filteredResults = useMemo(() => {
		return MOCK_RESULTS.filter((res) => {
			const matchSearch =
				res.customer.includes(searchTerm) || res.id.includes(searchTerm);

			if (activeFilter === "MINE") return matchSearch && res.is_mine;
			if (activeFilter === "REPEAT") return matchSearch && res.is_repeat;
			if (activeFilter === "PENDING")
				return matchSearch && res.process_status === "PENDING";

			return matchSearch;
		});
	}, [searchTerm, activeFilter]);

	return (
		<div className={styles.container}>
			{/* 상단 헤더 */}
			<header
				style={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
					marginBottom: "32px",
				}}
			>
				<button
					type="button"
					onClick={() => navigate("/dashboard")}
					className={styles.backButton}
				>
					<ArrowLeft size={24} color="#333" />
				</button>
				<h1
					style={{
						fontSize: "24px",
						fontWeight: 800,
						color: "#1A1A1A",
						margin: 0,
					}}
				>
					통합 상담 내역 관리
				</h1>
			</header>

			{/* 🚀 상담사 전용 퀵 필터 섹션 */}
			<div
				style={{
					display: "flex",
					gap: "12px",
					marginBottom: "24px",
					flexWrap: "wrap",
				}}
			>
				{[
					{ label: "전체 내역", value: "ALL", icon: <Filter size={16} /> },
					{ label: "나의 상담", value: "MINE", icon: <UserCheck size={16} /> },
					{
						label: "재상담(집중관리)",
						value: "REPEAT",
						icon: <RotateCcw size={16} />,
					},
					{
						label: "기록 대기중",
						value: "PENDING",
						icon: <ClipboardList size={16} />,
					},
				].map((btn) => (
					<button
						key={btn.value}
						type="button"
						onClick={() => setActiveFilter(btn.value)}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							padding: "12px 20px",
							borderRadius: "16px",
							fontSize: "14px",
							fontWeight: 700,
							cursor: "pointer",
							transition: "all 0.2s",
							border:
								activeFilter === btn.value
									? `2px solid #E6007E`
									: "2px solid #EEE",
							backgroundColor: activeFilter === btn.value ? "#E6007E" : "#FFF",
							color: activeFilter === btn.value ? "#FFF" : "#666",
							boxShadow:
								activeFilter === btn.value
									? "0 4px 12px rgba(230, 0, 126, 0.2)"
									: "none",
						}}
					>
						{btn.icon}
						{btn.label}
					</button>
				))}
			</div>

			{/* 상세 조건 검색 */}
			<section className={styles.filterSection}>
				<div className={styles.filterGrid}>
					<div className={styles.inputGroup}>
						<label htmlFor="search-keyword">고객명 / 상담 ID</label>
						<div className={styles.inputWrapper}>
							<Search size={16} color="#888" />
							<input
								id="search-keyword"
								type="text"
								className={styles.input}
								placeholder="검색어 입력..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor="search-date">조회 기간</label>
						<div className={styles.inputWrapper}>
							<Calendar size={16} color="#888" />

							<input id="search-date" type="date" className={styles.input} />
						</div>
					</div>

					<div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
						<button
							type="button"
							className={styles.resetBtn}
							onClick={() => {
								setSearchTerm("");
								setActiveFilter("ALL");
							}}
						>
							<RefreshCcw size={16} /> 초기화
						</button>
						<button type="button" className={styles.searchBtn}>
							검색하기
						</button>
					</div>
				</div>
			</section>

			{/* 결과 테이블 */}
			<section className={styles.resultSection}>
				<div className={styles.resultHeader}>
					<span>
						검색 결과 <strong>{filteredResults.length}</strong> 건
					</span>
					<button type="button" className={styles.downloadBtn}>
						<Download size={16} /> 리포트 다운로드
					</button>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>상담 ID</th>
								<th>고객명</th>
								<th>상담 카테고리</th>
								<th>AI 요약 내용</th>
								<th>담당자</th>
								<th>처리 상태</th>
								<th>상세</th>
							</tr>
						</thead>
						<tbody>
							{filteredResults.map((res) => (
								<tr
									key={res.id}
									className={styles.tableRow}
									onClick={() => navigate(`/history/${res.id}`)}
								>
									<td style={{ color: "#888", fontSize: "13px" }}>#{res.id}</td>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
											}}
										>
											<span style={{ fontWeight: 800, fontSize: "15px" }}>
												{res.customer}
											</span>
											{res.is_repeat && (
												<span
													style={{
														padding: "2px 8px",
														fontSize: "11px",
														backgroundColor: "#FFF0F6",
														color: "#E6007E",
														borderRadius: "4px",
														border: "1px solid #E6007E",
														fontWeight: 800,
													}}
												>
													재상담
												</span>
											)}
										</div>
									</td>
									<td>{res.category}</td>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "6px",
											}}
										>
											<MessageCircle size={14} color="#007AFF" />
											<span
												style={{
													maxWidth: "200px",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{res.summary}
											</span>
										</div>
									</td>
									<td>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "6px",
											}}
										>
											<User
												size={14}
												color={res.is_mine ? "#E6007E" : "#999"}
											/>
											<span style={{ fontWeight: res.is_mine ? 800 : 400 }}>
												{res.agent}
											</span>
										</div>
									</td>
									<td>
										<div
											style={{
												display: "inline-flex",
												alignItems: "center",
												gap: "6px",
												padding: "6px 12px",
												borderRadius: "100px",
												fontSize: "12px",
												fontWeight: 800,
												backgroundColor:
													res.process_status === "COMPLETED"
														? "#DCFCE7"
														: res.process_status === "PENDING"
															? "#FEF3C7"
															: "#F3F4F6",
												color:
													res.process_status === "COMPLETED"
														? "#15803D"
														: res.process_status === "PENDING"
															? "#B45309"
															: "#4B5563",
											}}
										>
											{res.process_status === "COMPLETED" ? (
												<CheckCircle size={14} />
											) : res.process_status === "PENDING" ? (
												<Clock size={14} />
											) : (
												<ExternalLink size={14} />
											)}
											{res.process_status === "COMPLETED"
												? "처리 완료"
												: res.process_status === "PENDING"
													? "기록 대기"
													: "부서 이관"}
										</div>
									</td>
									<td>
										<ChevronRight size={18} color="#CCC" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default ConsultationSearch;
