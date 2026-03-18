import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as styles from "./Style/CustomerChat.css.ts";

/** 1. 메시지 객체의 타입 정의 */
interface ChatMessage {
    id: number;
    sender: 'me' | 'agent';
    text: string;
    time: string;
}

const CustomerChat = () => {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // 상담 종료 모달 상태
    const [showTerminatedModal, setShowTerminatedModal] = useState(false);

    // 2. 초기 메시지 설정: 상담사 환영 메시지 + 고객 문의 내역 자동 로드
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const savedInquiry = localStorage.getItem("customerInquiry");
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // [A] 상담사의 첫 환영 인사 (고정)
        const initialMsgs: ChatMessage[] = [
            {
                id: 1000,
                sender: 'agent',
                text: '안녕하세요! LG U+ 고객센터입니다. 무엇을 도와드릴까요?',
                time: now
            }
        ];

        // [B] 고객이 신청 단계에서 작성한 내용이 있다면 추가
        if (savedInquiry) {
            try {
                const data = JSON.parse(savedInquiry);
                
                // 고객 본인이 보낸 메시지
                initialMsgs.push({ 
                    id: Date.now(), 
                    sender: 'me', 
                    text: data.message || data.text || "상담을 신청합니다.", 
                    time: data.time || now 
                });

                // [C] 고객 메시지 수신 후 상담사의 자동 응답
                initialMsgs.push({ 
                    id: Date.now() + 1, 
                    sender: 'agent', 
                    text: '문의하신 내용을 상담사가 확인하고 있습니다. 잠시만 기다려 주세요.', 
                    time: now 
                });
            } catch (e) {
                console.error("초기 데이터 파싱 에러:", e);
            }
        }
        
        return initialMsgs;
    });

    const [input, setInput] = useState("");

    /** 3. 실시간 통신 감지 (상담사 메시지 수신 및 종료 감지) */
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            // 상담 종료 감지 (isMatched가 삭제되거나 false가 될 때)
            if (e.key === "isMatched" && (e.newValue === null || e.newValue === "false")) {
                setShowTerminatedModal(true);
            }

            // 상담사가 보낸 실시간 메시지 수신
            if (e.key === "agentMessage" && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    setMessages(prev => {
                        // 중복 메시지 방지
                        if (prev.some(msg => msg.id === data.id)) return prev;
                        return [...prev, {
                            id: data.id,
                            sender: 'agent',
                            text: data.text,
                            time: data.time
                        }];
                    });
                } catch (err) {
                    console.error("메시지 데이터 파싱 실패", err);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    /** 4. 스크롤 하단 자동 이동 */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    /** 5. 메시지 전송 함수 */
    const handleSend = () => {
        if (!input.trim()) return;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageId = Date.now();
        
        const newMessage: ChatMessage = { 
            id: messageId, 
            sender: 'me', 
            text: input, 
            time: now 
        };

        setMessages(prev => [...prev, newMessage]);
        // 상담사 화면으로 메시지 전달
        localStorage.setItem("customerMessage", JSON.stringify(newMessage));
        setInput("");
    };

    /** 6. 상담 종료 후 페이지 이동 */
    const handleCloseAndNavigate = () => {
        setShowTerminatedModal(false);

        localStorage.removeItem("customerInquiry");
        navigate('/customer/apply', { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.phoneFrame}>
                {/* 헤더 섹션 */}
                <header className={styles.chatHeader}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1, marginLeft: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#E6007E', fontWeight: 800 }}>실시간 매칭 완료</div>
                        <div style={{ fontSize: '16px', fontWeight: 800 }}>U+ 전문 상담사</div>
                    </div>
                    <button onClick={() => navigate('/customer/apply')} className={styles.homeBtn}>
                        <Home size={24} />
                    </button>
                </header>

                {/* 채팅 영역 */}
                <div className={styles.chatArea} ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.sender === 'me' ? styles.myMsgWrapper : styles.agentMsgWrapper}>
                            <div className={msg.sender === 'me' ? styles.myBubble : styles.agentBubble}>
                                {msg.text}
                            </div>
                            <span className={styles.timeLabel}>{msg.time}</span>
                        </div>
                    ))}
                </div>

                {/* 입력 영역 */}
                <div className={styles.inputArea}>
                    <input 
                        className={styles.textField} 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="상담사에게 메시지 보내기..."
                    />
                    <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}>
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* 상담 종료 안내 모달 */}
            {showTerminatedModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AlertCircle size={48} color="#E6007E" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>상담 종료</h2>
                        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
                            상담사에 의해 상담이 종료되었습니다.<br />
                            이용해 주셔서 감사합니다.
                        </p>
                        <button 
                            onClick={handleCloseAndNavigate}
                            className={styles.modalConfirmBtn}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerChat;