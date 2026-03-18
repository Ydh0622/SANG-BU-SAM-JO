import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ConsultationDetail from "./pages/Consultation/ConsultationDetail";
import ConsultationSearch from "./pages/Search/ConsultationSearch";
import ConsultationHistory from "./pages/History/ConsultationHistory";
import NoticeList from "./pages/Notice/NoticeList"; 
import CustomerApply from "./pages/Customer/CustomerApply"; 
import CustomerQA from "./pages/Customer/CustomerQA"; 
import CustomerSummary from "./pages/Customer/CustomerSummary"; // 추가: 요약 및 매칭 대기 페이지
import CustomerChat from "./pages/Customer/CustomerChat"; 
import MyPage from "./pages/MyPage/MyPage";
import NotificationPage from "./pages/Notification/Notification"; 

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* 1. 로그인 페이지 (진입점) */}
                    <Route path="/" element={<LoginPage />} />
                    
                    {/* 2. 대시보드: 메인 현황 및 상담 배정 팝업 확인 */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* 3. 실시간 상담 상세: 고객과 채팅 및 AI 요약/메모 수정 */}
                    <Route path="/consultation/:customerId" element={<ConsultationDetail />} />

                    {/* 4. 상담 내역 검색: 과거 기록 필터링 및 조회 */}
                    <Route path="/search" element={<ConsultationSearch />} />

                    {/* 5. 상담 상세 이력: 완료된 상담의 최종 요약본 확인 */}
                    <Route path="/history/:historyId" element={<ConsultationHistory />} />

                    {/* 6. 공지사항: 리스트 및 상세 페이지 */}
                    <Route path="/notice" element={<NoticeList />} />

                    {/* 7. 알림 센터: 상담사 개인 업무 알림 내역 히스토리 */}
                    <Route path="/notifications" element={<NotificationPage />} />

                    {/* 8. 마이페이지: 상담사 성과 확인 및 관리 페이지 진입 */}
                    <Route path="/mypage" element={<MyPage />} />

                    {/* 9. 고객 정보 입력: 채팅 시작 전 이름/연락처 입력 단계 (1단계) */}
                    <Route path="/customer/apply" element={<CustomerApply />} />

                    {/* 10. 고객용 Q&A 추천: 입력 정보 기반 자주 묻는 질문 확인 (2단계) */}
                    <Route path="/customer/qa" element={<CustomerQA />} />

                    {/* 11. 고객용 최종 확인 및 매칭: 입력 정보 요약 및 상담사 대기 (3단계) */}
                    <Route path="/customer/summary" element={<CustomerSummary />} />

                    {/* 12. 고객용 실시간 채팅 상세: 상담 수락 후 이동하는 화면 (4단계) */}
                    <Route path="/customer/chat" element={<CustomerChat />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;