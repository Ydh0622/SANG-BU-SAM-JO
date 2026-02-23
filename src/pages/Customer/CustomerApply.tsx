import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";
import * as styles from "./Style/CustomerApply.css.ts";

const CustomerApply: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 입력된 정보를 localStorage에 저장하여 상담사 화면 및 대기 화면과 연동
        const customerData = {
            ...formData,
            appliedAt: new Date().toISOString(),
            id: `CUST_${Date.now()}`,
        };
        localStorage.setItem("currentCustomer", JSON.stringify(customerData));
        
        // 2. 초기 매칭 상태 설정 (대기 화면 진입 전 초기화)
        localStorage.setItem("isMatched", "false");

        // 🚀 3. 수정된 경로: 바로 채팅방이 아닌 '상담 대기 및 연결 화면'으로 이동
        navigate("/customer");
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

                    <button type="submit" className={styles.submitBtn}>
                        {/* CSS에서 정의한 반짝임 효과 */}
                        <span className={styles.btnShimmer} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            상담 신청하기
                            <ArrowRight size={20} />
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