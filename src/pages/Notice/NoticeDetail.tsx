import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react'; 
import * as styles from "./Style/NoticeDetail.css.ts";

const MOCK_NOTICES = [
  {
    id: 1,
    category: '점검',
    title: '[긴급] 서버 안정화 및 AI 엔진 정기 점검 안내',
    author: '시스템 관리자',
    createdAt: '2026-02-21',
    content: `안녕하세요. 상부삼조 팀입니다. 
    
서비스 안정화를 위해 아래와 같이 정기 점검이 진행될 예정입니다. 
점검 중에는 AI 요약 및 실시간 채팅 기능이 일시적으로 제한될 수 있으니 상담사 여러분의 양해 부탁드립니다.

[점검 일시]
- 2026년 2월 25일(수) 02:00 ~ 04:00 (약 2시간)

[점검 내용]
- 서버 데이터베이스 최적화
- AI 상담 요약 엔진 버전 업데이트
- 알림 센터 리스트 로딩 속도 개선

더 나은 서비스를 제공하기 위해 최선을 다하겠습니다. 감사합니다.`,
  },
  {
    id: 2,
    category: '업데이트',
    title: '상담사 메모 저장 및 AI 요약본 수정 기능 배포',
    author: '기술팀',
    createdAt: '2026-02-19',
    content: '상담사분들의 피드백을 반영하여 상담 중 실시간 메모 기능과 AI가 생성한 요약본을 직접 수정할 수 있는 편집 기능이 업데이트되었습니다. 이제 상담 상세 페이지에서 확인하실 수 있습니다.',
  },
  {
    id: 3,
    category: '공지',
    title: '신규 상담사 업무 가이드북 최신판(v2.1) 배포',
    author: '운영팀',
    createdAt: '2026-02-15',
    content: `2026년 상반기 신규 상담사 업무 가이드북이 최신 버전(v2.1)으로 업데이트되었습니다. 

이번 업데이트에는 멘토 피드백을 반영한 [AI 상담 관리 전략]과 [실시간 대기열 대응 프로세스]가 상세히 포함되어 있습니다. 모든 상담사분들은 상담 전 해당 가이드북을 반드시 숙지해주시기 바랍니다.

자료는 마이페이지 내 '자료실' 섹션에서도 PDF 형태로 다운로드 가능합니다.`,
  }
];

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // URL 파라미터 id와 Mock 데이터 id를 비교
  const notice = MOCK_NOTICES.find((n) => n.id === Number(id));

  if (!notice) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>공지사항을 찾을 수 없습니다. (ID: {id})</h2>
          <button 
            className={styles.backButton} 
            style={{ margin: '0 auto' }} 
            onClick={() => navigate('/notice')}
          >
             <ChevronLeft size={20} /> 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* 상단: 뒤로가기 버튼 */}
        <button className={styles.backButton} onClick={() => navigate('/notice')}>
          <ChevronLeft size={20} />
          공지사항 목록으로 돌아가기
        </button>

        {/* 제목 영역 */}
        <header className={styles.header}>
          <span className={styles.categoryTag} style={{
             backgroundColor: notice.category === '점검' ? '#fee' : 
                             notice.category === '업데이트' ? '#eef2ff' : '#f0fdf4',
             color: notice.category === '점검' ? '#d32f2f' : 
                    notice.category === '업데이트' ? '#3f51b5' : '#166534',
          }}>
            {notice.category}
          </span>
          <h1 className={styles.title}>{notice.title}</h1>
          <div className={styles.meta}>
            <span>작성자: {notice.author}</span>
            <span style={{ margin: '0 8px', color: '#eee' }}>|</span>
            <span>작성일: {notice.createdAt}</span>
          </div>
        </header>

        {/* 본문 영역 */}
        <article className={styles.content}>
          {notice.content}
        </article>

        {/* 하단 버튼 */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center' }}>
          <button 
            className={styles.backButton}
            style={{ 
                margin: '0 auto', 
                padding: '12px 40px', 
                backgroundColor: '#1A1A1A', 
                color: '#fff', 
                borderRadius: '12px' 
            }}
            onClick={() => navigate('/notice')}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;