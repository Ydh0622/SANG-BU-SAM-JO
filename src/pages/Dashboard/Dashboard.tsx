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
import { 
    fetchConsultations, 
    fetchWaitingCount, 
    fetchWaitingConsultations,
    deleteWaitingConsultation,
    matchOldestConsultation,
    assignConsultation
} from "../../api/services/consultation";
import * as styles from "./Style/Dashboard.css.ts";

import type { ConsultationResponse as BaseResponse } from "../../types/consultation";


// --- 인터페이스 정의 ---
export interface ConsultationResponse extends Omit<BaseResponse, 'created_at' | 'updated_at' | 'customer_name' | 'consultation_id' | 'content_preview' | 'status'> {
    created_at?: string;
    updated_at?: string;
    customer_name?: string | null;
    consultation_id?: number;
    consultationId?: number;     
    customerName?: string | null; 
    initialMessage?: string | null;
    content_preview?: string | null;
    statusCode?: string;
    priorityCode?: string;
    productLineCode?: string;
    channelCode?: string;
    endedAt?: string;
    status?: BaseResponse['status'] | string; 
}

const NOTICES = [
    { 
        id: 1, 
        title: "[점검] AI 상담 요약 엔진 정기 점검 안내", 
        date: "02.21",
        content: "안녕하세요. 시스템 안정화를 위해 AI 엔진 정기 점검이 진행됩니다."
    },
    { 
        id: 2, 
        title: "상담사 메모 저장 및 수정 기능 업데이트", 
        date: "02.19",
        content: "상담 중 작성한 메모를 즉시 저장하고 나중에 수정할 수 있습니다."
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
    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
    
    const [isCooldown, setIsCooldown] = useState(false);
    const [skippedCustomerIds, setSkippedCustomerIds] = useState<Set<number | string>>(new Set());

    const [activities, setActivities] = useState<ConsultationResponse[]>([]);
    const [selectedNotice, setSelectedNotice] = useState<typeof NOTICES[0] | null>(null);

    const [todayDoneCountFromServer] = useState<number>(0);
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
        if (todayDoneCountFromServer > 0) return todayDoneCountFromServer;

        const todayStr = new Date().toLocaleDateString('en-CA'); 
        return activities.filter(activity => {
            const status = String(activity.status || activity.statusCode || "").trim().toUpperCase();
            const isDone = (status === 'DONE');
            const dateSource = activity.endedAt || activity.updated_at || activity.created_at;
            if (!dateSource) return false;
            const activityLocalDate = new Date(dateSource).toLocaleDateString('en-CA');
            return isDone && activityLocalDate === todayStr;
        }).length;
    }, [activities, todayDoneCountFromServer]); 

    const loadDashboardData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const [consultationsRes, , waitingRes] = await Promise.all([
                fetchConsultations(),
                fetchWaitingCount(),
                fetchWaitingConsultations()
            ]);

            setActivities(Array.isArray(consultationsRes) ? consultationsRes : []);
            setApiWaitingList(Array.isArray(waitingRes) ? waitingRes : []);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/", { replace: true });
            return;
        }
        
        const init = async () => {
            await loadDashboardData();
        };
        init();
        
        const interval = setInterval(() => {
            if (localStorage.getItem("token")) {
                loadDashboardData();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate, loadDashboardData]); 

    const assignNextCustomer = useCallback(async (currentStatus?: string) => {
        const checkStatus = currentStatus || workStatus;

        if (checkStatus !== "AVAILABLE" || assignedCustomer || isCooldown) return;

        try {
            const data = await matchOldestConsultation();

            if (!data?.consultationId) return;
            if (skippedCustomerIds.has(data.consultationId)) return;

            const matchedCustomer: ConsultationResponse = {
                consultationId: data.consultationId,
                consultation_id: data.consultationId,
                customerName: data.customerName ?? "고객",
                customer_name: data.customerName ?? "고객",
                initialMessage: data.initialMessage ?? "상담 요청이 도착했습니다.",
                channelCode: data.meta?.channelCode ?? undefined,
                productLineCode: data.meta?.productLineCode ?? undefined,
                priorityCode: data.meta?.priorityCode ?? undefined,
                created_at: data.meta?.createdAt ?? undefined,
                statusCode: "WAITING",
                
            };

            setAssignedCustomer(matchedCustomer as unknown as CustomerInfo);
        } catch (error) {
            console.error("가장 오래된 대기 상담 조회 실패:", error);
        }
    }, [workStatus, assignedCustomer, isCooldown, skippedCustomerIds, setAssignedCustomer]);

    const handleToggleStatus = useCallback(() => {
        toggleWorkStatus();
        if (workStatus !== "AVAILABLE") {
            setTimeout(() => assignNextCustomer("AVAILABLE"), 100);
        }
    }, [workStatus, toggleWorkStatus, assignNextCustomer]); 

    const handleRemoveWaitingCustomer = useCallback(async (customerId: string | number) => {
        if (window.confirm("이 고객을 대기열에서 제외하시겠습니까?")) {
            try {
                await deleteWaitingConsultation(customerId);
                setApiWaitingList((prev) => 
                    prev.filter((item) => {
                        const id = item.consultationId || item.consultation_id || (item as unknown as { id: string | number }).id;
                        return id !== customerId;
                    })
                ); 
                await loadDashboardData();
                alert("성공적으로 제거되었습니다.");
            } catch (error) {
                console.error("제거 실패:", error);
                alert("제거 처리 중 오류가 발생했습니다. 권한을 확인해주세요.");
            }
        }
    }, [loadDashboardData]);

    const handleAcceptConsultation = useCallback(
        async (customer: CustomerInfo | ConsultationResponse) => {
            const consultation = customer as ConsultationResponse;
            const info = customer as CustomerInfo;

            const id = consultation.consultationId || consultation.consultation_id || info.id;
            const name = consultation.customerName || consultation.customer_name || info.name || "고객";
            const msg =
                consultation.initialMessage ||
                consultation.content_preview ||
                info.inquiryMessage ||
                "상담 신청합니다.";

            if (!id) return;

            try {
                const assigned = await assignConsultation(id);

                localStorage.setItem(
                    "realtime_waiting_count",
                    String(waitingList.length > 0 ? waitingList.length - 1 : 0)
                );
                localStorage.setItem("isMatched", "true");
                localStorage.setItem(
                    "lastInquiry",
                    JSON.stringify({
                        message: msg,
                        customerName: name,
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    })
                );
                localStorage.setItem(
                    "currentCustomer",
                    JSON.stringify({
                        name,
                        consultationId: assigned.consultationId,
                        agentId: assigned.agentId,
                        startedAt: assigned.startedAt,
                        status: assigned.status,
                    })
                );

                setAssignedCustomer(null);
                navigate(`/consultation/${id}`);
            } catch (error) {
                console.error("상담 배정 실패:", error);
                alert("상담 배정 처리에 실패했습니다.");
            }
        },
        [navigate, setAssignedCustomer, waitingList.length]
    );

    const handleRejectConsultation = useCallback(() => {
        if (assignedCustomer) {
            const id = (assignedCustomer as unknown as ConsultationResponse).consultationId || 
                       (assignedCustomer as unknown as ConsultationResponse).consultation_id || 
                       (assignedCustomer as CustomerInfo).id;
            
            if (id) {
                setSkippedCustomerIds(prev => new Set(prev).add(id));
            }
        }

        setAssignedCustomer(null);
        setIsCooldown(true);
        
        setTimeout(() => {
            setIsCooldown(false);
        }, 5000);
    }, [assignedCustomer, setAssignedCustomer]);

    const handleNotificationClick = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    const markAllAsRead = (e: React.MouseEvent) => { e.stopPropagation(); setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); };
    const handleLogout = useCallback(() => { if (window.confirm("로그아웃 하시겠습니까?")) { localStorage.clear(); navigate("/", { replace: true }); } }, [navigate]); 
    const handleSaveDashboardMemo = useCallback(() => {
    if (!memo.trim()) return alert("내용을 입력해주세요.");

    const localData = localStorage.getItem("savedMemos");
    const prevMemos = localData ? JSON.parse(localData) : [];

    const newMemo = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        customer: "대시보드 메모",
        category: "일반",
        content: memo.trim(),
    };

    const updatedMemos = [newMemo, ...prevMemos];
    localStorage.setItem("savedMemos", JSON.stringify(updatedMemos));

    alert("메모가 저장되었습니다.");
    setMemo(""); 

}, [memo, setMemo]); 
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (workStatus !== "AVAILABLE" || assignedCustomer) return;

        const interval = setInterval(() => {
            assignNextCustomer();
        }, 3000);

        return () => clearInterval(interval);
    }, [workStatus, assignedCustomer, assignNextCustomer]);

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
                                    <div className={styles.popoverHeader}><span>실시간 업무 알림</span><button onClick={markAllAsRead}>모두 읽음</button></div>
                                    <div className={styles.popoverList}>
                                        {notifications.map(n => (
                                            <div key={n.id} className={`${styles.popoverItem} ${n.isRead ? styles.readItem : ''}`} onClick={() => handleNotificationClick(n.id)}>
                                                {!n.isRead && <div className={styles.unreadDot} />}
                                                <div className={styles.popoverContent}><p className={styles.popoverTitle}>{n.title}</p><span className={styles.popoverTime}>{n.time}</span></div>
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
                            <div className={styles.alertLevelBadge.CRITICAL}>
                                <AlertTriangle size={14} />
                                <span className={styles.alertLevelText}>CRITICAL</span>
                            </div>
                            <p className={styles.alertText}>현재 서울 지역 IPTV 접속 장애 문의가 급증하고 있습니다.</p>
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
                                <div><span className={styles.statLabel}>실시간 대기</span><div className={styles.statValue}>{waitingList.length}명</div><span style={{ fontSize: '11px', color: '#E6007E', fontWeight: 600 }}>명단 보기 &gt;</span></div>
                            </div>
                 
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: "#F0FDF4", color: "#22C55E" }}><CheckCircle2 size={20} /></div>
                                <div><span className={styles.statLabel}>오늘 완료</span><div className={styles.statValue}>{completedCount}건</div></div>
                            </div>
                            <div className={styles.statCard} onClick={() => navigate('/mypage')} style={{ cursor: 'pointer' }}>
                                <div className={styles.statIcon} style={{ background: "#E6F0FF", color: "#007AFF" }}><FileText size={20} /></div>
                                <div><span className={styles.statLabel}>나의 성과</span><div className={styles.statValue}>보기</div></div>
                            </div>
                        </div>

                        <section className={styles.glassCard}>
                            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className={styles.cardTitle} style={{ marginBottom: 0 }}>최근 상담 내역</h3>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/search')} 
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#E6007E',      
                                        cursor: 'pointer', 
                                        fontSize: '14px',      
                                        fontWeight: 700,       
                                        padding: '4px 0',
                                        letterSpacing: '-0.3px'
                                    }}
                                >
                                    전체보기
                                </button>
                            </div>
                            <div style={{ padding: "60px 0", textAlign: "center", color: "#999", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <MessageSquare size={40} style={{ opacity: 0.15, marginBottom: '12px' }} />
                                <p style={{ fontSize: '14px', fontWeight: 500 }}>상담 내역이 없습니다.</p>
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
                            <div className={styles.cardHeader}><h3 className={styles.cardTitle}><Megaphone size={18} color="#E6007E" /> 공지사항</h3><button onClick={() => navigate('/notice')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px' }}>전체보기</button></div>
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

            {isQueueModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsQueueModalOpen(false)}>
                    <div className={styles.premiumModal} style={{ maxWidth: "540px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>LIVE QUEUE</div>
                            <button type="button" onClick={() => setIsQueueModalOpen(false)} style={{ background: "none", border: "none", cursor: 'pointer' }}><X size={24} color="#999" /></button>
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
                                            const consultation = item as ConsultationResponse;
                                            const info = item as CustomerInfo;
                                            const id = consultation.consultationId || consultation.consultation_id || info.id;
                                            return (
                                                <tr key={`queue-${id}-${index}`} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                                    <td style={{ padding: '12px 5px', fontWeight: 'bold', color: '#E6007E' }}>{index + 1}</td>
                                                    <td style={{ padding: '12px 5px', fontWeight: 600 }}>{consultation.customerName || consultation.customer_name || info.name || "고객"}</td> 
                                                    <td style={{ padding: '12px 5px', fontSize: '13px', color: '#555' }}>{(consultation.initialMessage || info.inquiryMessage || "").slice(0, 20)}...</td>
                                                    <td style={{ padding: '12px 5px', textAlign: 'center' }}><button onClick={() => handleRemoveWaitingCustomer(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={14} color="#FF4D4F" /></button></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (<p style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>현재 대기 중인 고객이 없습니다.</p>)}
                        </div>
                        <button type="button" className={styles.primaryBtn} style={{ width: "100%", marginTop: '24px' }} onClick={() => setIsQueueModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

            {showGuide && (
                <div className={styles.modalOverlay} onClick={() => setShowGuide(false)}>
                    <div className={styles.premiumModal} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>KB</div>
                            <button type="button" onClick={() => setShowGuide(false)} style={{ background: "none", border: "none" }}><X size={24} color="#999" /></button>
                        </div>
                        <h2 className={styles.modalHeading}>실시간 장애 대응 가이드</h2>
                        <div className={styles.aiGuideBox}><p className={styles.aiGuideText}>수도권 지역 IPTV 인증 서버 부하로 인한 접속 지연 발생 중입니다.</p></div>
                        <button type="button" className={styles.primaryBtn} style={{ width: "100%", marginTop: '20px' }} onClick={() => setShowGuide(false)}>내용 확인 완료</button>
                    </div>
                </div>
            )}

            {selectedNotice && (
                <div className={styles.modalOverlay} onClick={() => setSelectedNotice(null)}>
                    <div className={styles.premiumModal} style={{ maxWidth: "540px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div className={styles.aiGlowBadge}>NOTICE</div>
                            <button type="button" onClick={() => setSelectedNotice(null)} style={{ background: "none", border: "none", cursor: 'pointer' }}><X size={24} color="#999" /></button>
                        </div>
                        <h2 className={styles.modalHeading}>{selectedNotice.title}</h2>
                        <div style={{ marginTop: '20px', color: '#444', lineHeight: 1.6, fontSize: '15px', whiteSpace: 'pre-wrap' }}>{selectedNotice.content}</div>
                    </div>
                </div>
            )}

            {assignedCustomer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.premiumModal}>
                        <div className={styles.aiGlowBadge}>REAL-TIME INQUIRY</div>
                        <h2 className={styles.modalHeading}>새로운 상담 배정</h2>
                        
                        <div className={styles.modalCustomerCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span className={styles.modalCustomerName}>
                                    {(assignedCustomer as unknown as ConsultationResponse).customerName || (assignedCustomer as unknown as ConsultationResponse).customer_name || (assignedCustomer as CustomerInfo).name || "고객"} 님
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#E6007E', backgroundColor: '#FFF0F6', padding: '4px 8px', borderRadius: '6px' }}>
                                    VIP Platinum
                                </span>
                            </div>

                            {/* ✅ 이미지 기반 성향 태그 */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {["결합할인", "신속해결", "친절선호"].map((tag) => (
                                    <span key={tag} style={{ 
                                        fontSize: '11px', 
                                        padding: '3px 9px', 
                                        borderRadius: '12px', 
                                        backgroundColor: '#F3F4F6', 
                                        color: '#4B5563',
                                        fontWeight: 600,
                                        border: '1px solid #E5E7EB'
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '12px 0' }} />

                            {/* ✅ 이미지 기반 이력 요약 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#6B7280' }}>최근 상담일</span>
                                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>2024.03.12</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#6B7280' }}>불만 합계</span>
                                    <span style={{ fontWeight: 800, color: '#E6007E' }}>0건</span>
                                </div>
                            </div>

                            <div className={styles.aiGuideBox} style={{ borderLeft: '4px solid #E6007E', marginTop: '12px', backgroundColor: '#F9FAFB' }}>
                                <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px', fontWeight: 700 }}>실시간 문의 내용</p>
                                <p className={styles.aiGuideText} style={{ fontWeight: 600, color: '#1A1A1A' }}>
                                    "{(assignedCustomer as unknown as ConsultationResponse).initialMessage || (assignedCustomer as unknown as ConsultationResponse).content_preview || (assignedCustomer as CustomerInfo).inquiryMessage || "상담 요청이 도착했습니다."}"
                                </p>
                            </div>
                        </div>

                        <div className={styles.modalActions} style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button type="button" className={styles.primaryBtn} style={{ flex: 1 }} onClick={() => handleAcceptConsultation(assignedCustomer)}>상담 시작</button>
                            <button type="button" className={styles.secondaryBtn} style={{ flex: 1 }} onClick={handleRejectConsultation}>거절</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;