import {
    Clock,
    Edit3,
    Eye,
    EyeOff,
    Mail,
    MessageSquare,
    Phone,
    Save,
    Send,
    Sparkles,
    Tag,
    User,
    Users,
    Search, 
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    X,
    FileDown
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { 
    getConsultationDetail, 
    sendConsultationMessage, 
    completeConsultation 
} from "../../api/services/consultation";
import { getSimilarFaq } from "../../api/services/faq"; 
import type { ConsultationResponse } from "../../types/consultation";
import * as styles from "./Style/Consultation.css.ts";

/** 이메일 속성을 포함하도록 타입 확장 */
interface ExtendedConsultationResponse extends ConsultationResponse {
    email?: string;
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
}

interface FaqResponse {
    recommendations: FaqItem[];
}

interface ConsultationRecord {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

const ConsultationDetail: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState<ExtendedConsultationResponse | null>(null);
    const [similarFaqs, setSimilarFaqs] = useState<FaqItem[]>([]); 

    const [isTyping, setIsTyping] = useState(false);
    const [consultationTime, setConsultationTime] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);

    const [waitingCount] = useState<number>(() => {
        const count = localStorage.getItem("realtime_waiting_count");
        return count ? Number(count) : 0;
    });

    const [record, setRecord] = useState<ConsultationRecord>({
        customer_request: "요금제 변경 및 가족 결합 할인 적용 요청",
        agent_action: "본인 확인 후 결합 해지 사유 설명 및 재결합 안내",
        summary_text: "고객이 기존 결합 해지 후 재결합 과정에서 발생한 위약금 소급 적용을 요청함. 가이드에 따라 처리 완료함.", 
        issue_type_code: "BILL_INQUIRY",
        resolution_code: "DONE",
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setConsultationTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchSimilarFaqs = useCallback(async (text: string) => {
        try {
            const response = await getSimilarFaq(text) as unknown as FaqResponse;
            const faqs = response?.recommendations || response; 
            if (Array.isArray(faqs)) setSimilarFaqs(faqs);
        } catch (err) { console.error("FAQ 로드 실패:", err); }
    }, []);

    const handleSaveAndExportFile = useCallback(() => {
        if (messages.length === 0) return;
        try {
            const title = `=== LG U+ 상담 기록 (ID: ${customerId}) ===\n`;
            const chatLogs = messages.map(m => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n');
            const blob = new Blob([title + chatLogs], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `상담기록_${customerInfo?.customer_name}.txt`); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) { console.error(error); }
    }, [customerId, messages, customerInfo]);

    useEffect(() => {
        const loadDetail = async () => {
            if (!customerId) return;
            try {
                setIsLoading(true);
                const data = await getConsultationDetail(customerId);
                const storedCustomer = localStorage.getItem("currentCustomer");
                const customerData = storedCustomer ? JSON.parse(storedCustomer) : null;

                setCustomerInfo({
                    ...data,
                    customer_name: customerData?.name || data.customer_name,
                    contact_info: customerData?.phone || data.contact_info,
                    email: customerData?.email || "vip_care@uplus.co.kr"
                });
            } catch (err) {
                console.warn("서버 데이터 로드 실패, 로컬 스토리지 확인:", err);
                const localHistoryRaw = localStorage.getItem("consultationHistory");
                
                if (localHistoryRaw) {
                    const localHistory: ConsultationResponse[] = JSON.parse(localHistoryRaw);
                    const fallbackData = localHistory.find(
                        (item: ConsultationResponse) => String(item.consultation_id) === String(customerId)
                    );
                    
                    if (fallbackData) {
                        setCustomerInfo(fallbackData as ExtendedConsultationResponse);
                    } else {
                        navigate("/dashboard");
                    }
                } else {
                    navigate("/dashboard");
                }
            } finally {
                const lastInquiry = localStorage.getItem("lastInquiry");
                if (lastInquiry) {
                    const parsed = JSON.parse(lastInquiry);
                    setMessages([{ id: 1, sender: "customer", text: parsed.message, time: parsed.time || "14:20" }]);
                    fetchSimilarFaqs(parsed.message);
                }
                setIsLoading(false);
            }
        };
        loadDetail();
    }, [customerId, fetchSimilarFaqs, navigate]);

    const handleSend = useCallback(async () => {
        if (!inputValue.trim() || !customerId) return;
        
        const textToSend = inputValue;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const messageId = Date.now();
        
        setInputValue("");

        const newMessage: Message = { id: messageId, sender: "agent", text: textToSend, time: now };
        setMessages((prev) => [...prev, newMessage]);

        localStorage.setItem("agentMessage", JSON.stringify({
            id: messageId,
            text: textToSend,
            time: now
        }));
        
        try {
            await sendConsultationMessage(customerId, textToSend);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        } catch (err) {
            console.warn("메시지 서버 전송 실패 (로컬 유지):", err);
        }
    }, [inputValue, customerId]);

    const handleFinalComplete = async () => {
        if (!customerId) return;
        try {
            try {
                await completeConsultation(customerId, record); 
            } catch {
                console.warn("서버 결과 저장 실패, 로컬 히스토리만 업데이트합니다.");
            }

            const existingHistoryRaw = localStorage.getItem("consultationHistory");
            const existingHistory: ConsultationResponse[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
            
            // [해결] consultation_id(number), priority("MID"), contact_info(필수) 추가
            const newDoneEntry: ConsultationResponse = {
                consultation_id: Date.now(), 
                customer_name: customerInfo?.customer_name || "알 수 없는 고객",
                contact_info: customerInfo?.contact_info || "010-0000-0000",
                category: "채팅상담", 
                issue_detail: record.issue_type_code === "BILL_INQUIRY" ? "요금/결합 할인" : "일반 문의",
                content_preview: record.summary_text,
                status: "DONE",
                priority: "MID", 
                channel_type: "CHAT",
                created_at: new Date().toISOString()
            };

            localStorage.setItem("consultationHistory", JSON.stringify([newDoneEntry, ...existingHistory]));
            ["lastInquiry", "isMatched", "currentCustomer", "assignedCustomer"].forEach(k => localStorage.removeItem(k));
            
            alert("상담 내역이 저장되었습니다.");
            navigate("/dashboard"); 
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    if (isLoading) return <div className={styles.loadingContainer}>데이터 로드 중...</div>;

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
                <aside className={styles.sideSection}>
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
                            <button type="button" onClick={() => setIsPhoneVisible(!isPhoneVisible)} style={{ marginLeft: "auto" }}>
                                {isPhoneVisible ? <EyeOff size={14} color="#999" /> : <Eye size={14} color="#E6007E" />}
                            </button>
                        </div>
                        <div className={styles.infoItem}>
                            <Mail size={16} color="#666" />
                            <span style={{ fontSize: "13px" }}>{customerInfo?.email}</span>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Edit3 size={18} color="#E6007E" /> AI 실시간 요약</h3>
                        <textarea
                            className={styles.memoArea}
                            value={record.summary_text}
                            onChange={(e) => setRecord({ ...record, summary_text: e.target.value })}
                        />
                        <div className={styles.aiGlowText}>
                           <Sparkles size={12} color="#E6007E" /> 실시간 상담 문맥 분석 및 기록 중
                        </div>
                    </article>
                </aside>

                <section className={styles.chatSection}>
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

                <aside className={styles.sideSection}>
                    <article className={styles.statCard}>
                        <h3 className={styles.cardTitle}><Users size={20} color="#E6007E" /> 실시간 대기</h3>
                        <div className={styles.waitNumber}><strong>{waitingCount}</strong> <span>명</span></div>
                    </article>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Search size={18} color="#E6007E" /> 유사 FAQ 추천</h3>
                        <div className={styles.faqWrapper}>
                            {similarFaqs.map((faq) => (
                                <div key={faq.faq_id} className={styles.faqItem}>
                                    <p style={{ fontSize: '13px', fontWeight: 600 }}>Q. {faq.question}</p>
                                    <button className={styles.faqCopyBtn} onClick={() => setInputValue(faq.answer)}>내용 복사</button>
                                </div>
                            ))}
                        </div>
                    </article>
                </aside>
            </div>

            {showExitModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.exitModal}>
                        <div className={styles.modalHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={22} color="#E6007E" />
                                <h2>상담 종료 및 결과 기록</h2>
                            </div>
                            <button onClick={() => setShowExitModal(false)}><X size={24} color="#666" /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.fieldGroup}>
                                <label><Edit3 size={14} /> AI 최종 상담 요약</label>
                                <textarea value={record.summary_text} onChange={(e) => setRecord({...record, summary_text: e.target.value})} />
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