import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, MessageSquare, ClipboardList, User, ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react";
import * as styles from "./Style/CustomerSummary.css.ts";

import { createConsultation, submitFaqFeedback } from "../../api/services/consultation";
import type { CreateConsultationRequest, CreateConsultationResponse } from "../../api/services/consultation";

type ProductLine = "MOBILE" | "INTERNET" | "IPTV" | "TELEPHONE" | "ETC";

interface CustomerFormData {
  name: string;
  phone: string;
  message: string;
  category: string;
}

// 💡 FaqItem 구조를 이전 페이지(question)와 일치시킴
interface FaqItem {
  faq_id: string;
  question: string;
  answer: string;
}

interface LocationState {
  formData: CustomerFormData;
  selectedFaqContent: FaqItem[];
  allFeedbacks: Record<string, "like" | "dislike" | null>;
}

const CATEGORY_MAP: Record<string, { id: number; code: ProductLine }> = {
  "요금제/부가서비스": { id: 1, code: "MOBILE" },
  "기기변경/신규가입": { id: 2, code: "MOBILE" },
  "기술지원/장애문의": { id: 3, code: "MOBILE" },
  "결합상품/인터넷": { id: 4, code: "INTERNET" },
  "이벤트/멤버십": { id: 5, code: "MOBILE" },
  "기타 문의": { id: 6, code: "ETC" }
};

const CustomerSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💡 데이터 수신 로직
  const state = location.state as LocationState;
  const formData = state?.formData || { name: "고객", phone: "", message: "", category: "기타 문의" };
  const selectedFaqContent = state?.selectedFaqContent || [];
  const allFeedbacks = state?.allFeedbacks || {};

  // [로직 통합] 매칭 감시
  useEffect(() => {
    let checkTimer: number | undefined;

    if (showModal && !isMatched) {
      checkTimer = window.setInterval(() => {
        const matchStatus = localStorage.getItem("isMatched");
        
        if (matchStatus === "true") {
          setIsMatched(true);
          if (checkTimer) clearInterval(checkTimer);
          
          setTimeout(() => {
            navigate("/customer/chat");
          }, 1500); 
        }
      }, 1000);
    }

    return () => { if (checkTimer) clearInterval(checkTimer); };
  }, [showModal, isMatched, navigate]);

  const handleStartChat = async () => {
    if (isSubmitting) return;

    localStorage.removeItem("isMatched");
    setIsMatched(false);

    const selectedCategory = CATEGORY_MAP[formData.category] || CATEGORY_MAP["기타 문의"];
    setIsSubmitting(true);

    try {
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
      const consultationId = result?.data?.consultationId ?? 
                           (result as unknown as { consultationId: number }).consultationId;

      if (consultationId) {
        localStorage.setItem("customerInquiry", JSON.stringify({
          message: formData.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        localStorage.setItem("currentConsultationId", consultationId.toString());
        localStorage.setItem("isMatched", "false");

        // 도움됐다고 체크한 FAQ ID 전송
        const likedKbIds = Object.entries(allFeedbacks)
            .filter(([key, val]) => key !== "AI" && val === "like")
            .map(([key]) => Number(key))
            .filter(id => !isNaN(id) && id > 0);

        if (likedKbIds.length > 0) {
            submitFaqFeedback(consultationId, likedKbIds).catch(() => {});
        }

        setShowModal(true);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "상담 신청 실패";
      alert(message);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isMatched) setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <CheckCircle size={54} color="#E6007E" style={{ marginBottom: "16px", display: "inline-block" }} />
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>입력 내용을 확인하세요</h2>
        </div>

        <div className={styles.section}>
          <div className={styles.label}><MessageSquare size={16} /> 상세 문의 내용</div>
          <div className={styles.contentBox}>{formData.message}</div>
        </div>

        {/* 💡 추천 답변 출력 영역 (이미지 스타일 적용) */}
        <div className={styles.section}>
          <div className={styles.label}><ClipboardList size={16} /> 내가 확인한 답변</div>
          <div style={{ backgroundColor: '#FFF1F8', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedFaqContent.length > 0 ? (
              selectedFaqContent.map((faq) => (
                <div key={faq.faq_id} style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#E6007E', fontWeight: 'bold' }}>•</span>
                  <span>{faq.question}</span>
                </div>
              ))
            ) : (
              <div style={{ color: "#9CA3AF", fontSize: '14px' }}>선택된 답변 없음</div>
            )}
          </div>
        </div>

        <div className={styles.section} style={{ marginBottom: "40px" }}>
          <div className={styles.label}><User size={16} /> 신청 정보</div>
          <div className={styles.contentBox}>
            <p style={{ margin: "0 0 4px 0" }}>성함: <strong>{formData.name}님</strong></p>
            <p style={{ margin: 0 }}>유형: <strong>{formData.category}</strong></p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>수정</button>
          <button className={styles.primaryBtn} onClick={handleStartChat} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "상담 시작하기"} 
            {!isSubmitting && <ArrowRight size={20} style={{ marginLeft: "6px" }} />}
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', width: '85%', maxWidth: '400px', position: 'relative' }}>
            {!isMatched && (
              <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={24} />
              </button>
            )}

            {isMatched ? (
              <>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <CheckCircle2 size={64} color="#E6007E" className="animate-bounce" />
                  </div>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>상담사가 연결되었습니다!</h3>
                <p style={{ color: '#6B7280', marginTop: '8px' }}>잠시 후 채팅방으로 입장합니다...</p>
              </>
            ) : (
              <>
                <Loader2 size={56} className="animate-spin" color="#E6007E" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>상담 신청 완료</h3>
                <p style={{ color: '#6B7280', marginTop: '12px' }}>상담사가 신청 내용을 확인하고 있습니다.</p>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>연결될 때까지 창을 닫지 마세요.</p>
              </>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-bounce { animation: bounce 0.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CustomerSummary;