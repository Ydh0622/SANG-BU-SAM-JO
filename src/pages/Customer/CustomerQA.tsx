import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, Check, X, ArrowLeft, Sparkles } from "lucide-react"; 
import * as styles from "./Style/CustomerQA.css.ts";
import { getSimilarFaq } from "../../api/services/faq";
import type { FaqItem } from "../../api/services/faq";
import { storeFaqSession } from "../../api/services/consultation";
import type { FaqFeedbackItem } from "../../api/services/consultation";

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
    const [sessionId] = useState<string>(() => crypto.randomUUID());
    const aiFeedback = feedbacks["AI"];

    // Apply에서 넘겨준 state를 안전하게 가져옵니다.
    const state = location.state as LocationState | null;
    const formData = state?.formData || { 
        name: "고객", 
        message: "", 
        category: "기타 문의" 
    };
    
    // 상담 ID 보관
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
            setDynamicFaqList(data.faqList); // 서버 응답의 faqList 사용
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

  const isAllSelected = !isLoading && (
    (dynamicFaqList?.length ?? 0) === 0 ||
    (dynamicFaqList ?? []).every(faq => feedbacks[String(faq.kbId)] != null)
);

    const handleFeedback = (id: string | number, status: FeedbackStatus) => {
        const key = String(id);
        setFeedbacks(prev => ({
            ...prev,
            [key]: prev[key] === status ? null : status
        }));
    };

    /** 다음 단계로 이동 시 FAQ 피드백을 Redis에 저장 후 이동합니다. */
    const handleNextStep = async () => {
        if (!isAllSelected) return;

        const selectedFaqContent = dynamicFaqList
            // [수정] faq_id 대신 kbId 사용
            .filter((faq: FaqItem) => feedbacks[String(faq.kbId)] === "like")
            .map((faq: FaqItem) => {
                const firstSentence = faq.answer.split('.')[0];
                const summaryText = firstSentence.length > 100
                    ? `${firstSentence.slice(0, 30)}...`
                    : firstSentence;

                return {
                    ...faq,
                    request: summaryText // [수정] question 대신 request 사용
                };
            });

        // FAQ 피드백을 Redis에 미리 저장
        if (dynamicFaqList.length > 0) {
            const faqPayload: FaqFeedbackItem[] = dynamicFaqList.map(faq => ({
                question: faq.request, // [수정] request 필드 사용
                answer: faq.answer,
                // [수정] faq_id 대신 kbId 사용 및 삼항 연산자 괄호 오류 수정
                liked: feedbacks[String(faq.kbId)] === "like" ? true : feedbacks[String(faq.kbId)] === "dislike" ? false : null,
            }));
            const aiAnswerLiked = feedbacks["AI"] === "like" ? true : feedbacks["AI"] === "dislike" ? false : null;
            await storeFaqSession(sessionId, faqPayload, aiAnswer, aiAnswerLiked).catch(err =>
                console.warn("FAQ 세션 저장 실패 (무시):", err)
            );
        }

        navigate("/customer/summary", {
            state: {
                formData,
                consultationId,
                selectedFaqContent,
                allFaqs: dynamicFaqList,
                faqSessionId: dynamicFaqList.length > 0 ? sessionId : undefined,
                aiFeedback: feedbacks["AI"],
                allFeedbacks: feedbacks
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* 헤더 */}
                <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={16} color="#fff" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>AI 분석 결과</span>
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.3 }}>
                        맞춤 답변을 확인해보세요
                    </h1>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontWeight: 500 }}>
                        답변이 도움이 됐다면 ✓, 아니라면 ✗를 선택해주세요
                    </p>
                </div>

                <div className={styles.cardBody}>
                    {/* 문의 내용 */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>문의 내용</p>
                        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                            <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                                {formData.message || "문의 내용이 없습니다."}
                            </p>
                        </div>
                    </div>

                    {/* AI 답변 박스 */}
                    <div className={styles.aiAnswerBox}>
                        <div className={styles.aiLabel}>
                            <Sparkles size={12} /> AI 종합 답변
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                                <button
                                    onClick={() => handleFeedback("AI", "like")}
                                    style={{
                                        width: '26px', height: '26px', borderRadius: '6px', border: '1.5px solid',
                                        borderColor: aiFeedback === 'like' ? '#E6007E' : '#CBD5E1',
                                        backgroundColor: aiFeedback === 'like' ? '#E6007E' : '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Check size={13} color={aiFeedback === 'like' ? '#fff' : '#94A3B8'} strokeWidth={3} />
                                </button>
                                <button
                                    onClick={() => handleFeedback("AI", "dislike")}
                                    style={{
                                        width: '26px', height: '26px', borderRadius: '6px', border: '1.5px solid',
                                        borderColor: aiFeedback === 'dislike' ? '#374151' : '#CBD5E1',
                                        backgroundColor: aiFeedback === 'dislike' ? '#374151' : '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <X size={13} color={aiFeedback === 'dislike' ? '#fff' : '#94A3B8'} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', color: '#94A3B8', fontSize: '14px' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #CBD5E1', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
                                답변을 생성하고 있습니다...
                            </div>
                        ) : (
                            <p className={styles.aiAnswerText}>{aiAnswer}</p>
                        )}
                    </div>

                    {/* 구분선 + FAQ 섹션 제목 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#F1F5F9' }} />
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#FFF0F6', color: '#E6007E', padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                            <Search size={12} /> 관련 FAQ {(dynamicFaqList || []).length}건
                        </div>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#F1F5F9' }} />
                    </div>

                    {/* FAQ 목록 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        {(dynamicFaqList ?? []).map((faq) => {
                        
                            const faqKey = String(faq.kbId);
                            const currentStatus = feedbacks[faqKey];
                            return (
                                <div key={faqKey} className={styles.qaItem}>
                                    <div className={styles.qaTextContainer}>
                                        <div className={styles.qaTitle}>{faq.request}</div> {/* [수정] request 필드 */}
                                        <div className={styles.qaText}>{faq.answer}</div>
                                    </div>
                                    <div className={styles.feedbackButtonGroup}>
                                        <button
                                            onClick={() => handleFeedback(faqKey, "like")}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid',
                                                borderColor: currentStatus === 'like' ? '#E6007E' : '#E2E8F0',
                                                backgroundColor: currentStatus === 'like' ? '#E6007E' : '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <Check size={16} color={currentStatus === 'like' ? '#fff' : '#CBD5E1'} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(faqKey, "dislike")}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid',
                                                borderColor: currentStatus === 'dislike' ? '#374151' : '#E2E8F0',
                                                backgroundColor: currentStatus === 'dislike' ? '#374151' : '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <X size={16} color={currentStatus === 'dislike' ? '#fff' : '#CBD5E1'} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 하단 버튼 */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate(-1)} className={styles.prevBtn} style={{ flex: 1 }}>
                            <ArrowLeft size={16} /> 이전
                        </button>
                        <button
                            disabled={!isAllSelected}
                            onClick={handleNextStep}
                            className={styles.submitBtn}
                            style={{ flex: 2 }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                {isAllSelected ? "상담 내용 확인하기" : isLoading ? "분석 중..." : "답변을 모두 평가해주세요"}
                                {isAllSelected && <MessageCircle size={18} />}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerQA;