import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google"; 
import { authApi } from "../../api/services/auth"; 

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
                console.log("구글 인가 코드 획득:", code);

                const response = await authApi.loginWithGoogle(code!);
                
                /**
                 * -------------------------------------------------------
                 * [현재: Mock 모드] authApi에서 준 데이터를 바로 사용
                 * -------------------------------------------------------
                 */
                const accessToken = response.accessToken; 
                const userName = response.user.name; //  가짜 데이터에서 이름을 가져옴

                /**
                 * [나중에: 서버 연결 시] 아래 주석을 풀어서 사용하세요
                 * const accessToken = response.data.accessToken;
                 * const userName = response.data.user.name;
                 */

                // (localStorage)에 데이터 담기
                localStorage.setItem('token', accessToken);
                localStorage.setItem('userName', userName); 
                
                console.log("로그인 성공! 이름:", userName);
                
                navigate("/dashboard", { replace: true }); 

            } catch (e) {
                console.error("로그인 API 통신 실패:", e);
                alert("상부상조 시스템 로그인에 실패했습니다.");
            } finally {
                setIsLoggingIn(false);
            }
        },
        onError: (error) => {
            console.error("구글 인증 자체 실패:", error);
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

                <button
                    type="button"
                    className={styles.footerText}
                    onClick={() => alert("고객센터로 문의해주세요.")}
                >
                    로그인에 문제가 있으신가요?
                </button>
            </main>
        </div>
    );
};

export default LoginPage;