import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, User, Phone, Mail, ShieldAlert, LogOut, Clock, MessageSquare } from 'lucide-react';
import * as styles from "./Style/Consultation.css.ts";

// 타입 정의
interface CustomerData {
  name: string;
  grade: string;
  phone: string;
  email: string;
  risk: string;
  history: string[];
  aiGuide: string;
}

const MOCK_DB: Record<string, CustomerData> = {
  "CUST_10024": {
    name: "고길동 고객님",
    grade: "VIP Platinum",
    phone: "010-1002-4xxx",
    email: "gogilldong@uplus.co.kr",
    risk: "이탈 주의: 최근 경쟁사 이동 키워드 언급",
    history: ["24.01.15 : 요금제 변경 상담", "23.12.02 : 가족 결합 할인 문의"],
    aiGuide: "고객님은 현재 무제한 요금제를 선호하며, OTT 결합 상품에 관심이 높습니다."
  },
  "CUST_001": {
    name: "김철수 고객님",
    grade: "Gold",
    phone: "010-1234-5678",
    email: "chulsoo@uplus.co.kr",
    risk: "특이사항 없음",
    history: ["24.01.20 : 신규 가입 상담"],
    aiGuide: "신규 가입 혜택 위주로 안내를 진행해 주세요."
  }
};

const ConsultationDetail: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 고객 데이터 결정 (렌더링 도중 즉시 계산)
  const customer = useMemo(() => {
    const targetId = customerId || "CUST_001";
    return MOCK_DB[targetId] || MOCK_DB["CUST_001"];
  }, [customerId]);

  const [messages, setMessages] = useState(() => [
    { id: 1, sender: 'customer', text: '안녕하세요, 상담 요청드립니다.', time: '14:20' },
    { id: 2, sender: 'ai', text: `[AI 분석] ${customer.aiGuide}`, time: '14:20', isAI: true }
  ]);
  
  const [inputValue, setInputValue] = useState("");

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = { 
      id: Date.now(), 
      sender: 'agent', 
      text: inputValue, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <div className={styles.container}>
      {/* Header 영역 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.statusDot}></div>
          <span className={styles.title} style={{ color: '#1A1A1A' }}>상담 중: {customer.name}</span>
          <div className={styles.timer}><Clock size={14} /> 00:34</div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className={styles.exitButton} onClick={() => navigate('/dashboard')}>종료 및 저장</button>
          <button className={styles.logoutButton} onClick={() => navigate('/')} title="로그아웃">
            <LogOut size={20} color="#333" />
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* Left: 고객 프로필 카드 */}
        <aside className={styles.sideSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ color: '#333' }}>고객 마스터 정보</h3>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}><User size={32} color="#E6007E" /></div>
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <strong style={{ fontSize: '18px', color: '#1A1A1A' }}>{customer.name}</strong>
                <p style={{ color: '#E6007E', fontWeight: 700, fontSize: '12px', marginTop: '4px' }}>{customer.grade}</p>
              </div>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoItem}><Phone size={14} /> {customer.phone}</div>
              <div className={styles.infoItem}><Mail size={14} /> {customer.email}</div>
            </div>
          </div>
        </aside>

        {/* Center: 채팅 영역 */}
        <section className={styles.chatSection}>
          <div className={styles.messageList} ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={msg.sender === 'customer' ? styles.customerMsg : msg.sender === 'ai' ? styles.aiMsg : styles.agentMsg}>
                <div className={styles.bubble}>{msg.text}</div>
                <span className={styles.msgTime}>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className={styles.aiGuideArea}>
            <div className={styles.aiGuideHeader}>
              <MessageSquare size={14} color="#007AFF" /> 
              <span style={{ color: '#007AFF', fontWeight: 700 }}>AI 실시간 추천 답변</span>
            </div>
            <div className={styles.suggestionList}>
              <button className={styles.suggestBtn} onClick={() => setInputValue(`${customer.name}, U+를 이용해 주셔서 감사합니다.`)}>
                "기본 인사말"
              </button>
            </div>
          </div>

          <div className={styles.inputArea}>
            <input 
              className={styles.input} 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지 입력..." 
            />
            <button className={styles.sendBtn} onClick={handleSend}><Send size={20} /></button>
          </div>
        </section>

        {/* Right: 분석 결과 */}
        <aside className={styles.sideSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ color: '#333' }}>
              <ShieldAlert size={16} color="#E6007E" style={{ marginRight: '6px' }} /> 
              실시간 분석
            </h3>
            <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
              ⚠️ {customer.risk}
            </div>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ color: '#333' }}>이전 상담 요약</h3>
            <ul style={{ padding: 0, listStyle: 'none', fontSize: '13px', color: '#666' }}>
              {customer.history.map((h, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>• {h}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ConsultationDetail;