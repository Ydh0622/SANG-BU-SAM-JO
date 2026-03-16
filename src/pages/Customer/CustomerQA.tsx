import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, Check, X, ArrowLeft } from "lucide-react"; 
import * as styles from "./Style/CustomerQA.css.ts";

// 데이터 타입 정의
interface CustomerFormData {
  name: string;
  message: string;
  category: string;
}

// 피드백 타입 정의
type FeedbackStatus = "like" | "dislike" | null;

const CustomerQA: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 각 FAQ ID별 피드백 상태 관리 ({ 1: "like", 2: "dislike" ... })
    const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackStatus>>({});

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

    // 모든 항목이 선택되었는지 확인
    const isAllSelected = faqList.every(faq => feedbacks[faq.id] !== undefined && feedbacks[faq.id] !== null);

    const handleFeedback = (id: number, status: FeedbackStatus) => {
        setFeedbacks(prev => ({
            ...prev,
            [id]: prev[id] === status ? null : status
        }));
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
                        const currentStatus = feedbacks[faq.id];
                        return (
                            <div 
                                key={faq.id} 
                                className={styles.qaItem}
                                style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>
                                        {faq.q}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#4B5563', marginTop: '8px', lineHeight: '1.5' }}>
                                        {faq.a}
                                    </div>
                                </div>
                                
                                {/* V / X 버튼 세트 */}
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        onClick={() => handleFeedback(faq.id, "like")}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid',
                                            borderColor: currentStatus === 'like' ? '#E6007E' : '#D1D5DB',
                                            backgroundColor: currentStatus === 'like' ? '#E6007E' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}
                                    >
                                        <Check size={18} color={currentStatus === 'like' ? '#fff' : '#D1D5DB'} strokeWidth={3} />
                                    </button>
                                    <button
                                        onClick={() => handleFeedback(faq.id, "dislike")}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid',
                                            borderColor: currentStatus === 'dislike' ? '#374151' : '#D1D5DB',
                                            backgroundColor: currentStatus === 'dislike' ? '#374151' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}
                                    >
                                        <X size={18} color={currentStatus === 'dislike' ? '#fff' : '#D1D5DB'} strokeWidth={3} />
                                    </button>
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
                    
                    <button 
                        disabled={!isAllSelected}
                        onClick={() => {
                            if (!isAllSelected) return;
                            const selectedFaqContent = faqList.filter(faq => feedbacks[faq.id] === 'like');
                            navigate("/customer/summary", { state: { formData, selectedFaqContent } });
                        }}
                        className={styles.submitBtn} 
                        style={{ 
                            flex: 2, 
                            height: '56px',
                            backgroundColor: isAllSelected ? '#E6007E' : '#D1D5DB',
                            cursor: isAllSelected ? 'pointer' : 'not-allowed',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '14px',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            {isAllSelected ? "상담 내용 확인하기" : "답변을 모두 평가해주세요"} <MessageCircle size={20} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerQA;