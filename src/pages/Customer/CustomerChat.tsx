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

    // 2. 초기 메시지 설정 및 로컬스토리지 연동
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const savedInquiry = localStorage.getItem("customerInquiry");
        if (savedInquiry) {
            const data = JSON.parse(savedInquiry);
            return [
                { 
                    id: Date.now(), 
                    sender: 'me', 
                    text: data.message, 
                    time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                },
                { 
                    id: Date.now() + 1, 
                    sender: 'agent', 
                    text: '안녕하세요! LG U+ 전문 상담사입니다. 문의하신 내용 확인을 위해 잠시만 대기 부탁드립니다.', 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }
            ];
        }
        return [];
    });

    const [input, setInput] = useState("");

    // 3. 상담사의 메시지 및 상담 종료 실시간 감지
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            // [추가] 상담 종료 감지: 상담사 쪽에서 'isMatched'를 삭제하거나 false로 만들 때
            if (e.key === "isMatched" && (e.newValue === null || e.newValue === "false")) {
                setShowTerminatedModal(true);
            }

            // 상담사 메시지 수신
            if (e.key === "agentMessage" && e.newValue) {
                const data: ChatMessage = JSON.parse(e.newValue);
                setMessages(prev => {
                    if (prev.some(msg => msg.id === data.id)) return prev;
                    return [...prev, {
                        id: data.id,
                        sender: 'agent',
                        text: data.text,
                        time: data.time
                    }];
                });
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // 4. 메시지 추가 시 하단으로 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 5. 메시지 전송 함수
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
        localStorage.setItem("customerMessage", JSON.stringify(newMessage));
        setInput("");
    };

    // [추가] 상담 종료 확인 후 이동
    const handleCloseAndNavigate = () => {
        setShowTerminatedModal(false);
        navigate('/customer/apply', { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.phoneFrame}>
                <header className={styles.chatHeader}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1, marginLeft: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#E6007E', fontWeight: 700 }}>실시간 매칭 완료</div>
                        <div style={{ fontSize: '16px', fontWeight: 800 }}>U+ 전문 상담사</div>
                    </div>
                    <button onClick={() => navigate('/customer/apply')} className={styles.homeBtn}>
                        <Home size={24} />
                    </button>
                </header>

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

            {/*  상담 종료 안내 모달 */}
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