import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowLeft, Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as styles from "./Style/CustomerChat.css.ts";

import { getConsultationDetail, sendConsultationMessage } from "../../api/services/consultation";
import type { ConsultationResponse } from "../../types/consultation";

// --- Types & Interfaces ---

interface ExtendedConsultationResponse extends ConsultationResponse {
    initialMessage?: string;
}

interface ConsultationDetailResponse {
    data: ExtendedConsultationResponse;
}

interface ChatMessage {
    id: number;
    sender: 'me' | 'agent';
    text: string;
    time: string;
}

const CustomerChat: React.FC = () => {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [consultationId, setConsultationId] = useState<string | null>(null);
    const [showTerminatedModal, setShowTerminatedModal] = useState(false);

    /**  Summary에서 넘겨준 customerInquiry를 읽어오는 로직 */
    useEffect(() => {
        const initChat = async () => {
            const storedId = localStorage.getItem("consultationId");
            //  Summary 페이지에서 저장한 그 '상세 문의 내용'을 가져옵니다.
            const localInquiry = localStorage.getItem("customerInquiry");
            
            if (!storedId) {
                navigate('/customer/apply');
                return;
            }
            
            setConsultationId(storedId);

            try {
                setIsLoading(true);
                const response = await getConsultationDetail(storedId);
                const resObj = response as unknown as ConsultationDetailResponse;
                const actualData = (resObj && resObj.data) ? resObj.data : (response as unknown as ExtendedConsultationResponse);

                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                //  초기 메시지 구성
                const initialMsgs: ChatMessage[] = [
                    {
                        id: 1000,
                        sender: 'agent',
                        text: '안녕하세요! LG U+ 고객센터입니다. 무엇을 도와드릴까요?',
                        time: now
                    },
                    { 
                        id: Date.now(), 
                        sender: 'me', 
                        //  여기서 localInquiry(상세문의 내용)를 가장 먼저 보여줍니다.
                        text: localInquiry || actualData.initialMessage || "상담을 신청합니다.", 
                        time: now 
                    },
                    { 
                        id: Date.now() + 1, 
                        sender: 'agent', 
                        text: '문의하신 내용을 상담사가 확인하고 있습니다. 잠시만 기다려 주세요.', 
                        time: now 
                    }
                ];
                setMessages(initialMsgs);
            } catch (error) {
                console.error(" 데이터 로드 실패:", error);
                // API 실패 시에도 로컬에 저장된 문의내용은 보여줌
                if (localInquiry) {
                    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setMessages([
                        { id: 1000, sender: 'agent', text: '안녕하세요! LG U+ 고객센터입니다.', time: now },
                        { id: Date.now(), sender: 'me', text: localInquiry, time: now }
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [navigate]);

    /** 실시간 통신 감지 */
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "isMatched" && (e.newValue === null || e.newValue === "false")) {
                setShowTerminatedModal(true);
            }
            if (e.key === "agentMessage" && e.newValue) {
                try {
                    const data = JSON.parse(e.newValue);
                    setMessages(prev => {
                        if (prev.some(msg => msg.id === data.id)) return prev;
                        return [...prev, { id: data.id, sender: 'agent', text: data.text, time: data.time }];
                    });
                } catch (err) { console.error(err); }
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || !consultationId) return;
        const textToSend = input;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage: ChatMessage = { id: Date.now(), sender: 'me', text: textToSend, time: now };

        setMessages(prev => [...prev, newMessage]);
        localStorage.setItem("customerMessage", JSON.stringify(newMessage));
        setInput("");
        inputRef.current?.focus();

        try {
            await sendConsultationMessage(consultationId, { content: textToSend, senderType: "CUSTOMER" });
        } catch (error) { console.warn(error); }
    }, [input, consultationId]);

    const handleCloseAndNavigate = () => {
        setShowTerminatedModal(false);
        localStorage.removeItem("consultationId");
        localStorage.removeItem("customerInquiry"); //  종료 시 데이터 삭제
        localStorage.removeItem("isMatched");
        localStorage.removeItem("agentMessage");
        navigate('/customer/apply', { replace: true });
    };

    if (isLoading) return <div className={styles.loadingContainer}>상담 정보를 불러오는 중입니다...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.phoneFrame}>
                <header className={styles.chatHeader}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}><ArrowLeft size={24} /></button>
                    <div style={{ flex: 1, marginLeft: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#E6007E', fontWeight: 800 }}>실시간 매칭 완료</div>
                        <div style={{ fontSize: '16px', fontWeight: 800 }}>U+ 전문 상담사</div>
                    </div>
                    <button onClick={() => navigate('/customer/apply')} className={styles.homeBtn}><Home size={24} /></button>
                </header>

                <div className={styles.chatArea} ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.sender === 'me' ? styles.myMsgWrapper : styles.agentMsgWrapper}>
                            <div className={msg.sender === 'me' ? styles.myBubble : styles.agentBubble}>{msg.text}</div>
                            <span className={styles.timeLabel}>{msg.time}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.inputArea}>
                    <input 
                        ref={inputRef}
                        className={styles.textField} 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (!e.nativeEvent.isComposing && e.key === 'Enter') handleSend(); }}
                        placeholder="상담사에게 메시지 보내기..."
                    />
                    <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}><Send size={20} /></button>
                </div>
            </div>

            {showTerminatedModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AlertCircle size={48} color="#E6007E" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>상담 종료</h2>
                        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '24px' }}>상담이 종료되었습니다.</p>
                        <button onClick={handleCloseAndNavigate} className={styles.modalConfirmBtn}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerChat;