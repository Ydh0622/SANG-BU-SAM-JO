import { style, keyframes } from "@vanilla-extract/css";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(5px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#F3F4F6", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px", 
  fontFamily: "'Pretendard', sans-serif",
});

export const card = style({
  width: "100%",
  maxWidth: "440px", 
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "20px 16px", 
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  animation: `${fadeIn} 0.4s ease-out`,
});

/* --- Q&A 리스트 아이템 컨테이너 --- */
export const qaItem = style({
  display: "flex",
  flexDirection: "row",   // 가로 배치 명시
  alignItems: "flex-start",
  gap: "12px", 
  padding: "16px", 
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  backgroundColor: "#ffffff",
  marginBottom: "12px", 
  transition: "all 0.2s",
  width: "100%",          // 부모 너비 꽉 채우기
  boxSizing: "border-box",
});

export const qaTextContainer = style({
  flex: 1,                
  minWidth: 0,           
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const qaTitle = style({
  fontSize: "15px",
  fontWeight: "700",
  color: "#374151",
  lineHeight: "1.4",
});

export const qaText = style({
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap", // 파이썬 \n 적용
  wordBreak: "keep-all",  // 한글의 경우 단어 단위 줄바꿈 (필요시 break-all로 변경)
  overflowWrap: "anywhere", // 긴 영문/숫자 대비
});

/* --- 버튼 영역 (찌그러짐 방지 및 고정) --- */
export const feedbackButtonGroup = style({
  display: "flex",
  gap: "6px",
  flexShrink: 0,          // 중요: 버튼 박스가 텍스트에 밀려 좁아지지 않게 함
  marginTop: "2px",       // 타이틀과 높이 맞춤용
});

/* --- 버튼 스타일 --- */
export const submitBtn = style({
  height: "56px",
  borderRadius: "14px",
  fontWeight: "bold",
  border: "none",
  color: "#fff",
  transition: "all 0.2s",
  width: "100%",
  cursor: "pointer",
  backgroundColor: "#E6007E",
  ":disabled": {
    backgroundColor: "#D1D5DB",
    cursor: "not-allowed",
  },
});

export const prevBtn = style({
  flex: 1,
  height: "56px",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  color: "#6B7280",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
});