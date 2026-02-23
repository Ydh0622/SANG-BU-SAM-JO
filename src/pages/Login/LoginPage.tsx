import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google"; 
import { authApi } from "../../api/services/auth"; 
import { MessageSquare, ArrowRight } from "lucide-react"; 

import googleLogo from "../../assets/image/google.png"; 
import * as styles from "./Style/Login.css.ts";

const LoginPage: React.FC = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            if (isLoggingIn) return;
            try {
                setIsLoggingIn(true);
                const { code } = codeResponse;
                const response = await authApi.loginWithGoogle(code!);
                
                const accessToken = response.accessToken; 
                const userName = response.user.name; 

                localStorage.setItem('token', accessToken);
                localStorage.setItem('userName', userName); 
                
                navigate("/dashboard", { replace: true }); 
            } catch (e) {
                console.error("로그인 실패:", e);
                alert("로그인에 실패했습니다.");
            } finally {
                setIsLoggingIn(false);
            }
        },
        onError: (error) => {
            console.error("인증 실패:", error);
            alert("구글 인증에 실패했습니다.");
        },
        flow: 'auth-code', 
    });

    return (
        <div className={styles.container}>
            <main className={styles.loginCard}>
                <h1 className={styles.title}>
                    <span className={styles.titleBrand}>
                        LG U<span className={styles.titlePlus}>+</span>
                    </span>
                    <div style={{ marginTop: '4px' }}>상담 서비스</div>
                </h1>
                
                <p className={styles.description}>
                    고객님의 궁금한 점을 빠르고 정확하게<br />
                    해결해 드립니다.
                </p>

                {/* 상담사 구글 로그인 버튼 */}
                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={() => handleGoogleLogin()} 
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <span>연결 중...</span>
                    ) : (
                        <>
                            <img 
                                src={googleLogo} 
                                alt="Google Logo" 
                                style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                            />
                            <span>Google 계정으로 시작하기</span>
                        </>
                    )}
                </button>

                {/* ✨ 수정된 고객 시연 진입 섹션 */}
                <div style={{ 
                    marginTop: '32px', 
                    paddingTop: '24px', 
                    borderTop: '1px solid #F1F3F5',
                    width: '100%'
                }}>
                    <p style={{ 
                        fontSize: '12px', 
                        color: '#999', 
                        marginBottom: '12px',
                        textAlign: 'center'
                    }}>
                        상담 프로세스 확인을 위한 시연 모드
                    </p>
                    <button 
                        type="button"
                        /** 💡 포인트: /customer 대신 /customer/apply로 바로 연결하여 정보 입력을 유도합니다. */
                        onClick={() => navigate('/customer/apply')}
                        style={{ 
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1.5px solid #E6007E',
                            backgroundColor: '#FFF',
                            color: '#E6007E',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF0F6';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <MessageSquare size={16} />
                        고객 상담 신청하기 (시연용)
                        <ArrowRight size={14} />
                    </button>
                </div>

                <button
                    type="button"
                    className={styles.footerText}
                    onClick={() => alert("관리자에게 문의해주세요.")}
                    style={{ marginTop: '24px' }}
                >
                    로그인에 문제가 있으신가요?
                </button>
            </main>
        </div>
    );
};

export default LoginPage;