import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom"; 
// 이미지 경로가 맞는지 꼭 확인해주세요!
import googleLogo from "../../assets/image/google.png"; 
import * as styles from "./Style/Login.css.ts";

const LoginPage: React.FC = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate(); 

    const handleGoogleLogin = useCallback(async () => {
        if (isLoggingIn) return;
        try {
            setIsLoggingIn(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            navigate("/dashboard", { replace: true }); 
        } catch (e) {
            console.error(e);
            alert("로그인 중 오류가 발생했습니다.");
        } finally {
            setIsLoggingIn(false);
        }
    }, [isLoggingIn, navigate]);

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
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <span>연결 중...</span>
                    ) : (
                        <>
                            <img 
                                src={googleLogo} 
                                alt="Google Logo" 
                                style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    objectFit: 'contain' 
                                }} 
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