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
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useConsultation, type CustomerInfo } from "../../hooks/useConsultation";
import { useLocalStorage } from "../../hooks/useLocalStorage"; 
import { fetchConsultations, fetchWaitingCount, fetchWaitingConsultations } from "../../api/services/consultation"; 
import type { ConsultationResponse } from "../../types/consultation"; 
// === API_STORE_IMPORT ===
import { apiStore } from "../../api/client"; 
import * as styles from "./Style/Dashboard.css.ts";

/**
 * [상부상조] 타입 정의 및 창 확장
 */
interface Notice {
    id: number;
    title: string;
    date: string;
    content: string;
}

// 브라우저 window 객체 확장을 위한 인터페이스
interface ExtendedWindow extends Window {
    createTest?: () => Promise<void>;
}

const NOTICES: Notice[] = [
    { 
        id: 1, 
        title: "[점검] AI 상담 요약 엔진 정기 점검 안내", 
        date: "02.21",
        content: "안녕하세요. 시스템 안정화를 위해 AI 엔진 정기 점검이 진행됩니다. 점검 중에는 요약 기능이 일시적으로 지연될 수 있습니다.\n\n- 일시: 2026.02.25 02:00 ~ 04:00"
    },
    { 
        id: 2, 
        title: "상담사 메모 저장 및 수정 기능 업데이트", 
        date: "02.19",
        content: "상담 중 작성한 메모를 즉시 저장하고, 나중에 마이페이지에서 수정할 수 있는 기능이 추가되었습니다. 업무 효율을 높여보세요!"
    },
    { 
        id: 3, 
        title: "신규 상담사 업무 가이드북 최신판 배포", 
        date: "02.15", 
        content: "2026년 상반기 통합 업무 가이드북 v2.1이 배포되었습니다. 지식 베이스(KB) 메뉴에서 다운로드 가능합니다."
    },
];

