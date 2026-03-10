import { useState } from "react";
import { 
    User, 
    Mail, 
    Shield, 
    Save, 
    FileText, 
    ArrowLeft, 
    BarChart3, 
    TrendingUp,   
    X, 
    Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as styles from "./Style/MyPage.css.ts";

interface MemoItem {
    id: number | string;
    date: string;
    customer: string;
    category: string;
    content: string;
}

const ProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
            <span>{label}</span>
            <span style={{ fontWeight: 700 }}>{value}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#EEE', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${value}%`, height: '100%', backgroundColor: color }} />
        </div>
    </div>
);

const MyPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'memo' | 'stats'>('profile');

    /** 저장된 메모 불러오기 */
    const [displayMemos, setDisplayMemos] = useState<MemoItem[]>(() => {
        const localData = localStorage.getItem("savedMemos");
        return localData ? JSON.parse(localData) : [];
    });

    /** 프로필 정보 초기화 및 로컬스토리지 데이터 연동 */
    const [profile, setProfile] = useState(() => {
        const savedFullName = localStorage.getItem("userName") || "유덕현 상담사";
        const savedEmail = localStorage.getItem("userEmail") || "vip_care@uplus.co.kr";
        const savedDept = localStorage.getItem("userDept") || "고객케어팀 (서울)";
        const savedRank = localStorage.getItem("userRank") || "시니어 상담사";
        
        const pureName = savedFullName.replace(" 상담사", "");
        
        return {
            name: pureName,
            email: savedEmail,
            dept: savedDept,
            rank: savedRank
        };
    });

    /** 공통 입력창 스타일 */
    const commonInputStyle = {
        width: '100%',
        padding: '12px 14px',
        fontSize: '15px',
        fontWeight: 600,
        color: '#1A1A1A',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        outline: 'none',
    };

    const handleDeleteMemo = (targetId: number | string) => {
        if (!window.confirm("이 상담 메모를 삭제하시겠습니까?")) return;
        const localData = localStorage.getItem("savedMemos");
        if (localData) {
            const savedMemos: MemoItem[] = JSON.parse(localData);
            const filteredLocal = savedMemos.filter(memo => memo.id !== targetId);
            localStorage.setItem("savedMemos", JSON.stringify(filteredLocal));
            setDisplayMemos(filteredLocal);
        }
    };

    const handleDeleteAll = () => {
        if (!window.confirm("모든 저장된 메모를 삭제하시겠습니까?")) return;
        localStorage.removeItem("savedMemos");
        setDisplayMemos([]);
    };

    const handleSaveProfile = () => {
        const pureName = profile.name.trim();
        if (!pureName) return alert("이름을 입력해주세요.");
        const fullName = `${pureName} 상담사`; 
        localStorage.setItem("userName", fullName);
        localStorage.setItem("userEmail", profile.email);
        localStorage.setItem("userDept", profile.dept);
        localStorage.setItem("userRank", profile.rank);
        alert("프로필 정보가 저장되었습니다.");
    };

    return (
        <div className={styles.container}>
            {/* ✅ 헤더 영역: 인라인 스타일을 제거하고 CSS 파일의 styles.header를 최대한 활용하거나 깔끔하게 정리 */}
            <header className={styles.header}>
                {/* ✅ 수정된 부분: Search 페이지와 동일한 버튼 구조 적용 */}
                <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')} 
                    className={styles.backBtn}
                >
                    <ArrowLeft size={24} color="#1A1A1A" />
                </button>
                <h1 className={styles.title}>마이페이지</h1>
            </header>

            <main className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <button className={activeTab === 'profile' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('profile')}>
                        <User size={18} /> 개인정보 수정
                    </button>
                    <button className={activeTab === 'memo' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('memo')}>
                        <FileText size={18} /> 저장된 상담 메모
                    </button>
                    <button className={activeTab === 'stats' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('stats')}>
                        <BarChart3 size={18} /> 나의 성과 통계
                    </button>
                </aside>

                <section className={styles.contentArea}>
                    {activeTab === 'profile' && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>프로필 설정</h2>
                            <div className={styles.inputGroup}>
                                <label><User size={14} /> 이름</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input 
                                        value={profile.name} 
                                        onChange={(e) => setProfile({...profile, name: e.target.value})} 
                                        placeholder="성함 입력"
                                        style={{
                                            ...commonInputStyle,
                                            fontSize: '18px',
                                            fontWeight: 800,
                                            paddingRight: '80px',
                                            backgroundColor: '#FFFFFF',
                                            border: '2px solid #F3F4F6',
                                        }}
                                    />
                                    <span style={{ position: 'absolute', right: '16px', fontSize: '16px', fontWeight: 600, color: '#94A3B8' }}>상담사</span>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Mail size={14} /> 이메일</label>
                                <input 
                                    value={profile.email} 
                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                    placeholder="이메일 입력"
                                    style={commonInputStyle}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Shield size={14} /> 소속/직급</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        value={profile.dept} 
                                        onChange={(e) => setProfile({...profile, dept: e.target.value})}
                                        placeholder="소속 부서"
                                        style={{ ...commonInputStyle, flex: 1 }} 
                                    />
                                    <input 
                                        value={profile.rank} 
                                        onChange={(e) => setProfile({...profile, rank: e.target.value})}
                                        placeholder="직급"
                                        style={{ ...commonInputStyle, flex: 1 }} 
                                    />
                                </div>
                            </div>
                            <button className={styles.saveBtn} onClick={handleSaveProfile}>
                                <Save size={16} /> 변경 내용 저장
                            </button>
                        </div>
                    )}

                    {activeTab === 'memo' && (
                        <div className={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 className={styles.cardTitle} style={{ margin: 0 }}>최근 저장된 메모</h2>
                                <button onClick={handleDeleteAll} style={{ color: '#EF4444', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    <Trash2 size={14} /> 비우기
                                </button>
                            </div>
                            <div className={styles.memoList}>
                                {displayMemos.length > 0 ? (
                                    displayMemos.map((memo, index) => (
                                        <div key={`${memo.id}-${index}`} className={styles.memoItem}>
                                            <div style={{ flex: 1 }}>
                                                <p className={styles.memoContent}>
                                                    {memo.content}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteMemo(memo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94A3B8', marginLeft: '12px' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>저장된 상담 메모가 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>상담 성과 요약 (최근 7일)</h2>
                            <div className={styles.statsGrid}>
                                <div className={styles.statMiniCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>평균 응대 시간</span>
                                        <TrendingUp size={16} color="#22C55E" />
                                    </div>
                                    <h3>04:25</h3>
                                    <p style={{ color: '#22C55E' }}>▲ 12s 개선됨</p>
                                </div>
                                <div className={styles.statMiniCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>고객 만족도</span>
                                        <TrendingUp size={16} color="#22C55E" />
                                    </div>
                                    <h3>4.8 / 5.0</h3>
                                    <p style={{ color: '#22C55E' }}>▲ 0.2점 상승</p>
                                </div>
                            </div>
                            <div style={{ marginTop: '40px' }}>
                                <h3 style={{ fontSize: '15px', marginBottom: '20px', fontWeight: 800, color: '#1E293B' }}>목표 달성률</h3>
                                <ProgressBar label="주간 상담 목표 건수 (120건)" value={85} color="#E6007E" />
                                <ProgressBar label="AI 요약 활용률" value={92} color="#007AFF" />
                                <ProgressBar label="첫 콜 해결률 (FCR)" value={78} color="#22C55E" />
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default MyPage;