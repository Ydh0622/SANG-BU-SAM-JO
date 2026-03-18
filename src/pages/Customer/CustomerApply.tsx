import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MessageCircle, ArrowRight, Send, ChevronDown } from "lucide-react";
import * as styles from "./Style/CustomerApply.css.ts";


/** 카테고리 맵 */
const CATEGORY_MAP: Record<string, { id: number; code: "MOBILE" | "INTERNET" | "IPTV" | "TELEPHONE" | "ETC" }> = {
    "요금제/부가서비스": { id: 1, code: "MOBILE" },
    "기기변경/신규가입": { id: 2, code: "MOBILE" },
    "기술지원/장애문의": { id: 3, code: "MOBILE" },
    "결합상품/인터넷": { id: 4, code: "INTERNET" },
    "이벤트/멤버십": { id: 5, code: "MOBILE" },
    "기타 문의": { id: 6, code: "ETC" }
};

const formatPhoneNumber = (value: string): string => {
    const rawValue = value.replace(/[^\d]/g, ""); 
    if (rawValue.length <= 3) return rawValue;
    if (rawValue.length <= 7) return `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
};

const CustomerApply: React.FC = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        category: "", 
        message: ""   
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.category) {
            alert("문의 카테고리를 선택해주세요.");
            return;
        }

        navigate("/customer/qa", { state: { formData } });
    };

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
                                <input 
                                    type="tel" name="phone" value={formData.phone} 
                                    onChange={handleChange} placeholder="010-0000-0000" 
                                    className={styles.input} required maxLength={13} 
                                />
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
                            <select name="category" value={formData.category} onChange={handleChange} className={styles.input} required style={{ appearance: 'none', background: 'transparent' }}>
                                <option value="" disabled>문의 유형을 선택해 주세요</option>
                                {Object.keys(CATEGORY_MAP).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <ChevronDown size={18} style={{ position: 'absolute', right: '12px', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>상세 내용</label>
                        <div className={styles.inputWrapper} style={{ alignItems: 'flex-start', minHeight: '120px' }}>
                            <Send size={16} className={styles.inputIcon} style={{ marginTop: '25px' }} />
                            <textarea 
                                name="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                placeholder="상담원에게 전달할 메시지를 입력하세요." 
                                className={styles.input} 
                                style={{ 
                                    height: '120px', border: 'none', width: '100%', outline: 'none', resize: 'none',
                                    paddingTop: '25px', paddingLeft: '46px', lineHeight: '1.5'
                                }} 
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            다음 단계로 <ArrowRight size={20} />
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerApply;