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
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useConsultation } from "../../hooks/useConsultation";
import { 
    getConsultationDetail, 
    sendConsultationMessage, 
    completeConsultation 
} from "../../api/services/consultation";
import { getSimilarFaq } from "../../api/services/faq"; // ✨ FAQ 서비스 추가
import type { ConsultationResponse } from "../../types/consultation";
import * as styles from "./Style/Consultation.css.ts";

/** 메시지 객체 및 FAQ 타입을 위한 정의 */
interface Message {
    id: number;
    sender: "customer" | "agent" | "ai";
    text: string;
    time: string;
    isAI?: boolean;
}

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    score: number;
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
    const { waitingCount } = useConsultation();

    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState<ConsultationResponse | null>(null);
    const [similarFaqs, setSimilarFaqs] = useState<FaqItem[]>([]); // ✨ FAQ 상태

    const [record, setRecord] = useState<ConsultationRecord>({
        customer_request: "",
        agent_action: "",
        summary_text: "",
        issue_type_code: "BILL_INQUIRY",
        resolution_code: "DONE",
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    // 1. 유사 FAQ 검색 함수 (명세서 11번: GET /api/v1/search/faq)
    const fetchSimilarFaqs = useCallback(async (text: string) => {
        try {
            const data = await getSimilarFaq(text);
            setSimilarFaqs(data);
        } catch (err) {
            console.error("FAQ 로드 실패:", err);
        }
    }, []);

    // 2. 초기 데이터 로드
    useEffect(() => {
        const loadDetail = async () => {
            if (!customerId) return;
            try {
                setIsLoading(true);
                const data = await getConsultationDetail(customerId);
                setCustomerInfo(data);
                
                // 초기 대화 및 FAQ 추천 시뮬레이션
                setMessages([
                    { id: 1, sender: "customer", text: "가족 결합 할인이 왜 이번 달에 적용이 안 됐나요?", time: "14:20" },
                    { id: 2, sender: "ai", text: "[AI 분석] 요금제 변경으로 인해 결합 조건이 해지된 상태입니다.", time: "14:21", isAI: true }
                ]);
                fetchSimilarFaqs("가족 결합 할인"); 
            } catch (err) {
                console.error("상세 정보 로드 실패:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDetail();
    }, [customerId, fetchSimilarFaqs]);

    // 3. 메시지 전송
    const handleSend = useCallback(async () => {
        if (!inputValue.trim() || !customerId) return;
        const textToSend = inputValue;
        setInputValue("");
        try {
            await sendConsultationMessage(customerId, textToSend);
            const newMessage: Message = {
                id: Date.now(),
                sender: "agent",
                text: textToSend,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, newMessage]);
            
            // 전송 후 새로운 FAQ 추천이 필요하다면 여기서 호출 가능
            // fetchSimilarFaqs(textToSend); 
        } catch (err) {
            console.error("메시지 전송 실패:", err);
        }
    }, [inputValue, customerId, fetchSimilarFaqs]);

    // 4. 상담 종료 (명세서 4번: 상담 기록 포함)
    const handleComplete = async () => {
        if (!customerId) return;
        if (!window.confirm("상담을 종료하고 기록을 확정하시겠습니까?")) return;
        try {
            // 명세서 규격에 맞게 record(요약문 등)를 같이 보낼 수 있도록 구조화
            await completeConsultation(customerId); 
            navigate("/dashboard");
        } catch (err) {
            console.error("상담 종료 실패:", err);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
        }
    }, [messages.length]);

    if (isLoading) return <div style={{ padding: "50px", textAlign: "center" }}>데이터 로드 중...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.statusDot} />
                    <h1 className={styles.title}>상담 세션: {customerId}</h1>
                    <section className={styles.timer}><Clock size={16} /> 04:12</section>
                </div>
                <button type="button" className={styles.exitButton} onClick={handleComplete}>
                    <Save size={16} style={{ marginRight: "6px" }} /> 종료 및 기록 확정
                </button>
            </header>

            <div className={styles.mainLayout}>
                {/* 좌측 사이드바: 고객정보, 상담요약 */}
                <aside className={styles.sideSection}>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>고객 정보</h3>
                        <div className={styles.avatar} style={{ margin: "0 auto 16px" }}><User size={40} color="#E6007E" /></div>
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <strong>{customerInfo?.customer_name || "고객님"}</strong>
                            <p style={{ color: "#E6007E", fontWeight: 800, fontSize: "12px" }}>VIP Platinum</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div className={styles.infoItem}>
                                <Phone size={16} color="#666" />
                                <span>{isPhoneVisible ? (customerInfo?.contact_info || "010-1234-5678") : "010-****-****"}</span>
                                <button 
                                    type="button" 
                                    onClick={() => setIsPhoneVisible(!isPhoneVisible)} 
                                    style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}
                                >
                                    {isPhoneVisible ? <EyeOff size={14} color="#999" /> : <Eye size={14} color="#E6007E" />}
                                </button>
                            </div>
                            <div className={styles.infoItem}>
                                <Mail size={16} color="#666" />
                                <span style={{ fontSize: "13px" }}>user@uplus.co.kr</span>
                            </div>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Edit3 size={18} color="#E6007E" /> 상담 요약</h3>
                        <textarea
                            className={styles.memoArea}
                            placeholder="상담 내용을 요약하세요..."
                            value={record.summary_text}
                            onChange={(e) => setRecord({ ...record, summary_text: e.target.value })}
                            style={{ height: "120px" }}
                        />
                    </article>
                </aside>

                {/* 중앙: 채팅 영역 */}
                <section className={styles.chatSection}>
                    <div className={styles.messageList} ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={msg.sender === "customer" ? styles.customerMsg : msg.isAI ? styles.aiMsg : styles.agentMsg}>
                                <div className={styles.bubble}>{msg.text}</div>
                                <time className={styles.msgTime}>{msg.time}</time>
                            </div>
                        ))}
                    </div>

                    <footer className={styles.aiGuideArea}>
                        <div className={styles.aiGuideHeader}><Sparkles size={16} /> AI 추천 답변</div>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                            <button type="button" className={styles.aiSuggestBtn} onClick={() => setInputValue("가족 결합 할인 소급 적용 안내 완료하였습니다.")}>
                                <MessageSquare size={14} /> 소급 적용 안내
                            </button>
                            <button type="button" className={styles.aiSuggestBtn} onClick={() => setInputValue("요금제 변경으로 인한 결합 해지 사유를 설명드렸습니다.")}>
                                <Tag size={14} /> 결합 해지 설명
                            </button>
                        </div>
                        <div className={styles.inputArea}>
                            <input
                                type="text" className={styles.input} value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="메시지를 입력하세요..."
                            />
                            <button type="button" className={styles.sendBtn} onClick={handleSend}><Send size={20} /></button>
                        </div>
                    </footer>
                </section>

                {/* 우측 사이드바: 대기열, ✨유사 FAQ, 키워드 */}
                <aside className={styles.sideSection}>
                    <article className={styles.card} style={{ backgroundColor: "#FFF0F6" }}>
                        <h3 className={styles.cardTitle} style={{ color: "#E6007E" }}><Users size={20} /> 실시간 대기</h3>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "32px", fontWeight: 900, color: "#E6007E" }}>{waitingCount}</span>
                            <span style={{ marginLeft: "4px" }}>명</span>
                        </div>
                    </article>

                    {/* ✨ 명세서 11번: 유사 FAQ 추천 영역 */}
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <Search size={18} color="#E6007E" style={{ marginRight: "6px" }} />
                            유사 FAQ 추천
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {similarFaqs.length > 0 ? (
                                similarFaqs.map((faq) => (
                                    <div key={faq.id} style={{ padding: "10px", borderRadius: "8px", backgroundColor: "#F9F9F9", border: "1px solid #EEE" }}>
                                        <p style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>Q. {faq.question}</p>
                                        <button 
                                            type="button"
                                            className={styles.aiSuggestBtn}
                                            onClick={() => setInputValue(faq.answer)}
                                            style={{ width: "100%", fontSize: "11px", padding: "6px" }}
                                        >
                                            답변 복사하기
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>추천 FAQ가 없습니다.</p>
                            )}
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><Tag size={18} color="#007AFF" /> 추출 키워드</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {["요금제변경", "가족결합", "미납안내"].map((tag) => (
                                <span key={tag} style={{ padding: "4px 10px", backgroundColor: "#F0F7FF", color: "#007AFF", borderRadius: "100px", fontSize: "12px", fontWeight: 700 }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </aside>
            </div>
        </div>
    );
};

export default ConsultationDetail;