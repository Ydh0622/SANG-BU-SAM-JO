import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, Check, X, ArrowLeft, Sparkles } from "lucide-react"; 
import * as styles from "./Style/CustomerQA.css.ts";
import { getSimilarFaq } from "../../api/services/faq";
import type { FaqItem } from "../../api/services/faq";

interface CustomerFormData {
  name: string;
  message: string;
  category: string;
}


interface LocationState {
    formData: CustomerFormData;
    consultationId: string;
}

type FeedbackStatus = "like" | "dislike" | null;

const CustomerQA: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [aiAnswer, setAiAnswer] = useState<string>("문의 내용을 분석하여 최적의 답변을 생성 중입니다...");
    const [dynamicFaqList, setDynamicFaqList] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackStatus>>({});
    const aiFeedback = feedbacks["AI"];

    // Apply에서 넘겨준 state를 안전하게 가져옵니다.
    const state = location.state as LocationState | null;
    const formData = state?.formData || { 
        name: "고객", 
        message: "", 
        category: "기타 문의" 
    };
    
    //  상담 ID 보관 (이게 없으면 나중에 Chat에서 튕김)
    const consultationId = state?.consultationId;

    const fetchAnalysis = useCallback(async () => {
        if (!formData.message) {
            setAiAnswer("상세 문의 내용이 없어 분석을 진행할 수 없습니다.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await getSimilarFaq(formData.message);
            setAiAnswer(data.answer);
            setDynamicFaqList(data.retrieved_faqs);
        } catch (error) {
            console.error("분석 데이터를 가져오는 중 오류 발생:", error);
            setAiAnswer("시스템 오류로 인해 답변을 생성하지 못했습니다. 상담사에게 연결해 주세요.");
        } finally {
            setIsLoading(false);
        }
    }, [formData.message]);

    useEffect(() => {
        fetchAnalysis();
    }, [fetchAnalysis]);

    const isAllSelected = !isLoading;

    const handleFeedback = (id: string, status: FeedbackStatus) => {
        setFeedbacks(prev => ({
            ...prev,
            [id]: prev[id] === status ? null : status
        }));
    };

    /**  다음 단계로 이동 시 consultationId를 포함합니다. */
    const handleNextStep = () => {
        if (!isAllSelected) return;

        const selectedFaqContent = dynamicFaqList
            .filter((faq: FaqItem) => feedbacks[faq.faq_id] === "like")
            .map((faq: FaqItem) => {
                const firstSentence = faq.answer.split('.')[0];
                const summaryText = firstSentence.length > 100
                    ? `${firstSentence.slice(0, 30)}...` 
                    : firstSentence;

                return {
                    ...faq,
                    question: summaryText 
                };
            });

        //  Summary 페이지로 consultationId를 배달합니다.
        navigate("/customer/summary", { 
            state: { 
                formData, 
                consultationId, 
                selectedFaqContent, 
                aiFeedback: feedbacks["AI"],
                allFeedbacks: feedbacks 
            } 
        });
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
                            {formData.message || "문의 내용이 없습니다."}
                        </p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'left', marginTop: '4px', marginBottom: '20px' }}>상세 문의 내용</p>

                    <div style={{ 
                        width: '100%', 
                        minHeight: '120px', 
                        border: '1px solid #D1D5DB', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: isLoading ? '#F9FAFB' : '#F0F7FF', 
                        marginBottom: '8px',
                        padding: '16px',
                        transition: 'background-color 0.3s'
                    }}>
                        <p style={{ 
                            color: isLoading ? '#9CA3AF' : '#1A1A1A', 
                            fontSize: '14px', 
                            margin: 0, 
                            textAlign: 'left', 
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            width: '100%'
                        }}>
                            {aiAnswer}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={12} color="#007AFF" /> AI 분석 답변
                        </p>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                onClick={() => handleFeedback("AI", "like")}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '6px', border: '1px solid',
                                    borderColor: aiFeedback === 'like' ? '#E6007E' : '#D1D5DB',
                                    backgroundColor: aiFeedback === 'like' ? '#E6007E' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <Check size={14} color={aiFeedback === 'like' ? '#fff' : '#D1D5DB'} strokeWidth={3} />
                            </button>
                            <button
                                onClick={() => handleFeedback("AI", "dislike")}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '6px', border: '1px solid',
                                    borderColor: aiFeedback === 'dislike' ? '#374151' : '#D1D5DB',
                                    backgroundColor: aiFeedback === 'dislike' ? '#374151' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <X size={14} color={aiFeedback === 'dislike' ? '#fff' : '#D1D5DB'} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #F3F4F6', marginBottom: '24px' }} />

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FDF2F8', color: '#E6007E', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold' }}>
                        <Search size={14} /> 자동 분석 결과
                    </div>
                    
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '12px' }}>
                        추천 답변이 도움이 될까요?
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                    {dynamicFaqList.map((faq) => {
                        const currentStatus = feedbacks[faq.faq_id];
                        return (
                            <div 
                                key={faq.faq_id} 
                                className={styles.qaItem}
                                style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}
                            >
                                <div style={{ flex: 1, width: '0' }}>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>
                                        {faq.question}
                                    </div>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        color: '#4B5563', 
                                        marginTop: '8px', 
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all'
                                    }}>
                                        {faq.answer}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleFeedback(faq.faq_id, "like")}
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
                                        onClick={() => handleFeedback(faq.faq_id, "dislike")}
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
                        onClick={handleNextStep}
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
                            {isAllSelected ? "상담 내용 확인하기" : isLoading ? "분석 중..." : "답변을 모두 평가해주세요"} <MessageCircle size={20} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerQA;