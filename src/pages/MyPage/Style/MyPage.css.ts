import { style, globalStyle } from "@vanilla-extract/css";

// 1. 기본 컨테이너 및 레이아웃
export const container = style({
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    padding: "40px 20px",
    fontFamily: "Pretendard, -apple-system, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

export const header = style({
    width: "100%",
    maxWidth: "1100px",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
});

export const backBtn = style({
    display: "flex",
    alignItems: "center",
    padding: "10px 18px",
    backgroundColor: "#FFF",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748B",
    transition: "all 0.2s ease",
    ":hover": { 
        backgroundColor: "#F1F5F9",
        borderColor: "#CBD5E1"
    },
});

export const title = style({ 
    fontSize: "28px", 
    fontWeight: 800,
    color: "#1E293B",
    margin: 0
});

export const mainContent = style({
    width: "100%",
    maxWidth: "1100px",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "30px",
    alignItems: "start",
});

// 2. 사이드바 및 탭 스타일
export const sidebar = style({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "sticky",
    top: "40px",
});

export const tab = style({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px 24px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "15px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
    color: "#64748B",
    transition: "all 0.2s",
    ":hover": { backgroundColor: "#EDF2F7" },
});

export const activeTab = style([tab, {
    backgroundColor: "#E6007E", // U+ 메인 컬러
    color: "#FFF",
    boxShadow: "0 4px 12px rgba(230, 0, 126, 0.25)",
    ":hover": { backgroundColor: "#C5006C" },
}]);

// 3. 콘텐츠 영역 및 카드 공통
export const contentArea = style({
    display: "flex",
    flexDirection: "column",
    gap: "25px",
});

export const card = style({
    backgroundColor: "#FFF",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
});

export const cardTitle = style({
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "28px",
    color: "#1E293B",
});

// 4. 프로필 수정 (InputGroup) 스타일
export const inputGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
});

globalStyle(`${inputGroup} label`, {
    fontSize: '14px', 
    fontWeight: 600, 
    color: '#475569', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px'
});

globalStyle(`${inputGroup} input`, {
    padding: '14px 18px', 
    borderRadius: '12px', 
    border: '1px solid #E2E8F0', 
    fontSize: '16px',
    backgroundColor: '#F8FAFC',
    outline: 'none',
    transition: 'all 0.2s'
});

globalStyle(`${inputGroup} input:focus`, {
    borderColor: '#E6007E',
    backgroundColor: '#FFF',
    boxShadow: '0 0 0 3px rgba(230, 0, 126, 0.1)'
});

globalStyle(`${inputGroup} input:disabled`, {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
    cursor: 'not-allowed'
});

export const saveBtn = style({
    width: "100%",
    padding: "16px",
    backgroundColor: "#1E293B",
    color: "#FFF",
    border: "none",
    borderRadius: "14px",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background-color 0.2s",
    ":hover": { backgroundColor: "#0F172A" }
});

// 5. 메모 리스트 스타일
export const memoList = style({ 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px" 
});

export const memoItem = style({
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #F1F5F9",
    backgroundColor: "#FDFDFD",
    transition: "all 0.2s ease",
    ":hover": {
        transform: "translateY(-2px)",
        borderColor: "#E6007E",
        boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.05)"
    }
});

export const memoDate = style({
    fontSize: "13px",
    color: "#94A3B8",
    display: "flex",
    alignItems: "center",
    gap: "5px",
});

export const memoCategory = style({
    fontSize: "12px",
    fontWeight: 700,
    color: "#E6007E",
    backgroundColor: "#FFF0F6",
    padding: "4px 10px",
    borderRadius: "6px",
});

export const memoContent = style({ 
    fontSize: "15px", 
    color: "#475569", 
    lineHeight: 1.7, 
    margin: "12px 0 0 0" 
});

// 6. 통계(Stats) 스타일
export const statsGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "30px"
});

export const statMiniCard = style({
    padding: "25px",
    borderRadius: "20px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #F1F5F9",
});

globalStyle(`${statMiniCard} span`, { fontSize: '14px', color: '#64748B', fontWeight: 500 });
globalStyle(`${statMiniCard} h3`, { fontSize: '28px', fontWeight: 800, margin: '10px 0', color: '#1E293B' });
globalStyle(`${statMiniCard} p`, { fontSize: '13px', fontWeight: 600, margin: 0 });