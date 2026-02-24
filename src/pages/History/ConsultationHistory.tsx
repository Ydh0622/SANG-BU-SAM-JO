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
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

/**  목데이터 DB (김철수와 고길동 상세 데이터 포함) */
const MOCK_HISTORY_DB: Record<string, HistoryData> = {
    "102938": {
        consultation_id: "102938",
        started_at: "2026.02.11 10:42",
        ended_at: "10:55",
        duration: "13분",
        customer_name: "김철수",
        mask_phone: "010-****-5678",
        category_display: "요금제 변경",
        agent_name: "나상담",
        customer_request: "요금제 부담으로 인한 혜택 강화 상품 문의",
        agent_action: "5G 시그니처 요금제 및 결합 할인 안내 후 변경 접수",
        summary_text: "5G 시그니처 요금제 변경 및 가족 결합 할인 혜택 안내 완료.",
        messages: [
            { id: 1, sender_type_code: "CUSTOMER", content: "요금제가 너무 비싼 것 같은데 혜택이 더 좋은 게 있나요?", sent_at: "10:42" },
            { id: 2, sender_type_code: "AGENT", content: "안녕하세요 김철수 고객님! 5G 시그니처로 옮기시면 결합 할인이 커져서 유리합니다.", sent_at: "10:45" },
        ],
    },
    /** 고길동 상세 데이터 추가 */
    "102939": {
        consultation_id: "102939",
        started_at: "2026.02.23 09:15",
        ended_at: "09:30",
        duration: "15분",
        customer_name: "고길동",
        mask_phone: "010-****-9999",
        category_display: "기술 지원",
        agent_name: "나상담",
        customer_request: "인터넷 연결이 간헐적으로 끊기는 현상 발생",
        agent_action: "단말기 신호 재송출 및 셋톱박스 초기화 원격 지원",
        summary_text: "셋톱박스 소프트웨어 업데이트 후 신호 안정화 확인됨.",
        messages: [
            { id: 1, sender_type_code: "CUSTOMER", content: "인터넷이 자꾸 끊겼다 안됐다 하는데 확인 좀 해주세요.", sent_at: "09:15" },
            { id: 2, sender_type_code: "AGENT", content: "불편을 드려 죄송합니다. 고길동 고객님, 현재 신호 상태 확인 중입니다.", sent_at: "09:17" },
            { id: 3, sender_type_code: "AGENT", content: "셋톱박스 재부팅 신호를 보냈습니다. 1분만 기다려주세요.", sent_at: "09:20" },
            { id: 4, sender_type_code: "CUSTOMER", content: "오 이제 다시 잘 되네요. 감사합니다.", sent_at: "09:28" },
        ],
    }
};

const ConsultationHistory: React.FC = () => {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);

    const historyData = useMemo<HistoryData | null>(() => {
        if (!historyId) return null;

        // 1. localStorage(실제 채팅 종료 데이터)에서 조회
        const savedDBRaw = localStorage.getItem("consultationHistoryDB");
        if (savedDBRaw) {
            const savedDB = JSON.parse(savedDBRaw);
            if (savedDB[historyId]) return savedDB[historyId];
        }

        // 2. 목데이터(가짜 데이터)에서 ID로 정확히 조회
        if (MOCK_HISTORY_DB[historyId]) return MOCK_HISTORY_DB[historyId];

        return null;
    }, [historyId]);

    if (!historyData) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2 style={{ color: '#E6007E', fontSize: '24px' }}>상담 기록 상세 정보를 찾을 수 없습니다.</h2>
                    <p style={{ marginTop: '16px', color: '#666' }}>ID: {historyId}</p>
                    <button onClick={() => navigate('/dashboard')} style={{ marginTop: '30px', padding: '12px 24px', backgroundColor: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>대시보드로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#E6007E',
                            color: '#FFFFFF',
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(230, 0, 126, 0.2)',
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
                                    <button type="button" onClick={() => setIsPhoneVisible(!isPhoneVisible)}>
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
                        {historyData.messages.map((msg) => (
                            <div key={msg.id} className={msg.sender_type_code === "CUSTOMER" ? styles.customerMsg : styles.agentMsg}>
                                <div className={styles.bubble}>{msg.content}</div>
                                <time className={styles.msgTime}>{msg.sent_at}</time>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ConsultationHistory;