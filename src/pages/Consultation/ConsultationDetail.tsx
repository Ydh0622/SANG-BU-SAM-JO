import {
    Clock, Eye, EyeOff, Mail, MessageSquare, Phone, Save, Send, Sparkles, Tag, User, Users, Search, ArrowLeft, AlertCircle, CheckCircle, X, FileDown, History, Check
} from "lucide-react"; 
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import {
    getConsultationDetail,
    getConsultationContext,
    sendConsultationMessage,
    endConsultation
} from "../../api/services/consultation";
import { getSimilarFaq } from "../../api/services/faq";
import type { ConsultationResponse } from "../../types/consultation";
import * as styles from "./Style/Consultation.css.ts";

// --- Types & Interfaces ---

interface ExtendedConsultationResponse extends ConsultationResponse {
    email?: string;
    initialMessage?: string;
    customerName?: string;
}

interface ConsultationDetailResponse {
    data: ExtendedConsultationResponse;
}

interface Message {
    id: number;
    sender: "customer" | "agent" | "ai";
    text: string;
    time: string;
}

interface FaqItem {
    faq_id: string;
    question: string;
    answer: string;
    similarity_score: number;
    isSelected?: boolean;
}

interface FaqResponse {
    recommendations: FaqItem[];
}

interface RecentHistory {
    date: string;
    category: string;
    summary: string;
    sentimentLabel: string | null;
    anxietyLevel: string | null;
    priceSensitivity: string | null;
    decisionStyle: string | null;
}

interface TendencyInfo {
    priceSensitivity: string | null;
    decisionStyle: string | null;
    anxietyLevel: string | null;
    sentimentLabel: string | null;
}

interface CustomerContext {
    name: string | null;
    grade: string | null;
    gender: string | null;
    age: number | null;
    totalConsultCount: number | null;
    lastConsultedAt: string | null;
    phoneMask: string | null;
    emailMask: string | null;
}

// --- Component ---