const Dashboard: React.FC = () => {
    const {
        status: workStatus, 
        toggleWorkStatus,
        assignedCustomer,
        setAssignedCustomer,
    } = useConsultation(); 
    
    const navigate = useNavigate();
    const popoverRef = useRef<HTMLDivElement>(null);
    
    const [adminName] = useState(() => localStorage.getItem("userName") || "상담원"); 
    const [now, setNow] = useState(new Date());
    const [showGuide, setShowGuide] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    
    const [activities, setActivities] = useState<ConsultationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    const [apiWaitingList, setApiWaitingList] = useState<ConsultationResponse[]>([]);
    
    const waitingList = useMemo<(ConsultationResponse | CustomerInfo)[]>(() => {
        if (apiWaitingList.length > 0) return apiWaitingList;
        const localData = localStorage.getItem("waitingCustomers");
        return localData ? (JSON.parse(localData) as CustomerInfo[]) : [];
    }, [apiWaitingList]); 

    const [memo, setMemo] = useLocalStorage<string>("dashboard_memo", "");
    const [notifications, setNotifications] = useLocalStorage("dashboard_notifications", [
        { id: 1, title: "긴급장애: 서울 IPTV 수신 불량", type: "urgent", time: "방금 전", isRead: false },
        { id: 2, title: "새로운 업무 가이드가 배포되었습니다.", type: "notice", time: "2시간 전", isRead: false },
        { id: 3, title: "오전 상담 실적 통계가 집계되었습니다.", type: "report", time: "4시간 전", isRead: true },
    ]);

    const completedCount = useMemo(() => {
        return activities.filter(activity => activity.status === 'DONE').length;
    }, [activities]); 

    const loadDashboardData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const [, , waitingRes] = await Promise.all([
                fetchConsultations(),
                fetchWaitingCount(),
                fetchWaitingConsultations()
            ]);

            setActivities([]);

            if (Array.isArray(waitingRes)) {
                setApiWaitingList(waitingRes as ConsultationResponse[]);
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * === BACKEND_CREATE_TEST ===
     * 콘솔에서 실행: createTest()
     */
    useEffect(() => {
        const win = window as ExtendedWindow;
        win.createTest = async () => {
            console.log("🚀 create API 연동 테스트를 시작합니다...");
            try {
                await apiStore.post('/v1/consultations', {
                    customer_name: "테스트 고객",
                    category: "요금제",
                    issue_detail: "API 테스트",
                    content_preview: "데이터 생성 테스트입니다.",
                    priority: "MEDIUM",
                    channel_type: "CHAT"
                });
                console.log("✅ 생성 성공!");
                loadDashboardData(); 
            } catch (err) {
                console.error("❌ 생성 실패:", err);
            }
        };
        return () => { delete win.createTest; };
    }, [loadDashboardData]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
            return;
        }
        loadDashboardData();
        
        const interval = setInterval(() => {
            if (localStorage.getItem("token")) loadDashboardData();
        }, 30000);
        return () => clearInterval(interval);
    }, [navigate, loadDashboardData]);

    const assignNextCustomer = useCallback((currentStatus?: string) => {
        const checkStatus = currentStatus || workStatus;
        if (checkStatus !== "AVAILABLE" || assignedCustomer) return;

        if (waitingList.length > 0) {
            const nextCustomer = waitingList[0];
            setAssignedCustomer(nextCustomer as unknown as CustomerInfo);
        }
    }, [workStatus, assignedCustomer, setAssignedCustomer, waitingList]); 

    const handleToggleStatus = useCallback(() => {
        toggleWorkStatus();
        if (workStatus !== "AVAILABLE") {
            setTimeout(() => {
                assignNextCustomer("AVAILABLE");
            }, 100);
        }
    }, [workStatus, toggleWorkStatus, assignNextCustomer]); 

    const handleRemoveWaitingCustomer = useCallback((customerId: string | number) => {
        if (window.confirm("이 고객을 대기열에서 제외하시겠습니까?")) {
            const localData = localStorage.getItem("waitingCustomers");
            const currentWaiting: CustomerInfo[] = localData ? JSON.parse(localData) : [];
            const updatedWaiting = currentWaiting.filter(c => c.id !== customerId);
            
            localStorage.setItem("waitingCustomers", JSON.stringify(updatedWaiting));
            setApiWaitingList(prev => [...prev]); 
        }
    }, []);

    // === 상담 배정(Assign) API 연결 및 로그 확인 ===
    const handleAcceptConsultation = useCallback(
        async (customer: CustomerInfo | ConsultationResponse) => {
            const id = 'consultation_id' in customer ? customer.consultation_id : customer.id;
            
            // 콘솔에 배정 요청 로그를 남겨 연결을 확인합니다.
            console.log(`[API Request] POST /api/v1/consultations/${id}/assign`);

            try {
                // 1. 배정 API 호출
                await apiStore.post(`/v1/consultations/${id}/assign`);
                console.log(`[API Success] 상담 배정 성공 (ID: ${id})`);

                const name = 'customer_name' in customer ? customer.customer_name : customer.name;
                const msg = 'content_preview' in customer ? customer.content_preview : (customer as CustomerInfo).inquiryMessage;

                localStorage.setItem("isMatched", "true");
                localStorage.setItem("lastInquiry", JSON.stringify({
                    message: msg,
                    customerName: name,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                setAssignedCustomer(null);
                // 2. 상세 페이지 이동
                navigate(`/consultation/${id}`);
            } catch (error) {
                console.error(`[API Error] 상담 배정 실패:`, error);
                alert("상담 배정에 실패했습니다. 이미 배정된 상담인지 확인해주세요.");
            }
        },
        [navigate, setAssignedCustomer],
    ); 

    const handleRejectConsultation = useCallback(() => {
        setAssignedCustomer(null);
    }, [setAssignedCustomer]); 

    const handleNotificationClick = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleLogout = useCallback(() => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            localStorage.clear();
            navigate("/", { replace: true });
        }
    }, [navigate]); 

    const handleSaveDashboardMemo = useCallback(() => {
        if (!memo.trim()) return alert("내용을 입력해주세요.");
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
    }, [memo]); 

    const handleDeleteActivity = useCallback((e: React.MouseEvent, consultationId: string | number) => {
        e.stopPropagation();
        if (window.confirm("이 상담 내역을 삭제하시겠습니까?")) {
            setActivities(prev => prev.filter(item => item.consultation_id !== consultationId));
            const localHistoryRaw = localStorage.getItem("consultationHistory");
            if (localHistoryRaw) {
                const localHistory: ConsultationResponse[] = JSON.parse(localHistoryRaw);
                const updatedHistory = localHistory.filter((item) => item.consultation_id !== consultationId);
                localStorage.setItem("consultationHistory", JSON.stringify(updatedHistory));
            }
        }
    }, []); 

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
                            <button type="button" className={workStatus === "AVAILABLE" ? styles.workStopBtn : styles.workStartBtn} onClick={handleToggleStatus}>
                                {workStatus === "AVAILABLE" ? "업무 잠시 멈춤" : "업무 시작하기"}
                            </button>
                        </section>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard} onClick={() => setIsQueueModalOpen(true)} style={{ cursor: 'pointer' }}>
                                <div className={styles.statIcon} style={{ background: "#FFF0F6", color: "#E6007E" }}><Users size={20} /></div>
                                <div>
                                    <span className={styles.statLabel}>실시간 대기</span>
                                    <div className={styles.statValue}>{waitingList.length}명</div>
                                    <span style={{ fontSize: '11px', color: '#E6007E', fontWeight: 600 }}>명단 보기 &gt;</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: "#F0FDF4", color: "#22C55E" }}><CheckCircle2 size={20} /></div>
                                <div>
                                    <span className={styles.statLabel}>오늘 완료</span>
                                    <div className={styles.statValue}>{completedCount}건</div>
                                </div>
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
                                    activities.slice(0, 5).map((log, index) => (
                                        <div key={`activity-${log.consultation_id}-${index}`} style={{ position: 'relative' }}>
                                            <button type="button" className={styles.activityItem} onClick={() => navigate(`/history/${log.consultation_id}`)}>
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
                                            <button type="button" onClick={(e) => handleDeleteActivity(e, log.consultation_id)} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                                <X size={12} color="#999" />
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
                            <textarea className={styles.memoArea} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder=" 메모하세요" />
                        </section>
                        <section className={styles.glassCard}>
                            <h3 className={styles.cardTitle}><Hash size={18} color="#007AFF" /> 실시간 키워드</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}> 
                                {["5G 요금제", "결합할인", "유심교체", "해외로밍", "멤버십"].map((tag) => (<span key={tag} className={styles.categoryTag}>#{tag}</span>))}
                            </div>
                        </section>
                        <section className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}><Megaphone size={18} color="#E6007E" /> 공지사항</h3>
                                <button onClick={() => navigate('/notice')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px' }}>전체보기</button>
                            </div>
                            <div className={styles.noticeList}>
                                {NOTICES.map((notice) => (
                                    <div key={notice.id} className={styles.noticeItem} onClick={() => setSelectedNotice(notice)} style={{ cursor: 'pointer' }}>
                                        <span className={styles.noticeTitle}>{notice.title}</span>
                                        <span className={styles.noticeDate}>{notice.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {/* 실시간 대기열 상세 모달 */}
            {isQueueModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsQueueModalOpen(false)}>
                    <div className={styles.premiumModal} style={{ maxWidth: "540px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>LIVE QUEUE</div>
                            <button type="button" onClick={() => setIsQueueModalOpen(false)} style={{ background: "none", border: "none", cursor: 'pointer' }}>
                                <X size={24} color="#999" />
                            </button>
                        </div>
                        <h2 className={styles.modalHeading}>실시간 대기 고객 명단</h2>
                        
                        <div style={{ marginTop: '20px', maxHeight: '360px', overflowY: 'auto' }}>
                            {waitingList.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#888', fontSize: '13px' }}>
                                            <th style={{ padding: '10px 5px' }}>순번</th>
                                            <th style={{ padding: '10px 5px' }}>고객명</th>
                                            <th style={{ padding: '10px 5px' }}>문의내용</th>
                                            <th style={{ padding: '10px 5px', textAlign: 'center' }}>삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitingList.map((item, index) => {
                                            const name = 'customer_name' in item ? item.customer_name : item.name;
                                            const msg = 'content_preview' in item ? item.content_preview : (item as CustomerInfo).inquiryMessage;
                                            const id = 'consultation_id' in item ? item.consultation_id : (item as CustomerInfo).id;

                                            return (
                                                <tr key={`queue-${id}-${index}`} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                                    <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#E6007E' }}>{index + 1}</td>
                                                    <td style={{ padding: '12px 5px', fontWeight: 600 }}>{name}</td>
                                                    <td style={{ padding: '12px 5px', fontSize: '13px', color: '#555' }}>
                                                        {(msg || "").length > 20 ? msg?.slice(0, 20) + '...' : msg}
                                                    </td>
                                                    <td style={{ padding: '12px 5px', textAlign: 'center' }}>
                                                        <button 
                                                            onClick={() => handleRemoveWaitingCustomer(id)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                        >
                                                            <X size={14} color="#FF4D4F" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                    <Users size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>현재 대기 중인 고객이 없습니다.</p>
                                </div>
                            )}
                        </div>
                        <button type="button" className={styles.primaryBtn} style={{ width: "100%", marginTop: '24px' }} onClick={() => setIsQueueModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
            
            {/* 상담 배정 모달 */}
            {assignedCustomer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.premiumModal}>
                        <div className={styles.aiGlowBadge}>REAL-TIME INQUIRY</div>
                        <h2 className={styles.modalHeading}>새로운 상담 배정</h2>
                        <div className={styles.modalCustomerCard}>
                            <span className={styles.modalCustomerName}>
                                {'customer_name' in assignedCustomer 
                                    ? (assignedCustomer as unknown as ConsultationResponse).customer_name 
                                    : (assignedCustomer as CustomerInfo).name} 고객님
                            </span>
                            <div className={styles.aiGuideBox} style={{ borderLeft: '4px solid #E6007E', marginTop: '12px' }}>
                                <p className={styles.aiGuideText} style={{ fontWeight: 600 }}>
                                    {'content_preview' in assignedCustomer 
                                        ? (assignedCustomer as unknown as ConsultationResponse).content_preview 
                                        : (assignedCustomer as CustomerInfo).inquiryMessage}
                                </p>
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.primaryBtn} onClick={() => handleAcceptConsultation(assignedCustomer)}>상담 시작</button>
                            <button type="button" className={styles.secondaryBtn} onClick={handleRejectConsultation}>거절</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 공지사항 상세 모달 */}
            {selectedNotice && (
                <div className={styles.modalOverlay} onClick={() => setSelectedNotice(null)}>
                    <div className={styles.premiumModal} style={{ maxWidth: "540px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>NOTICE</div>
                            <button type="button" onClick={() => setSelectedNotice(null)} style={{ background: "none", border: "none", cursor: 'pointer' }}>
                                <X size={24} color="#999" />
                            </button>
                        </div>
                        <h2 className={styles.modalHeading}>{selectedNotice.title}</h2>
                        <div style={{ marginTop: '20px', color: '#444', lineHeight: 1.6, fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                            {selectedNotice.content}
                        </div>
                        <button type="button" className={styles.primaryBtn} style={{ width: "100%", marginTop: '32px' }} onClick={() => setSelectedNotice(null)}>내용 확인</button>
                    </div>
                </div>
            )}

            {/* 장애 대응 가이드 모달 */}
            {showGuide && (
                <div className={styles.modalOverlay} onClick={() => setShowGuide(false)}>
                    <div className={styles.premiumModal} style={{ maxWidth: "600px" }} onClick={e => e.stopPropagation()}>
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