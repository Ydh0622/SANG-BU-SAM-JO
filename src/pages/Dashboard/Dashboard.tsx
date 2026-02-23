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
    Save,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useConsultation, type CustomerInfo } from "../../hooks/useConsultation";
import { fetchConsultations } from "../../api/services/consultation"; 
import type { ConsultationResponse } from "../../types/consultation"; 
import * as styles from "./Style/Dashboard.css.ts";

/** 로컬 스토리지 데이터 규격을 위한 인터페이스 정의 */
interface LocalConsultationHistory {
    consultation_id: string | number;
    customer_name: string;
    category: string;
    issue_detail: string;
    content_preview: string;
    status: string;
    priority: string;
    channel_type: string;
    created_at: string;
}

const NOTICES = [
    { id: 1, title: "[점검] AI 상담 요약 엔진 정기 점검 안내", date: "02.21" },
    { id: 2, title: "상담사 메모 저장 및 수정 기능 업데이트", date: "02.19" },
    { id: 3, title: "신규 상담사 업무 가이드북 최신판 배포", date: "02.15" },
];

const Dashboard: React.FC = () => {
    const {
        status: workStatus, 
        toggleWorkStatus,
        assignedCustomer,
        setAssignedCustomer,
        waitingCount,
    } = useConsultation();
    
    const navigate = useNavigate();
    const popoverRef = useRef<HTMLDivElement>(null);
    
    const [adminName] = useState(() => localStorage.getItem("userName") || "상담원");
    const [now, setNow] = useState(new Date());
    const [memo, setMemo] = useState("");
    const [showGuide, setShowGuide] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [activities, setActivities] = useState<ConsultationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "긴급장애: 서울 IPTV 수신 불량", type: "urgent", time: "방금 전", isRead: false },
        { id: 2, title: "새로운 업무 가이드가 배포되었습니다.", type: "notice", time: "2시간 전", isRead: false },
        { id: 3, title: "오전 상담 실적 통계가 집계되었습니다.", type: "report", time: "4시간 전", isRead: true },
    ]);

    /** 상담 수락 핸들러 */
    const handleAcceptConsultation = useCallback(
        (customer: CustomerInfo) => {
            localStorage.setItem("isMatched", "true");
            localStorage.setItem("lastInquiry", JSON.stringify({
                message: customer.inquiryMessage,
                customerName: customer.name,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            navigate(`/consultation/${customer.id}`);
        },
        [navigate],
    );

    /** 내역 삭제 핸들러 */
    const handleDeleteActivity = useCallback((e: React.MouseEvent, consultationId: string | number) => {
        e.stopPropagation();
        if (window.confirm("이 상담 내역을 삭제하시겠습니까?")) {
            setActivities(prev => prev.filter(item => item.consultation_id !== consultationId));
            const localHistoryRaw = localStorage.getItem("consultationHistory");
            if (localHistoryRaw) {
                const localHistory: LocalConsultationHistory[] = JSON.parse(localHistoryRaw);
                const updatedHistory = localHistory.filter(
                    (item) => item.consultation_id !== consultationId
                );
                localStorage.setItem("consultationHistory", JSON.stringify(updatedHistory));
            }
        }
    }, []);

    /** ✨ [수정된 부분] 모든 상세 내역 클릭 시 '상담 이력(대화기록)' 페이지로 이동 */
    const handleNavigateToDetail = (id: string | number) => {
        // 이미 종료된 내역이므로 채팅방(/consultation)이 아닌 이력 상세(/history)로 보냅니다.
        navigate(`/history/${id}`);
    };

    /** 실시간 배정 고객 데이터 동기화 */
    useEffect(() => {
        if (assignedCustomer) {
            const storedCustomer = localStorage.getItem("currentCustomer");
            if (storedCustomer) {
                const customerData = JSON.parse(storedCustomer);
                if (customerData.name && assignedCustomer.name !== customerData.name) {
                    setAssignedCustomer({
                        ...assignedCustomer,
                        name: customerData.name,
                        id: customerData.id || assignedCustomer.id
                    });
                }
            }
        }
    }, [assignedCustomer, setAssignedCustomer]);

    /** 데이터 통합 로드 */
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const apiData = await fetchConsultations();
                const localHistoryRaw = localStorage.getItem("consultationHistory");
                const localHistory: LocalConsultationHistory[] = localHistoryRaw ? JSON.parse(localHistoryRaw) : [];
                
                const combinedData = [...localHistory, ...apiData];
                setActivities(combinedData as ConsultationResponse[]);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const handleNotificationClick = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = useCallback(() => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const handleSaveDashboardMemo = useCallback(() => {
        if (!memo.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        const newMemo = {
            id: Date.now(),
            date: new Date().toLocaleDateString("ko-KR"),
            customer: "개인 메모",
            category: "일반",
            content: memo
        };
        const existingMemos = JSON.parse(localStorage.getItem("savedMemos") || "[]");
        localStorage.setItem("savedMemos", JSON.stringify([newMemo, ...existingMemos]));
        alert("메모가 저장되었습니다!");
        setMemo("");
    }, [memo]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logoArea} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <span className={styles.brandLogo}> LG U<span className={styles.magentaText}>+</span></span>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.dateTimeDesktop}>
                            {now.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}{" "}
                            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div style={{ position: 'relative' }} ref={popoverRef}>
                            <button type="button" className={styles.iconButton} onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                                <Bell size={22} color="#1A1A1A" strokeWidth={2.5} />
                                {notifications.some(n => !n.isRead) && <span className={styles.notificationBadge}></span>}
                            </button>
                            {isNotificationOpen && (
                                <div className={styles.notificationPopover}>
                                    <div className={styles.popoverHeader}>
                                        <span>실시간 업무 알림</span>
                                        <button onClick={markAllAsRead}>모두 읽음</button>
                                    </div>
                                    <div className={styles.popoverList}>
                                        {notifications.map(n => (
                                            <div key={n.id} className={`${styles.popoverItem} ${n.isRead ? styles.readItem : ''}`} onClick={() => handleNotificationClick(n.id)}>
                                                {!n.isRead && <div className={styles.unreadDot} />}
                                                <div className={styles.popoverContent}>
                                                    <p className={styles.popoverTitle}>{n.title}</p>
                                                    <span className={styles.popoverTime}>{n.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={styles.popoverFooter} onClick={() => { setIsNotificationOpen(false); navigate('/notifications'); }}>전체 알림 내역 보기 <ChevronRight size={14} /></button>
                                </div>
                            )}
                        </div>
                        <div className={styles.profileChip} onClick={() => navigate('/mypage')} style={{ cursor: 'pointer' }}>
                            <div className={styles.avatarMini}><User size={16} color="white" /></div>
                            <span className={styles.userNameText}>{adminName}님</span>
                        </div>
                        <button type="button" className={styles.logoutBtn} onClick={handleLogout}><LogOut size={18} /></button>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.dashboardGrid}>
                    <div className={styles.mainContentLeft}>
                        <div className={styles.alertBanner}>
                            <div className={styles.alertLevelBadge.CRITICAL}><AlertTriangle size={14} /> CRITICAL</div>
                            <p className={styles.alertText}>[긴급 이슈] 현재 서울 지역 IPTV 접속 장애 문의가 평소 대비 250% 급증하고 있습니다.</p>
                            <button type="button" className={styles.alertLinkBtn} onClick={() => setShowGuide(true)}>가이드 보기</button>
                        </div>

                        <section className={styles.heroCard}>
                            <div className={styles.heroInfo}>
                                <h2 className={styles.heroTitle}>반갑습니다, {adminName}님! 👋</h2>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                    {workStatus === "AVAILABLE" ? <Activity size={16} className={styles.magentaText} /> : <Clock size={16} color="#999" />}
                                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{workStatus === "AVAILABLE" ? "상담 대기 중" : "업무 정지 중"}</span>
                                </div>
                            </div>
                            <button type="button" className={workStatus === "AVAILABLE" ? styles.workStopBtn : styles.workStartBtn} onClick={toggleWorkStatus}>
                                {workStatus === "AVAILABLE" ? "업무 잠시 멈춤" : "업무 시작하기"}
                            </button>
                        </section>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: "#FFF0F6", color: "#E6007E" }}><Users size={20} /></div>
                                <div><span className={styles.statLabel}>실시간 대기</span><div className={styles.statValue}>{waitingCount}명</div></div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: "#F0FDF4", color: "#22C55E" }}><CheckCircle2 size={20} /></div>
                                <div><span className={styles.statLabel}>오늘 완료</span><div className={styles.statValue}>12건</div></div>
                            </div>
                            <div className={styles.statCard} onClick={() => navigate('/mypage')} style={{ cursor: 'pointer' }}>
                                <div className={styles.statIcon} style={{ background: "#E6F0FF", color: "#007AFF" }}><FileText size={20} /></div>
                                <div><span className={styles.statLabel}>나의 성과</span><div className={styles.statValue}>보기</div></div>
                            </div>
                        </div>

                        <section className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>최근 상담 내역</h3>
                                <button type="button" onClick={() => navigate("/search")} style={{ color: "#E6007E", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>전체보기</button>
                            </div>
                            <div className={styles.activityList}>
                                {isLoading ? (
                                    <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>데이터 로드 중...</p>
                                ) : activities.length > 0 ? (
                                    activities.slice(0, 5).map((log) => (
                                        <div key={log.consultation_id} style={{ position: 'relative' }}>
                                            <button type="button" className={styles.activityItem} onClick={() => handleNavigateToDetail(log.consultation_id)}>
                                                <div className={styles.timeTag}>
                                                    {log.channel_type === "CALL" ? <Phone size={18} /> : <MessageSquare size={18} />}
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: "12px", textAlign: 'left' }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                                        <span className={styles.customerName}>{log.customer_name} 고객님</span>
                                                        <span className={styles.priorityBadge[log.priority as keyof typeof styles.priorityBadge]}>{log.priority}</span>
                                                    </div>
                                                    <div style={{ fontSize: "13px", color: "#E6007E", fontWeight: 700, marginBottom: "4px" }}>{log.category} {">"} {log.issue_detail}</div>
                                                    <div style={{ fontSize: "14px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "40px" }}>{log.content_preview}</div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px" }}>
                                                    <div className={styles.statusBadge[log.status as keyof typeof styles.statusBadge]}>{log.status === "DONE" ? "처리완료" : "상담중"}</div>
                                                    <ChevronRight size={18} className={styles.arrowIcon} />
                                                </div>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={(e) => handleDeleteActivity(e, log.consultation_id)}
                                                style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.05)', color: '#999', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E6007E'; e.currentTarget.style.color = '#FFF'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#999'; }}
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>상담 내역이 없습니다.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className={styles.mainContentRight}>
                        <section className={styles.glassCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 className={styles.cardTitle} style={{ marginBottom: 0 }}><Edit3 size={18} color="#E6007E" /> 나의 메모</h3>
                                <button type="button" onClick={handleSaveDashboardMemo} style={{ fontSize: '12px', padding: '6px 12px', background: '#1A1A1A', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Save size={14} /> 저장</button>
                            </div>
                            <textarea className={styles.memoArea} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="상담 키워드를 메모하세요..." />
                        </section>
                        <section className={styles.glassCard}>
                            <h3 className={styles.cardTitle}><Hash size={18} color="#007AFF" /> 실시간 키워드</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                                {["5G 요금제", "결합할인", "유심교체", "해외로밍", "멤버십"].map((tag) => (<span key={tag} className={styles.categoryTag}>#{tag}</span>))}
                            </div>
                        </section>
                        <section className={styles.glassCard}>
                            <div className={styles.cardHeader}><h3 className={styles.cardTitle}><Megaphone size={18} color="#E6007E" /> 공지사항</h3></div>
                            <div className={styles.noticeList}>
                                {NOTICES.map((notice) => (
                                    <div key={notice.id} className={styles.noticeItem} onClick={() => navigate(`/notice/${notice.id}`)} style={{ cursor: 'pointer' }}>
                                        <span className={styles.noticeTitle}>{notice.title}</span>
                                        <span className={styles.noticeDate}>{notice.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {assignedCustomer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.premiumModal}>
                        <div className={styles.aiGlowBadge}>REAL-TIME INQUIRY</div>
                        <h2 className={styles.modalHeading}>새로운 상담 배정</h2>
                        <div className={styles.modalCustomerCard}>
                            <span className={styles.modalCustomerName}>{assignedCustomer.name} 고객님</span>
                            <div className={styles.aiGuideBox} style={{ borderLeft: '4px solid #E6007E', marginTop: '12px' }}>
                                <p className={styles.aiGuideText} style={{ fontWeight: 600 }}>"{assignedCustomer.inquiryMessage}"</p>
                            </div>
                            <p style={{ fontSize: '13px', color: '#888', marginTop: '10px' }}><strong>최근 이력:</strong> {assignedCustomer.recentHistory}</p>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.primaryBtn} onClick={() => handleAcceptConsultation(assignedCustomer)}>상담 시작</button>
                            <button type="button" className={styles.secondaryBtn} onClick={() => setAssignedCustomer(null)}>거절</button>
                        </div>
                    </div>
                </div>
            )}

            {showGuide && (
                <div className={styles.modalOverlay}>
                    <div className={styles.premiumModal} style={{ maxWidth: "600px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>KNOWLEDGE BASE</div>
                            <button type="button" onClick={() => setShowGuide(false)} style={{ background: "none", border: "none" }}><X size={24} color="#999" /></button>
                        </div>
                        <h2 className={styles.modalHeading}>실시간 장애 대응 가이드</h2>
                        <div className={styles.aiGuideBox}><p className={styles.aiGuideText}>수도권 지역 IPTV 인증 서버 부하로 인한 접속 지연 발생 중입니다.</p></div>
                        <button type="button" className={styles.primaryBtn} style={{ width: "100%", marginTop: '20px' }} onClick={() => setShowGuide(false)}>내용 확인 완료</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;