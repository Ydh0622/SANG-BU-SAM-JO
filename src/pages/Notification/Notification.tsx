import { useState } from "react";
import { 
    Bell, 
    ChevronLeft, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    Trash2, 
    MoreVertical 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as styles from "./Style/Notification.css.ts";

interface NotificationItem {
    id: number;
    title: string;
    content: string;
    type: 'ASSIGN' | 'SYSTEM' | 'STATS' | 'NOTICE';
    time: string;
    isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    { id: 1, title: "새로운 상담 배정", content: "이영희 고객님의 5G 요금제 변경 문의가 배정되었습니다.", type: 'ASSIGN', time: "5분 전", isRead: false },
    { id: 2, title: "긴급 시스템 점검", content: "금일 오후 10시부터 AI 엔진 최적화 점검이 예정되어 있습니다.", type: 'SYSTEM', time: "1시간 전", isRead: false },
    { id: 3, title: "주간 성과 업데이트", content: "지난주 상담 만족도가 4.8점으로 목표치를 달성했습니다!", type: 'STATS', time: "3시간 전", isRead: true },
    { id: 4, title: "업무 가이드 배포", content: "신규 결합 할인 상품에 대한 상담 스크립트가 추가되었습니다.", type: 'NOTICE', time: "어제", isRead: true },
];

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

    const handleRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleReadAll = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleDelete = (id: number) => {
        if (!window.confirm("이 알림을 삭제하시겠습니까?")) return;
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className={styles.title}>알림 센터</h1>
                    <button onClick={handleReadAll} className={styles.readAllBtn}>모두 읽음</button>
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.listWrapper}>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`${styles.notiItem} ${n.isRead ? styles.readItem : ""}`}
                                onClick={() => handleRead(n.id)}
                            >
                                <div className={styles.iconArea}>
                                    {n.type === 'ASSIGN' && <CheckCircle2 size={20} color="#E6007E" />}
                                    {n.type === 'SYSTEM' && <AlertTriangle size={20} color="#F97316" />}
                                    {n.type === 'STATS' && <Clock size={20} color="#007AFF" />}
                                    {n.type === 'NOTICE' && <Bell size={20} color="#64748B" />}
                                </div>
                                <div className={styles.contentArea}>
                                    <div className={styles.itemHeader}>
                                        <span className={styles.itemTitle}>{n.title}</span>
                                        <span className={styles.itemTime}>{n.time}</span>
                                    </div>
                                    <p className={styles.itemDesc}>{n.content}</p>
                                </div>
                                
                                {/*  더보기 및 삭제 버튼 영역 디테일 강화 */}
                                <div className={styles.actionArea}>
                                    <button 
                                        className={styles.moreBtn}
                                        onClick={(e) => { e.stopPropagation(); /* 상세 메뉴 로직 추가 가능 */ }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <Bell size={48} color="#E2E8F0" />
                            <p>새로운 알림이 없습니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationPage;