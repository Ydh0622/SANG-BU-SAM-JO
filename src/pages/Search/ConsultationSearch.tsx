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
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { fetchSearchList } from "../../api/services/search";
import type { ApiConsultationItem, SearchApiResponse } from "../../api/services/search";
import * as styles from "./Style/Search.css.ts";

/** 검색 결과 인터페이스*/
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

const ConsultationSearch: React.FC = () => {
    const navigate = useNavigate();
    const dateInputRef = useRef<HTMLInputElement>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("ALL");
    const [searchDate, setSearchDate] = useState(""); 
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /** 💡 데이터 로드 로직 */
    const loadSearchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response: SearchApiResponse = await fetchSearchList(activeFilter === "MINE" ? "MY" : "ALL");
            
            //  API 서버에서 응답받은 직후의 전체 데이터 구조 확인
            console.log("1. API 전체 응답(Raw):", response);

            const currentAgentName = localStorage.getItem("userName") || "상담원";
            const currentAgentId = Number(localStorage.getItem("userId") || 0); 
            
            const apiList = response && Array.isArray(response.data) ? response.data : [];

            //  map을 돌리기 전, 실제 리스트 배열이 제대로 뽑혔는지 확인
            console.log("2. 추출된 apiList (배열여부):", Array.isArray(apiList), "개수:", apiList.length);

            const convertedApi: SearchResult[] = apiList.map((item: ApiConsultationItem) => {
                const rawDate = item.endedAt || item.startedAt || new Date().toISOString();
                const dateObj = new Date(rawDate);
                const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                return {
                    id: String(item.consultationId),
                    date: formattedDate,
                    customer: item.customerName || "이름 없음",
                    category: item.consultationCategory || "일반상담",
                    summary: item.summaryText || "상담 기록이 없습니다.",
                    agent: Number(item.agentId) === currentAgentId ? currentAgentName : (item.agentId ? `상담원 #${item.agentId}` : "미지정"),
                    is_mine: Number(item.agentId) === currentAgentId, 
                    is_repeat: false, 
                    process_status: item.statusCode === "DONE" ? "COMPLETED" : 
                                    item.statusCode === "IN_PROGRESS" ? "PENDING" : "TRANSFERRED"
                };
            });

          
            console.log("3. 변환 완료된 SearchResult 리스트:", convertedApi);

            const uniqueResults = Array.from(new Map(convertedApi.map(item => [item.id, item])).values());
            setAllResults(uniqueResults);

        } catch (error) {
            console.error("상담 내역 로드 실패:", error);
            setAllResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => {
        loadSearchData();
    }, [loadSearchData]);

    /**  필터링 로직 수정 (데이터 노출 보장) */
    const filteredResults = useMemo(() => {
        if (allResults.length === 0) return [];

        return allResults.filter((res) => {
            const term = searchTerm.trim().toLowerCase();

            // 1. 검색어 필터: 비어있으면 통과(!term), 있으면 포함 여부 확인
            const matchSearch = !term || 
                (res.customer || "").toLowerCase().includes(term) || 
                (res.id || "").includes(term) || 
                (res.summary || "").toLowerCase().includes(term);

            // 2. 날짜 필터: 선택 안했으면 통과(!searchDate), 형식을 맞춰서 비교
            let matchDate = true;
            if (searchDate) {
                const targetDate = searchDate.replace(/-/g, ".");
                matchDate = (res.date || "").includes(targetDate);
            }

            // 3. 탭 필터
            let matchTab = true;
            if (activeFilter === "MINE") matchTab = res.is_mine;
            else if (activeFilter === "PENDING") matchTab = res.process_status === "PENDING";
            else if (activeFilter === "REPEAT") matchTab = res.is_repeat;

            return matchSearch && matchDate && matchTab;
        });
    }, [searchTerm, activeFilter, allResults, searchDate]);

    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            try { dateInputRef.current.showPicker(); } catch { dateInputRef.current.focus(); }
        }
    };

    
    const handleRowClick = (id: string) => {
        navigate(`/history/${id}`);
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
                        <button type="button" className={styles.searchBtn} onClick={loadSearchData}>검색하기</button>
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
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "#E6007E", fontWeight: 700 }}>데이터를 불러오는 중입니다...</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>상담 ID</th>
                                    <th>고객명</th>
                                    <th>상담 카테고리</th>
                                    <th>상세 내용</th>
                                    <th>담당자</th>
                                    <th>처리 상태</th>
                                    <th>상세</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((res) => (
                                        <tr key={res.id} className={styles.tableRow} onClick={() => handleRowClick(res.id)}>
                                            <td style={{ color: "#888", fontSize: "13px" }}>#{res.id}</td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span style={{ fontWeight: 800, fontSize: "15px", color: "#1A1A1A" }}>{res.customer}</span>
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "100px 0", color: "#999" }}>
                                            <Search size={48} style={{ opacity: 0.1, marginBottom: "16px" }} />
                                            <p style={{ fontSize: '16px', fontWeight: 600 }}>검색 결과가 없습니다.</p>
                                            <p style={{ fontSize: '14px', marginTop: '4px' }}>(로드된 원본: {allResults.length}건)</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ConsultationSearch;