import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import * as styles from "./Style/CustomerApply.css.ts";

const CustomerApply: React.FC = () => {
    const navigate = useNavigate();

    // 1. 제출 중 상태값 추가 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //  2. 중복 클릭 차단 (이미 제출 중이면 실행 안 함)
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // 시뮬레이션을 위해 짧은 대기 (사용자 피드백용)
            await new Promise((resolve) => setTimeout(resolve, 800));

            const newCustomer = {
                id: `CUST_${Date.now()}`,
                name: formData.name,
                inquiryMessage: "실시간 채팅 상담 신청",
                recentHistory: "신규 상담 신청 고객입니다.",
                appliedAt: new Date().toISOString(),
            };

            // 데이터 저장 및 큐 관리
            const waitingList = JSON.parse(localStorage.getItem("waitingCustomers") || "[]");
            waitingList.push(newCustomer);
            localStorage.setItem("waitingCustomers", JSON.stringify(waitingList));
            localStorage.setItem("realtime_waiting_count", waitingList.length.toString());
            localStorage.setItem("assignedCustomer", JSON.stringify(newCustomer));
            localStorage.setItem("currentCustomer", JSON.stringify(newCustomer));
            localStorage.setItem("isMatched", "false");

            // 페이지 이동
            navigate("/customer");
        } catch (error) {
            console.error("신청 오류:", error);
        } finally {
            // 에러가 나더라도 버튼을 다시 활성화하거나 상황에 맞게 처리
            // 여기서는 이동하므로 상태 초기화는 생략 가능하나 안정성을 위해 유지
            // setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.iconCircle}>
                        <MessageCircle size={32} color="#E6007E" />
                    </div>
                    <h1 className={styles.title}>LG U+ 실시간 채팅 상담</h1>
                    <p className={styles.subtitle}>
                        상담을 시작하기 위해 아래 정보를 입력해 주세요.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            이름 <span className={styles.requiredDot}>•</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="성함을 입력하세요"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            휴대폰 번호 <span className={styles.requiredDot}>•</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <Phone size={18} className={styles.inputIcon} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            이메일 주소 <span className={styles.requiredDot}>•</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@uplus.co.kr"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/*  버튼 비활성화 및 인라인 애니메이션 적용으로 에러 해결 */}
                    <button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={isSubmitting}
                        style={{ 
                            opacity: isSubmitting ? 0.7 : 1, 
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            position: 'relative'
                        }}
                    >
                        {!isSubmitting && <span className={styles.btnShimmer} />}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            {isSubmitting ? (
                                <>
                                    처리 중... 
                                    <Loader2 
                                        size={20} 
                                        style={{ 
                                            animation: 'spin 1s linear infinite' 
                                        }} 
                                    />
                                    <style>{`
                                        @keyframes spin {
                                            from { transform: rotate(0deg); }
                                            to { transform: rotate(360deg); }
                                        }
                                    `}</style>
                                </>
                            ) : (
                                <>상담 신청하기 <ArrowRight size={20} /></>
                            )}
                        </div>
                    </button>
                </form>

                <footer className={styles.footer}>
                    상담 가능 시간: 평일 09:00 ~ 18:00
                </footer>
            </div>
        </div>
    );
};

export default CustomerApply;