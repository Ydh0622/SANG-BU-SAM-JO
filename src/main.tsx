import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google' 
import './index.css'
import App from './App.tsx'

/**
 * [상부상조] 프로젝트 메인 진입점
 * 명세서 1번 인증 기능을 위해 앱 전체를 GoogleOAuthProvider로 감쌉니다.
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
  </StrictMode>,
)