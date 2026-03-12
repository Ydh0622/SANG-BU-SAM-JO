import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MessageCircle, ArrowRight, Loader2, Send, CheckCircle2, ChevronDown, X } from "lucide-react";
import * as styles from "./Style/CustomerApply.css.ts";

import { createConsultation } from "../../api/services/consultation";
import type { CreateConsultationRequest, CreateConsultationResponse } from "../../api/services/consultation";

// 1. 카테고리 타입 및 데이터 정의 (컴포넌트 외부)
type ProductLine = "MOBILE" | "INTERNET" | "IPTV" | "TELEPHONE" | "ETC";

interface CategoryInfo {
    id: number;
    code: ProductLine;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
    "요금제/부가서비스": { id: 1, code: "MOBILE" },
    "기기변경/신규가입": { id: 2, code: "MOBILE" },
    "기술지원/장애문의": { id: 3, code: "MOBILE" },
    "결합상품/인터넷": { id: 4, code: "INTERNET" },
    "이벤트/멤버십": { id: 5, code: "MOBILE" },
    "기타 문의": { id: 6, code: "ETC" }
};

const CustomerApply: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        category: "", 
        message: ""   
    });

    useEffect(() => {
        let checkTimer: number | undefined;
        if (showModal && !isMatched) {
            checkTimer = window.setInterval(() => {
                const matchStatus = localStorage.getItem("isMatched");
                if (matchStatus === "true") {
                    setIsMatched(true);
                    if (checkTimer) clearInterval(checkTimer);
                    setTimeout(() => navigate("/customer/chat"), 1500);
                }
            }, 1000);
        }
        return () => { if (checkTimer) clearInterval(checkTimer); };
    }, [showModal, isMatched, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // 2. 가이드에 따른 Validation 기준
        if (!formData.name.trim()) return alert("이름을 입력해주세요.");
        if (!formData.phone.trim()) return alert("연락처를 입력해주세요.");
        
        const selectedCategory = CATEGORY_MAP[formData.category];
        if (!selectedCategory) return alert("문의 카테고리를 선택해주세요.");
        
        if (!formData.message.trim()) return alert("상세 내용을 입력해주세요.");

        setIsSubmitting(true);

        try {
            // 3. API 요청 규격에 맞춘 페이로드 구성 (any 없음)
            const payload: CreateConsultationRequest = {
                customerName: formData.name,
                phone: formData.phone,
                channel: "CHAT",
                productLineCode: selectedCategory.code,
                issueTypeId: selectedCategory.id,
                priority: "MID",
                initialMessage: formData.message
            };

            const result: CreateConsultationResponse = await createConsultation(payload);
            
            if (result.success && result.data) {
                localStorage.setItem("currentConsultationId", result.data.consultationId.toString());
                localStorage.setItem("isMatched", "false"); 
                setShowModal(true);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "상담 신청 중 알 수 없는 에러가 발생했습니다.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => { setShowModal(false); setIsMatched(false); };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.iconCircle}><MessageCircle size={32} color="#E6007E" /></div>
                    <h1 className={styles.title}>LG U+ 실시간 채팅 상담</h1>
                    <p className={styles.subtitle}>문의 내용을 선택하시면 상담사가 연결됩니다.</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>이름</label>
                            <div className={styles.inputWrapper}>
                                <User size={16} className={styles.inputIcon} />
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="성함" className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label className={styles.label}>연락처</label>
                            <div className={styles.inputWrapper}>
                                <Phone size={16} className={styles.inputIcon} />
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>이메일 주소 (선택)</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={16} className={styles.inputIcon} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@uplus.co.kr" className={styles.input} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>문의 카테고리</label>
                        <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                            <select name="category" value={formData.category} onChange={handleChange} className={styles.input} required style={{ appearance: 'none', background: 'transparent', cursor: 'pointer' }}>
                                <option value="" disabled>문의 유형을 선택해 주세요</option>
                                {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <ChevronDown size={18} style={{ position: 'absolute', right: '12px', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>상세 내용</label>
                        <div className={styles.inputWrapper} style={{ alignItems: 'flex-start', paddingTop: '10px' }}>
                            <Send size={16} className={styles.inputIcon} style={{ marginTop: '2px' }} />
                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="상담원에게 전달할 메시지를 입력하세요." className={styles.input} style={{ minHeight: '80px', border: 'none', width: '100%', outline: 'none', resize: 'none' }} required />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                처리 중... <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                상담 신청하기 <ArrowRight size={20} />
                            </div>
                        )}
                    </button>
                </form>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', width: '85%', maxWidth: '400px', position: 'relative' }}>
                        {!isMatched && (
                            <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                <X size={24} />
                            </button>
                        )}
                        {isMatched ? (
                            <>
                                <Loader2 size={56} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 20px', color: '#E6007E' }} />
                                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>상담사 연결 완료!</h3>
                                <p style={{ color: '#6B7280', marginTop: '8px' }}>채팅방으로 이동합니다...</p>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={56} color="#E6007E" style={{ margin: '0 auto 20px' }} />
                                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>상담 신청 완료</h3>
                                <p style={{ color: '#6B7280', marginTop: '8px', marginBottom: '24px' }}>상담사가 수락할 때까지 기다려 주세요.</p>
                                <button onClick={closeModal} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#F3F4F6', color: '#4B5563', fontWeight: 600, border: 'none', cursor: 'pointer' }}>닫기</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default CustomerApply;