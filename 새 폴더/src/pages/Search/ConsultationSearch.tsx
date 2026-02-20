import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Filter, Calendar, ChevronRight, 
  Download, RefreshCcw, User, MessageCircle, ArrowLeft 
} from 'lucide-react';
import * as styles from "./Style/Search.css.ts";

// 고길동 데이터가 포함된 MOCK 데이터
const MOCK_RESULTS = [
  { id: "LOG_001", date: "2026.02.11", customer: "김철수", type: "요금제 변경", summary: "5G 시그니처 전환 안내", agent: "나상담", status: "완료" },
  { id: "LOG_002", date: "2026.02.10", customer: "고길동", type: "결합할인", summary: "가족 결합 범위 확대 상담", agent: "나상담", status: "완료" },
  { id: "LOG_003", date: "2026.02.09", customer: "이영희", type: "해지방어", summary: "타사 이동 방지 혜택 제공", agent: "홍길동", status: "진행중" },
];

const ConsultationSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={styles.container}>
      {/* 상단 타이틀 및 뒤로가기 버튼 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            border: 'none', 
            background: '#FFF', 
            padding: '10px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="대시보드로 돌아가기"
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>상담 내역 관리</h1>
      </div>

      {/* 1. 상단 필터 섹션 */}
      <section className={styles.filterSection}>
        <div className={styles.filterTitle}>
          <Filter size={20} color="#E6007E" />
          <h2 style={{ color: '#1A1A1A' }}>상담 내역 통합 검색</h2>
        </div>
        
        <div className={styles.filterGrid}>
          <div className={styles.inputGroup}>
            <label>고객명 / ID</label>
            <div className={styles.inputWrapper}>
              <Search size={16} color="#888" />
              <input 
                className={styles.input}
                type="text" 
                placeholder="고객 정보를 입력하세요" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>상담 유형</label>
            <select className={styles.select}>
              <option>전체</option>
              <option>요금제 변경</option>
              <option>결합/할인</option>
              <option>해지/정지</option>
              <option>일반 문의</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>조회 기간</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} color="#888" />
              <input className={styles.input} type="date" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={styles.resetBtn}>
              <RefreshCcw size={16} /> 초기화
            </button>
            <button className={styles.searchBtn}>검색하기</button>
          </div>
        </div>
      </section>

      {/* 2. 검색 결과 리스트 섹션 */}
      <section className={styles.resultSection}>
        <div className={styles.resultHeader}>
          <span style={{ color: '#555', fontSize: '14px' }}>
            검색 결과 <strong style={{ color: '#E6007E' }}>{MOCK_RESULTS.length}</strong>건
          </span>
          <button className={styles.downloadBtn}>
            <Download size={16} /> 리포트 추출
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>상담일자</th>
                <th>고객명</th>
                <th>상담유형</th>
                <th>상담 요약</th>
                <th>담당자</th>
                <th>상태</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RESULTS.map((res) => (
                <tr key={res.id} className={styles.tableRow} onClick={() => navigate(`/history/${res.id}`)}>
                  <td style={{ color: '#888', fontWeight: 500 }}>{res.date}</td>
                  <td style={{ fontWeight: 700, color: '#333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="#AAA" /> {res.customer}
                    </div>
                  </td>
                  <td><span className={styles.typeBadge}>{res.type}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }}>
                      <MessageCircle size={14} color="#007AFF" /> 
                      {res.summary}
                    </div>
                  </td>
                  <td style={{ color: '#666' }}>{res.agent}</td>
                  <td>
                    <span className={res.status === '완료' ? styles.statusComplete : styles.statusDoing}>
                      {res.status}
                    </span>
                  </td>
                  <td><ChevronRight size={18} color="#CCC" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ConsultationSearch;