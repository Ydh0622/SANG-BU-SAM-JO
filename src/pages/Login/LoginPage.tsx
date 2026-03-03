import type React from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { authApi } from "../../api/services/auth";
import { MessageSquare, ArrowRight, UserCircle } from "lucide-react"; // UserCircle 아이콘 추가
import axios from "axios";

import * as styles from "./Style/Login.css.ts";

interface BackendLoginResponse {
  token?: string;
  accessToken?: string;
  user: { name: string };
  data?: {
    token?: string;
    accessToken?: string;
    user?: { name: string };
  };
}

const LoginPage: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = useCallback((credentialResponse: CredentialResponse) => {
    if (isLoggingIn) return;

    const performLogin = async () => {
      const idToken = credentialResponse.credential; 
      if (!idToken) return;

      try {
        setIsLoggingIn(true);
        const response = (await authApi.loginWithGoogle(idToken)) as BackendLoginResponse;

        const token = response.token || response.accessToken || response.data?.token || response.data?.accessToken;
        const userName = response.user?.name || response.data?.user?.name || "상담원";

        if (!token) throw new Error("서버 응답에 토큰이 없습니다.");

        localStorage.setItem("token", token);
        localStorage.setItem("userName", userName);
        
        navigate("/dashboard", { replace: true });
      } catch (e: unknown) {
        console.error("로그인 실패 상세:", e);
        let errorMessage = "로그인 실패: 유효하지 않은 유저이거나 서버 오류입니다.";
        if (axios.isAxiosError(e)) {
          errorMessage = e.response?.data?.message || errorMessage;
        }
        alert(errorMessage);
        setIsLoggingIn(false);
      }
    };

    performLogin();
  }, [isLoggingIn, navigate]);

  /** [추가] 게스트 로그인 핸들러 */
  const handleGuestLogin = () => {
    // 1. 시연 및 포트폴리오 확인을 위한 가짜 데이터 세팅
    localStorage.setItem("token", "guest_mock_token_uplus_eureka_2026");
    localStorage.setItem("userName", "게스트"); // 방문자 성함 표시
    localStorage.setItem("userEmail", "guest_view@uplus.co.kr");
    localStorage.setItem("userDept", "고객케어팀 (데모)");
    localStorage.setItem("userRank", "체험 계정");

    // 2. 대시보드로 즉시 이동
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className={styles.container}>
      <main className={styles.loginCard}>
        <h1 className={styles.title}>
          <span className={styles.titleBrand}>LG U<span className={styles.titlePlus}>+</span></span>
          <div style={{ marginTop: "4px" }}>상담 서비스</div>
        </h1>

        <p className={styles.description}>고객님의 궁금한 점을 빠르고 정확하게 해결해 드립니다.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "16px", margin: "24px 0" }}>
          {!isLoggingIn ? (
            <>
              {/* 구글 로그인 버튼 */}
              <div style={{ transform: 'scale(1.05)' }}> 
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => console.error("로그인 실패")}
                  useOneTap={false} 
                  theme="filled_blue"
                  shape="pill"
                  width="320"      
                  text="signin_with" 
                />
              </div>

              {/* [추가] 게스트 로그인 버튼 */}
              <button 
                type="button" 
                onClick={handleGuestLogin}
                style={{
                  width: '320px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  padding: '12px',
                  borderRadius: '100px',
                  color: '#495057',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                <UserCircle size={18} /> 로그인 없이 체험하기 (Guest)
              </button>
            </>
          ) : (
            <div style={{ padding: '10px', color: '#E6007E', fontWeight: 600 }}>
              인증 정보를 확인 중입니다...
            </div>
          )}
        </div>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #F1F3F5", width: "100%" }}>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px', textAlign: 'center' }}>
            상담 프로세스 확인을 위한 시연 모드
          </p>
          <button 
            type="button" 
            onClick={() => navigate("/customer/apply")} 
            style={{ 
              width: '100%', 
              border: '1.5px solid #E6007E', 
              padding: '14px', 
              borderRadius: '12px', 
              color: '#E6007E', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              cursor: 'pointer', 
              backgroundColor: '#FFF',
              transition: 'background-color 0.2s'
            }}
          >
            <MessageSquare size={16} /> 고객 상담 신청하기 (시연용) <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;