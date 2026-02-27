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

/** * [MOCK DATA] 시연을 위한 가짜 데이터베이스
 * TODO: 나중에 실제 API 연동 시 이 MOCK_HISTORY_DB 전체를 삭제하세요.
 */
const MOCK_HISTORY_DB: Record<string, HistoryData> = {
    // 1. 김유플 고객님 (ID: 101)
    "101": {
        consultation_id: "101",
        started_at: "2026.02.27 11:20",
        ended_at: "11:35",
        duration: "15분",
        customer_name: "김유플",
        mask_phone: "010-****-1234",
        category_display: "요금제 문의",
        agent_name: "유덕현", 
        customer_request: "5G 다이렉트 요금제 변경 및 할인 혜택 확인 요청",
        agent_action: "5G 다이렉트 65 상품 안내 및 변경 접수 완료",
        summary_text: "5G 다이렉트 요금제로 변경 완료 및 가족 결합 할인 유지 확인됨.",
        messages: [
            { id: 1, sender_type_code: "CUSTOMER", content: "5G 다이렉트 요금제로 바꾸고 싶은데 어떻게 되나요?", sent_at: "11:20" },
            { id: 2, sender_type_code: "AGENT", content: "안녕하세요 김유플 고객님! 5G 다이렉트로 옮기시면 결합 할인이 커져서 유리합니다.", sent_at: "11:22" },
            { id: 3, sender_type_code: "CUSTOMER", content: "네, 그걸로 변경해 주세요.", sent_at: "11:30" },
        ],
    },
    // 2. 이엘지 고객님 (ID: 102)
    "102": {
        consultation_id: "102",
        started_at: "2026.02.27 10:10",
        ended_at: "10:25",
        duration: "15분",
        customer_name: "이엘지",
        mask_phone: "010-****-5678",
        category_display: "기기 결합",
        agent_name: "유덕현",
        customer_request: "가족 무한 결합 할인 혜택 및 인터넷 합산 문의",
        agent_action: "결합 가능한 인터넷 회선 확인 및 예상 할인 금액 산출 안내",
        summary_text: "인터넷+모바일 3회선 결합 시 월 22,000원 할인 안내 완료.",
        messages: [
            { id: 1, sender_type_code: "CUSTOMER", content: "인터넷이랑 결합하면 얼마나 할인되나요?", sent_at: "10:10" },
            { id: 2, sender_type_code: "AGENT", content: "가족분들 휴대폰 회선 수에 따라 달라집니다. 확인해 드릴까요?", sent_at: "10:12" },
        ],
    },
    // 3. 박Eureka 고객님 (ID: 103)
    "103": {
        consultation_id: "103",
        started_at: "2026.02.27 09:40",
        ended_at: "09:50",
        duration: "10분",
        customer_name: "박Eureka",
        mask_phone: "010-****-9999",
        category_display: "분실 신고",
        agent_name: "유덕현",
        customer_request: "휴대폰 분실로 인한 일시 정지 및 위치 찾기 서비스 문의",
        agent_action: "분실 정지 즉시 접수 및 위치 정보 확인 방법 안내",
        summary_text: "분실 정지 처리 완료 및 보상 기변 절차 안내.",
        messages: [
            { id: 1, sender_type_code: "CUSTOMER", content: "핸드폰을 잃어버렸어요. 정지 부탁드립니다.", sent_at: "09:40" },
            { id: 2, sender_type_code: "AGENT", content: "네, 즉시 정지 처리 도와드리겠습니다. 본인 확인 부탁드립니다.", sent_at: "09:42" },
        ],
    }
};

const ConsultationHistory: React.FC = () => {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);

    const historyData = useMemo<HistoryData | null>(() => {
        if (!historyId) return null;

        const savedDBRaw = localStorage.getItem("consultationHistoryDB");
        if (savedDBRaw) {
            const savedDB = JSON.parse(savedDBRaw);
            if (savedDB[historyId]) return savedDB[historyId];
        }

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
                        className={styles.primaryBtn} // 스타일이 정의되어 있다면 클래스 사용
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