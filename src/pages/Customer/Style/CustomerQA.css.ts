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
  padding: "10px", // 외부 여백 축소
  fontFamily: "'Pretendard', sans-serif",
});

export const card = style({
  width: "100%",
  maxWidth: "440px", // 가로폭 약간 축소
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "20px 16px", // 내부 여백 대폭 축소 (기존 32px -> 20px)
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  animation: `${fadeIn} 0.4s ease-out`,
});

/* --- 상단 Step Bar (높이 축소) --- */
export const stepContainer = style({
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  marginBottom: "16px", // 마진 축소
});

export const stepBox = style({
  width: "28px",
  height: "28px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  border: "1px solid #D1D5DB",
  color: "#9CA3AF",
});

export const stepBoxActive = style({
  backgroundColor: "#E6007E",
  borderColor: "#E6007E",
  color: "#ffffff",
});

/* --- 헤더 (콤팩트화) --- */
export const header = style({
  textAlign: "center",
  marginBottom: "16px", // 마진 축소
});

export const title = style({
  fontSize: "18px", // 폰트 크기 축소
  fontWeight: "800",
  color: "#111827",
  marginBottom: "4px",
});

export const subtitle = style({
  fontSize: "13px",
  color: "#6B7280",
});

/* --- Q&A 리스트 (간격 최적화) --- */
export const qaItem = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "12px", // 패딩 축소
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  backgroundColor: "#ffffff",
  marginBottom: "8px", // 아이템 간 간격 축소
  cursor: "pointer",
});

export const qaItemActive = style({
  borderColor: "#E6007E",
  backgroundColor: "#FFF1F8",
});

/* --- 버튼 영역 (높이 고정 및 정렬) --- */
export const buttonGroup = style({
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginTop: "16px", // 상단 마진 축소
  width: "100%",
});

const baseButton = style({
  height: "48px", // 전체 높이를 위해 56px에서 48px로 조정
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  border: "none",
  cursor: "pointer",
});

export const prevBtn = style([baseButton, {
  flex: 1,
  backgroundColor: "#ffffff",
  border: "1px solid #E5E7EB",
  color: "#6B7280",
}]);

export const submitBtn = style([baseButton, {
  flex: 2,
  backgroundColor: "#E6007E",
  color: "#ffffff",
  ":disabled": {
    backgroundColor: "#D1D5DB",
    cursor: "not-allowed",
  },
}]);

/* --- 요약 박스 (높이 축소) --- */
export const summaryBox = style({
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  padding: "12px 16px",
  marginBottom: "16px",
});

export const summaryItem = style({
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0", // 간격 축소
  fontSize: "14px",
  borderBottom: "1px solid #F3F4F6",
  selectors: { "&:last-child": { borderBottom: "none" } },
});