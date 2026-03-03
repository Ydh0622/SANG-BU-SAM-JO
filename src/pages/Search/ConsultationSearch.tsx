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
import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./Style/Search.css.ts";

/** 검색 결과 인터페이스 */
interface SearchResult {
    id: string;
    date: string;
    customer: string;
    category: string;
    summary: string;
    agent: string;
    is_mine: boolean; 
    is_repeat: boolean;
    process_status: "COMPLETED" | "PENDING" | "TRANSFERRED";
}

/** 로컬 스토리지에서 넘어오는 데이터 타입 정의 */
interface LocalHistoryItem {
    consultation_id: string;
    customer_name: string;
    category: string;
    content_preview?: string;
    summary?: string;
    status: string;
    created_at?: string;
}

const MOCK_RESULTS: SearchResult[] = [];

const ConsultationSearch: React.FC = () => {
    const navigate = useNavigate();
    const dateInputRef = useRef<HTMLInputElement>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("ALL");
    const [searchDate, setSearchDate] = useState(""); 
    
    const [allResults] = useState<SearchResult[]>(() => {
        const localHistoryRaw = localStorage.getItem("consultationHistory");
        const localHistory: LocalHistoryItem[] = localHistoryRaw ? JSON.parse(localHistoryRaw) : [];
        const currentAgentName = localStorage.getItem("userName") || "상담원";

        const convertedLocal: SearchResult[] = localHistory.map((item) => ({
            id: item.consultation_id,
            date: new Date(item.created_at || Date.now()).toLocaleDateString(),
            customer: item.customer_name,
            category: item.category,
            summary: item.content_preview || item.summary || "상담 내용 요약 없음",
            agent: currentAgentName,
            is_mine: true,
            is_repeat: false,
            process_status: item.status === "DONE" ? "COMPLETED" : "PENDING"
        }));

        return [...convertedLocal, ...MOCK_RESULTS];
    });

    const filteredResults = useMemo(() => {
        return allResults.filter((res) => {
            const matchSearch =
                res.customer.includes(searchTerm) || 
                res.id.includes(searchTerm) || 
                res.summary.includes(searchTerm);

            const matchDate = searchDate ? res.date.includes(searchDate.replace(/-/g, ".")) : true;

            if (activeFilter === "MINE") return matchSearch && matchDate && res.is_mine;
            if (activeFilter === "REPEAT") return matchSearch && matchDate && res.is_repeat;
            if (activeFilter === "PENDING")
                return matchSearch && matchDate && res.process_status === "PENDING";

            return matchSearch && matchDate;
        });
    }, [searchTerm, activeFilter, allResults, searchDate]);

    // [수정] catch 문에서 (error) 대신 ()를 사용하여 'never used' 경고 해결
    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker();
            } catch {
                // error 변수를 선언하지 않음으로써 경고 제거
                dateInputRef.current.focus();
            }
        }
    };

    const handleRowClick = (id: string) => {
        if (id.startsWith("LOG_")) {
            navigate(`/history/${id}`);
        } else {
            navigate(`/consultation/${id}`);
        }
    };

    return (
        <div className={styles.container}>
            <header style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <button type="button" onClick={() => navigate("/dashboard")} className={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
                    통합 상담 내역 관리
                </h1>
            </header>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[
                    { label: "전체 내역", value: "ALL", icon: <Filter size={16} /> },
                    { label: "나의 상담", value: "MINE", icon: <UserCheck size={16} /> },
                    { label: "재상담(집중관리)", value: "REPEAT", icon: <RotateCcw size={16} /> },
                    { label: "기록 대기중", value: "PENDING", icon: <ClipboardList size={16} /> },
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
                            border: activeFilter === btn.value ? `2px solid #E6007E` : "2px solid #EEE",
                            backgroundColor: activeFilter === btn.value ? "#E6007E" : "#FFF",
                            color: activeFilter === btn.value ? "#FFF" : "#666",
                            boxShadow: activeFilter === btn.value ? "0 4px 12px rgba(230, 0, 126, 0.2)" : "none",
                        }}
                    >
                        {btn.icon}
                        {btn.label}
                    </button>
                ))}
            </div>

            <section className={styles.filterSection}>
                <div className={styles.filterGrid}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="search-keyword">고객명 / 상담 ID / 요약내용</label>
                        <div className={styles.inputWrapper}>
                            <Search size={16} color="#888" />
                            <input
                                id="search-keyword"
                                type="text"
                                className={styles.input}
                                placeholder="검색어 입력..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ color: "#1A1A1A", fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="search-date">조회 기간</label>
                        <div className={styles.inputWrapper} onClick={handleCalendarClick} style={{ cursor: 'pointer' }}>
                            <Calendar size={16} color="#888" />
                            <input 
                                ref={dateInputRef}
                                id="search-date" 
                                type="date" 
                                className={styles.input} 
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                style={{ color: "#1A1A1A", fontWeight: 800, fontFamily: "inherit", cursor: 'pointer' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => {
                                setSearchTerm("");
                                setSearchDate("");
                                setActiveFilter("ALL");
                            }}
                        >
                            <RefreshCcw size={16} /> 초기화
                        </button>
                        <button type="button" className={styles.searchBtn}>검색하기</button>
                    </div>
                </div>
            </section>

            <section className={styles.resultSection}>
                <div className={styles.resultHeader}>
                    <span>검색 결과 <strong>{filteredResults.length}</strong> 건</span>
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
                                <tr key={res.id} className={styles.tableRow} onClick={() => handleRowClick(res.id)}>
                                    <td style={{ color: "#888", fontSize: "13px" }}>#{res.id}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontWeight: 800, fontSize: "15px", color: "#1A1A1A" }}>{res.customer}</span>
                                            {res.is_repeat && (
                                                <span style={{ padding: "2px 8px", fontSize: "11px", backgroundColor: "#FFF0F6", color: "#E6007E", borderRadius: "4px", border: "1px solid #E6007E", fontWeight: 800 }}>
                                                    재상담
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{res.category}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <MessageCircle size={14} color="#007AFF" />
                                            <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {res.summary}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <User size={14} color={res.is_mine ? "#E6007E" : "#999"} />
                                            <span style={{ fontWeight: res.is_mine ? 800 : 400 }}>{res.agent}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "100px",
                                            fontSize: "12px",
                                            fontWeight: 800,
                                            backgroundColor: res.process_status === "COMPLETED" ? "#DCFCE7" : res.process_status === "PENDING" ? "#FEF3C7" : "#F3F4F6",
                                            color: res.process_status === "COMPLETED" ? "#15803D" : res.process_status === "PENDING" ? "#B45309" : "#4B5563",
                                        }}>
                                            {res.process_status === "COMPLETED" ? <CheckCircle size={14} /> : res.process_status === "PENDING" ? <Clock size={14} /> : <ExternalLink size={14} />}
                                            {res.process_status === "COMPLETED" ? "처리 완료" : res.process_status === "PENDING" ? "기록 대기" : "부서 이관"}
                                        </div>
                                    </td>
                                    <td><ChevronRight size={18} color="#CCC" /></td>
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