const ConsultationDetail: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState<ExtendedConsultationResponse | null>(null);
    const [similarFaqs, setSimilarFaqs] = useState<FaqItem[]>([]);
    
    const [recentHistories, setRecentHistories] = useState<RecentHistory[]>([]);
    const [tendencyInfo, setTendencyInfo] = useState<TendencyInfo | null>(null);
    const [customerCtx, setCustomerCtx] = useState<CustomerContext | null>(null);

    const [isTyping] = useState(false);
    const [consultationTime, setConsultationTime] = useState(0);
    const [showExitModal, setShowExitModal] =   useState(false);
    const [finalResultCode, setFinalResultCode] = useState<string>("DONE");

    const [waitingCount] = useState<number>(() => {
        const count = localStorage.getItem("realtime_waiting_count") || localStorage.getItem("dashboard_waiting_count");
        return count ? Number(count) : 0;
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchSimilarFaqs = useCallback(async (text: string) => {
        if (!text || !text.trim()) return;
        try {
            const response = await getSimilarFaq(text);
            const data = response as unknown as FaqResponse | FaqItem[];
            const faqs = Array.isArray(data) ? data : data?.recommendations || [];
            setSimilarFaqs(faqs.map((f, idx) => ({ 
                ...f, 
                faq_id: f.faq_id || `faq-${idx}-${Date.now()}`,
                isSelected: undefined 
            })));
        } catch (error) {
            console.error("FAQ 로드 실패:", error);
        }
    }, []);

    const handleSaveAndExportFile = useCallback(() => {
        if (messages.length === 0) return;
        try {
            const customerName = customerCtx?.name || customerInfo?.customer_name || "Unknown";
            const chatLogs = messages.map(m => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n');
            const blob = new Blob([`=== LG U+ 상담 기록 (고객: ${customerName}) ===\n${chatLogs}`], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `상담기록_${customerName}_${new Date().toLocaleDateString()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("파일 다운로드 실패:", error);
        }
    }, [messages, customerInfo]);

    useEffect(() => {
        let active = true;

        const loadDetailAndAssign = async () => {
            if (!customerId) return;
            try {
                setIsLoading(true);
                const response = await getConsultationDetail(customerId);
                if (!active) return;

                const resObj = response as unknown as ConsultationDetailResponse;
                const actualData = (resObj && resObj.data) ? resObj.data : (response as unknown as ExtendedConsultationResponse);

                const storedCustomer = localStorage.getItem("currentCustomer");
                const customerData = storedCustomer ? JSON.parse(storedCustomer) : null;

                setCustomerInfo({
                    ...actualData,
                    customer_name: customerData?.name || actualData.customerName || actualData.customer_name || "고객",
                    contact_info: customerData?.phone || actualData.contact_info || "010-0000-0000",
                    email: customerData?.email || "vip_care@uplus.co.kr"
                });

                const lastInquiryRaw = localStorage.getItem("lastInquiry");
                let firstMsgText = actualData.initialMessage || "상담 신청합니다.";
                if (lastInquiryRaw) {
                    const parsed = JSON.parse(lastInquiryRaw);
                    if (parsed.message?.trim()) firstMsgText = parsed.message;
                }

                setMessages([{
                    id: Date.now(),
                    sender: "customer",
                    text: firstMsgText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);

                // 컨텍스트 캐시 조회 (최근 상담 + 성향)
                try {
                    const ctx = await getConsultationContext(customerId) as { data?: Record<string, unknown> } & Record<string, unknown>;
                    const ctxData = (ctx?.data ?? ctx) as {
                        customer?: {
                            name?: string; grade?: string; gender?: string; age?: number;
                            totalConsultCount?: number; lastConsultedAt?: string;
                            phoneMask?: string; emailMask?: string;
                        };
                        recentConsultations?: {
                            endedAt?: string; productLineCode?: string; summaryText?: string;
                            sentimentLabel?: string; anxietyLevel?: string;
                            priceSensitivity?: string; decisionStyle?: string;
                        }[];
                        faqList?: {
                            kbId?: number; productLineCode?: string;
                            request?: string; answer?: string;
                            customerLiked?: boolean | null;
                        }[];
                    };

                    if (ctxData?.faqList && ctxData.faqList.length > 0) {
                        setSimilarFaqs(ctxData.faqList.map((f: typeof ctxData.faqList[0] & { customerLiked?: boolean | null }, idx: number) => ({
                            faq_id: f.kbId ? String(f.kbId) : `faq-${idx}`,
                            question: f.request ?? "-",
                            answer: f.answer ?? "-",
                            similarity_score: 0,
                            isSelected: f.customerLiked === true ? true : f.customerLiked === false ? false : undefined,
                        })));
                    }

                    if (ctxData?.customer) {
                        const c = ctxData.customer;
                        setCustomerCtx({
                            name: c.name ?? null,
                            grade: c.grade ?? null,
                            gender: c.gender ?? null,
                            age: c.age ?? null,
                            totalConsultCount: c.totalConsultCount ?? null,
                            lastConsultedAt: c.lastConsultedAt ?? null,
                            phoneMask: c.phoneMask ?? null,
                            emailMask: c.emailMask ?? null,
                        });
                    }

                    if (ctxData?.recentConsultations) {
                        setRecentHistories(ctxData.recentConsultations.map((r) => {
                            const d = r.endedAt ? new Date(r.endedAt) : null;
                            const date = d
                                ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
                                : "-";
                            return {
                                date,
                                category: r.productLineCode ?? "-",
                                summary: r.summaryText ?? "-",
                                sentimentLabel: r.sentimentLabel ?? null,
                                anxietyLevel: r.anxietyLevel ?? null,
                                priceSensitivity: r.priceSensitivity ?? null,
                                decisionStyle: r.decisionStyle ?? null,
                            };
                        }));

                        const latest = ctxData.recentConsultations[0];
                        if (latest) {
                            setTendencyInfo({
                                priceSensitivity: latest.priceSensitivity ?? null,
                                decisionStyle: latest.decisionStyle ?? null,
                                anxietyLevel: latest.anxietyLevel ?? null,
                                sentimentLabel: latest.sentimentLabel ?? null,
                            });
                        }
                    }
                } catch (e) {
                    console.warn("컨텍스트 로드 실패:", e);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        loadDetailAndAssign();
        return () => { active = false; };
    }, [customerId, fetchSimilarFaqs, navigate]);

    const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !customerId) return;
    
    const textToSend = inputValue;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage: Message = { id: Date.now(), sender: "agent", text: textToSend, time: now };
    
    setInputValue("");
    setMessages((prev) => [...prev, newMessage]);
    localStorage.setItem("agentMessage", JSON.stringify(newMessage));
    
    try {
       
        await sendConsultationMessage(customerId, textToSend, "AGENT");
    } catch (error) {
        console.warn("API 전송 실패:", error);
    }
}, [inputValue, customerId]);

    const handleFinalComplete = async () => {
        if (!customerId || (!customerInfo && !customerCtx)) return;
        
        try {
            setShowExitModal(false);
            setIsLoading(true);

            const fullChatLog = messages
                .map(m => `[${m.time}] ${m.sender === 'customer' ? '고객' : '상담사'}: ${m.text}`)
                .join('\n');

            const payload = {
                finalResultCode: finalResultCode,
                customerName: customerCtx?.name || customerInfo?.customer_name,
                consultationContent: fullChatLog 
            };

            await endConsultation(customerId, payload);
            await new Promise(resolve => setTimeout(resolve, 1000));

            ["lastInquiry", "isMatched", "currentCustomer", "assignedCustomer", "realtime_waiting_count", "customerInquiry", "recentConsultations"].forEach(k => localStorage.removeItem(k));
            navigate("/search", { replace: true });

        } catch (err) {
            setIsLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            alert(`저장 실패: ${error.response?.data?.message || "입력 형식을 확인해주세요."}`);
        }
    };

    useEffect(() => {
        const handleCustomerChat = (e: StorageEvent) => {
            if (e.key === "customerMessage" && e.newValue) {
                const data = JSON.parse(e.newValue);
                setMessages(prev => {
                    if (prev.some(msg => msg.id === data.id)) return prev;
                    return [...prev, {
                        id: data.id,
                        sender: 'customer',
                        text: data.text,
                        time: data.time
                    }];
                });

            }
        };
        window.addEventListener("storage", handleCustomerChat);
        return () => window.removeEventListener("storage", handleCustomerChat);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setConsultationTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    if (isLoading) return <div className={styles.loadingContainer}>처리 중입니다...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button type="button" onClick={() => navigate('/dashboard')} className={styles.backBtn}>
                        <ArrowLeft size={24} color="#666" />
                    </button>
                    <div className={styles.statusDot} />
                    <h1 className={styles.title}>실시간 상담: {customerCtx?.name ?? customerInfo?.customer_name}</h1>
                    <section className={styles.timer}><Clock size={16} /> {formatTime(consultationTime)}</section>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className={styles.saveButton} onClick={handleSaveAndExportFile}>
                        <FileDown size={16} style={{ marginRight: "6px" }} /> 다운로드
                    </button>
                    <button type="button" className={styles.exitButton} onClick={() => setShowExitModal(true)}>
                        <CheckCircle size={16} style={{ marginRight: "6px" }} /> 상담 종료
                    </button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                <aside className={styles.sideSection} style={{ flex: '0 0 350px' }}>
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>고객 정보</h3>
                            {customerCtx?.grade && (
                                <span className={styles.badgeVIP}>{customerCtx.grade}</span>
                            )}
                        </div>
                        <div className={styles.avatar} style={{ margin: "0 auto 16px" }}>
  <User size={40} color="#E6007E" />
</div>
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <strong>{customerCtx?.name ?? customerInfo?.customer_name}</strong>
                            {customerCtx?.age && customerCtx?.gender && (
                                <p style={{ color: "#666", fontSize: "12px", margin: "2px 0 0" }}>
                                    {customerCtx.gender === 'MALE' ? '남' : '여'} · {customerCtx.age}세
                                </p>
                            )}
                            {customerCtx?.totalConsultCount != null && (
                                <p style={{ color: "#E6007E", fontWeight: 800, fontSize: "12px", margin: "4px 0 0" }}>
                                    누적 상담 {customerCtx.totalConsultCount}회
                                </p>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <Phone size={16} color="#666" />
                            <span>{isPhoneVisible ? (customerInfo?.contact_info ?? customerCtx?.phoneMask) : (customerCtx?.phoneMask ?? "010-****-****")}</span>
                            <button type="button" onClick={() => setIsPhoneVisible(!isPhoneVisible)} style={{ marginLeft: "auto", background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isPhoneVisible ? <EyeOff size={14} color="#999" /> : <Eye size={14} color="#E6007E" />}
                            </button>
                        </div>
                        <div className={styles.infoItem}>
                            <Mail size={16} color="#666" />
                            <span style={{ fontSize: "13px" }}>{customerCtx?.emailMask ?? customerInfo?.email}</span>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Sparkles size={18} color="#E6007E" /> 고객 성향 분석</h3>
                        {tendencyInfo ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {tendencyInfo.priceSensitivity && (
                                    <span style={{ backgroundColor: '#FFF0F6', color: '#E6007E', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        #가격민감도_{tendencyInfo.priceSensitivity}
                                    </span>
                                )}
                                {tendencyInfo.decisionStyle && (
                                    <span style={{ backgroundColor: '#F0F7FF', color: '#0056B3', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        #결정스타일_{tendencyInfo.decisionStyle}
                                    </span>
                                )}
                                {tendencyInfo.anxietyLevel && (
                                    <span style={{ backgroundColor: '#FFFBE6', color: '#D46B08', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        #불안수준_{tendencyInfo.anxietyLevel}
                                    </span>
                                )}
                                {tendencyInfo.sentimentLabel && (
                                    <span style={{ backgroundColor: '#F6FFED', color: '#389E0D', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        #감정_{tendencyInfo.sentimentLabel}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>성향 데이터가 없습니다.</p>
                        )}
                    </article>
                </aside>

                <section className={styles.chatSection} style={{ flex: '1' }}>
                    <div className={styles.messageList} ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={msg.sender === "customer" ? styles.customerMsg : styles.agentMsg}>
                                <div className={styles.bubble}>{msg.text}</div>
                                <time className={styles.msgTime}>{msg.time}</time>
                            </div>
                        ))}
                        {isTyping && (
                            <div className={styles.customerMsg}>
                                <div className={styles.typingBubble}>
                                    <div className={styles.dot} /><div className={styles.dot} /><div className={styles.dot} />
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className={styles.chatFooter}>
                        <div className={styles.aiGuideHeader}><Sparkles size={16} color="#E6007E" /> AI 추천 답변</div>
                        <div className={styles.aiSuggestRow}>
                            <button type="button" className={styles.aiSuggestBtn} onClick={() => setInputValue("가족 결합 할인 소급 적용 건을 확인하였습니다.")}>
                                <MessageSquare size={14} style={{ marginRight: '4px' }} /> 소급 적용 안내
                            </button>
                            <button type="button" className={styles.aiSuggestBtn} onClick={() => setInputValue("요금제 변경 시 결합 할인 유지 조건에 대해 설명드렸습니다.")}>
                                <Tag size={14} style={{ marginRight: '4px' }} /> 결합 조건 설명
                            </button>
                        </div>
                        <div className={styles.inputArea}>
                            <input
                                className={styles.input}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  
                                    if (e.nativeEvent.isComposing) return;
                                    if (e.key === "Enter") handleSend();
                                }}
                                placeholder="메시지 입력..."
                            />
                            <button type="button" className={styles.sendBtn} onClick={handleSend} disabled={!inputValue.trim()}><Send size={20} /></button>
                        </div>
                    </footer>
                </section>

                <aside className={styles.sideSection} style={{ flex: '0 0 380px' }}>
                    <article className={styles.statCard}>
                        <h3 className={styles.cardTitle}><Users size={20} color="#E6007E" /> 실시간 대기</h3>
                        <div className={styles.waitNumber}><strong>{waitingCount}</strong> <span>명</span></div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Search size={18} color="#E6007E" /> 사전 FAQ 결과</h3>
                        <div className={styles.faqWrapper}>
                            {similarFaqs.length > 0 ? similarFaqs.map((faq) => (
                                <div key={faq.faq_id}
                                     className={styles.faqItem}
                                     style={{
                                         position: 'relative',
                                         padding: '16px',
                                         borderBottom: '1px solid #f0f0f0',
                                         backgroundColor: faq.isSelected === true ? '#F0F7FF' : faq.isSelected === false ? '#FFF1F0' : 'transparent',
                                     }}>

                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '24px', height: '24px', borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: faq.isSelected === true ? '#52c41a' : faq.isSelected === false ? '#ff4d4f' : '#f0f0f0',
                                    }}>
                                        {faq.isSelected === true && <Check size={14} color="#fff" strokeWidth={3} />}
                                        {faq.isSelected === false && <X size={14} color="#fff" strokeWidth={3} />}
                                    </div>

                                    <div style={{ paddingRight: '40px' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>{faq.question}</p>
                                        <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{faq.answer}</p>
                                    </div>
                                </div>
                            )) : <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }}>고객이 사전 FAQ를 확인하지 않았습니다.</p>}
                        </div>
                    </article>

                    <article className={styles.card} style={{ marginTop: '16px' }}>
                        <h3 className={styles.cardTitle}><History size={18} color="#E6007E" style={{ marginRight: '6px' }} /> 최근 상담 내역</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                            {recentHistories.map((item, idx) => (
                                <div key={`history-${idx}`} style={{
                                    padding: '10px', backgroundColor: '#F7F8F9', borderRadius: '10px', border: '1px solid #EDEDED'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', color: '#999' }}>{item.date}</span>
                                        <span style={{ fontSize: '11px', color: '#E6007E', fontWeight: 700 }}>{item.category}</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#444', margin: '0 0 6px', lineHeight: '1.4' }}>{item.summary}</p>
                                    {(item.sentimentLabel || item.anxietyLevel || item.priceSensitivity || item.decisionStyle) && (
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {item.sentimentLabel && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '8px',
                                                    backgroundColor: item.sentimentLabel === 'POSITIVE' ? '#F6FFED' : item.sentimentLabel === 'NEGATIVE' ? '#FFF1F0' : '#F5F5F5',
                                                    color: item.sentimentLabel === 'POSITIVE' ? '#389E0D' : item.sentimentLabel === 'NEGATIVE' ? '#CF1322' : '#888',
                                                }}>
                                                    {item.sentimentLabel === 'POSITIVE' ? '😊 긍정' : item.sentimentLabel === 'NEGATIVE' ? '😠 부정' : '😐 중립'}
                                                </span>
                                            )}
                                            {item.anxietyLevel && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '8px',
                                                    backgroundColor: item.anxietyLevel === 'HIGH' ? '#FFF7E6' : '#F5F5F5',
                                                    color: item.anxietyLevel === 'HIGH' ? '#D46B08' : '#888',
                                                }}>
                                                    불안 {item.anxietyLevel}
                                                </span>
                                            )}
                                            {item.priceSensitivity && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '8px',
                                                    backgroundColor: '#FFF0F6', color: '#E6007E',
                                                }}>
                                                    가격 {item.priceSensitivity}
                                                </span>
                                            )}
                                            {item.decisionStyle && (
                                                <span style={{
                                                    fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '8px',
                                                    backgroundColor: '#F0F7FF', color: '#0056B3',
                                                }}>
                                                    {item.decisionStyle === 'CAUTIOUS' ? '신중형' : item.decisionStyle === 'IMPULSIVE' ? '즉흥형' : '정보탐색형'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </article>
                </aside>
            </div>

            {showExitModal && (
                <div className={styles.modalOverlay} onClick={() => setShowExitModal(false)}>
                    <div className={styles.exitModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={22} color="#E6007E" />
                                <h2>상담 종료 및 결과 기록</h2>
                            </div>
                            <button onClick={() => setShowExitModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#666" /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.fieldGroup} style={{ marginBottom: '20px' }}>
                                <label><Tag size={14} /> 상담 결과 분류</label>
                                <select 
                                    value={finalResultCode} 
                                    onChange={(e) => setFinalResultCode(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '8px' }}
                                >
                                    <option value="DONE">처리 완료</option>
                                    <option value="TRANSFERRED">부서 이관</option>
                                    <option value="FOLLOW_UP">추후 재통화</option>
                                    <option value="PENDING">기록 대기</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowExitModal(false)}>취소</button>
                            <button className={styles.modalConfirmBtn} onClick={handleFinalComplete}>
                                <Save size={18} style={{ marginRight: '6px' }} /> 기록 저장 및 종료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultationDetail;