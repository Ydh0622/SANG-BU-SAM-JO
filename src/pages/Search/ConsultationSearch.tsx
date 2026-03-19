import {
    ArrowLeft, Calendar, CheckCircle, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, Clock, Download, ExternalLink,
    Filter, MessageCircle, RefreshCcw, Search, User, UserCheck,
} from "lucide-react";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { searchConsultations } from "../../api/services/search";
import type { ConsultationSearchHit, ConsultationSearchRequest, ConsultationSearchResponse } from "../../api/services/search";
import * as styles from "./Style/Search.css.ts";

/** UI 표시용 검색 결과 인터페이스 */
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
    
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeFilter, setActiveFilter] = useState<string>("ALL");
    const [searchDate, setSearchDate] = useState<string>("");
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const pagesPerBlock = 5;

    /** 데이터 Fetch 함수 */
    const fetchSearchData = useCallback(async (page: number, filter: string) => {
        try {
            setIsLoading(true);
            const storedId = localStorage.getItem("userId");
            const currentAgentId = storedId ? Number(storedId) : 0;
            const currentAgentName = localStorage.getItem("userName") || "상담원";

            // [수정 핵심] 값이 있는 파라미터만 조건부로 할당 (FAQ 방식과 동일하게)
            const req: ConsultationSearchRequest = {
                page: page,
                size: itemsPerPage,
            };

            if (searchTerm.trim()) req.keyword = searchTerm.trim();
            if (filter === "MINE") req.agent_id = currentAgentId;
            if (filter === "REPEAT") req.final_result_code = "TRANSFERRED";
            if (searchDate) {
                req.date_from = `${searchDate}T00:00:00`;
                req.date_to = `${searchDate}T23:59:59`;
            }

            // 수정된 search.ts (params 방식)를 통해 데이터 호출
            const response: ConsultationSearchResponse = await searchConsultations(req) || {
                hits: [],
                total: 0,
                page: page,
                size: itemsPerPage
            };
            
            const hits: ConsultationSearchHit[] = response.hits || [];

            const PRODUCT_LINE_LABEL: Record<string, string> = {
                MOBILE: "모바일", INTERNET: "인터넷", IPTV: "IPTV",
                TELEPHONE: "유선전화", ETC: "기타",
            };

            const converted: SearchResult[] = hits.map((item: ConsultationSearchHit) => {
                const rawDate = item.started_at || item.ended_at;
                const formattedDate = rawDate 
                    ? rawDate.split('T')[0].replace(/-/g, '.') 
                    : "날짜 없음";

                const isMine = item.agent_id !== null && Number(item.agent_id) === currentAgentId;
                const resultCode = item.final_result_code || "";
                
                const processStatus: SearchResult["process_status"] =
                    resultCode === "TRANSFERRED" ? "TRANSFERRED" :
                    resultCode === "DONE" ? "COMPLETED" : "PENDING";

                return {
                    id: String(item.consultation_id),
                    date: formattedDate,
                    customer: item.customer_name || (item.customer_id ? `고객 #${item.customer_id}` : "이름 없음"),
                    category: PRODUCT_LINE_LABEL[item.product_line_code || ""] || "일반상담",
                    summary: item.summary_text || "상담 기록이 없습니다.",
                    agent: isMine ? currentAgentName : (item.agent_name || (item.agent_id ? `상담원 #${item.agent_id}` : "미지정")),
                    is_mine: isMine,
                    is_repeat: resultCode === "TRANSFERRED",
                    process_status: processStatus,
                };
            });

            setAllResults(converted);
            setTotalCount(response.total || 0);
            setCurrentPage(page);

        } catch (error) {
            console.error("데이터 로드 실패:", error);
            setAllResults([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, searchDate, itemsPerPage]);

    // 필터나 조회 기간 변경 시 1페이지부터 다시 로드
    useEffect(() => {
        fetchSearchData(1, activeFilter);
    }, [activeFilter, searchDate, fetchSearchData]);

    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    const currentBlock = Math.ceil(currentPage / pagesPerBlock);
    const startPage = (currentBlock - 1) * pagesPerBlock + 1;
    const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
    const currentBlockPages = Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i);

    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            try { dateInputRef.current.showPicker(); } catch { dateInputRef.current.focus(); }
        }
    };

    const handlePageChange = (page: number) => {
        fetchSearchData(page, activeFilter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterClick = (filterValue: string) => {
        setActiveFilter(filterValue);
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
                ].map((btn) => (
                    <button
                        key={btn.value}
                        type="button"
                        onClick={() => handleFilterClick(btn.value)}
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchDate(e.target.value)}
                                style={{ color: "#1A1A1A", fontWeight: 800, fontFamily: "inherit", cursor: 'pointer' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => { setSearchTerm(""); setSearchDate(""); setActiveFilter("ALL"); }}
                        >
                            <RefreshCcw size={16} /> 초기화
                        </button>
                        <button type="button" className={styles.searchBtn} onClick={() => fetchSearchData(1, activeFilter)}>검색하기</button>
                    </div>
                </div>
            </section>

            <section className={styles.resultSection}>
                <div className={styles.resultHeader}>
                    <span>검색 결과 <strong>{totalCount}</strong> 건</span>
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
                                    {allResults.length > 0 ? (
                                        allResults.map((res: SearchResult) => (
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

                            {totalPages > 1 && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginTop: "32px", paddingBottom: "40px" }}>
                                    <button 
                                        type="button"
                                        disabled={currentPage <= pagesPerBlock}
                                        onClick={() => handlePageChange(currentPage - pagesPerBlock)}
                                        style={paginationArrowStyle(currentPage <= pagesPerBlock)}
                                    >
                                        <ChevronsLeft size={18} />
                                    </button>
                                    <button 
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        style={paginationArrowStyle(currentPage === 1)}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div style={{ display: "flex", gap: "4px", margin: "0 8px" }}>
                                        {currentBlockPages.map((num: number) => (
                                            <button
                                                key={num}
                                                type="button"
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
                                    <button 
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        style={paginationArrowStyle(currentPage === totalPages)}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                    <button 
                                        type="button"
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