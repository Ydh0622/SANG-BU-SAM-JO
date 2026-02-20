import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, MessageCircle, FileText, Download, Clock, ShieldCheck } from 'lucide-react';
import * as styles from "./Style/HistoryDetail.css.ts";

// ✅ 1. 명확한 타입 정의 (any 제거)
interface Message {
  id: number;
  sender: 'customer' | 'agent' | 'ai';
  text: string;
  time: string;
  isAI?: boolean;
}

interface HistoryData {
  id: string;
  date: string;
  time: string;
  customer: string;
  type: string;
  agent: string;
  summary: string;
  messages: Message[];
}

// 2. Mock DB에 타입 적용
const MOCK_HISTORY_DB: Record<string, HistoryData> = {
  "LOG_001": {
    id: "LOG_001",
    date: "2026.02.11",
    time: "10:42 ~ 10:55",
    customer: "김철수",
    type: "요금제 변경",
    agent: "나상담",
    summary: "5G 시그니처 요금제 변경 및 가족 결합 할인 혜택을 상세히 안내함. 최종적으로 변경 동의.",
    messages: [
      { id: 1, sender: 'customer', text: '요금제가 너무 비싼 것 같은데 혜택이 더 좋은 게 있나요?', time: '10:42' },
      { id: 3, sender: 'agent', text: '안녕하세요 김철수 고객님! 5G 시그니처로 옮기시면 결합 할인이 커져서 유리합니다.', time: '10:45' },
    ]
  },
  "LOG_002": {
    id: "LOG_002",
    date: "2026.02.10",
    time: "14:15 ~ 14:30",
    customer: "고길동",
    type: "결합할인",
    agent: "나상담",
    summary: "가족 결합 범위 확대에 따른 추가 서류 및 혜택 상담 완료. 대리인 서류 안내함.",
    messages: [
      { id: 1, sender: 'customer', text: '가족 결합 범위를 조카까지 넓힐 수 있나요?', time: '14:15' },
      { id: 3, sender: 'agent', text: '고길동 고객님, 현재 U+ 가족 결합은 직계 존비속 외에 형제, 자매까지 가능합니다.', time: '14:18' },
    ]
  }
};

const ConsultationHistory: React.FC = () => {
  const { historyId } = useParams<{ historyId: string }>();
  const navigate = useNavigate();

  // 3. 동적 데이터 매핑 (타입 추론 적용)
  const historyData = useMemo<HistoryData>(() => {
    return MOCK_HISTORY_DB[historyId || ""] || MOCK_HISTORY_DB["LOG_002"];
  }, [historyId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} color="#333" />
          </button>
          <h1 className={styles.title}>
            상담 기록 상세조회 
            <span style={{ marginLeft: '12px', color: '#888', fontWeight: 500, fontSize: '16px' }}>
              ID: {historyData.id}
            </span>
          </h1>
        </div>
        <button className={styles.downloadBtn}>
          <Download size={18} /> 기록 PDF 저장
        </button>
      </header>

      <div className={styles.mainLayout}>
        <aside className={styles.sideSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <User size={18} /> 고객 및 상담 정보
            </h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <strong><Calendar size={14} /> 상담일자</strong>
                <span>{historyData.date}</span>
              </div>
              <div className={styles.infoItem}>
                <strong><Clock size={14} /> 상담시간</strong>
                <span>{historyData.time}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>고객명</strong>
                <span>{historyData.customer}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>상담유형</strong>
                <span style={{ color: '#E6007E', fontWeight: 700 }}>{historyData.type}</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FileText size={18} /> AI 최종 요약
            </h3>
            <p className={styles.summaryText}>{historyData.summary}</p>
          </div>
        </aside>

        <section className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <MessageCircle size={18} color="#666" /> 전체 대화 기록
          </div>
          <div className={styles.messageList}>
            {/* ✅ msg: Message 타입을 통해 any 에러 해결 */}
            {historyData.messages.map((msg: Message) => (
              <div 
                key={msg.id} 
                className={
                  msg.sender === 'customer' ? styles.customerMsg : 
                  msg.sender === 'ai' ? styles.aiMsg : styles.agentMsg
                }
              >
                <div className={styles.bubble}>{msg.text}</div>
                <span className={styles.msgTime}>{msg.time}</span>
              </div>
            ))}
          </div>
          <div className={styles.footerNote}>
            <ShieldCheck size={14} /> 본 상담 기록은 수정이 불가능한 읽기 전용 상태입니다.
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConsultationHistory;