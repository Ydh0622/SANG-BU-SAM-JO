import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone } from "lucide-react"; 
import * as styles from "./Style/NoticeList.css.ts";

interface Notice {
    id: number;
    category: '공지' | '업데이트' | '점검';
    title: string;
    author: string;
    createdAt: string;
    content: string;
    isImportant: boolean;
}

const MOCK_NOTICES: Notice[] = [
    {
        id: 1,
        category: '점검',
        title: '[긴급] 서버 안정화 및 AI 엔진 정기 점검 안내',
        author: '시스템 관리자',
        createdAt: '2026-02-21',
        content: '내용 생략 (상세 페이지에서 확인)',
        isImportant: true,
    },
    {
        id: 2,
        category: '업데이트',
        title: '상담사 메모 저장 및 AI 요약본 수정 기능 배포',
        author: '기술팀',
        createdAt: '2026-02-19',
        content: '내용 생략 (상세 페이지에서 확인)',
        isImportant: false,
    },
    {
        id: 3,
        category: '공지',
        title: '신규 상담사 업무 가이드북 최신판(v2.1) 배포',
        author: '운영팀',
        createdAt: '2026-02-15',
        content: '내용 생략 (상세 페이지에서 확인)',
        isImportant: false,
    },
];

const NoticeList = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                
                {/* 헤더 섹션: image_b96884.png의 뒤로가기 버튼 스타일 적용 */}
                <header style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px", 
                    marginBottom: "32px" 
                }}>
                    <button 
                        type="button" 
                        onClick={() => navigate("/dashboard")} 
                        style={{ 
                            background: '#FFFFFF', 
                            border: '1px solid #EEEEEE', 
                            borderRadius: '12px', // 이미지와 같은 둥근 사각형
                            cursor: 'pointer', 
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            padding: 0
                        }}
                    >
                        <ArrowLeft size={20} color="#1A1A1A" />
                    </button>
                    
                    <h1 style={{ 
                        fontSize: "22px", 
                        fontWeight: 800, 
                        color: "#1A1A1A", 
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <Megaphone size={22} color="#E6007E" />
                        공지사항
                    </h1>
                </header>

                <div className={styles.titleSection}>
                    <p className={styles.subTitle}>서비스의 주요 업데이트와 안내 사항을 확인하세요.</p>
                </div>

                <div className={styles.listCard}>
                    {/* 테이블 헤더 */}
                    <div style={{  
                        display: 'grid', 
                        gridTemplateColumns: '100px 1fr 120px', 
                        padding: '15px 0', 
                        borderBottom: '2px solid #F1F3F5',
                        color: '#666',
                        fontWeight: 700,
                        fontSize: '14px'
                    }}>
                        <span style={{ textAlign: 'center' }}>구분</span>
                        <span style={{ paddingLeft: '20px' }}>제목</span>
                        <span style={{ textAlign: 'right', paddingRight: '10px' }}>작성일</span>
                    </div>

                    {/* 리스트 아이템 */}
                    {MOCK_NOTICES.map((notice) => (
                        <div 
                            key={notice.id} 
                            className={styles.listItem}
                            onClick={() => navigate(`/notice/${notice.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <span className={styles.categoryTag} style={{
                                    backgroundColor: notice.category === '점검' ? '#fee' : '#eef2ff',
                                    color: notice.category === '점검' ? '#d32f2f' : '#3f51b5'
                                }}>
                                    {notice.category}
                                </span>
                            </div>
                            <span className={styles.itemTitle} style={{ fontWeight: notice.isImportant ? 800 : 500 }}>
                                {notice.isImportant && <span style={{ color: '#d32f2f', marginRight: '5px' }}>[중요]</span>}
                                {notice.title}
                            </span>
                            <span className={styles.itemDate}>{notice.createdAt}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticeList;