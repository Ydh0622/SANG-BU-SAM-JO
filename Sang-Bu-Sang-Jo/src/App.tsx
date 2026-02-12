import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ConsultationDetail from "./pages/Consultation/ConsultationDetail";
import ConsultationSearch from "./pages/Search/ConsultationSearch";
import ConsultationHistory from "./pages/History/ConsultationHistory";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* 1. 로그인 페이지 */}
                    <Route path="/" element={<LoginPage />} />
                    
                    {/* 2. 대시보드: 오늘 현황 확인 */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* 3. 실시간 상담 상세(채팅): 실시간으로 고객과 대화 */}
                    <Route path="/consultation/:customerId" element={<ConsultationDetail />} />

                    {/* 4. 상담 내역 검색: 전체 리스트 확인 및 필터링 */}
                    <Route path="/search" element={<ConsultationSearch />} />

                    {/* 5. 상담 상세 이력: 과거 대화 기록 열람  */}
                    <Route path="/history/:historyId" element={<ConsultationHistory />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;