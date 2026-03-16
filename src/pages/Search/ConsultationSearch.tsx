import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,  
    ChevronsRight,
    ClipboardList,
    Clock,
    Download,
    ExternalLink,
    Filter,
    MessageCircle,
    RefreshCcw,
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

    // 📄페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const pagesPerBlock = 5; // 한 번에 보여줄 페이지 번호 개수

    /**  데이터 로드 로직 */
    const loadSearchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response: SearchApiResponse = await fetchSearchList(activeFilter === "MINE" ? "MY" : "ALL");
            
            const currentAgentName = localStorage.getItem("userName") || "상담원";
            const currentAgentId = Number(localStorage.getItem("userId") || 0); 
            
            const apiList: ApiConsultationItem[] = response && Array.isArray(response.data) ? response.data : [];

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

            const uniqueResults = Array.from(new Map(convertedApi.map(item => [item.id, item])).values());
            setAllResults(uniqueResults);
            setCurrentPage(1); // 데이터 로드시 페이지 리셋

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

    /** 필터링 로직 */
    const filteredResults = useMemo(() => {
        if (allResults.length === 0) return [];

        return allResults.filter((res) => {
            const term = searchTerm.trim().toLowerCase();
            const matchSearch = !term || 
                (res.customer || "").toLowerCase().includes(term) || 
                (res.id || "").includes(term) || 
                (res.summary || "").toLowerCase().includes(term);

            let matchDate = true;
            if (searchDate) {
                const targetDate = searchDate.replace(/-/g, ".");
                matchDate = (res.date || "").includes(targetDate);
            }

            let matchTab = true;
            if (activeFilter === "MINE") matchTab = res.is_mine;
            else if (activeFilter === "PENDING") matchTab = res.process_status === "PENDING";
            else if (activeFilter === "REPEAT") matchTab = res.process_status === "TRANSFERRED";

            return matchSearch && matchDate && matchTab;
        });
    }, [searchTerm, activeFilter, allResults, searchDate]);

    // 현재 페이지에 해당하는 아이템 계산
    const currentItems = useMemo(() => {
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredResults.slice(firstIndex, lastIndex);
    }, [filteredResults, currentPage]);

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    /**  현재 블록의 페이지 번호들 계산 (5개씩) */
    const currentBlockPages = useMemo(() => {
        const currentBlock = Math.ceil(currentPage / pagesPerBlock);
        const startPage = (currentBlock - 1) * pagesPerBlock + 1;
        const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            try { dateInputRef.current.showPicker(); } catch { dateInputRef.current.focus(); }
        }
    };

    const handlePageChange = (page: number) => {
        const targetPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(targetPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    { label: "부서 이관", value: "REPEAT", icon: <ExternalLink size={16} /> },
                    { label: "기록 대기중", value: "PENDING", icon: <ClipboardList size={16} /> },
                ].map((btn) => (
                    <button
                        key={btn.value}
                        type="button"
                        onClick={() => { setActiveFilter(btn.value); setCurrentPage(1); }}
                        style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "16px",
                            fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                            border: activeFilter === btn.value ? `2px solid #E6007E` : "2px solid #EEE",
                            backgroundColor: activeFilter === btn.value ? "#E6007E" : "#FFF",
                            color: activeFilter === btn.value ? "#FFF" : "#666",
                            boxShadow: activeFilter === btn.value ? "0 4px 12px rgba(230, 0, 126, 0.2)" : "none",
                        }}
                    >
                        {btn.icon} {btn.label}
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
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                                onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }}
                                style={{ color: "#1A1A1A", fontWeight: 800, fontFamily: "inherit", cursor: 'pointer' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => { setSearchTerm(""); setSearchDate(""); setActiveFilter("ALL"); setCurrentPage(1); }}
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
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>상담 ID</th>
                                        <th>고객명</th>
                                        <th>상담 카테고리</th>
                                        <th>문의 내용</th>
                                        <th>담당자</th>
                                        <th>처리 상태</th>
                                        <th>상세</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((res) => (
                                            <tr key={res.id} className={styles.tableRow} onClick={() => navigate(`/history/${res.id}`)}>
                                                <td style={{ color: "#888", fontSize: "13px" }}>#{res.id}</td>
                                                <td><span style={{ fontWeight: 800, fontSize: "15px", color: "#1A1A1A" }}>{res.customer}</span></td>
                                                <td>{res.category}</td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <MessageCircle size={14} color="#007AFF" />
                                                        <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{res.summary}</span>
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
                                                        display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 800,
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
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* 개선된 페이지네이션  */}
                            {totalPages > 1 && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginTop: "32px", paddingBottom: "40px" }}>
                                    
                                    {/* 첫 블록이 아닐 때만 노출하거나 비활성화 처리 (5페이지 앞) */}
                                    <button 
                                        disabled={currentPage <= pagesPerBlock}
                                        onClick={() => handlePageChange(currentPage - pagesPerBlock)}
                                        style={paginationArrowStyle(currentPage <= pagesPerBlock)}
                                    >
                                        <ChevronsLeft size={18} />
                                    </button>

                                    {/* 이전 페이지 */}
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        style={paginationArrowStyle(currentPage === 1)}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    
                                    {/* 숫자 페이지 (5개씩) */}
                                    <div style={{ display: "flex", gap: "4px", margin: "0 8px" }}>
                                        {currentBlockPages.map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => handlePageChange(num)}
                                                style={{
                                                    width: "36px", height: "36px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700,
                                                    backgroundColor: currentPage === num ? "#E6007E" : "transparent",
                                                    color: currentPage === num ? "#FFF" : "#666",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 다음 페이지 */}
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        style={paginationArrowStyle(currentPage === totalPages)}
                                    >
                                        <ChevronRight size={18} />
                                    </button>

                                    {/* 다음 블록 (5페이지 뒤) */}
                                    <button 
                                        disabled={Math.ceil(currentPage / pagesPerBlock) === Math.ceil(totalPages / pagesPerBlock)}
                                        onClick={() => handlePageChange(currentPage + pagesPerBlock)}
                                        style={paginationArrowStyle(Math.ceil(currentPage / pagesPerBlock) === Math.ceil(totalPages / pagesPerBlock))}
                                    >
                                        <ChevronsRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

/** 페이지네이션 화살표 공통 스타일 */
const paginationArrowStyle = (isDisabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #EEE",
    background: "#FFF",
    padding: "8px",
    borderRadius: "8px",
    cursor: isDisabled ? "default" : "pointer",
    opacity: isDisabled ? 0.3 : 1,
    color: "#666",
    transition: "all 0.2s"
});

export default ConsultationSearch;