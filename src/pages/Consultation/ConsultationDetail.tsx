import {
    Clock, Eye, EyeOff, Mail, MessageSquare, Phone, Save, Send, Sparkles, Tag, User, Users, Search, ArrowLeft, AlertCircle, CheckCircle, X, FileDown, History, Check
} from "lucide-react"; 
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import {
    getConsultationDetail,
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
    
    const [recentHistories] = useState<RecentHistory[]>([
        { date: "2024.03.05", category: "요금제", summary: "5G 다이렉트 65 요금제 변경 및 결합 할인 혜택 재안내" },
        { date: "2024.02.12", category: "기기변경", summary: "아이폰 15 프로 예약 구매 혜택 및 공시지원금 비교 상담" },
        { date: "2024.01.20", category: "결합할인", summary: "가족 무한사랑 결합 해지 시 발생 위약금 소급 적용 검토" },
        { date: "2023.12.15", category: "부가서비스", summary: "VVIP 멤버십 혜택 활용 방법 및 영화 예매권 사용 문의" },
        { date: "2023.11.02", category: "기타", summary: "해외 로밍 데이터 무제한 요금제 가입 및 차단 설정 완료" }
    ]);

    const [isTyping, setIsTyping] = useState(false);
    const [consultationTime, setConsultationTime] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [finalResultCode, setFinalResultCode] = useState<string>("DONE");

    const [waitingCount] = useState<number>(() => {
        const count = localStorage.getItem("realtime_waiting_count") || localStorage.getItem("dashboard_waiting_count");
        return count ? Number(count) : 0;
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    // FAQ 선택 핸들러 (V 클릭 시 true, X 클릭 시 false)
const handleSelectFaq = (id: string, status: boolean) => {
    setSimilarFaqs(prev => prev.map(faq => {
        if (faq.faq_id === id) {
            return { 
                ...faq, 
                isSelected: faq.isSelected === status ? undefined : status 
            };
        }
        return faq;
    }));
};
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
            const customerName = customerInfo?.customer_name || "Unknown";
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
        const loadDetailAndAssign = async () => {
            if (!customerId) return;
            try {
                setIsLoading(true);
                const response = await getConsultationDetail(customerId);
                
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

                fetchSimilarFaqs(firstMsgText);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        loadDetailAndAssign();
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
            await sendConsultationMessage(customerId, textToSend);
        } catch (error) {
            console.warn("API 전송 실패:", error);
        }
    }, [inputValue, customerId]);

const handleFinalComplete = async () => {
    if (!customerId || !customerInfo) return;
    
    try {
        setShowExitModal(false);
        setIsLoading(true);

        // 1. 대화 내역 전체를 하나의 문자열로 합치기 (시간 - 보낸사람: 내용)
        const fullChatLog = messages
            .map(m => `[${m.time}] ${m.sender === 'customer' ? '고객' : '상담사'}: ${m.text}`)
            .join('\n');

        // 2. 서버로 보낼 데이터 구성
        const payload = {
            finalResultCode: finalResultCode,
            customerName: customerInfo.customer_name,
            consultationContent: fullChatLog 
        };

        // 3. API 전송
        await endConsultation(customerId, payload);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 로컬 스토리지 정리 및 이동
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
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 1500);
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
                    <h1 className={styles.title}>실시간 상담: {customerInfo?.customer_name}</h1>
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
                {/* 왼쪽 사이드 - 고객 정보 */}
                <aside className={styles.sideSection} style={{ flex: '0 0 350px' }}>
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>고객 정보</h3>
                            <span className={styles.badgeVIP}>VIP Platinum</span>
                        </div>
                        <div className={styles.avatar} style={{ margin: "0 auto 16px" }}><User size={40} color="#E6007E" /></div>
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <strong>{customerInfo?.customer_name}</strong>
                            <p style={{ color: "#E6007E", fontWeight: 800, fontSize: "12px" }}>LG U+ 최우수 고객</p>
                        </div>
                        <div className={styles.infoItem}>
                            <Phone size={16} color="#666" />
                            <span>{isPhoneVisible ? (customerInfo?.contact_info) : "010-****-****"}</span>
                            <button type="button" onClick={() => setIsPhoneVisible(!isPhoneVisible)} style={{ marginLeft: "auto", background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isPhoneVisible ? <EyeOff size={14} color="#999" /> : <Eye size={14} color="#E6007E" />}
                            </button>
                        </div>
                        <div className={styles.infoItem}>
                            <Mail size={16} color="#666" />
                            <span style={{ fontSize: "13px" }}>{customerInfo?.email}</span>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Sparkles size={18} color="#E6007E" /> 고객 성향 분석</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                            <span style={{ backgroundColor: '#FFF0F6', color: '#E6007E', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>#신속한처리</span>
                            <span style={{ backgroundColor: '#F0F7FF', color: '#0056B3', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>#결합할인_관심</span>
                            <span style={{ backgroundColor: '#F6FFED', color: '#389E0D', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>#매너우수</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                            용건 위주의 간결한 설명을 선호하며, 현재 결합 할인 혜택 누락 여부에 민감함.
                        </p>
                    </article>
                </aside>

                {/* 중앙 - 채팅 영역 */}
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
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="메시지 입력..."
                            />
                            <button type="button" className={styles.sendBtn} onClick={handleSend} disabled={!inputValue.trim()}><Send size={20} /></button>
                        </div>
                    </footer>
                </section>

                {/* 오른쪽 사이드 - FAQ & 히스토리 */}
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
                                         transition: 'all 0.2s ease'
                                     }}>
                                    
                                    {/* 이미지 레이아웃 반영: 우측 상단 V / X 버튼 */}
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '12px', 
                                        right: '12px', 
                                        display: 'flex', 
                                        gap: '6px' 
                                    }}>
                                        <button 
                                            onClick={() => handleSelectFaq(faq.faq_id, true)}
                                            style={{
                                                width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d9d9d9',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                backgroundColor: faq.isSelected === true ? '#52c41a' : '#fff',
                                                color: faq.isSelected === true ? '#fff' : '#d9d9d9'
                                            }}
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </button>
                                        <button 
                                            onClick={() => handleSelectFaq(faq.faq_id, false)}
                                            style={{
                                                width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d9d9d9',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                backgroundColor: faq.isSelected === false ? '#ff4d4f' : '#fff',
                                                color: faq.isSelected === false ? '#fff' : '#d9d9d9'
                                            }}
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>

                                    <div style={{ paddingRight: '60px' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>{faq.question}</p>
                                        <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{faq.answer}</p>
                                    </div>
                                </div>
                            )) : <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</p>}
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
                                    <p style={{ fontSize: '12px', color: '#444', margin: 0, lineHeight: '1.4' }}>{item.summary}</p>
                                </div>
                            ))}
                        </div>
                    </article>
                </aside>
            </div>

            {/* 상담 종료 모달 */}
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