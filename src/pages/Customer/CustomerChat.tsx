import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
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

    // 2. 초기 메시지 설정 및 로컬스토리지 연동
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const savedInquiry = localStorage.getItem("customerInquiry");
        if (savedInquiry) {
            const data = JSON.parse(savedInquiry);
            return [
                { id: Date.now(), sender: 'me', text: data.message, time: data.time || '오후 2:20' },
                { id: Date.now() + 1, sender: 'agent', text: '안녕하세요! LG U+ 전문 상담사입니다. 문의하신 내용 확인을 위해 잠시만 대기 부탁드립니다.', time: '오후 2:21' }
            ];
        }
        return [];
    });

    const [input, setInput] = useState("");

    useEffect(() => {
        const handleAgentMessage = (e: StorageEvent) => {
            if (e.key === "agentMessage" && e.newValue) {
                const data = JSON.parse(e.newValue);
                
                setMessages(prev => {
                    // 중복 수신 방지
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

        window.addEventListener("storage", handleAgentMessage);
        return () => window.removeEventListener("storage", handleAgentMessage);
    }, []);

    //  디테일: 메시지 추가 시 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageId = Date.now();
        
        // 1. 내 화면 업데이트
        const newMessage: ChatMessage = { id: messageId, sender: 'me', text: input, time: now };
        setMessages(prev => [...prev, newMessage]);
        
        // 2.  상담사 화면으로 전달 (localStorage 이벤트 발생)
        localStorage.setItem("customerInquiry", JSON.stringify({
            id: messageId,
            message: input,
            time: now
        }));

        setInput("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.phoneFrame}>
                <header className={styles.chatHeader}>
                    <button onClick={() => navigate('/customer')} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div style={{ fontSize: '13px', color: '#E6007E', fontWeight: 700 }}>실시간 매칭 완료</div>
                        <div style={{ fontSize: '17px', fontWeight: 800 }}>U+ 전문 상담사</div>
                    </div>
                </header>

                {/*  ref를 추가하여 자동 스크롤 적용 */}
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
        </div>
    );
};

export default CustomerChat;