import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, Check, ArrowLeft } from "lucide-react"; 
import * as styles from "./Style/CustomerQA.css.ts";

// 1. 데이터 타입 정의
interface CustomerFormData {
  name: string;
  message: string;
  category: string;
}

const CustomerQA: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [selectedFaqs, setSelectedFaqs] = useState<number[]>([]);

    // location.state 타입 안전하게 가져오기
    const state = location.state as { formData: CustomerFormData } | null;
    const formData = state?.formData || { 
        name: "고객", 
        message: "입력된 상세 내용이 없습니다.", 
        category: "기타 문의" 
    };

    const faqList = [
        { id: 1, q: `'${formData.category}' 관련 자주 묻는 질문입니다.`, a: "이 서비스는 현재 전국 대리점 및 온라인 샵에서 신청 가능합니다." },
        { id: 2, q: "입력하신 문의 내용에 대한 답변입니다.", a: `"${formData.message}" 문의 건은 상담사 연결 시 우선적으로 전달됩니다.` },
        { id: 3, q: "가족 결합 할인이 가능한가요?", a: "U+ 앱에서 증빙서류 등록 후 바로 신청이 가능합니다." }
    ];

    const toggleFaq = (id: number) => {
        setSelectedFaqs(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-block', padding: '6px 20px', border: '2px solid #374151', borderRadius: '12px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Q&A
                    </div>

                    <div style={{ width: '100%', minHeight: '60px', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '12px', textAlign: 'left', backgroundColor: '#fff' }}>
                        <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                            {formData.message}
                        </p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'left', marginTop: '4px', marginBottom: '20px' }}>상세 문의 내용</p>

                    <div style={{ width: '100%', minHeight: '120px', border: '1px solid #D1D5DB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', marginBottom: '8px' }}>
                        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>(상세 문의에 대한 분석 답변 API 연결 예정)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'left', marginBottom: '24px' }}>AI 분석 답변</p>

                    <hr style={{ border: '0', borderTop: '1px solid #F3F4F6', marginBottom: '24px' }} />

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FDF2F8', color: '#E6007E', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold' }}>
                        <Search size={14} /> 자동 분석 결과
                    </div>
                    
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '12px' }}>
                        추천 답변이 도움이 될까요?
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                    {faqList.map((faq) => {
                        const isSelected = selectedFaqs.includes(faq.id);
                        return (
                            <div 
                                key={faq.id} 
                                onClick={() => toggleFaq(faq.id)}
                                className={`${styles.qaItem} ${isSelected ? styles.qaItemActive : ""}`}
                            >
                                <div style={{ 
                                    minWidth: '24px', height: '24px', borderRadius: '6px', 
                                    border: `2px solid ${isSelected ? '#E6007E' : '#D1D5DB'}`,
                                    backgroundColor: isSelected ? '#E6007E' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                                }}>
                                    {isSelected && <Check size={16} color="#fff" strokeWidth={3} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#E6007E' : '#374151' }}>
                                        {faq.q}
                                    </div>
                                    {isSelected && (
                                        <div style={{ fontSize: '14px', color: '#4B5563', marginTop: '10px', lineHeight: '1.5' }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ flex: 1, height: '56px', borderRadius: '14px', border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                        <ArrowLeft size={18} /> 이전
                    </button>
                    
                    {/* Summary 페이지로 데이터 전달하며 이동 */}
                    <button 
                        onClick={() => {
                            const selectedFaqContent = faqList.filter(faq => selectedFaqs.includes(faq.id));
                            navigate("/customer/summary", { state: { formData, selectedFaqContent } });
                        }}
                        className={styles.submitBtn} 
                        style={{ flex: 2, height: '56px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            상담 내용 확인하기 <MessageCircle size={20} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerQA;