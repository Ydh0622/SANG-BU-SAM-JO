import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Phone, Mail, TrendingUp, 
  Bell, User, LogOut, ChevronRight, MessageSquare 
} from 'lucide-react';
import * as styles from "./Style/Dashboard.css.ts";
import { useConsultation } from "../../hooks/useConsultation";

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-****');
  }
  return phone;
};

// ✅ 목 데이터 보강 (고길동 및 다양한 케이스 추가)
const MOCK_ACTIVITIES = [
  { id: "LOG_001", time: "10:42", ampm: "AM", name: "김철수", phoneNumber: "01012345678", email: "chulsoo@uplus.co.kr", description: "5G 시그니처 요금제 변경 및 가족 결합 할인 문의", type: "BILLING", status: "COMPLETE" },
  { id: "LOG_002", time: "10:15", ampm: "AM", name: "고길동", phoneNumber: "01010024000", email: "gogilldong@uplus.co.kr", description: "VIP Platinum 멤버십 혜택 안내 및 영화 예매권 사용법", type: "CS", status: "COMPLETE" },
  { id: "LOG_003", time: "09:50", ampm: "AM", name: "이영희", phoneNumber: "01056781234", email: "younghee@uplus.co.kr", description: "인터넷 설치 지연 불만 접수 (기술팀 이관)", type: "TECH", status: "TRANSFER" },
  { id: "LOG_004", time: "09:30", ampm: "AM", name: "박지성", phoneNumber: "01033334444", email: "js_park@uplus.co.kr", description: "유럽 여행 로밍 요금제 추천 및 데이터 차단 설정", type: "ROAMING", status: "COMPLETE" },
  { id: "LOG_005", time: "09:12", ampm: "AM", name: "손흥민", phoneNumber: "01077778888", email: "sonny@uplus.co.kr", description: "신규 아이폰 사전예약 사은품 및 개통 절차 문의", type: "SALES", status: "COMPLETE" },
];

const Dashboard: React.FC = () => {
  const { status, toggleWorkStatus, assignedCustomer, setAssignedCustomer } = useConsultation();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: 900, color:'#1A1A1A', letterSpacing:'-1px' }}>LG U<span style={{ color: '#E6007E' }}>+</span></span>
          <div style={{ width: '1px', height: '18px', background: '#DDD' }}></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>{todayStr} {now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          
          <div style={{ position: 'relative', cursor:'pointer' }}>
            <Bell size={20} color="#333" />
            <span style={{ position:'absolute', top:'-2px', right:'-2px', width:'8px', height:'8px', background:'#E6007E', borderRadius:'50%', border: '2px solid #FFF' }}></span>
          </div>
          
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <User size={18} color="#FFF" />
            </div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{adminName}님</span>
            </div>
          </div>
          <button className={styles.logoutButton} onClick={() => navigate('/')} title="로그아웃">
            <LogOut size={18} color="#333" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.leftSection}>
          
          {/* Status Card */}
          <section className={styles.card} style={{ borderLeft: '4px solid #E6007E' }}>
            <div className={styles.statusContainer}>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1A1A1A' }}>안녕하세요, {adminName}님! 👋</h2>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>현재 <strong>{status === 'AVAILABLE' ? "상담 대기열 진입" : "업무 정지"}</strong> 상태입니다.</p>
              </div>
              <div className={styles.statusIndicator} style={{ 
                backgroundColor: status === 'AVAILABLE' ? '#FFF0F6' : '#F3F4F6', 
                color: status === 'AVAILABLE' ? '#E6007E' : '#4B5563'
              }}>
                <span className={status === 'AVAILABLE' ? styles.activeIndicator : ''} 
                      style={{ display:'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: status === 'AVAILABLE' ? '#E6007E' : '#9CA3AF', marginRight: '6px' }}></span>
                {status === 'AVAILABLE' ? "ONLINE" : "OFFLINE"}
              </div>
            </div>
            <button className={status === 'AVAILABLE' ? styles.stopButton : styles.startButton} onClick={toggleWorkStatus}>
              {status === 'AVAILABLE' ? "잠시 휴식하기 (Pause)" : "업무 시작하기 (Start)"}
            </button>
          </section>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>오늘 처리</span>
              <div className={styles.statValue}>
                12 <TrendingUp size={20} color="#28a745" style={{marginLeft:'8px'}}/>
              </div>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>평균 상담 시간</span>
              <div className={styles.statValue} style={{display:'flex', alignItems:'center', gap:'8px'}}>
                08:24 <Clock size={18} color="#666" />
              </div>
            </div>
            <div className={styles.statBox} style={{ border: '1px solid #FFD6E7', background:'#FFF0F6' }}>
              <span className={styles.statLabel} style={{color:'#E6007E'}}>대기 고객</span>
              <div className={styles.statValue} style={{color: '#E6007E'}}>3<span style={{fontSize:'16px', color:'#E6007E', marginLeft:'4px'}}>명</span></div>
            </div>
          </div>

          {/* Activity Log - 리스트 보강됨 */}
          <section className={styles.card} style={{ flex: 1, minHeight: '400px' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#333' }}>최근 상담 이력</h4>
              <button 
                style={{border:'none', background:'none', color:'#E6007E', fontSize:'13px', fontWeight:600, cursor:'pointer'}} 
                onClick={() => navigate('/search')}
              >
                전체 이력 보기
              </button>
            </div>
            
            <ul className={styles.activityList}>
              {MOCK_ACTIVITIES.map((log) => (
                <li key={log.id} className={styles.activityItem} onClick={() => navigate(`/history/${log.id}`)}>
                  <div className={styles.activityTime}>{log.time}<br/><small>{log.ampm}</small></div>
                  <div className={styles.activityContent} style={{ borderLeft: `3px solid ${log.type === 'TECH' ? '#FFC107' : log.type === 'CS' ? '#007AFF' : '#E6007E'}` }}>
                    <span className={styles.activityName}>{log.name} 고객님</span>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                      <span className={styles.activityDesc} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                        <Phone size={12} color="#666" /> {formatPhoneNumber(log.phoneNumber)}
                      </span>
                      <span className={styles.activityDesc} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                        <Mail size={12} color="#666" /> {log.email}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#CCC" />
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Section */}
        <aside className={styles.rightSection}>
          <section className={styles.card}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>오늘의 목표</h4>
            <div style={{display:'flex', alignItems:'flex-end', gap:'4px', marginBottom:'8px'}}>
              <span style={{fontSize:'32px', fontWeight:800, color:'#E6007E'}}>80</span>
              <span style={{fontSize:'16px', fontWeight:600, color:'#E6007E', marginBottom:'4px'}}>%</span>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: '80%' }}></div>
            </div>
            <p style={{fontSize:'12px', color:'#666', marginTop:'12px', lineHeight:'1.4'}}>
              🚀 퇴근 전까지 <strong style={{color:'#1A1A1A'}}>3건</strong>만 더 처리하면<br/>일일 목표를 달성합니다!
            </p>
          </section>

          <section className={styles.card}>
            <h4 style={{ margin: '0 0 16px 0', fontSize:'15px', fontWeight: 700 }}>📌 공지사항</h4>
            <div className={styles.noticeItem}>
              <span style={{display:'block', fontWeight:700, marginBottom:'2px', color:'#1A1A1A'}}>결합 할인 정책 변경 안내</span>
              <span style={{fontSize:'12px', color:'#888'}}>2026.02.12 적용 예정</span>
            </div>
            <div className={styles.noticeItem}>
              <span style={{display:'block', fontWeight:700, marginBottom:'2px', color:'#1A1A1A'}}>시스템 정기 점검</span>
              <span style={{fontSize:'12px', color:'#888'}}>오늘 밤 22:00 ~ 24:00</span>
            </div>
          </section>
        </aside>
      </main>

      {/* Modal: AI 상담 연결 */}
      {assignedCustomer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.aiBadge}>✨ AI 지능형 분석 완료</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color:'#1A1A1A' }}>새로운 상담 연결</h2>
            
            <div className={styles.customerSummary}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                <span style={{ fontWeight: 900, fontSize: '20px', color: '#1A1A1A' }}>
                  {assignedCustomer.name} 고객님
                </span>
                <span className={styles.modalTag}>{assignedCustomer.category}</span>
              </div>
              <div style={{ background: '#F0F7FF', padding: '16px', borderRadius: '16px', borderLeft: '4px solid #007AFF', textAlign:'left' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                  <MessageSquare size={14} color="#007AFF" />
                  <span style={{ fontSize:'13px', fontWeight:700, color:'#007AFF' }}>AI 전략 가이드</span>
                </div>
                <p style={{ fontSize:'14px', color:'#1A1A1A', lineHeight:'1.5', margin: 0 }}>
                  "{assignedCustomer.recentHistory}"
                </p>
              </div>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.acceptButton} onClick={handleAccept}>상담 수락하기</button>
              <button className={styles.refuseButton} onClick={() => setAssignedCustomer(null)}>나중에</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;