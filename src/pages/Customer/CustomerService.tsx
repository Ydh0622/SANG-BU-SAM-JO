import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MessageCircle, HelpCircle, CheckCircle2, Loader2, Smartphone } from 'lucide-react';
import * as styles from "./Style/CustomerService.css.ts";

const CustomerService = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMatched, setIsMatched] = useState(false);

    // 1. 실시간 연동: 상담사의 수락 신호(isMatched)를 감시
    useEffect(() => {
        let checkTimer: number;
        
        if (showModal && !isMatched) {
            checkTimer = window.setInterval(() => {
                const matchStatus = localStorage.getItem("isMatched");
                // 상담사 페이지에서 "수락"을 누르면 isMatched가 "true"가 됨
                if (matchStatus === "true") {
                    setIsMatched(true);
                    clearInterval(checkTimer);
                    
                    setTimeout(() => {
                        // ✨ 이동 전 매칭 상태값은 유지하되, 페이지 이동
                        navigate("/customer/chat"); 
                    }, 1500);
                }
            }, 1000);
        }
        
        return () => clearInterval(checkTimer);
    }, [showModal, isMatched, navigate]);

    const handleSubmit = () => {
        if (!message.trim()) return;
        
        setIsConnecting(true);

        // ✨ 디테일: 새로운 상담을 위해 기존 세션 데이터 청소
        ["customerInquiry", "agentMessage", "lastInquiry"].forEach(k => localStorage.removeItem(k));
        
        // 2. 상담 데이터 구조화 (id와 time 추가)
        const inquiryData = {
            id: Date.now(), // 중복 방지용 고유 ID
            message: message,
            category: "실시간 문의",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // 3. ✨ 양방향 연동을 위한 데이터 저장
        // customerInquiry: 상담사 대시보드에 알림을 띄움
        localStorage.setItem("customerInquiry", JSON.stringify(inquiryData));
        // lastInquiry: 채팅방 진입 시 첫 메시지로 사용됨
        localStorage.setItem("lastInquiry", JSON.stringify(inquiryData));
        // 배정 대기 상태 설정
        localStorage.setItem("isMatched", "false"); 
        
        setTimeout(() => {
            setIsConnecting(false);
            setShowModal(true);
        }, 800);
    };

    return (
        <div className={styles.container}>
            <div className={styles.phoneFrame}>
                <header className={styles.header}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>LG U+ 고객지원</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>상부삼조 AI 실시간 상담</div>
                </header>

                <div className={styles.chatArea}>
                    <div style={{ 
                        backgroundColor: '#FFF', 
                        padding: '18px', 
                        borderRadius: '0 24px 24px 24px', 
                        fontSize: '15px', 
                        color: '#374151', 
                        border: '1px solid #E5E7EB', 
                        lineHeight: 1.6 
                    }}>
                        안녕하세요! 고객님 😊<br/>
                        <strong>LG U+ AI 상담 시스템</strong>입니다.<br/>
                        문의하실 내용을 선택하거나 아래에 입력해 주세요.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
                        <button className={styles.categoryBtn} onClick={() => setMessage("요금제 변경 문의")}>
                            <Smartphone size={24} color="#E6007E" /> 
                            <span>요금제 변경</span>
                        </button>
                        <button className={styles.categoryBtn} onClick={() => setMessage("기술 지원 문의")}>
                            <MessageCircle size={24} color="#E6007E" /> 
                            <span>기술 지원</span>
                        </button>
                        <button className={styles.categoryBtn} onClick={() => setMessage("로밍 서비스 문의")}>
                            <HelpCircle size={24} color="#E6007E" /> 
                            <span>로밍/부가서비스</span>
                        </button>
                        <button className={styles.categoryBtn} onClick={() => setMessage("기타 문의")}>
                            <Send size={24} color="#E6007E" /> 
                            <span>기타 문의</span>
                        </button>
                    </div>

                    {message && !showModal && (
                        <div style={{ 
                            alignSelf: 'flex-end', 
                            backgroundColor: '#E6007E', 
                            color: '#FFF', 
                            padding: '12px 18px', 
                            borderRadius: '24px 24px 0 24px', 
                            fontSize: '14px', 
                            marginTop: '10px' 
                        }}>
                            {message}
                        </div>
                    )}
                </div>

                <div className={styles.inputArea}>
                    <input 
                        className={styles.textField} 
                        placeholder={isConnecting ? "연결 요청 중..." : "상담 내용을 입력하세요..."}
                        value={message}
                        disabled={isConnecting}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <button className={styles.sendBtn} onClick={handleSubmit} disabled={isConnecting || !message.trim()}>
                        <Send size={22} />
                    </button>
                </div>

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            {isMatched ? (
                                <>
                                    <div style={{ color: '#E6007E', marginBottom: '20px' }}>
                                        <Loader2 size={56} className="animate-spin" style={{ margin: '0 auto' }} />
                                    </div>
                                    <h3 className={styles.modalTitle}>상담사 연결 완료!</h3>
                                    <p className={styles.modalText}>
                                        전문 상담사가 배정되었습니다.<br/>
                                        <strong>잠시 후 채팅방으로 이동합니다.</strong>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={56} color="#E6007E" style={{ margin: '0 auto 20px' }} />
                                    <h3 className={styles.modalTitle}>상담 신청 완료</h3>
                                    <p className={styles.modalText}>
                                        문의 내용이 상담사에게 전달되었습니다.<br/>
                                        <strong>상담사가 수락할 때까지 기다려 주세요.</strong>
                                    </p>
                                    <div style={{ marginTop: '20px', fontSize: '13px', color: '#E6007E', fontWeight: 600 }}>
                                        상담사의 응답을 기다리는 중...
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerService;