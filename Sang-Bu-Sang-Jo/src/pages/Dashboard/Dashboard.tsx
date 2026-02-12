import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Phone, Mail, TrendingUp, 
  Bell, User, LogOut, ChevronRight, MessageSquare, Activity
} from 'lucide-react';
import * as styles from "./Style/Dashboard.css.ts";
import { useConsultation } from "../../hooks/useConsultation";

// ✅ 전화번호 포맷팅 함수 (사용됨)
const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-****');
  }
  return phone;
};

const MOCK_ACTIVITIES = [
  { id: "LOG_001", time: "10:42", ampm: "AM", name: "김철수", phoneNumber: "01012345678", email: "chulsoo@uplus.co.kr", description: "5G 시그니처 요금제 변경 및 가족 결합 할인 문의", type: "BILLING", status: "COMPLETE" },
  { id: "LOG_002", time: "10:15", ampm: "AM", name: "고길동", phoneNumber: "01010024000", email: "gogilldong@uplus.co.kr", description: "VIP Platinum 멤버십 혜택 안내 및 영화 예매권 사용법", type: "CS", status: "COMPLETE" },
  { id: "LOG_003", time: "09:50", ampm: "AM", name: "이영희", phoneNumber: "01056781234", email: "younghee@uplus.co.kr", description: "인터넷 설치 지연 불만 접수 (기술팀 이관)", type: "TECH", status: "TRANSFER" },
];

const Dashboard: React.FC = () => {

  const { status, toggleWorkStatus, assignedCustomer, setAssignedCustomer, waitingCount } = useConsultation();
  const navigate = useNavigate();
  const [adminName] = useState<string>(() => localStorage.getItem("userName") || "상담원");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const handleAccept = () => {
    if (!assignedCustomer) return;
    const customerId = assignedCustomer.id;
    setAssignedCustomer(null);
    navigate(`/consultation/${customerId}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoArea}>
            <span className={styles.brandLogo}>LG U<span className={styles.magentaText}>+</span></span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.dateTimeDesktop}>{todayStr} {now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className={styles.iconButton}>
              <Bell size={20} />
              <span className={styles.notificationBadge}></span>
            </div>
            <div className={styles.profileChip}>
              <div className={styles.avatarMini}><User size={16} /></div>
              <span className={styles.userNameText}>{adminName}님</span>
            </div>
            <button className={styles.logoutBtn} onClick={() => navigate('/')} title="로그아웃">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.dashboardGrid}>
          <div className={styles.mainContentLeft}>
            {/* Status Card */}
            <section className={styles.heroCard}>
              <div className={styles.heroInfo}>
                <h2 className={styles.heroTitle}>반갑습니다, {adminName}님! 👋</h2>
                <p className={styles.heroSubtitle}>오늘도 고객님의 목소리에 귀 기울여 주세요.</p>
                <div className={styles.statusBoxMobile}>
                   <div className={`${styles.statusBadge} ${status === 'AVAILABLE' ? styles.online : styles.offline}`}>
                    <span className={status === 'AVAILABLE' ? styles.pulseDot : styles.staticDot}></span>
                    {status === 'AVAILABLE' ? "상담 대기 중" : "업무 정지 중"}
                  </div>
                </div>
              </div>
              <button className={status === 'AVAILABLE' ? styles.workStopBtn : styles.workStartBtn} onClick={toggleWorkStatus}>
                {status === 'AVAILABLE' ? "업무 잠시 멈춤" : "업무 시작하기"}
              </button>
            </section>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#E6F0FF', color: '#007AFF' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <span className={styles.statLabel}>오늘의 처리</span>
                  {/* ✅ TrendingUp 사용 */}
                  <div className={styles.statValue}>
                    12 <TrendingUp size={16} style={{ color: '#28a745', marginLeft: '4px' }} />
                  </div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#FFF0F6', color: '#E6007E' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <span className={styles.statLabel}>평균 응대</span>
                  <div className={styles.statValue}>08:24</div>
                </div>
              </div>
              <div className={styles.statCard} style={{ background: 'linear-gradient(135deg, #E6007E 0%, #FF4D97 100%)', color: '#FFF' }}>
                <div className={styles.statIcon} style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>
                  <User size={20} />
                </div>
                <div>
                  <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>대기 고객</span>
                  <div className={styles.statValue} style={{ color: '#FFF' }}>{waitingCount}명</div>
                </div>
              </div>
            </div>

            {/* History List */}
            <section className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>최근 상담 내역</h3>
                <button className={styles.textBtn} onClick={() => navigate('/search')}>전체보기</button>
              </div>
              <div className={styles.activityList}>
                {MOCK_ACTIVITIES.map((log) => (
                  <div key={log.id} className={styles.activityItem} onClick={() => navigate(`/history/${log.id}`)}>
                    <div className={styles.timeTag}>{log.time}</div>
                    <div className={styles.customerInfoMain}>
                      <span className={styles.customerName}>{log.name} 고객님</span>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        {/* ✅ Phone, Mail 및 formatPhoneNumber 사용 */}
                        <span style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {formatPhoneNumber(log.phoneNumber)}
                        </span>
                        <span style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {log.email}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={styles.arrowIcon} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Section */}
          <aside className={styles.mainContentRight}>
            <section className={styles.glassCard}>
              <h3 className={styles.cardTitle}>일일 목표 달성도</h3>
              <div className={styles.progressCircleArea}>
                <div className={styles.percentageText}>80%</div>
                <div className={styles.goalDescription}>목표까지 단 <strong>3건</strong>!</div>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: '80%' }}></div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Modal: AI 상담 연결 */}
      {assignedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.premiumModal}>
            <div className={styles.aiGlowBadge}>AI SMART MATCH</div>
            <h2 className={styles.modalHeading}>새로운 상담 연결</h2>
            
            <div className={styles.modalCustomerCard}>
              <div className={styles.modalCustomerHeader}>
                <span className={styles.modalCustomerName}>{assignedCustomer.name} 고객님</span>
                <span className={styles.categoryTag}>{assignedCustomer.category}</span>
              </div>
              <div className={styles.aiGuideBox}>
                <div className={styles.aiGuideTitle}>
                  <MessageSquare size={14} /> AI 전략 제안
                </div>
                <p className={styles.aiGuideText}>"{assignedCustomer.recentHistory}"</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.primaryBtn} onClick={handleAccept}>상담 시작하기</button>
              <button className={styles.secondaryBtn} onClick={() => setAssignedCustomer(null)}>보류</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;