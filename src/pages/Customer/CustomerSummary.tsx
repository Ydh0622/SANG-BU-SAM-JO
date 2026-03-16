import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, MessageSquare, ClipboardList, User, ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react";
import * as styles from "./Style/CustomerSummary.css.ts";

interface CustomerFormData {
  name: string;
  message: string;
  category: string;
}

interface FaqItem {
  id: number;
  q: string;
  a: string;
}

interface LocationState {
  formData: CustomerFormData;
  selectedFaqContent: FaqItem[];
}

const CustomerSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [isMatched, setIsMatched] = useState(false);

  const state = location.state as LocationState;
  const formData = state?.formData || { name: "고객", message: "", category: "일반" };
  const selectedFaqContent = state?.selectedFaqContent || [];

  // 2. 상담 시작 버튼 클릭 시 (모달 띄우고 매칭 시뮬레이션)
  const handleStartChat = () => {
    setShowModal(true);
    
    // 3초 후 매칭 완료 처리
    setTimeout(() => {
      setIsMatched(true);
      
      // 매칭 완료 1.5초 후 실제 채팅방 이동
      setTimeout(() => {
        navigate("/customer/chat", { state: { formData } });
      }, 1500);
    }, 3000);
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

        <div className={styles.section}>
          <div className={styles.label}><ClipboardList size={16} /> 내가 확인한 답변</div>
          {selectedFaqContent.length > 0 ? (
            selectedFaqContent.map((faq) => (
              <div key={faq.id} className={styles.selectedTag}>• {faq.q}</div>
            ))
          ) : (
            <div className={styles.contentBox} style={{ color: "#9CA3AF" }}>선택된 답변 없음</div>
          )}
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
          <button className={styles.primaryBtn} onClick={handleStartChat}>
            상담 시작하기 <ArrowRight size={20} style={{ marginLeft: "6px" }} />
          </button>
        </div>
      </div>

      {/* --- 매칭 대기 모달 --- */}
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
                    <Loader2 size={64} className="animate-spin" color="#E6007E" />
                    <CheckCircle2 size={24} color="#E6007E" style={{ position: 'absolute', top: '20px', left: '20px' }} />
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
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default CustomerSummary;