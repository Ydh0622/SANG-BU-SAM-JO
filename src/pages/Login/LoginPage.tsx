import type React from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { authApi } from "../../api/services/auth";
import { MessageSquare, ArrowRight } from "lucide-react"; 
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

interface UserInfo {
  name: string;
  email: string;
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
        
        if (!token) throw new Error("서버 응답에 토큰이 없습니다.");

        localStorage.setItem("token", token);

        try {
          console.log("📍 [LoginPage] 내 정보 조회(users/me) 시도...");
          const userInfo = (await authApi.getMe()) as unknown as UserInfo;
          
          const realName = userInfo?.name || response.user?.name || response.data?.user?.name || "상담원";
          localStorage.setItem("userName", realName);
          console.log(`✅ [LoginPage] 유저 정보 연동 성공: ${realName}`);
        } catch (userError) {
          console.error(" [LoginPage] 내 정보 조회 실패, 기본 정보 사용:", userError);
          const backupName = response.user?.name || response.data?.user?.name || "상담원";
          localStorage.setItem("userName", backupName);
        }
        
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