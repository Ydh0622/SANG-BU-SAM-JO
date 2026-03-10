import {
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    Eye,
    FileText,
    MessageCircle,
    User,
} from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import { fetchSearchList } from "../../api/services/search"; 
import * as styles from "./Style/HistoryDetail.css.ts";

/** 1. ERD 명세 기반 타입 정의 */
interface Message {
    id: number;
    sender_type_code: "CUSTOMER" | "AGENT" | "SYSTEM";
    content: string;
    sent_at: string;
}

interface HistoryData {
    consultation_id: string;
    started_at: string;
    ended_at: string;
    duration: string;
    customer_name: string;
    mask_phone: string;
    category_display: string;
    agent_name: string;
    customer_request: string;
    agent_action: string;
    summary_text: string;
    messages: Message[];
}

const ConsultationHistory: React.FC = () => {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    
    const [historyData, setHistoryData] = useState<HistoryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /** 서버에서 상세 데이터 가져오기 */
    useEffect(() => {
        const loadDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetchSearchList("ALL");
                const found = response.data.find(item => String(item.consultationId) === historyId);

                if (found) {
                    setHistoryData({
                        consultation_id: String(found.consultationId),
                        started_at: found.startedAt ? found.startedAt.replace('T', ' ').split('.')[0] : "기록 없음",
                        ended_at: found.endedAt ? found.endedAt.split('T')[1].split('.')[0] : "진행중",
                        duration: found.startedAt && found.endedAt ? "계산됨" : "-",
                        customer_name: found.customerName || "이름 없음",
                        mask_phone: "010-****-****", 
                        category_display: found.consultationCategory || "일반상담",
                        agent_name: found.agentId ? `상담원 #${found.agentId}` : "미지정",
                        customer_request: "과거 상담 이력 데이터입니다.",
                        agent_action: found.summaryText || "조치 내역 없음",
                        summary_text: found.summaryText || "요약 내역이 없습니다.",
                        messages: [] 
                    });
                }
            } catch (error) {
                console.error("상세 데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (historyId) loadDetail();
    }, [historyId]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '100px 20px', textAlign: 'center', color: '#E6007E', fontWeight: 700 }}>
                    상담 기록을 불러오는 중입니다...
                </div>
            </div>
        );
    }

    if (!historyData) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button 
                            type="button" 
                            onClick={() => navigate("/search")} 
                            className={styles.backButton}
                        >
                            <ArrowLeft size={24} color="#333" />
                        </button>
                        <h1 className={styles.title}>상담 기록 상세조회</h1>
                    </div>
                </header>
                <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2 style={{ color: '#E6007E', fontSize: '24px' }}>상담 기록 상세 정보를 찾을 수 없습니다.</h2>
                    <p style={{ marginTop: '16px', color: '#666' }}>ID: {historyId}</p>
                    <button onClick={() => navigate('/search')} style={{ marginTop: '30px', padding: '12px 24px', backgroundColor: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>목록으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button 
                        type="button" 
                        onClick={() => navigate("/search")} 
                        className={styles.backButton}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </button>
                    <h1 className={styles.title}>
                        상담 기록 상세조회
                        <span style={{ marginLeft: "12px", color: "#888", fontWeight: 500, fontSize: "14px" }}>
                            ID: {historyData.consultation_id}
                        </span>
                    </h1>
                </div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                        type="button" 
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#E6007E', color: '#FFFFFF',
                            padding: '10px 20px', borderRadius: '12px',
                            border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                        }}
                        onClick={() => alert("상담 기록을 PDF로 저장합니다.")}
                    >
                        <Download size={18} strokeWidth={2.5} />
                        기록 PDF 저장
                    </button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                <aside className={styles.sideSection}>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><User size={18} /> 고객 및 상담 정보</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <strong><Calendar size={14} /> 상담일자</strong>
                                <span>{historyData.started_at.split(" ")[0]}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong><Clock size={14} /> 상담시간</strong>
                                <span>
                                    {historyData.started_at.split(" ")[1]} ~ {historyData.ended_at} ({historyData.duration})
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>고객명</strong>
                                <span>{historyData.customer_name}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>연락처</strong>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span>{isPhoneVisible ? historyData.mask_phone.replace(/\*/g, '8') : historyData.mask_phone}</span>
                                    <button type="button" onClick={() => setIsPhoneVisible(!isPhoneVisible)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Eye size={14} color="#E6007E" />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>상담분류</strong>
                                <span style={{ color: '#E6007E', fontWeight: 700 }}>{historyData.category_display}</span>
                            </div>
                        </div>
                    </article>

                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}><FileText size={18} /> 상담 기록 요약</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div>
                                <h4 style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>고객 요청</h4>
                                <p style={{ fontSize: "14px" }}>{historyData.customer_request}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>상담사 조치</h4>
                                <p style={{ fontSize: "14px" }}>{historyData.agent_action}</p>
                            </div>
                            <div style={{ backgroundColor: "#fff0f6", padding: "12px", borderRadius: "10px" }}>
                                <h4 style={{ fontSize: "12px", color: "#E6007E", fontWeight: 800, marginBottom: "4px" }}>최종 요약</h4>
                                <p style={{ fontSize: "14px", fontWeight: 500 }}>{historyData.summary_text}</p>
                            </div>
                        </div>
                    </article>
                </aside>

                <section className={styles.chatSection}>
                    <div className={styles.chatHeader}>
                        <MessageCircle size={18} color="#666" /> 전체 대화 기록
                    </div>
                    <div className={styles.messageList}>
                        {historyData.messages.length > 0 ? (
                            historyData.messages.map((msg) => (
                                <div key={msg.id} className={msg.sender_type_code === "CUSTOMER" ? styles.customerMsg : styles.agentMsg}>
                                    <div className={styles.bubble}>{msg.content}</div>
                                    <time className={msg.sent_at === "기록 없음" ? "" : styles.msgTime}>{msg.sent_at}</time>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>대화 기록이 없습니다.</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ConsultationHistory;